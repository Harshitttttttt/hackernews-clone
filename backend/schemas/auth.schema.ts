import { z } from "zod";

const RegisterUserSchema = z.object({
  username: z.string().min(3, { message: "Must be 3 characters or more" }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, { message: "Must be 8 characters or more" }),
});

const LoginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, { message: "Must be 8 characters or more" }),
});

export { RegisterUserSchema, LoginUserSchema };
