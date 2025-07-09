import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFormSubmissionSchema, governmentSchemes } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all government schemes
  app.get("/api/schemes", async (req, res) => {
    res.json(governmentSchemes);
  });

  // Get specific scheme by ID
  app.get("/api/schemes/:id", async (req, res) => {
    const { id } = req.params;
    const scheme = governmentSchemes.find(s => s.id === id);
    
    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }
    
    res.json(scheme);
  });

  // Create form submission
  app.post("/api/form-submissions", async (req, res) => {
    try {
      const validatedData = insertFormSubmissionSchema.parse(req.body);
      const submission = await storage.createFormSubmission(validatedData);
      res.json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update form submission
  app.patch("/api/form-submissions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const submissionId = parseInt(id);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({ message: "Invalid submission ID" });
      }

      const validatedData = insertFormSubmissionSchema.partial().parse(req.body);
      const updated = await storage.updateFormSubmission(submissionId, validatedData);
      
      if (!updated) {
        return res.status(404).json({ message: "Form submission not found" });
      }
      
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get form submission by ID
  app.get("/api/form-submissions/:id", async (req, res) => {
    const { id } = req.params;
    const submissionId = parseInt(id);
    
    if (isNaN(submissionId)) {
      return res.status(400).json({ message: "Invalid submission ID" });
    }

    const submission = await storage.getFormSubmission(submissionId);
    
    if (!submission) {
      return res.status(404).json({ message: "Form submission not found" });
    }
    
    res.json(submission);
  });

  // Get form submissions by scheme
  app.get("/api/schemes/:schemeId/submissions", async (req, res) => {
    const { schemeId } = req.params;
    const submissions = await storage.getFormSubmissionsByScheme(schemeId);
    res.json(submissions);
  });

  const httpServer = createServer(app);
  return httpServer;
}
