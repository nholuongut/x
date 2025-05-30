import { EndpointAdapter } from '@empathyco/x-adapter';
import {
  ExperienceControlsRequest,
  IdentifierResultsRequest,
  NextQueriesRequest,
  PopularSearchesRequest,
  QuerySuggestionsRequest,
  RecommendationsRequest,
  RelatedPromptsRequest,
  RelatedTagsRequest,
  SearchRequest,
  SemanticQueriesRequest,
  TaggingRequest
} from './request';
import {
  IdentifierResultsResponse,
  NextQueriesResponse,
  PopularSearchesResponse,
  QuerySuggestionsResponse,
  RecommendationsResponse,
  RelatedTagsResponse,
  SearchResponse,
  SemanticQueriesResponse,
  ExperienceControlsResponse,
  RelatedPromptsResponse
} from './response';

export interface XComponentsAdapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>;
  popularSearches: EndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>;
  nextQueries: EndpointAdapter<NextQueriesRequest, NextQueriesResponse>;
  recommendations: EndpointAdapter<RecommendationsRequest, RecommendationsResponse>;
  querySuggestions: EndpointAdapter<QuerySuggestionsRequest, QuerySuggestionsResponse>;
  relatedPrompts: EndpointAdapter<RelatedPromptsRequest, RelatedPromptsResponse>;
  relatedTags: EndpointAdapter<RelatedTagsRequest, RelatedTagsResponse>;
  identifierResults: EndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>;
  tagging: EndpointAdapter<TaggingRequest, void>;
  semanticQueries: EndpointAdapter<SemanticQueriesRequest, SemanticQueriesResponse>;
  experienceControls: EndpointAdapter<ExperienceControlsRequest, ExperienceControlsResponse>;
}
