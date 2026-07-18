import type { KV } from '$lib/types';
import type { PageServerLoad } from './$types';
import { load_data } from './loader';

export const load: PageServerLoad = async ({ }) => {
  let codebook = await load_data("codebook") as KV[];
  let provenance = await load_data("provenance") as KV[];
  return {
    codebook,
    provenance,
  };
};
