import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Enter your full name'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type RegisterFormValues = z.infer<typeof registerSchema>

export const loanApplicationSchema = z.object({
  type: z.enum(['personal', 'home', 'auto', 'education', 'business']),
  amount: z
    .number({ message: 'Enter a valid amount' })
    .min(10000, 'Minimum loan amount is ₹10,000')
    .max(10000000, 'Maximum loan amount is ₹1,00,00,000'),
  tenureMonths: z
    .number({ message: 'Enter tenure in months' })
    .min(6, 'Minimum tenure is 6 months')
    .max(360, 'Maximum tenure is 360 months'),
  purpose: z.string().min(10, 'Please describe the purpose in at least 10 characters'),
})
export type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>

export const rejectionSchema = z.object({
  reason: z.string().min(10, 'Please provide a reason of at least 10 characters'),
})
export type RejectionFormValues = z.infer<typeof rejectionSchema>
