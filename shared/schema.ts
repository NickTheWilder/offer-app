import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  bidderNumber: text("bidder_number").notNull().unique(),
  role: text("role", { enum: ["admin", "bidder"] }).notNull().default("bidder"),
  password: text("password").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isActive: true
});

// Auction Items Table
export const auctionItems = pgTable("auction_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  images: text("images").array(),
  startingBid: doublePrecision("starting_bid").notNull(),
  minimumBidIncrement: doublePrecision("minimum_bid_increment").notNull().default(5),
  buyNowPrice: doublePrecision("buy_now_price"),
  estimatedValue: doublePrecision("estimated_value"),
  category: text("category").notNull(),
  tags: text("tags").array(),
  auctionType: text("auction_type", { enum: ["silent"] }).notNull().default("silent"),
  displayOrder: integer("display_order").notNull().default(0),
  donorName: text("donor_name"),
  donorPublic: boolean("donor_public").notNull().default(false),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  status: text("status", { enum: ["draft", "published", "active", "sold", "unsold"] }).notNull().default("draft"),
  restrictions: text("restrictions"),
  additionalDetails: jsonb("additional_details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertAuctionItemSchema = createInsertSchema(auctionItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Bids Table
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  bidderId: integer("bidder_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  isWinning: boolean("is_winning").notNull().default(false),
  isBuyNow: boolean("is_buy_now").notNull().default(false)
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  timestamp: true
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AuctionItem = typeof auctionItems.$inferSelect;
export type InsertAuctionItem = z.infer<typeof insertAuctionItemSchema>;

export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
