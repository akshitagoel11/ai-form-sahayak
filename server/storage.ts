import { users, formSubmissions, type User, type InsertUser, type FormSubmission, type InsertFormSubmission } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getFormSubmission(id: number): Promise<FormSubmission | undefined>;
  getFormSubmissionsByScheme(schemeId: string): Promise<FormSubmission[]>;
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  updateFormSubmission(id: number, updates: Partial<InsertFormSubmission>): Promise<FormSubmission | undefined>;
  deleteFormSubmission(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private formSubmissions: Map<number, FormSubmission>;
  private currentUserId: number;
  private currentSubmissionId: number;

  constructor() {
    this.users = new Map();
    this.formSubmissions = new Map();
    this.currentUserId = 1;
    this.currentSubmissionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFormSubmission(id: number): Promise<FormSubmission | undefined> {
    return this.formSubmissions.get(id);
  }

  async getFormSubmissionsByScheme(schemeId: string): Promise<FormSubmission[]> {
    return Array.from(this.formSubmissions.values()).filter(
      (submission) => submission.schemeId === schemeId
    );
  }

  async createFormSubmission(insertSubmission: InsertFormSubmission): Promise<FormSubmission> {
    const id = this.currentSubmissionId++;
    const now = new Date();
    const submission: FormSubmission = {
      ...insertSubmission,
      id,
      status: insertSubmission.status || 'draft',
      createdAt: now,
      updatedAt: now,
    };
    this.formSubmissions.set(id, submission);
    return submission;
  }

  async updateFormSubmission(id: number, updates: Partial<InsertFormSubmission>): Promise<FormSubmission | undefined> {
    const existing = this.formSubmissions.get(id);
    if (!existing) return undefined;

    const updated: FormSubmission = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.formSubmissions.set(id, updated);
    return updated;
  }

  async deleteFormSubmission(id: number): Promise<boolean> {
    return this.formSubmissions.delete(id);
  }
}

export const storage = new MemStorage();
