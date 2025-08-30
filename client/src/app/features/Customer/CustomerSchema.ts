import {z} from 'zod';


export const customerSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z.string()
  .min(1, 'Phone is required')
  .regex(/^(\+27|0)[0-9]{9}$/, 'Please enter a valid South African phone number')
  .transform(val => val.startsWith('0') ? `+27${val.slice(1)}` : val)
});

export type CustomerFormData = z.infer<typeof customerSchema>

export type Customer = CustomerFormData & { id: string };