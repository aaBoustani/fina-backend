import { customType, timestamp, uuid } from "drizzle-orm/pg-core";
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

const analysis = pgTable("analysis", {
    id: uuid('id').defaultRandom().primaryKey(),
    dishName: text("dish_name").notNull(),
    macros: object<Macros>("macros").notNull(),
    weight: text("weight").notNull(),
    energy: object<Energy>("energy").notNull(),
    nutritionalValues: object<NutritionalValue>("nutritional_values").array(),
    ingredients: object<Ingredient>("ingredients").array(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

const analysisRelations = relations(analysis, ({ one }) => ({ upload: one(uploadTable) }));

const uploadTable = pgTable("upload", {
    id: uuid('id').defaultRandom().primaryKey(),
    image: text("image").notNull(),
    analysisId: uuid("analysis_id").references(() => analysis.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

type InsertAnalysis = typeof analysis.$inferInsert;
type SelectAnalysis = typeof analysis.$inferSelect;

type InsertUpload = typeof uploadTable.$inferInsert;
type SelectUpload = typeof uploadTable.$inferSelect;

export {
    Macros,
    Energy,
    NutritionalValue,

    analysis,
    uploadTable,
    analysisRelations,

    InsertAnalysis,
    SelectAnalysis,
    InsertUpload,
    SelectUpload,
}