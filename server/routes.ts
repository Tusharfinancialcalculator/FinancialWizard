import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculatorHistorySchema, insertUserPreferencesSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for calculator history
  app.post("/api/calculator/history", async (req, res) => {
    try {
      const data = insertCalculatorHistorySchema.parse(req.body);
      const calculation = await storage.saveCalculation(data);
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ message: "Invalid calculation data" });
    }
  });

  app.get("/api/calculator/history/:type", async (req, res) => {
    try {
      const history = await storage.getCalculationHistory(req.params.type);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calculation history" });
    }
  });

  // API routes for user preferences
  app.post("/api/calculator/preferences", async (req, res) => {
    try {
      const data = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.savePreferences(data);
      res.json(preferences);
    } catch (error) {
      res.status(400).json({ message: "Invalid preferences data" });
    }
  });

  app.get("/api/calculator/preferences/:type", async (req, res) => {
    try {
      const preferences = await storage.getPreferences(req.params.type);
      if (!preferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}