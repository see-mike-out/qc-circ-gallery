<script lang="ts">
  let { data }: PageProps = $props();
  import { CodeDefs } from "$lib/definitions";
  import type { KV } from "$lib/types";
  import { writable, type Writable } from "svelte/store";
  import type { PageProps } from "./$types";
  import { make_link } from "$lib/utility";
  import { onMount } from "svelte";

  let codebook: Writable<KV[]> = writable(data.codebook);
  let provenance: Writable<KV[]> = writable(data.provenance);

  let curr_case: Writable<string | undefined> = writable();
  let curr_case_data: Writable<{ prov: KV; codes: KV[] } | undefined> =
    writable();
  let curr_feature: Writable<KV | undefined> = writable();

  function test_feature(a: KV | undefined, b: KV | undefined): boolean {
    if (a || b) {
      return (
        a?.decision === b?.decision &&
        a?.feature === b?.feature &&
        a?.value === b?.value
      );
    }
    return false;
  }
  let curr_feature_desc: Writable<string | undefined> = writable();
  let relevant_cases: Writable<KV[]> = writable([]);
  curr_case.subscribe((c) => {
    if (c) {
      let prov = $provenance.filter((d) => d.name === c)[0];
      let codes = $codebook
        .filter((d) => d.name === c)
        .toSorted(
          (a, b) => -a.group_order.localeCompare(b.group_order.localeCompare),
        );
      curr_case_data.set({ prov, codes });
      if ($curr_feature) {
        let applicable =
          codes.filter((d) => {
            return test_feature(d, $curr_feature);
          }).length > 0;
        if (!applicable) {
          curr_feature.set(undefined);
        }
      }
    } else {
      curr_case_data.set(undefined);
      curr_feature.set(undefined);
    }
  });
  curr_feature.subscribe((f) => {
    if (f) {
      let { decision, feature, value } = f;
      let def_key = `${decision}${feature ? "." + feature : ""}${value ? "." + value : ""}`;
      curr_feature_desc.set(CodeDefs[def_key]);
      let rc = $codebook
        .filter((d) => {
          return test_feature(d, f);
        })
        .map((d) => d.name);
      let rcp = $provenance.filter((d) => rc.includes(d.name));
      relevant_cases.set(rcp);
    } else {
      relevant_cases.set([]);
      curr_feature_desc.set(undefined);
    }
  });
  onMount(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let pre_selected_name = searchParams.get("name");

    let decision = searchParams.get("decision");
    let feature = searchParams.get("feature");
    let value = searchParams.get("value");
    let pre_selected_key =
      decision && feature && value
        ? {
            decision,
            feature,
            value,
          }
        : null;

    if (pre_selected_name) {
      curr_case.set(pre_selected_name);
    }
    if (pre_selected_key) {
      curr_feature.set(pre_selected_key);
    }
  });
</script>

<h1 class="container">
  Quantum Circuit Visualization Design Space <a
    href="https://see-mike-out.github.io/qc-circ-gallery/"
    style="margin-left:3rem">Go to the design space view</a
  >
  <a href="https://arxiv.org/abs/2607.24042" style="margin-left:3rem" target="_blank">Preprint</a>
</h1>

