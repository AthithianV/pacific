import { MySql2Database } from "drizzle-orm/mysql2";

declare global {
  var drizzle: MySql2Database<Record<string, never>> | undefined;
}

export {};