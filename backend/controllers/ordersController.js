const pool = require("../db");

function generateTrackingCode() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `IJI-${Date.now()}-${random}`;
}

// إنشاء طلب جديد
async function createOrder(req, res) {
  const client = await pool.connect();

  try {
    const {
      customer_name,
      customer_phone,
      items,
      total_price,
      payment_method = "cash",
      bank_reference = null,
      momo_reference = null,
      payment_phone = null,
      proof_image = null,
    } = req.body;

    if (!customer_name || !customer_phone) {
      return res.status(400).json({ error: "Customer name and phone are required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    const trackingCode = generateTrackingCode();
    const userId = req.user?.id || null;

    let orderStatus = "pending";
    let paymentStatus = "pending";

    if (payment_method !== "cash") {
      orderStatus = "awaiting_payment";
      paymentStatus = "submitted";
    }

    await client.query("BEGIN");

    const orderResult = await client.query(
      `
      INSERT INTO orders (
        user_id,
        customer_name,
        customer_phone,
        total_price,
        tracking_code,
        payment_method,
        payment_status,
        order_status,
        bank_reference,
        momo_reference,
        payment_phone,
        proof_image,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,CURRENT_TIMESTAMP)
      RETURNING *
      `,
      [
        userId,
        customer_name,
        customer_phone,
        total_price,
        trackingCode,
        payment_method,
        paymentStatus,
        orderStatus,
        bank_reference,
        momo_reference,
        payment_phone,
        proof_image,
      ]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          artwork_id,
          title,
          price,
          category,
          quantity
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
          order.id,
          item.id || null,
          item.title,
          Number(item.price || 0),
          item.category || "Uncategorized",
          item.quantity || 1,
        ]
      );
    }

    if (payment_method !== "cash") {
      await client.query(
        `
        INSERT INTO payments (
          order_id,
          method,
          amount,
          phone_number,
          transaction_reference,
          proof_image,
          status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          order.id,
          payment_method,
          Number(total_price || 0),
          payment_phone,
          bank_reference || momo_reference,
          proof_image,
          paymentStatus,
        ]
      );
    }

    if (userId) {
      await client.query(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1,$2,$3,$4)
        `,
        [
          userId,
          "Order Created",
          `Your order ${trackingCode} has been created successfully.`,
          "order",
        ]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("createOrder error:", error);
    return res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
}

// جلب كل الطلبات للأدمن
async function getAllOrders(req, res) {
  try {
    const ordersResult = await pool.query(
      `
      SELECT *
      FROM orders
      ORDER BY created_at DESC
      `
    );

    const orders = ordersResult.rows;

    for (const order of orders) {
      const itemsResult = await pool.query(
        `
        SELECT *
        FROM order_items
        WHERE order_id = $1
        ORDER BY id ASC
        `,
        [order.id]
      );

      order.items = itemsResult.rows;
    }

    return res.json(orders);
  } catch (error) {
    console.error("getAllOrders error:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// جلب طلب واحد
async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`,
      [id]
    );

    order.items = itemsResult.rows;

    return res.json(order);
  } catch (error) {
    console.error("getOrderById error:", error);
    return res.status(500).json({ error: "Failed to fetch order" });
  }
}

// تتبع الطلب برقم التتبع
async function trackOrder(req, res) {
  try {
    const { trackingCode } = req.params;

    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE tracking_code = $1`,
      [trackingCode]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Tracking code not found" });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`,
      [order.id]
    );

    order.items = itemsResult.rows;

    return res.json(order);
  } catch (error) {
    console.error("trackOrder error:", error);
    return res.status(500).json({ error: "Failed to track order" });
  }
}

// تحديث حالة الطلب
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = [
      "pending",
      "awaiting_payment",
      "payment_submitted",
      "payment_verified",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const result = await pool.query(
      `
      UPDATE orders
      SET order_status = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = result.rows[0];

    if (order.user_id) {
      await pool.query(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1,$2,$3,$4)
        `,
        [
          order.user_id,
          "Order Status Updated",
          `Your order ${order.tracking_code} is now ${status}.`,
          "order",
        ]
      );
    }

    return res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({ error: "Failed to update order status" });
  }
}

// تحديث حالة الدفع
async function updatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "submitted", "verified", "rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const result = await pool.query(
      `
      UPDATE orders
      SET payment_status = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = result.rows[0];

    if (status === "verified") {
      await pool.query(
        `
        UPDATE orders
        SET order_status = 'payment_verified',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [id]
      );
    }

    if (order.user_id) {
      await pool.query(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1,$2,$3,$4)
        `,
        [
          order.user_id,
          "Payment Status Updated",
          `Payment for order ${order.tracking_code} is now ${status}.`,
          "payment",
        ]
      );
    }

    return res.json({
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("updatePaymentStatus error:", error);
    return res.status(500).json({ error: "Failed to update payment status" });
  }
}

// إرسال/تسجيل الدفع
async function submitPayment(req, res) {
  try {
    const { id } = req.params;
    const {
      method,
      amount,
      phone_number = null,
      transaction_reference = null,
      proof_image = null,
    } = req.body;

    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResult.rows[0];

    await pool.query(
      `
      INSERT INTO payments (
        order_id,
        method,
        amount,
        phone_number,
        transaction_reference,
        proof_image,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,'submitted')
      `,
      [
        id,
        method,
        Number(amount || order.total_price || 0),
        phone_number,
        transaction_reference,
        proof_image,
      ]
    );

    await pool.query(
      `
      UPDATE orders
      SET payment_method = $1,
          payment_status = 'submitted',
          order_status = 'payment_submitted',
          payment_phone = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,
      [method, phone_number, id]
    );

    if (order.user_id) {
      await pool.query(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1,$2,$3,$4)
        `,
        [
          order.user_id,
          "Payment Submitted",
          `Payment for order ${order.tracking_code} has been submitted.`,
          "payment",
        ]
      );
    }

    return res.json({ message: "Payment submitted successfully" });
  } catch (error) {
    console.error("submitPayment error:", error);
    return res.status(500).json({ error: "Failed to submit payment" });
  }
}

// حذف الطلب
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM orders WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("deleteOrder error:", error);
    return res.status(500).json({ error: "Failed to delete order" });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
  updatePaymentStatus,
  submitPayment,
  deleteOrder,
};
