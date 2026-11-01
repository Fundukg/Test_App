import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITE_STORAGE_KEY = "@matches_favorites";

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(
          FAVORITE_STORAGE_KEY,
        );
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error(
          "Ошибка при загрузке избранного из AsyncStorage:",
          error,
        );
      } finally {
        setIsLoading(true);
      }
    };

    loadFavorites();
  }, []);

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.includes(id);
    },
    [favorites],
  );

  const toggle = useCallback(
    async (id: string) => {
      try {
        let newFavorites: string[];

        if (favorites.includes(id)) {
          newFavorites = favorites.filter((favoriteId) => favoriteId !== id);
        } else {
          newFavorites = [...favorites, id];
        }

        setFavorites(newFavorites);

        await AsyncStorage.setItem(
          FAVORITE_STORAGE_KEY,
          JSON.stringify(newFavorites),
        );
      } catch (error) {
        console.error(
          "Ошибка при сохранении избранного в AsyncStorage:",
          error,
        );
      }
    },
    [favorites],
  );

  return { favorites, isFavorite, toggle, isLoading };
}
