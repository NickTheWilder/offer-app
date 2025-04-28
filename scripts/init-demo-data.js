import "dotenv/config";
import pg from "pg";
import crypto from "crypto";
import { promisify } from "util";

const { Pool } = pg;
const { scrypt, randomBytes } = crypto;
const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const buf = await scryptAsync(password, salt, 64);
    return `${buf.toString("hex")}.${salt}`;
}

async function main() {
    console.log("Initializing demo data...");

    // Connect to the database
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    // Create an admin user
    const adminPassword = await hashPassword("admin123");
    const adminUser = await pool.query(
        `INSERT INTO users (name, email, phone, bidder_number, role, password) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     ON CONFLICT (email) DO UPDATE SET role = 'admin'
     RETURNING *`,
        ["Admin User", "admin@example.com", "555-1234", "A001", "admin", adminPassword]
    );
    console.log("Created admin user:", adminUser.rows[0].email);

    // Create a regular bidder
    const bidderPassword = await hashPassword("bidder123");
    const bidderUser = await pool.query(
        `INSERT INTO users (name, email, phone, bidder_number, role, password) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     ON CONFLICT (email) DO UPDATE SET role = 'bidder'
     RETURNING *`,
        ["Bidder User", "bidder@example.com", "555-5678", "B001", "bidder", bidderPassword]
    );
    console.log("Created bidder user:", bidderUser.rows[0].email);

    // Create a few auction items
    const auctionItems = [
        {
            name: "Handmade Quilt",
            description: "Beautiful handmade quilt donated by the quilting circle. Full size, 100% cotton.",
            images: JSON.stringify(["https://images.unsplash.com/photo-1587862602960-d8a9a0f70141"]),
            starting_bid: 50.0,
            minimum_bid_increment: 5.0,
            buy_now_price: 200.0,
            estimated_value: 175.0,
            category: "Handcrafts",
            tags: JSON.stringify(["quilt", "handmade", "bedding"]),
            donor_name: "Church Quilting Circle",
            donor_public: true,
            status: "active",
        },
        {
            name: "Dinner for 4 at Luigi's",
            description: "Gift certificate for dinner for four at Luigi's Italian Restaurant, including appetizers and dessert.",
            images: JSON.stringify(["https://images.unsplash.com/photo-1555396273-367ea4eb4db5"]),
            starting_bid: 75.0,
            minimum_bid_increment: 10.0,
            buy_now_price: 300.0,
            estimated_value: 250.0,
            category: "Dining",
            tags: JSON.stringify(["dining", "restaurant", "gift certificate"]),
            donor_name: "Luigi's Italian Restaurant",
            donor_public: true,
            status: "active",
        },
        {
            name: "Vacation Cabin Weekend",
            description: "Weekend stay at a mountain cabin. Two bedrooms, hot tub, hiking trails nearby.",
            images: JSON.stringify(["https://images.unsplash.com/photo-1586375300773-8384e3e4916f"]),
            starting_bid: 200.0,
            minimum_bid_increment: 25.0,
            buy_now_price: 800.0,
            estimated_value: 650.0,
            category: "Travel",
            tags: JSON.stringify(["vacation", "cabin", "weekend getaway"]),
            donor_name: "Smith Family",
            donor_public: true,
            status: "active",
        },
        {
            name: "Homemade Pie for a Year",
            description: "One homemade pie delivered to your home each month for a year. Your choice of flavors.",
            images: JSON.stringify(["https://images.unsplash.com/photo-1535920527002-b35e96722969"]),
            starting_bid: 100.0,
            minimum_bid_increment: 10.0,
            buy_now_price: 400.0,
            estimated_value: 300.0,
            category: "Food",
            tags: JSON.stringify(["pie", "baking", "dessert"]),
            donor_name: "Mary Johnson",
            donor_public: true,
            status: "active",
        },
        {
            name: "Professional Family Portrait Session",
            description: "Professional photography session including 10 digital images and one 8x10 print.",
            images: JSON.stringify(["https://images.unsplash.com/photo-1609220136736-443140cffec6"]),
            starting_bid: 150.0,
            minimum_bid_increment: 15.0,
            buy_now_price: 500.0,
            estimated_value: 450.0,
            category: "Services",
            tags: JSON.stringify(["photography", "portrait", "family"]),
            donor_name: "Capture Photography Studio",
            donor_public: true,
            status: "active",
        },
    ];

    // Insert auction items
    for (const item of auctionItems) {
        await pool.query(
            `INSERT INTO auction_items (
        name, description, images, starting_bid, minimum_bid_increment, 
        buy_now_price, estimated_value, category, tags, 
        donor_name, donor_public, status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT DO NOTHING`,
            [item.name, item.description, item.images, item.starting_bid, item.minimum_bid_increment, item.buy_now_price, item.estimated_value, item.category, item.tags, item.donor_name, item.donor_public, item.status]
        );
        console.log(`Created auction item: ${item.name}`);
    }

    console.log("Demo data initialization complete.");
    await pool.end();
}

main().catch(console.error);
