const db = require("../db");
const axios = require("axios");

exports.requestMTNPayment = async (req, res) => {
  const { order_id, phone_number, amount } = req.body;

  if (!order_id || !phone_number || !amount) {
    return res
      .status(400)
      .json({ message: "order_id, phone_number and amount are required" });
  }

  try {
    const transactionReference = `MTN-${Date.now()}`;

    const paymentResult = await db.query(
      `
      INSERT INTO payments (
        order_id,
        method,
        amount,
        phone_number,
        transaction_reference,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [order_id, "mtn", amount, phone_number, transactionReference, "pending"]
    );

    await db.query(
      `
      UPDATE orders
      SET payment_method = $1,
          payment_phone = $2,
          payment_status = 'pending',
          order_status = 'awaiting_payment',
          momo_reference = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      `,
      ["mtn", phone_number, transactionReference, order_id]
    );

    return res.status(201).json({
      message: "MTN payment request created successfully",
      payment: paymentResult.rows[0],
    });
  } catch (error) {
    console.error("MTN payment error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create MTN payment request" });
  }
};

exports.requestAirtelPayment = async (req, res) => {
  const { order_id, phone_number, amount } = req.body;

  if (!order_id || !phone_number || !amount) {
    return res
      .status(400)
      .json({ message: "order_id, phone_number and amount are required" });
  }

  try {
    const transactionReference = `AIRTEL-${Date.now()}`;

    const paymentResult = await db.query(
      `
      INSERT INTO payments (
        order_id,
        method,
        amount,
        phone_number,
        transaction_reference,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [order_id, "airtel", amount, phone_number, transactionReference, "pending"]
    );

    await db.query(
      `
      UPDATE orders
      SET payment_method = $1,
          payment_phone = $2,
          payment_status = 'pending',
          order_status = 'awaiting_payment',
          momo_reference = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      `,
      ["airtel", phone_number, transactionReference, order_id]
    );

    return res.status(201).json({
      message: "Airtel payment request created successfully",
      payment: paymentResult.rows[0],
    });
  } catch (error) {
    console.error("Airtel payment error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create Airtel payment request" });
  }
};

exports.getPaymentStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM payments WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Get payment status error:", error);
    return res.status(500).json({ message: "Failed to fetch payment status" });
  }
};

exports.paymentCallback = async (req, res) => {
  const { transaction_reference, status } = req.body;

  if (!transaction_reference || !status) {
    return res
      .status(400)
      .json({ message: "transaction_reference and status are required" });
  }

  try {
    const paymentResult = await db.query(
      `
      UPDATE payments
      SET status = $1
      WHERE transaction_reference = $2
      RETURNING *
      `,
      [status, transaction_reference]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const payment = paymentResult.rows[0];

    if (status === "success" || status === "verified") {
      await db.query(
        `
        UPDATE orders
        SET payment_status = 'verified',
            order_status = 'payment_verified',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [payment.order_id]
      );
    }

    if (status === "failed" || status === "rejected") {
      await db.query(
        `
        UPDATE orders
        SET payment_status = 'rejected',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [payment.order_id]
      );
    }

    return res.json({
      message: "Payment callback handled successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment callback error:", error);
    return res.status(500).json({ message: "Failed to process callback" });
  }
};
