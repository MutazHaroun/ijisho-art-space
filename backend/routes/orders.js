const express = require("express");
const router = express.Router();
const db = require("../db");

function generateTrackingCode() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `IJI-${Date.now()}-${random}`;
}

// Create order
router.post("/", async (req, res) => {
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
    user_id = null,
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items are required" });
  }

  for (const item of items) {
    if (!item.id || !item.title) {
      return res.status(400).json({
        message: "Each order item must include id and title",
      });
    }
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const trackingCode = generateTrackingCode();

    let paymentStatus = "pending";
    let orderStatus = "pending";

    if (payment_method !== "cash") {
      paymentStatus = "submitted";
      orderStatus = "awaiting_payment";
    }

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
      VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11, $12,
        CURRENT_TIMESTAMP
      )
      RETURNING *
      `,
      [
        user_id || null,
        customer_name || null,
        customer_phone || null,
        Number(total_price) || 0,
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
        INSERT INTO order_items (order_id, artwork_id, title, price, category)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          order.id,
          item.id,
          item.title,
          Number(item.price) || 0,
          item.category || null,
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
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          order.id,
          payment_method,
          Number(total_price) || 0,
          payment_phone,
          bank_reference || momo_reference,
          proof_image,
          paymentStatus,
        ]
      );
    }

    if (user_id) {
      await client.query(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1, $2, $3, $4)
        `,
        [
          user_id,
          "Order Created",
          `Your order ${trackingCode} has been created successfully.`,
          "order",
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  } finally {
    client.release();
  }
});

// Track order by tracking code
router.get("/track/:trackingCode", async (req, res) => {
  const { trackingCode } = req.params;

  try {
    const orderResult = await db.query(
      `
      SELECT *
      FROM orders
      WHERE tracking_code = $1
      `,
      [trackingCode]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Tracking code not found" });
    }

    const order = orderResult.rows[0];

    const itemsResult = await db.query(
      `
      SELECT id, artwork_id, title, price, category
      FROM order_items
      WHERE order_id = $1
      ORDER BY id ASC
      `,
      [order.id]
    );

    order.items = itemsResult.rows.map((item) => ({
      ...item,
      quantity: 1,
    }));

    res.json(order);
  } catch (error) {
    console.error("Track order error:", error);
    res.status(500).json({ message: "Failed to track order" });
  }
});

// Get all orders - newest first
router.get("/", async (req, res) => {
  try {
    const ordersResult = await db.query(`
      SELECT *
      FROM orders
      ORDER BY created_at DESC
    `);

    const orders = ordersResult.rows;

    for (const order of orders) {
      const itemsResult = await db.query(
        `
        SELECT id, artwork_id, title, price, category
        FROM order_items
        WHERE order_id = $1
        ORDER BY id ASC
        `,
        [order.id]
      );

      order.items = itemsResult.rows.map((item) => ({
        ...item,
        quantity: 1,
      }));
    }

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get orders for one user
router.get("/my-orders/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const ordersResult = await db.query(
      `
      SELECT *
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const orders = ordersResult.rows;

    for (const order of orders) {
      const itemsResult = await db.query(
        `
        SELECT id, artwork_id, title, price, category
        FROM order_items
        WHERE order_id = $1
        ORDER BY id ASC
        `,
        [order.id]
      );

      order.items = itemsResult.rows.map((item) => ({
        ...item,
        quantity: 1,
      }));
    }

    res.json(orders);
  } catch (error) {
    console.error("Fetch my orders error:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

// Get single order
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const orderResult = await db.query(
      `
      SELECT *
      FROM orders
      WHERE id = $1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.rows[0];

    const itemsResult = await db.query(
      `
      SELECT id, artwork_id, title, price, category
      FROM order_items
      WHERE order_id = $1
      ORDER BY id ASC
      `,
      [order.id]
    );

    order.items = itemsResult.rows.map((item) => ({
      ...item,
      quantity: 1,
    }));

    res.json(order);
  } catch (error) {
    console.error("Fetch single order error:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// Submit payment manually
router.post("/:id/payment", async (req, res) => {
  const { id } = req.params;
  const {
    method,
    amount,
    phone_number = null,
    transaction_reference = null,
    proof_image = null,
  } = req.body;

  try {
    const orderResult = await db.query(
      `
      SELECT *
      FROM orders
      WHERE id = $1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.rows[0];

    await db.query(
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
      VALUES ($1, $2, $3, $4, $5, $6, 'submitted')
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

    await db.query(
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
      await db.query(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1, $2, $3, $4)
        `,
        [
          order.user_id,
          "Payment Submitted",
          `Payment for order ${order.tracking_code} has been submitted.`,
          "payment",
        ]
      );
    }

    res.json({ message: "Payment submitted successfully" });
  } catch (error) {
    console.error("Submit payment error:", error);
    res.status(500).json({ message: "Failed to submit payment" });
  }
});

// Update order status
router.put("/:id/status", async (req, res) => {
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
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const result = await db.query(
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
      return res.status(404).json({ message: "Order not found" });
    }

    const order = result.rows[0];

    if (order.user_id) {
      await db.query(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1, $2, $3, $4)
        `,
        [
          order.user_id,
          "Order Status Updated",
          `Your order ${order.tracking_code} is now ${status}.`,
          "order",
        ]
      );
    }

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// Update payment status
router.put("/:id/payment-status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["pending", "submitted", "verified", "rejected"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid payment status" });
  }

  try {
    const result = await db.query(
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
      return res.status(404).json({ message: "Order not found" });
    }

    const order = result.rows[0];

    if (status === "verified") {
      await db.query(
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
      await db.query(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1, $2, $3, $4)
        `,
        [
          order.user_id,
          "Payment Status Updated",
          `Payment for order ${order.tracking_code} is now ${status}.`,
          "payment",
        ]
      );
    }

    res.json({
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({ message: "Failed to update payment status" });
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      DELETE FROM orders
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

module.exports = router;

