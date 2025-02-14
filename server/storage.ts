import { 
  calculatorHistory, 
  userPreferences,
  type CalculatorHistory,
  type InsertCalculatorHistory,
  type UserPreferences,
  type InsertUserPreferences
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Calculator History
  saveCalculation(data: InsertCalculatorHistory): Promise<CalculatorHistory>;
  getCalculationHistory(type: string): Promise<CalculatorHistory[]>;

  // User Preferences
  savePreferences(data: InsertUserPreferences): Promise<UserPreferences>;
  getPreferences(calculatorType: string): Promise<UserPreferences | undefined>;
}

export class DatabaseStorage implements IStorage {
  async saveCalculation(data: InsertCalculatorHistory): Promise<CalculatorHistory> {
    const [calculation] = await db
      .insert(calculatorHistory)
      .values(data)
      .returning();
    return calculation;
  }

  async getCalculationHistory(type: string): Promise<CalculatorHistory[]> {
    return await db
      .select()
      .from(calculatorHistory)
      .where(eq(calculatorHistory.type, type))
      .orderBy(calculatorHistory.createdAt);
  }

  async savePreferences(data: InsertUserPreferences): Promise<UserPreferences> {
    const [preferences] = await db
      .insert(userPreferences)
      .values(data)
      .returning();
    return preferences;
  }

  async getPreferences(calculatorType: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.calculatorType, calculatorType));
    return preferences;
  }
}

export const storage = new DatabaseStorage();