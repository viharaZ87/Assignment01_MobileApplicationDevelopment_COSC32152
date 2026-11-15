import { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  
  const toggleFavorite = (event) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some((item) => item.id === event.id);
      if (exists) {
        return prevFavorites.filter((item) => item.id !== event.id);
      } else {
        return [...prevFavorites, event];
      }
    });
  };

  
  const isFavorite = (eventId) => {
    return favorites.some((item) => item.id === eventId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}


export function useFavorites() {
  return useContext(FavoritesContext);
}