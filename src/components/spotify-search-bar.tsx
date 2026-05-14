'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import _ from 'lodash';
import './spotify-search-bar.css';

export default function SpotifySearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    {
      track: string;
      artist: string;
      album: string;
      cover: string;
      id: string;
    }[]
  >([]);

  useEffect(() => {
    // Wait a couple seconds while the user types in their search before making the API call
    const timer = setTimeout(async () => {
      if (searchTerm) {
        try {
          const res = await fetch(
            `/api/search?q="${encodeURIComponent(searchTerm)}"`
          );
          await res.json().then(function (_searchResult) {
            // Add a search result object to the array for each result item (each song)
            let formattedResults = _.map(
              _searchResult.items,
              (_searchResultItem) => ({
                track: _searchResultItem.name,
                artist: _searchResultItem.artists[0].name,
                album: _searchResultItem.album.name,
                cover: _searchResultItem.album.images[0].url,
                id: _searchResultItem.id,
              })
            );
            setSearchResults(formattedResults);
          });
        } catch (err) {
          console.error('Error retrieving search results', err);
        }
      // User either never typed anything in or erased all of what they had, so we want to clear the results
      } else {
        setSearchResults([]);
      }
    }, 200);

    // Clear the timer if the user finishes typing
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Dynamically update the current search term as the user types into the search bar
  const updateSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-bar-container">
      <form>
        <input
          type="text"
          placeholder="Search for a song.."
          value={searchTerm}
          onChange={updateSearchTerm}
          // Hide search results after clicking away
          onBlur={() => {
            setSearchResults([]);
          }}
        ></input>
      </form>
      {searchResults.length > 0 && (
        <div className="search-results-container">
          {searchResults.map((item, index) => (
            <div key={index} className="search-result">
              <Image
                className="cover-art"
                src={item.cover}
                width="50"
                height="50"
                alt="Album cover"
              ></Image>
              <div className="result-text">
                <span className="track-name">{item.track}</span>
                <span className="artist-name">Song &sdot; {item.artist}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
