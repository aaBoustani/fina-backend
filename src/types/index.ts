import { analysisTable, uploadTable } from '@/db/schema';


type InsertAnalysis = typeof analysisTable.$inferInsert;
type SelectAnalysis = typeof analysisTable.$inferSelect;

type InsertUpload = typeof uploadTable.$inferInsert;
type SelectUpload = typeof uploadTable.$inferSelect;

export * from './dto';
export {
    InsertAnalysis,
    SelectAnalysis,
    InsertUpload,
    SelectUpload,
}