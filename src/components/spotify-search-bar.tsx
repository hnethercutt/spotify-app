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
    const timer = setTimeout(async () => {
      if (searchTerm) {
        try {
          const res = await fetch(
            `/api/search?q="${encodeURIComponent(searchTerm)}"`
          );
          await res.json().then(function (_searchResult) {
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
            console.log(formattedResults);
          });
        } catch (err) {
          console.error('Error retrieving search results', err);
        }
      } else {
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
