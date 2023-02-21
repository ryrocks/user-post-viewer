export interface FetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: any;
  fetchData: (url: string) => Promise<void>;
}
