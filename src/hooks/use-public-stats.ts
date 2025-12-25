import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

interface PublicStats {
  users: number;
  drivers: number;
  cities: number;
  rating: number;
  rides: number;
  totalDriverEarnings: number;
  rider: Array<{ value: string; label: string }>;
  driver: Array<{ value: string; label: string }>;
}

export function usePublicStats() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/analytics/public/stats");
        setStats(response.data.data);
      } catch {
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