<main class="container">
  <section id="space">
    <ol id="case-list">
      {#each $provenance as item, i}
        <li>
          <button
            class={$curr_case === item.name ? "selected" : ""}
            onclick={() => {
              curr_case.set(item.name);
            }}>{item.name.replace(/\..+$/gi, "")}</button
          >
        </li>
      {/each}
    </ol>
  </section>
  <section id="cases">
    {#if $curr_case}
      <div id="provenance">
        <h2>{$curr_case.replace(/\..+$/gi, "")}</h2>
        <p class="desc">
          Collected time: {$curr_case_data?.prov.timeCollected}
        </p>
        {#if $curr_case_data?.prov.source}
          <p class="desc">
            {#if $curr_case_data?.prov.source.startsWith("http")}
              Source: <a
                href={$curr_case_data?.prov.source}
                target="_blank">Click</a
              >
            {:else}
              Source: {@html make_link($curr_case_data?.prov.source)}
            {/if}
            <br /><span class="source-raw">{$curr_case_data?.prov.source}</span>
          </p>
        {/if}
        {#if $curr_case_data?.prov.note}
          <p class="desc">
            {@html make_link($curr_case_data?.prov.note)}
          </p>
        {/if}

        <footer>
          Because many of our sources are copyrighted, we only provide detailed
          instructions on how to find them from the actual sources.
        </footer>
      </div>
      <div id="codes">
        <h3>Codes</h3>
        <ul>
          {#each $curr_case_data?.codes as c_item, ci}
            <li>
              <button
                class={test_feature($curr_feature, c_item) ? "selected" : ""}
                onclick={() => {
                  curr_feature.set({
                    decision: c_item.decision,
                    feature: c_item.feature,
                    value: c_item.value,
                  });
                }}
              >
                {c_item.decision} &rightarrow; {c_item.feature}
                &rightarrow; {c_item.value}
              </button>
            </li>
          {/each}
        </ul>
      </div>
      <div id="code-details">
        {#if $curr_feature}
          <h3>
            {$curr_feature.decision} <br /> &rightarrow; {$curr_feature.feature}
            <br />&rightarrow; {$curr_feature.value}
          </h3>
          <p class="desc">{$curr_feature_desc}</p>
          {#if $relevant_cases.length > 0}
            <h4>Relevant cases</h4>
            <p class="desc">Click items to check out details.</p>
            <ul id="relevant_cases">
              {#each $relevant_cases as r_item, ri}
                <li>
                  <button
                    class={$curr_case === r_item.name ? "selected" : ""}
                    onclick={() => {
                      curr_case.set(r_item.name);
                    }}>{r_item.name.replace(/\..+$/gi, "")}</button
                  >
                </li>
              {/each}
            </ul>
          {/if}
        {/if}
      </div>
    {:else}
      <h2>&leftarrow; Select from the left navigation</h2>
    {/if}
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

  ol#case-list,
  #codes ul {
    display: block;
    width: 100%;
    background-color: #d7ccc8;
    overflow: scroll;
    border-radius: 0.25rem;
    margin: 0;
    padding: 0;
  }
  ol#case-list {
    height: 100%;
  }
  #codes ul {
    max-height: calc(100vh - 3.15rem);
  }

  ol#case-list li,
  #codes ul li {
    list-style: none;
    display: block;
    margin: 0;
    padding: 0;
  }

  ol#case-list li button,
  #codes ul li button {
    display: block;
    appearance: none;
    width: 100%;
    padding: 0.25rem 0.5rem;
    border-width: 0 0 1px 0;
    border-color: rgba(0, 0, 0, 0.2);
    background-color: transparent;
    text-align: left;
    font-size: 0.8rem;
    line-height: 100%;
    transition: 0.15s;
    cursor: pointer;
  }

  ol#case-list li:last-child button,
  #codes ul li:last-child button {
    border-bottom-width: 0;
  }

  ol#case-list li button:hover,
  ol#case-list li button.selected,
  #codes ul li button:hover,
  #codes ul li button.selected {
    background-color: rgba(255, 255, 255, 0.3);
    font-weight: 600;
  }

  #cases {
    width: calc(100% - 300px);
    height: calc(100vh - 1.5rem);
    padding: 0 0.5rem 0.5rem 0.25rem;
    display: flex;
    column-gap: 0.5rem;
  }

  h2 {
    margin: 0;
    padding: 0;
    font-size: 0.85rem;
    font-weight: 700;
  }

  .desc {
    display: block;
    font-size: 0.8rem;
    line-height: 100%;
    margin: 0.25rem 0 0.25rem 0;
    color: #333;
  }
  #provenance {
    width: 500px;
    padding: 0.25rem;
    border-radius: 0.25rem;
    background-color: #a1887f;
    height: fit-content;
  }
  #provenance h2 {
    color: white;
    margin-bottom: 0.5rem;
  }
  :global(#provenance .desc),
  :global(#provenance .desc a) {
    color: rgba(255, 255, 255, 0.8) !important;
  }
  .source-raw {
    display: block;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.6rem;
    margin-top: 0.15rem;
  }

  h3 {
    font-size: 0.8rem;
    margin: 0 0 0.25rem 0;
    font-weight: 500;
    color: black;
  }
  h4 {
    font-size: 0.8rem;
    margin: 0.5rem 0 0.25rem 0;
    font-weight: 500;
    color: black;
    border-top: 1px solid #ddd;
    padding-top: 0.25rem;
  }

  #code-details {
    background-color: white;
    width: 300px;
    height: fit-content;
    padding: 0.25rem;
    border-radius: 0.25rem;
    margin-top: 1.2rem;
  }
  #relevant_cases {
    margin: 0;
    padding: 0;
    max-height: calc(100vh - 12rem);
    overflow: scroll;
    display: flex;
    column-gap: 8px;
    row-gap: 8px;
    flex-wrap: wrap;
  }
  #relevant_cases li {
    list-style: none;
    display: block;
    width: 67px;
    height: 47px;
    margin: 0;
    padding: 0;
  }
  #relevant_cases li button {
    appearance: none;
    display: block;
    height: 100%;
    width: 100%;
    font-size: 0.6rem;
    border: 0;
    overflow: hidden;
    text-align: left;
    background-color: #efebe9;
    border-radius: 0.25rem;
  }
  #relevant_cases li button.selected,
  #relevant_cases li button:hover {
    font-weight: 600;
    background-color: #a1887f;
    color: white;
  }
  footer {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }
</style>
