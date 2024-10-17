import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextResponse } from "next/server";

let dbPromise = null; // Initialize dbPromise to null

// Function to open the database
async function opendb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: "./product.db",
      driver: sqlite3.Database,
    });
  }
  return dbPromise;
}

// Initialize database tables (ensure it is only called once)
async function initDb() {
  const db = await opendb();
  await db.run(`
    CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productname TEXT,
      category TEXT,
      sku TEXT,
      price INTEGER,
      stockqty INTEGER,
      unit TEXT,
      expdate DATE,
      suppliername TEXT,
      description TEXT
    )
  `);
  console.log("Created 'product' table");
}

// Handle POST request to insert data
export async function POST(req) {
  let db;
  try {
    await initDb(); // Ensure the database schema is initialized
    const data = await req.json();

    const {
      productname,
      category,
      sku,
      price,
      stockqty,
      unit,
      expdate,
      suppliername,
      description,
    } = data;

    db = await opendb(); // Open database
    const result = await db.run(
      `
      INSERT INTO product (productname, category, sku, price, stockqty, unit, expdate, suppliername, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        productname,
        category,
        sku,
        price,
        stockqty,
        unit,
        expdate,
        suppliername,
        description,
      ]
    );

    const productId = result.lastID;
    console.log({ productId });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error during database operation:", error);
    return NextResponse.json(
      { error: "Database error: " + error.message },
      { status: 500 }
    );
  } finally {
    if (db) {
      console.log("Closed the database connection after POST.");
    }
  }
}

// Handle GET request to retrieve data
export async function GET() {
  let db;
  try {
    await initDb(); // Ensure the database schema is initialized

    db = await opendb(); // Open database
    const data = await db.all("SELECT * FROM product"); // Fetch all products
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error during database operation:", error);
    return NextResponse.json(
      { error: "Database error: " + error.message },
      { status: 500 }
    );
  } finally {
    if (db) {
      console.log("Closed the database connection after GET.");
    }
  }
}


export async function DELETE(req) {
  let db;

  try {
    // Extract the 'id' from the request body
    const { id } = await req.json(); // This assumes you're sending { "id": <your_id> } in the body

    console.log("ID received for deletion: " + id);

    // Check if the ID is valid
    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    await initDb(); // Initialize the database schema
    db = await opendb(); // Open the database connection

    // Execute the DELETE query using the provided ID
    const result = await db.run("DELETE FROM product WHERE id = ?", id);

    // Check if the product was successfully deleted
    if (result.changes === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Return a success message if the product was deleted
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    // Log the error and return a response with the error message
    console.error("Error during database operation:", error);
    return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
  } finally {
    if (db) {
      console.log("Closed the database connection after DELETE.");
    }
  }
}

// Handle PUT request to update data
export async function PUT(req) {
  let db;

  try {
    const data = await req.json();
    const { id, productname, category, sku, price, stockqty, unit, expdate, suppliername, description } = data;

    // Check if the ID is valid
    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    await initDb(); // Ensure the database schema is initialized
    db = await opendb(); // Open the database connection

    // Execute the UPDATE query using the provided ID and new data
    const result = await db.run(
      `UPDATE product 
      SET productname = ?, category = ?, sku = ?, price = ?, stockqty = ?, unit = ?, expdate = ?, suppliername = ?, description = ?
      WHERE id = ?`,
      [productname, category, sku, price, stockqty, unit, expdate, suppliername, description, id]
    );

    // Check if the product was successfully updated
    if (result.changes === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error during database operation:", error);
    return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
  } finally {
    if (db) {
      console.log("Closed the database connection after PUT.");
    }
  }
}


