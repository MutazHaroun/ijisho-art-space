# Backend Fix Progress

✅ Created `routes/orderReviews.js` - fixes MODULE_NOT_FOUND error

## Next Steps:
1. cd ../ART2/backend && npm run dev  (server should start now)
2. If DB error on `order_reviews` table:
   - Run DB migration to add table:
     ```
     -- Add to migration.sql or run in pgAdmin/psql:
     CREATE TABLE IF NOT EXISTS order_reviews (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       order_id UUID REFERENCES orders(id),
       customer_name VARCHAR(255),
       customer_phone VARCHAR(50),
       rating INTEGER CHECK (rating >= 1 AND rating <= 5),
       comment TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```
3. Test endpoint: POST http://localhost:5000/api/order-reviews {order_id: '...', rating: 5}
4. Seed some test data if needed via seed.js
