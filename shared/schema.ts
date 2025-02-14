import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const calculatorHistory = pgTable("calculator_history", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'sip', 'emi', 'credit-card', 'interest'
  input: jsonb("input").notNull(), // Store calculation inputs
  result: jsonb("result").notNull(), // Store calculation results
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  calculatorType: text("calculator_type").notNull(),
  defaultValues: jsonb("default_values").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schemas for inserting data
export const insertCalculatorHistorySchema = createInsertSchema(calculatorHistory).omit({ 
  id: true,
  createdAt: true 
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ 
  id: true,
  updatedAt: true 
});

// Types for the application
export type InsertCalculatorHistory = z.infer<typeof insertCalculatorHistorySchema>;
export type CalculatorHistory = typeof calculatorHistory.$inferSelect;

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;