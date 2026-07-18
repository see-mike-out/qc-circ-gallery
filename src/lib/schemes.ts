import type { FormItem } from "./types";

export const DB_FILE_NAME = 'data2.db';

export const ProvDataTableName = "provenance";

export const ImageProvForm: FormItem[] = [
  { key: "name", title: "Name", type: "text", db_type: "VARCHAR", readonly: true, is_primary: true },
  { key: "source", title: "Source", type: "text", db_type: "VARCHAR" },
  { key: "timeCollected", title: "Collected Time", type: "text", db_type: "VARCHAR" },
  { key: "note", title: "Note", type: "long-text", db_type: "VARCHAR" },
];

export const SpaceDataTableName = "spacetags";

export const SpaceDataForm: FormItem[] = [
  { key: "index", title: "Index", type: "text", db_type: "VARCHAR", readonly: true, is_primary: true },
  { key: "name", title: "Name", type: "text", db_type: "VARCHAR", readonly: true },
  { key: "feature", title: "Feature", type: "text", db_type: "VARCHAR" },
  { key: "value", title: "Value", type: "text", db_type: "VARCHAR" },
  { key: "note", title: "Note", type: "text", db_type: "VARCHAR" },
]

export const CodeTableName = "codebook";

export const CodeTableForm: FormItem[] = [
  { key: "fv", title: "Feature-Value", type: "text", db_type: "VARCHAR", is_primary: true },
  { key: "feature", title: "Feature", type: "text", db_type: "VARCHAR" },
  { key: "value", title: "Value", type: "text", db_type: "VARCHAR"},
  { key: "definition", title: "Definition", type: "text", db_type: "VARCHAR" }
];

export function encodeSQLValue(value: any) {
  if (typeof value == 'number') { return value.toString(); }
  else if (typeof value == 'string') { return `'${value}'`; }
  else if (value === undefined || value === null) { return 'NULL'; }
  else return `${value.toString()}`;
}