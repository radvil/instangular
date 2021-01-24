import { HttpParams } from '@angular/common/http';

export interface HttpQueryOptions {
  includeComments?: boolean;
  includeReactions?: boolean;
  searchField?: string;
  searchValue?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
  select?: string;
}

export const makeHttpQueries = (queryOptions: HttpQueryOptions) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    includeComments,
    includeReactions,
    searchField,
    searchValue,
  } = queryOptions;
  let queries = new HttpParams();
  if (includeComments === true) {
    queries = queries.set('includeComments', 'true');
  }
  if (includeReactions === true) {
    queries = queries.set('includeReactions', 'true');
  }
  if (sortBy && sortOrder) {
    queries = queries.set('sortBy', sortBy).set('sortOrder', sortOrder);
  }
  if (searchField && searchValue) {
    queries = queries.set('searchField', searchField).set('searchValue', searchValue);
  }
  if (page) {
    queries = queries.set('page', page.toString());
  }
  if (limit) {
    queries = queries.set('limit', limit.toString());
  }
  return queries;
};
