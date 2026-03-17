const express = require("express");
const router = express.Router();
const db = require("../db");

// Create order
router.post("/", async (req, res) => {
  const { customer_name, customer_phone, items, total_price } = req.body;

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

    const orderResult = await client.query(
      `
      INSERT INTO orders (customer_name, customer_phone, total_price, status)
      VALUES ($1, $2, $3, 'Pending')
      RETURNING *
      `,
      [
        customer_name || null,
        customer_phone || null,
        Number(total_price) || 0,
      ]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `
        INSERT INTO order_items (order_id, artwork_id, title, price, category)
        VALUES ($1, $2::uuid, $3, $4, $5)
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

      order.items = itemsResult.rows;
    }

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
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

    order.items = itemsResult.rows;

    res.json(order);
  } catch (error) {
    console.error("Fetch single order error:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// Update order status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["Pending", "Confirmed", "Cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const result = await db.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update order status" });
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
