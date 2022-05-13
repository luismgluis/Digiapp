/**
 * Represents an application http-response metadata.
 */
export interface AppHttpResponseMeta {

  page?: number;
  pageSize?: number
  count?: number;
  total?: number;
  previousPage?: number | undefined;
  nextPage?: number | undefined;
  totalPages?: number;
}
