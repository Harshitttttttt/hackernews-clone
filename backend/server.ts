import express from "express";
const port = process.env.PORT || 3000;
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.ts";
import userRoutes from "./routes/userRoutes.ts";
import { drizzle } from "drizzle-orm/neon-http";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not defined. Ensure your .env file is correctly loaded or the variable is set."
  );
}

// console.log(databaseUrl);
const db = drizzle(databaseUrl);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `Server is running on port ${port} - \x1b[34mhttp://localhost:${[
      port,
    ]}\x1b[0m`
  );
});
