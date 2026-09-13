'use client';
import { useState, useEffect, useRef } from 'react';
import { SpotifySong } from '@/types/playlist';
import { fetchSearchResults } from '@/services/playlist-service';
import Image from 'next/image';
import _ from 'lodash';
import './spotify-search-bar.css';

// So parent components can access selected song data
interface SearchBarProps {
  onSongSelected: (refSong: SpotifySong) => void;
}

export default function SpotifySearchBar({ onSongSelected }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifySong[]>([]);

  useEffect(() => {
    // Wait a couple seconds while the user types in their search before making the API call
    const timer = setTimeout(async () => {
      if (searchTerm) {
        fetchSearchResults(searchTerm).then(function(_searchResults) {
          setSearchResults(_searchResults);
        });
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

  // Pass back the data for the song that was clicked and clear the results display
  const handleSongClick = (selectedSong: SpotifySong) => {
    onSongSelected(selectedSong);
    setSearchResults([]);
  };

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide search results when the user clicks outside of the search bar or results area
    const handleClickOffResults = (e: MouseEvent) => {
      if(searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOffResults);

    return () => {
      document.removeEventListener('mousedown', handleClickOffResults);
    };
  }, []);

  return (
    <div ref={searchRef} className="search-bar-container">
      <form>
        <input
          type="text"
          placeholder="Search for a song.."
          value={searchTerm}
          onChange={updateSearchTerm}
        ></input>
      </form>
      {searchResults.length > 0 && (
        <div className="search-results-container">
          {searchResults.map((item, index) => (
            <div key={index} className="search-result" onClick={() => handleSongClick(item)}>
              <Image
                className="cover-art"
                src={item.coverArtUrl}
                width="50"
                height="50"
                alt="Album cover"
              ></Image>
              <div className="result-text">
                <span className="track-name">{item.title}</span>
                <span className="artist-name">Song &sdot; {item.artist}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
