export type FormItem = {
  key: string;
  title?: string;
  db_type: 'INTEGER' | 'VARCHAR';
  type: 'number' | 'text' | 'boolean' | 'datetime' | 'long-text';
  readonly?: boolean;
  is_primary?: boolean;
};

export type KV = {
  [key: string]: any;
};