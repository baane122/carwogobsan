/**
 * CARWO GOBSAN API Routes - Products
 * Direct database access via Insforge PostgreSQL
 */

import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    "postgresql://postgres:***@m3tvc3y9.us-east.database.insforge.app:5432/insforge?sslmode=require",
});

// GET /api/products
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT p.*, c.name_en as category_name, c.name_so as category_name_so
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.active = true
       ORDER BY p.created_at DESC`
    );
    client.release();
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO products (name_en, name_so, description_en, description_so, price, price_sos, image, category_id, stock, featured, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [body.name_en, body.name_so, body.description_en, body.description_so,
       body.price, body.price_sos, body.image, body.category_id, body.stock,
       body.featured || false, body.active || true]
    );
    client.release();
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}