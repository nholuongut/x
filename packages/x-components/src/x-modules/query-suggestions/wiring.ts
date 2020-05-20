import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * QuerySuggestions wires factory.
 *
 * @public
 */
export const querySuggestionsModule = withModule('querySuggestions');

/**
 * Sets the query-suggestions module query.
 *
 * @public
 */
export const setQuerySuggestionsQuery = querySuggestionsModule.wireCommit('setQuery');

/**
 * Clears the query-suggestions module query.
 *
 * @public
 */
export const clearQuerySuggestionsQuery = querySuggestionsModule.wireCommit('setQuery', '');

/**
 * Requests and stores a new set of query suggestions for the {@link QuerySuggestionsState.query}.
 *
 * @public
 */
export const getAndSaveSuggestions = querySuggestionsModule.wireDispatchWithoutPayload(
  'getAndSaveSuggestions'
);

/**
 * QuerySuggestions wiring.
 *
 * @internal
 */
export const querySuggestionsWiring = createWiring({
  UserIsTypingAQuery: {
    setQuerySuggestionsQuery // TODO It should be debounced
  },
  UserAcceptedAQuery: {
    setQuerySuggestionsQuery
  },
  UserClearedQuery: {
    clearQuerySuggestionsQuery
  },
  QuerySuggestionsRequestChanged: {
    getAndSaveSuggestions
  }
});
