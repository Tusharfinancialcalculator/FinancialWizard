import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Remove all database-related routes since we're not using them
  const httpServer = createServer(app);
  return httpServer;
}