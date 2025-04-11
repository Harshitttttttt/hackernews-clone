// types/express/index.d.ts
import { SelectUser } from "../../backend/db/schema.ts";

declare global {
  namespace Express {
    interface Request {
      user?: SelectUser;
    }
  }
}
