<template>
  <component
    :is="animation"
    v-if="partialResults.length"
    class="x-partial-results-list"
    data-test="partial-results"
    tag="ul"
  >
    <li
      v-for="(partialResult, index) in partialResults"
      :key="`${partialResult.query}-${index}`"
      class="x-partial-result"
      data-test="partial-result"
    >
      <!--
       @slot (Required) Partial results item content
           @binding {Partial} partialResult - Partial Result data
      -->
      <slot :partialResult="partialResult" />
    </li>
  </component>
</template>

<script lang="ts">
  import { PartialResult } from '@empathyco/x-types';
  import { computed, ComputedRef, defineComponent } from 'vue';
  import { searchXModule } from '../x-module';
  import { AnimationProp } from '../../../types/animation-prop';
  import { useState } from '../../../composables/use-state';

  /**
   * It renders a list of partial results from {@link SearchState.partialResults} by default.
   * It also provides the partial result slot to customize the item with the partial result bound.
   *
   * @public
   */
  export default defineComponent({
    name: 'PartialResultsList',
    xModule: searchXModule.name,
    props: {
      /**
       * Animation component that will be used to animate the partial results.
       *
       * @public
       */
      animation: {
        type: AnimationProp,
        default: 'ul'
      },

      /**
       * Maximum number of partial results to show.
       *
       * @public
       */
      maxItemsToRender: {
        type: Number,
        default: 5
      }
    },
    setup(props) {
      /**
       * The partials results from the search state.
       *
       * @public
       */
      const items: ComputedRef<PartialResult[]> = useState('search', [
        'partialResults'
      ]).partialResults;

      /**
       * A limited number of partial results.
       *
       * @returns The partial results sliced by the maxItemsToRender.
       *
       * @internal
       */
      const partialResults = computed(() => items.value.slice(0, props.maxItemsToRender));

      return {
        partialResults
      };
    }
  });
</script>

<style lang="css" scoped>
  .x-partial-results-list {
    display: flex;
    flex-flow: column nowrap;
    list-style-type: none;
    padding: 0;
  }
</style>

<docs lang="mdx">
## Examples

This component loops through an array of partials an exposed a slot to use customize each partial.

### Basic example

It renders a list of partial results using the default slot:

```vue
<template>
  <PartialResultsList>
    <template #default="{ partialResult }">
      <ResultsList :results="partialResult.results" />
    </template>
  </PartialResultsList>
</template>
```

### Configuring the number of partials

It sets the maximum partials to show to 3.

```vue
<template>
  <PartialResultsList :maxItemsToRender="3">
    <template #default="{ partialResult }">
      <ResultsList :results="partialResult.results" />
    </template>
  </PartialResultsList>
</template>
```

### Rendering usage

It renders a list of partial results using the default slot. It will show the query, the partial
results and a button to update the query with the partial one.

```vue
<template>
  <PartialResultsList>
    <template #default="{ partialResult }">
      <span>{{ partialResult.query }}</span>
      <BaseGrid :columns="4" :items="partialResult.results">
        <template #result="{ item }">
          <BaseResultLink :result="item">
            <template #default="{ item }">
              <BaseResultImage :result="item" />
              <span class="x-result__title">{{ item.name }}</span>
            </template>
          </BaseResultLink>
        </template>
      </BaseGrid>
      <PartialQueryButton :query="partialResult.query">
        <template #default="{ query }">Ver todos {{ query }}</template>
      </PartialQueryButton>
    </template>
  </PartialResultsList>
</template>
```
</docs>
