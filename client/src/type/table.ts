export interface TodoTableProps {
  data: any[];
  columns: any[];
  setNewModalOpen: (open: boolean) => void;
}

export type ColumnFiltersState = {
  id: string;
  value: unknown;
}[];

export type SortingState = {
  id: string;
  desc: boolean;
}[];
