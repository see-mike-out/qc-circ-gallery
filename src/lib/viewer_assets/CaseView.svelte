<script lang="ts">
  import { CodeDefs } from "$lib/definitions";
  import { make_link, type KV } from "$lib/utility";
  import { writable, type Writable } from "svelte/store";

  export let curr_cases: Writable<KV[]> = writable([]);
  export let curr_keyword: Writable<KV> = writable({});

  let image_expansion: Writable<string | undefined> = writable();
  let description: Writable<string> = writable("");
  curr_keyword.subscribe((k) => {
    let { decision, feature, value } = k;
    let def_key = `${decision}${feature ? "." + feature : ""}${value ? "." + value : ""}`;
    description.set(CodeDefs[def_key]);
  });

  const main_url = "https://see-mike-out.github.io/qc-circ-gallery/";
</script>

<div class="cases_wrap">
  <div class="title">
    <h2>
      {#if $curr_keyword.decision}
        {$curr_keyword.decision}
        {#if $curr_keyword.feature}
          &rightarrow; {$curr_keyword.feature}
        {/if}{#if $curr_keyword.value}
          &rightarrow;
          {$curr_keyword.value}{/if} ({$curr_cases.length} items)
      {:else}
        &leftarrow; Select from the left navigation{/if}
    </h2>
    <span class="desc">
      {$description}
    </span>

    <footer>
      Because many of our sources are copyrighted, we only provide detailed
      instructions on how to find them from the actual sources.
    </footer>
  </div>
  <div class="image-list-wrap">
    {#each $curr_cases as item, j}
      <article>
        <h3>
          {item.name}
          |
          {#if $curr_keyword.decision && $curr_keyword.feature && $curr_keyword.value}
            <a
              href={`${main_url}/case_list_view?name=${item.name}&decision=${$curr_keyword.decision}&feature=${$curr_keyword.feature}&value=${$curr_keyword.value}`}
              target="_blank">Find details</a
            >
          {:else}
            <a
              href={`${main_url}/case_list_view?name=${item.name}`}
              target="_blank">Find details</a
            >
          {/if}
        </h3>
        <div class="desc">
          {#if item.source.startsWith("http")}
            <p>Source: <a href={item.source} target="_blank">Click</a></p>
          {:else}
            <p>Source: {@html make_link(item.source)}</p>
          {/if}
          {#if item.note}
            <p>{@html make_link(item.note)}</p>
          {/if}
        </div>
      </article>
    {/each}
  </div>
</div>

{#if $image_expansion}
  <div id="expanded-image">
    <div class="expanded-image-box">
      <div>
        <button
          class="close"
          on:click={() => {
            image_expansion.set(undefined);
          }}>Close</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .cases_wrap {
    height: 100%;
    overflow-y: scroll;
  }
  .title {
    position: sticky;
    top: 0;
    background-color: #efebe9;
  }
  h2 {
    margin: 0;
    padding: 0;
    font-size: 0.8rem;
    font-weight: 700;
  }
  .desc {
    display: block;
    font-size: 0.8rem;
    line-height: 100%;
    margin: 0 0 0.25rem 0;
    color: #333;
  }
  h3 {
    font-size: 0.8rem;
    margin: 0 0 0.25rem 0;
    font-weight: 500;
    color: white;
  }
  .image-list-wrap {
    padding: 0;
    display: flex;
    row-gap: 0.5rem;
    column-gap: 0.5rem;
    flex-wrap: wrap;
  }
  .image-list-wrap article {
    width: 300px;
    padding: 0.25rem;
    background-color: #a1887f;
    border-radius: 0.25rem;
  }
  .desc {
    padding-top: 0.25rem;
  }
  .desc p {
    color: white;
    font-size: 0.8rem;
    margin: 0.5rem 0 0 0;
    padding: 0;
    line-height: 100%;
  }
  :global(.image-list-wrap article a) {
    color: white;
  }

  #expanded-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(3px);
    z-index: 999;
  }
  #expanded-image .expanded-image-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    max-width: 90%;
    max-height: 90%;
    overflow: scroll;
  }
  #expanded-image .expanded-image-box button {
    appearance: none;
    background-color: transparent;
    border: 0;
    color: white;
  }

  footer {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.7);
  }
</style>
