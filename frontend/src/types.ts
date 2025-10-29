export type TimeEntry = {
  id: number;
  minutes: number;
  note?: string | null;
  created_at: string;
};

export type Goal = {
  id: number;
  title: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  total_minutes: number;
  time_entries: TimeEntry[];
};
