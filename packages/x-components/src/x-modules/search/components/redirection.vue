<template>
  <div v-if="redirection && slots.default" class="x-redirection" data-test="redirection">
    <slot v-bind="{ redirection, redirect, abortRedirect, isRedirecting, delayInSeconds }" />
  </div>
</template>

<script lang="ts">
  import { Redirection as RedirectionModel } from '@empathyco/x-types';
  import { computed, defineComponent, PropType, Ref, ref, watch } from 'vue';
  import { searchXModule } from '../x-module';
  import { use$x } from '../../../composables/use-$x';
  import { useState } from '../../../composables/use-state';
  import { XEvent } from '../../../wiring/events.types';

  /**
   * A redirection is a component that sends the user to a link in the website. It is helpful when
   * there are queries like `help`, `shipping costs`, `my account`, where a link to a section in the
   * website will be more helpful than the set of results returned.
   *
   * @public
   */
  export default defineComponent({
    name: 'Redirection',
    xModule: searchXModule.name,
    props: {
      /**
       * The redirection mode. Auto for auto redirection and manual for an user interaction.
       *
       * @public
       */
      mode: {
        type: String as PropType<'auto' | 'manual'>,
        default: 'auto'
      },
      /**
       * The waiting time in seconds until the redirection is made.
       *
       * @remarks this delay only works in auto mode.
       *
       * @public
       */
      delayInSeconds: {
        type: Number,
        default: 0
      }
    },
    setup(props, { slots }) {
      const $x = use$x();

      const { redirections } = useState('search', ['redirections']);

      /**
       * List of events to stop the animation.
       */
      const eventsToStopAnimation: XEvent[] = [
        'UserAcceptedAQuery',
        'UserClearedQuery',
        'UserSelectedARelatedTag'
      ];

      /**
       * The timeout id, used to cancel the redirection.
       *
       * @internal
       */
      const timeoutId: Ref<number> = ref(0);

      /**
       * Boolean flag which indicates if the redirection is running.
       *
       * @public
       */
      const isRedirecting = ref(true);

      /**
       * Computed property which returns the first recommendation of the state, if any returns null.
       *
       * @returns The first redirection of the state.
       *
       * @internal
       */
      const redirection = computed((): RedirectionModel | null => redirections?.value[0] ?? null);

      /**
       * Stops the animation if the user search another query.
       *
       * @internal
       */
      const cancelRedirect = () => {
        clearTimeout(timeoutId.value);
        isRedirecting.value = false;
      };

      eventsToStopAnimation.forEach(event => $x.on(event, false).subscribe(cancelRedirect));

      /**
       * Dispatches the redirection, updating the url.
       *
       * @public
       */
      const redirect = () => {
        clearTimeout(timeoutId.value);
        $x.emit('UserClickedARedirection', redirection.value!);
        window.location.replace(redirection.value!.url);
      };

      /**
       * Stops the redirection, emitting `UserClickedAbortARedirection` event.
       *
       * @public
       */
      const abortRedirect = () => {
        cancelRedirect();
        $x.emit('UserClickedAbortARedirection');
      };

      /**
       * Watcher function which adds a setTimeout to the redirect method is the component
       * is in auto mode and there are redirections.
       *
       * @internal
       */
      watch(
        redirections,
        () => {
          isRedirecting.value = true;
          if (props.mode === 'auto' && redirection.value) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            timeoutId.value = window.setTimeout(redirect, props.delayInSeconds * 1000);
          }
        },
        { immediate: true }
      );

      return {
        redirection,
        redirect,
        abortRedirect,
        isRedirecting,
        slots
      };
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedARedirection`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
  after the user clicks the redirection button.
- [`UserClickedAbortARedirection`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
  after the user clicks the abort redirection button.

## Play with the component

In this example, a query has been searched in the search input resulting in a case where the
response has a redirection.

A text box appears bellow the search box indicating that you're going to be redirected to another
web page.

This component has two modes:

- Auto mode means that the redirection will occur after a certain number of seconds passed as a
  property.
- If the value is 0 the redirection will be instantly.
- Manual mode means that the user have to click the redirect button or nothing will happen.

_Type any term in the input field to try it out!_

```vue
<template>
  <Redirection #default="{ redirection, redirect, abortRedirect }">
    <span>In a few seconds you're going to be redirected!</span>
    <span>{{ redirection.url }}</span>
    <button @click="redirection">Redirect now!</button>
    <button @click="abortRedirect">Abort redirection!</button>
  </Redirection>
</template>

<script>
  import { Redirection } from '@empathyco/x-components/search';
  export default {
    name: 'RedirectionDemo',
    components: {
      Redirection
    }
  };
</script>
```

## Extending the component

Components behaviour can be changed, in this example the mode of the component will be manual
forcing the user to accept the redirection

```vue
<template>
  <Redirection #default="{ redirection, redirect }">
    <span>{{ redirection.url }}</span>
    <button @click="redirect">Redirect now!</button>
  </Redirection>
</template>

<script>
  import { Redirection } from '@empathyco/x-components/search';
  export default {
    name: 'RedirectionDemo',
    components: {
      Redirection
    },
    data() {
      return {
        mode: 'manual'
      };
    }
  };
</script>
```
</docs>
