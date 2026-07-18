<script lang="ts">
  import type { FormItem } from "./types";

  export let item: FormItem,
    value: any,
    change: Function,
    force_readonly: boolean | undefined = undefined;
</script>

{#if item}
  <div class="kv-form-row">
    <label for={item.key}>
      {item.title ?? item.key}
    </label>
    {#if item.type == "text"}
      <input
        type="text"
        value={value ?? ""}
        on:change={(e) => {
          change(e);
        }}
        readonly={force_readonly ?? item.readonly ?? false}
      />
    {:else if item.type == "long-text"}
      <textarea
        on:change={(e) => {
          change(e);
        }}
        readonly={force_readonly ?? item.readonly ?? false}
        >{value ?? ""}</textarea
      >
    {:else if item.type == "number"}
      <input
        type="number"
        value={value ?? ""}
        on:change={(e) => {
          change(e);
        }}
        readonly={force_readonly ?? item.readonly ?? false}
      />
    {:else if item.type == "boolean"}
      ...
    {:else if item.type == "datetime"}
      ....
    {/if}
  </div>
{/if}

<style>
  .kv-form-row {
    display: flex;
    column-gap: 0.5rem;
    font-size: 0.8rem;
    padding: 0.25rem;
    width: 100%;
  }
  label {
    color: #454545;
    width: 120px;
  }
  input[type="text"],
  input[type="number"],
  textarea {
    border: 1px solid #d7ccc8;
    border-radius: 0.25rem;
    padding: 0.1rem;
    line-height: 100%;
    font-size: 0.8rem;
    width: calc(100% - 120px - 0.5rem);
  }
  textarea {
    /* height: 3rem; */
    field-sizing: content;
  }
</style>
