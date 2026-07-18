<script lang="ts">
  import type { KV } from "$lib/utility";
  import { writable, type Writable } from "svelte/store";
  import { LevelOrder } from "$lib/definitions";
  
  export let codebook_parsed: Writable<KV> = writable({}),
    curr_keyword: Writable<KV> = writable({}),
    update_data: (item: KV) => void;
  let expanded: Writable<KV> = writable({});
  function expand(first: string, second?: string) {
    expanded.set({
      first,
      second,
    });
  }
</script>

<nav class="space_btn_wrap">
  {#each LevelOrder as level, l}
    <button class={"level-0"} disabled>
      {l + 1}. {level.Name} Level
    </button>
    {#each level.Items as item, i}
      <button
        id={`button-${item}`}
        class={"level-1 " + ($expanded.first == item ? "child-expanded" : "")}
        data-selected={$curr_keyword.decision == item}
        on:click={() => {
          expand(item);
          update_data({
            decision: item,
          });
        }}
      >
        {item}
      </button>
      {#each $codebook_parsed?.second_level?.[item] as jtem, j}
        <button
          id={`button-${item}-${jtem}`}
          class={"level-2 " +
            `button-${item} ` +
            ($expanded.first == item && $expanded.second == jtem
              ? "child-expanded "
              : "") +
            ($expanded.first == item ? "expanded" : "hidden")}
          data-selected={$curr_keyword.feature == jtem}
          disabled={$expanded.first != item}
          on:click={() => {
            expand(item, jtem);
            update_data({
              decision: item,
              feature: jtem,
            });
          }}
        >
          {jtem}
        </button>
        {#each $codebook_parsed?.third_level?.[item]?.[jtem] as ktem, j}
          <button
            id={`button-${item}-${jtem}-${ktem}`}
            class={"level-3 " +
              `button-${item}-${jtem} ` +
              ($expanded.first == item && $expanded.second == jtem
                ? "expanded"
                : "hidden")}
            data-selected={$curr_keyword.value == ktem}
            disabled={!($expanded.first == item && $expanded.second == jtem)}
            on:click={() => {
              update_data({
                decision: item,
                feature: jtem,
                value: ktem,
              });
            }}
          >
            {ktem}
          </button>
        {/each}
      {/each}
    {/each}
  {/each}
</nav>

<style>
  .space_btn_wrap {
    display: block;
    width: 100%;
    height: 100%;
    background-color: #d7ccc8;
    overflow: scroll;
    border-radius: 0.25rem;
  }
  button {
    display: block;
    appearance: none;
    transition: 0.15s;
  }
  button.hidden {
    display: none;
  }

  button.level-0 {
    width: 100%;
    padding: 0.25rem;
    text-align: left;
    background-color: white;
    border-width: 0 0 1px 0;
    border-color: rgba(0, 0, 0, 0.5);
    border-style: solid;
    color: #5d4037;
    position: sticky;
    top: 0;
    font-weight: 700;
  }
  button.level-1 {
    width: 100%;
    padding: 0.25rem;
    text-align: left;
    background-color: #d7ccc8;
    border-width: 0 0 1px 0;
    border-color: rgba(0, 0, 0, 0.5);
    border-style: solid;
    color: #5d4037;
    position: sticky;
    top: 0;
  }
  button.level-1:hover,
  button.level-1.child-expanded,
  button.level-1[data-selected="true"] {
    font-weight: 600;
    background-color: #efebe9;
  }
  button.level-2 {
    width: 100%;
    padding: 0.25rem 0.25rem 0.25rem 1rem;
    text-align: left;
    background-color: #d7ccc8;
    border-width: 0 0 1px 0;
    border-color: rgba(0, 0, 0, 0.5);
    border-style: solid;
    color: #5d4037;
    position: sticky;
    top: 0;
  }

  button.level-2:hover,
  button.level-2.child-expanded,
  button.level-2[data-selected="true"] {
    font-weight: 600;
    background-color: #efebe9;
  }
  button.level-3 {
    width: 100%;
    padding: 0.25rem 0.25rem 0.25rem 1.75rem;
    text-align: left;
    background-color: #d7ccc8;
    border-width: 0 0 1px 0;
    border-color: rgba(0, 0, 0, 0.5);
    border-style: solid;
    color: #5d4037;
    position: sticky;
    top: 0;
  }
  button.level-3:hover,
  button.level-3[data-selected="true"] {
    font-weight: 600;
    background-color: #efebe9;
  }
</style>
