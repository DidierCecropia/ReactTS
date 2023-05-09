import { useState, useEffect } from "react";

interface FetchState<T> {
  loading: boolean;
  data: T | null;
  error: string;
}

export const useFetch = <T = unknown>(url: string): FetchState<T> => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        setData(json);
      } catch (error) {
        setError(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { loading, data, error };
};

export const useFetchCSV = <T = unknown>(url: string): FetchState<T> => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const csvData = await response.text();
        const lines = csvData.split("\n");
        const headers = lines[0].split(",");
        const result = [];
        for (let i = 1; i < lines.length; i++) {
          const obj = {};
          const currentLine = lines[i].split(",");
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
          }
          result.push(obj);
        }
        const results = result.filter((stock) => stock.assetType === "Stock");
        setData(results);
      } catch (error) {
        setError(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { loading, data, error };
};
