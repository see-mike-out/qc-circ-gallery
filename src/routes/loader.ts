import { parseCSV } from "$lib/csvParse";
import { unique, type KV } from "$lib/utility";

export async function load_data(slug: string) {
  if (slug == "codebook") {
    let raw_rows: KV[] = await parseCSV(`static/data-save/spacecodes.csv`);
    return raw_rows;
  } else if (slug == "space") {
    let raw_rows: KV[] = await parseCSV(`static/data-save/spacecodes.csv`);
    let rows: KV[] = unique(raw_rows.map((d) => `${d.group_order}--${d.decision}--${d.feature}--${d.value}`)).map((e) => {
      let [group_order, decision, feature, value] = e.split("--")
      return { group_order, decision, feature, value };
    });
    rows = rows.toSorted((a: KV, b: KV) =>
      (a.group_order as string).localeCompare(b.group_order as string),
    )
    return rows;
  } else if (slug == "provenance") {
    let rows: KV[] = await parseCSV(`static/data-save/provenance.csv`);
    return rows;
  }
}