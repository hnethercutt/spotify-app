'use client';
import { useState } from 'react';
import SpotifySearchBar from './spotify-search-bar';
import type { PlaylistRequest, SpotifySong, SpotifyArtist } from '@/types/playlist';
import { generatePlaylist } from '@/services/playlist-service';
import { Chip } from '@mui/material';

export default function GeneratePlaylistForm() {
  const [requestFormData, setRequestFormData] = useState<PlaylistRequest>({
    vibe: '',
    notes: '',
    referenceSongs: [],
    languages: [],
    excludeArtists: [],
    excludeGenres: [],
    popularity: 'balanced',
    allowDuplicateArtists: true,
    includeReferenceSongs: true,
    generateTitleAndDescription: true,
    songCount: 25,
  });

  const handleRefSongSelected = (selectedSong: SpotifySong) => {
    setRequestFormData((prevRequestFormData) => ({
      ...prevRequestFormData,
      referenceSongs: [...(prevRequestFormData.referenceSongs ?? []), selectedSong],
    }));
  };

  const deleteRefSong = (indexToRemove: number) => {
    setRequestFormData((prevRequestFormData) => ({
      ...prevRequestFormData,
      referenceSongs: prevRequestFormData.referenceSongs?.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleExcludeArtistSelected = (selectedArtist: SpotifyArtist) => {
    setRequestFormData((prevRequestFormData) => ({
      ...prevRequestFormData,
      excludeArtists: [...(prevRequestFormData.excludeArtists ?? []), selectedArtist],
    }));
  };

  const deleteExcludeArtist = (indexToRemove: number) => {
    setRequestFormData((prevRequestFormData) => ({
      ...prevRequestFormData,
      excludeArtists: prevRequestFormData.excludeArtists?.filter((_, index) => index !== indexToRemove),
    }));
  };

  const generateBtnClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    generatePlaylist(requestFormData);
  };

  const updateFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let { name, value } = e.target;

    setRequestFormData((prevRequestFormData) => ({
      ...prevRequestFormData,
      [name]: value,
    }));
  };

  return (
    <div>
      <div>
        <div>
          <label>Vibe</label>
          <input type="text" name="vibe" onChange={updateFormInput} />
        </div>
        <div>
          <label>Additional Notes</label>
          <input type="text" name="notes" onChange={updateFormInput} />
        </div>
        <div>
          <label>Reference Songs</label>
          {requestFormData.referenceSongs?.map((item, index) => (
            <div key={index}>
              {/* Color styling is temporary */}
              <Chip
                label={`${item.title} - ${item.artist}`}
                variant="outlined"
                sx={{
                  color: "white",
                  "& .MuiChip-deleteIcon": { color: "white" },
                }}
                onDelete={() => deleteRefSong(index)}
              />
            </div>
          ))}
          <SpotifySearchBar onSongSelected={handleRefSongSelected} />
        </div>
        <div>
          <label>Exclude Artists</label>
          {requestFormData.excludeArtists?.map((item, index) => (
            <div key={index}>
              {/* Color styling is temporary */}
              <Chip
                label={`${item.name}`}
                variant="outlined"
                sx={{
                  color: "white",
                  "& .MuiChip-deleteIcon": { color: "white" },
                }}
                onDelete={() => deleteExcludeArtist(index)}
              />
            </div>
          ))}
          <SpotifySearchBar onArtistSelected={handleExcludeArtistSelected} />
        </div>
        <button onClick={generateBtnClicked}>Generate</button>
      </div>
    </div>
  );
}
