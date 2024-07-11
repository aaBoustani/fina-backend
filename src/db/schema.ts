import { customType, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core/table";
import { relations } from "drizzle-orm/relations";


interface Macros {
    fat: string;
    carbs: string;
    protein: string;
}

interface Energy {
    calories: string;
    kilojoules: string;
}

interface NutritionalValue {
    name: string;
    amount: string;
}

interface Ingredient {
    name: string;
    weight: string;
}

const object = <TData>(name: string) => customType<{ data: TData }>({
    dataType() { return "json" },
    toDriver(value: TData) { return JSON.stringify(value) }
})(name);

export const analysis = pgTable("analysis", {
    id: serial("id").primaryKey(),
    dishName: text("dish_name").notNull(),
    macros: object<Macros>("macros").notNull(),
    weight: text("weight").notNull(),
    energy: object<Energy>("energy").notNull(),
    nutritionalValues: object<NutritionalValue>("nutritional_values").array(),
    ingredients: object<Ingredient>("ingredients").array(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

export const analysisRelations = relations(analysis, ({ one }) => ({ upload: one(upload) }));

export const upload = pgTable("upload", {
    id: serial("id").primaryKey(),
    image: text("image").notNull(),
    analysisId: integer("analysis_id").references(() => analysis.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

export type InsertAnalysis = typeof analysis.$inferInsert;
export type SelectAnalysis = typeof analysis.$inferSelect;

export type InsertUpload = typeof upload.$inferInsert;
export type SelectUpload = typeof upload.$inferSelect;