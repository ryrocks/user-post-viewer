import { useState } from "react";
import { FetchResult } from "domain/interface/fetch";

function useFetchData<T>(initialData: T | null = null): FetchResult<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (url: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchData };
}

export default useFetchData;
