export interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  yoe: number | null;
  current_ctc: number | null;
  professional_summary: string | null;
  created_at: string;
  is_deleted?: boolean;
  [key: string]: any; // Allow other fields from the database
}
