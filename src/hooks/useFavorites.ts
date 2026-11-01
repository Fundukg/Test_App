import { useState } from "react";

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggle = (id: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(id)) {
        return prevFavorites.filter((favoriteId) => favoriteId !== id);
      }
      return [...prevFavorites, id];
    });
  };

  return { favorites, isFavorite, toggle };
}
