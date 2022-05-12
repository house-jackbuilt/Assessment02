import React, { useState, useEffect, useReducer, useContext } from "react";
import { getMovies } from "../api/tmdb-api";
import { AuthContext } from '../contexts/authContext';

export const MoviesContext = React.createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "load":
      return { movies: action.payload.result };
    default:
      return state;
  }
};

const MoviesContextProvider = (props) => {
  const [myReviews, setMyReviews] = useState( {} ) 
  const [favorites, setFavorites] = useState( [] )
  const [playlist, setPlaylist] = useState( [] )
  const context = useContext(AuthContext);

  const [state, dispatch] = useReducer(reducer, { movies: []});

  useEffect(() => {
    getMovies().then(result => {
      dispatch({ type: "load", payload: {result}});
    });
  },[context.isAuthenticated]);

  const addToFavorites = (movie) => {
    let newFavorites = [...favorites];
    if (!favorites.includes(movie.id)){
      newFavorites.push(movie.id);
    }
    setFavorites(newFavorites)
  };
  
  const addToPlaylist = (movie) => {
    let newPlaylist = [...playlist];
    if (!playlist.includes(movie.id)){
      newPlaylist.push(movie.id);
    }
    setPlaylist(newPlaylist);
  };
  console.log(playlist);

  // We will use this function in a later section
  const removeFromFavorites = (movie) => {
    setFavorites( favorites.filter(
      (mId) => mId !== movie.id
    ) )
  };

  const addReview = (movie, review) => {
    setMyReviews( {...myReviews, [movie.id]: review } )
  };

  return (
    <MoviesContext.Provider
      value={{
		movies: state.movies,
        favorites,
        addToFavorites,
        addToPlaylist,
        removeFromFavorites,
        addReview,
      }}
    >
      {props.children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;