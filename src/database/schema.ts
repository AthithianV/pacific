import { boolean, date, datetime, decimal, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const Role = mysqlTable("roles", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 25 }).unique().notNull(),
});

export const User = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement(),
    username: varchar("username", { length: 25 }).unique().notNull(),
    email: varchar("email", { length: 25 }).unique().notNull(),
    password: varchar("password", { length: 100 }).notNull(),
    roleId: int("role_id").notNull().references(() => Role.id),
    createdAt: date("created_at").default(new Date()),
    updatedAt: date("updated_at")
});

export const Product = mysqlTable("products", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", {length: 100}).notNull(),
    description: varchar("description", {length: 500}),
    category: varchar("category", {length: 50}).notNull(),
    scheduledStartDate: datetime("scheduled_start_date").notNull(),
    expiryDate: datetime("expiry_date").notNull(),
    freeDelivery: boolean("free_delivery").default(false),
    deliveryAmount: decimal("delivery_amount", { precision: 10, scale: 2 }),
    imageUrl: varchar("image_url", {length: 500}),
    oldPrice: decimal("old_price", { precision: 10, scale: 2 }),
    newPrice: decimal("new_price", { precision: 10, scale: 2 }),
    urlSlug: varchar("url_slug", { length: 150 }).unique().notNull(),
});