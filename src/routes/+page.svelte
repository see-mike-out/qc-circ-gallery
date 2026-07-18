<script lang="ts">
  import type { KV } from "$lib/types";
  import CaseView from "$lib/viewer_assets/CaseView.svelte";
  import SpaceNav from "$lib/viewer_assets/SpaceNav.svelte";
  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import type { PageProps } from "./$types";
  import { unique } from "$lib/utility";

  let curr_keyword: Writable<KV> = writable({});
  let curr_cases: Writable<KV[]> = writable([]);
  let { data }: PageProps = $props();

  let codebook: Writable<KV[]> = writable(data.codebook);
  let provenance: Writable<KV[]> = writable(data.provenance);

  function update_data(item: KV) {
    curr_keyword.set(item);
  }

  let codebook_parsed: Writable<KV> = writable({});
  onMount(() => {
    let first_level: string[] = [];
    let first_level_ordering: KV = {};
    let second_level: { [key: string]: string[] } = {};
    let third_level: { [key: string]: { [key: string]: string[] } } = {};
    $codebook.forEach((item) => {
      // let fl0: string = `${item.group_order.slice(0, 2)}-${item.decision}`;
      let fl: string = item.decision;
      let sl: string = item.feature;
      let tl: string = item.value;
      if (fl.length > 0 && sl.length > 0 && tl.length > 0) {
        first_level_ordering[fl] = item.group_order.slice(0, 2);
        if (!first_level.includes(fl)) {
          first_level.push(fl);
        }
        if (!second_level[fl]) {
          second_level[fl] = [];
        }
        if (!third_level[fl]) {
          third_level[fl] = {};
        }

        if (!second_level[fl].includes(sl)) {
          second_level[fl].push(sl);
          second_level[fl].sort((a: string, b: string) => a.localeCompare(b));
        }
        if (!third_level[fl][sl]) {
          third_level[fl][sl] = [];
        }
        if (!third_level[fl][sl].includes(tl)) {
          third_level[fl][sl].push(tl);
          third_level[fl][sl].sort((a: string, b: string) =>
            a.localeCompare(b),
          );
        }
      }
    });
    codebook_parsed.set({
      first_level: first_level.toSorted((a, b) =>
        first_level_ordering[a].localeCompare(first_level_ordering[b]),
      ),
      second_level,
      third_level,
    });

    curr_keyword.subscribe((k: KV) => {
      if (k) {
        let { decision, feature, value } = k;
        let items = unique(
          $codebook
            .filter(
              (d) =>
                d.decision == decision &&
                (!feature || d.feature == feature) &&
                (!value || d.value == value),
            )
            .map((d) => d.name),
        );
        curr_cases.set(
          $provenance.filter((d) => {
            return items.includes(d.name);
          }),
        );
      }
    });
  });
</script>

<h1 class="container">
  Quantum Circuit Visualization Design Space <a
    href="https://see-mike-out.github.io/qc-circ-gallery/case_list_view"
    style="margin-left:3rem">Go to the list of cases</a
  >
</h1>

<main class="container">
  <section id="space">
    <SpaceNav {codebook_parsed} {update_data} {curr_keyword}></SpaceNav>
  </section>
  <section id="cases">
    <CaseView {curr_cases} {curr_keyword}></CaseView>
  </section>
</main>

<style>
  h1 {
    margin: 0;
    padding: 0.3rem 0.75rem;
    line-height: 100%;
    font-size: 0.9rem;
    text-align: start;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.5);
  }

  main.container {
    display: flex;
    column-gap: 0;
  }

  #space {
    width: 300px;
    height: calc(100vh - 1.5rem);
    padding: 0 0.25rem 0.5rem 0.5rem;
  }

  #cases {
    width: calc(100% - 300px);
    height: calc(100vh - 1.5rem);
    padding: 0 0.5rem 0.5rem 0.25rem;
  }
</style>
