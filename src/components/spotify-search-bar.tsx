'use client';
import { useState } from 'react';
import _ from 'lodash';
import './spotify-search-bar.css';

export default function SpotifySearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    { track: string; artist: string; album: string; id: string }[]
  >([]);

  const updateSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/search?q="${encodeURIComponent(searchTerm)}"`
      );
      await res.json().then(function(_searchResult) {
        let formattedResults = _.map(_searchResult.items, (_searchResultItem)  => ({
          track: _searchResultItem.name,
          artist: _searchResultItem.artists[0].name,
          album: _searchResultItem.album.name,
          id: _searchResultItem.id
        }));
        setSearchResults(formattedResults);
        console.log(formattedResults);
      });
    } catch (err) {
      console.error('Error retrieving search results', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={updateSearchTerm}
        ></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
