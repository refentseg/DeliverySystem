import { z } from 'zod';

// Zod schema for driver validation
export const driverSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z.string()
    .min(1, 'Phone is required')
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  licenseNumber: z.string()
    .min(1, 'License number is required')
    .min(5, 'License number must be at least 5 characters')
    .max(20, 'License number must be less than 20 characters')
    .regex(/^[A-Za-z0-9\-\s]+$/, 'License number can only contain letters, numbers, spaces, and hyphens')
});

// Type inferred from the schema
export type DriverFormData = z.infer<typeof driverSchema>;

// Type for existing driver with ID
export type Driver = DriverFormData & { id: string };