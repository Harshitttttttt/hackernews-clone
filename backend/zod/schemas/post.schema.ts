import { z } from "zod";

const CreatePostSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  url: z.string().optional(),
  content: z.string().optional(),
});

export { CreatePostSchema };
