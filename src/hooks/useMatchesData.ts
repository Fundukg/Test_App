import { useState, useEffect, useCallback } from "react";
import { MATCHES_URL } from "../config";
import matchesJson from "../../data/matches.json";

export type Match = {
  id: string;
  startsAt: string;
  status: string;
  minute?: number;
  home: { id: string; name: string; city: string };
  away: { id: string; name: string; city: string };
  score: { home: number; away: number } | null;
};

export const useMatchesData = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const fetchMatches = async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      const response = await fetch(MATCHES_URL);
      if (!response.ok) throw new Error("Ошибка сети");
      const data = await response.json();

      setMatches(data);
      setLastUpdated(Date.now());
    } catch (err) {
      const fallbackData = matchesJson.matches as Match[];
      setMatches(fallbackData);
      setLastUpdated(Date.now());
      setError(err as Error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);
  return {
    matches,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refetch: () => fetchMatches(true),
  };
};
