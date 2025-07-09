import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  schemeId: text("scheme_id").notNull(),
  formData: text("form_data").notNull(), // JSON string
  language: text("language").notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).pick({
  schemeId: true,
  formData: true,
  language: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;

// Government schemes definition
export const governmentSchemes = [
  {
    id: "pradhan-mantri-ujjwala-yojana",
    name: {
      english: "Pradhan Mantri Ujjwala Yojana (PMUY)",
      hindi: "प्रधान मंत्री उज्ज्वला योजना"
    },
    description: {
      english: "LPG Connection Scheme",
      hindi: "एलपीजी कनेक्शन योजना"
    },
    icon: "fas fa-fire"
  },
  {
    id: "ladli-behna-yojana",
    name: {
      english: "Ladli Behna Yojana",
      hindi: "लाडली बहना योजना"
    },
    description: {
      english: "Women Empowerment Scheme",
      hindi: "महिला सशक्तिकरण योजना"
    },
    icon: "fas fa-female"
  },
  {
    id: "mahila-samriddhi-yojana",
    name: {
      english: "Mahila Samriddhi Yojana",
      hindi: "महिला समृद्धि योजना"
    },
    description: {
      english: "Women Development Scheme",
      hindi: "महिला विकास योजना"
    },
    icon: "fas fa-users"
  },
  {
    id: "sukanya-samriddhi-yojana",
    name: {
      english: "Sukanya Samriddhi Yojana",
      hindi: "सुकन्या समृद्धि योजना"
    },
    description: {
      english: "Girl Child Savings Scheme",
      hindi: "बालिका बचत योजना"
    },
    icon: "fas fa-piggy-bank"
  },
  {
    id: "kishori-shakti-yojana",
    name: {
      english: "Kishori Shakti Yojana",
      hindi: "किशोरी शक्ति योजना"
    },
    description: {
      english: "Adolescent Girl Empowerment",
      hindi: "किशोरी सशक्तिकरण"
    },
    icon: "fas fa-graduation-cap"
  },
  {
    id: "cm-parivar-samridhi-yojana",
    name: {
      english: "CM Parivar Samridhi Yojana",
      hindi: "सीएम परिवार समृद्धि योजना"
    },
    description: {
      english: "Family Welfare Scheme",
      hindi: "पारिवारिक कल्याण योजना"
    },
    icon: "fas fa-home"
  }
];
