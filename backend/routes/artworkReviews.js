const express = require("express");
const router = express.Router();
const db = require("../db");

// Add artwork review
router.post("/", async (req, res) => {
  const { artwork_id, customer_name, customer_phone, rating, comment } = req.body;

  if (!artwork_id || !rating) {
    return res.status(400).json({
      message: "artwork_id and rating are required",
    });
  }

  const numericRating = Number(rating);

  if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO artwork_reviews (
        artwork_id,
        customer_name,
        customer_phone,
        rating,
        comment
      )
      VALUES ($1::uuid, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        artwork_id,
        customer_name || null,
        customer_phone || null,
        numericRating,
        comment || null,
      ]
    );

    res.status(201).json({
      message: "Artwork review added successfully",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Add artwork review error:", error);
    res.status(500).json({
      message: "Failed to add artwork review",
    });
  }
});

// Get reviews for one artwork + stats
router.get("/artwork/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const reviewsResult = await db.query(
      `
      SELECT *
      FROM artwork_reviews
      WHERE artwork_id = $1::uuid
      ORDER BY created_at DESC
      `,
      [id]
    );

    const statsResult = await db.query(
      `
      SELECT
        COUNT(*)::int AS reviews_count,
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS average_rating
      FROM artwork_reviews
      WHERE artwork_id = $1::uuid
      `,
      [id]
    );

    res.json({
      reviews: reviewsResult.rows,
      stats: statsResult.rows[0],
    });
  } catch (error) {
    console.error("Fetch artwork reviews error:", error);
    res.status(500).json({
      message: "Failed to fetch artwork reviews",
    });
  }
});

// Delete artwork review
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      DELETE FROM artwork_reviews
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete artwork review error:", error);
    res.status(500).json({
      message: "Failed to delete artwork review",
    });
  }
});

module.exports = router;
