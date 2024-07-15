import { customType, timestamp, uuid } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core/table";
import { relations } from "drizzle-orm/relations";
import { Ingredient, Macros, Energy, NutritionalValue } from "$/src/types/dto";


const object = <TData>(name: string) => customType<{ data: TData }>({
    dataType() { return "json" },
    toDriver(value: TData) {
        try {
            return JSON.stringify(value);
        } catch (error) {
            return value;
        }
    },
    fromDriver(value: any) {
        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }
})(name);

const analysisTable = pgTable("analysis", {
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

const analysisRelations = relations(analysisTable, ({ one }) => ({ upload: one(uploadTable) }));

const uploadTable = pgTable("upload", {
    id: uuid('id').defaultRandom().primaryKey(),
    image: text("image").notNull(),
    analysisId: uuid("analysis_id").references(() => analysisTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

const uploadRelations = relations(uploadTable, ({ one }) => ({
    analysis: one(analysisTable, {
        fields: [uploadTable.analysisId],
        references: [analysisTable.id],
    })
}));

export {
    analysisTable,
    uploadTable,
    analysisRelations,
    uploadRelations,
};