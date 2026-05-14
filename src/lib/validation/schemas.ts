import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(2).max(100),
    phone: z.string().min(10).max(20),
    email: z.string().email().optional().or(z.literal('')),
    username: z.string().min(3).max(50).optional().or(z.literal('')),
    password: z.string().min(6).max(100),
    role: z.enum(['sales', 'admin']),
  })
  .refine((d) => d.email || d.username, {
    message: 'Email or username required',
  });

export const loginSchema = z.object({
  identifier: z.string().min(1), // email or username
  password: z.string().min(1),
});

export const leadSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(10).max(20),
  customerEmail: z.string().email().optional().or(z.literal('')),
  city: z.string().min(2).max(100),
  note: z.string().max(1000).optional(),
  budget: z.string().optional(),
  brochureUrl: z.string().url().optional().or(z.literal('')),
});

export const syncLeadSchema = z.object({
  id: z.string(),
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(10).max(20),
  customerEmail: z.string().optional(),
  city: z.string().min(2).max(100),
  note: z.string().optional(),
  budget: z.string().optional(),
  createdAt: z.string(),
});
