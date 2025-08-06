import { z } from "zod";

export const userValidators = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.email(),
  username: z.string().min(3),
  password: z.string().min(6),
  status: z.string().optional(),
});
