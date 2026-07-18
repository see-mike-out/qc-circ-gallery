import type { KV } from "./types";
import { createReadStream } from "fs";
import { default as csv } from 'csv-parser';

export async function parseCSV(filepath: string): Promise<KV[]> {
  return new Promise((resolve, reject) => {
    let rows: KV[] = [];
    createReadStream(filepath).pipe(csv()).on('data', (r) => {
      rows.push(r);
    }).on('end', () => {
      resolve(rows);
    });
  })
}