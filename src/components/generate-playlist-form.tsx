'use client';
import { useState } from 'react';
import SpotifySearchBar from './spotify-search-bar';
import GenreSelector from './genre-selector';
import type { PlaylistRequest, SpotifySong, SpotifyArtist } from '@/types/playlist';
import { generatePlaylist } from '@/services/playlist-service';
import { TextField, Chip, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useId } from 'react';
import './generate-playlist-form.css';

export default function GeneratePlaylistForm() {
  const [requestFormData, setRequestFormData] = useState<PlaylistRequest>({
    vibe: '',
    notes: '',
    referenceSongs: [],
    excludeArtists: [],
    excludeGenres: [],
    popularity: 'balanced',
    allowDuplicateArtists: true,
    includeReferenceSongs: true,
    generateTitleAndDescription: true,
    songCount: 25,
  });

  // Will probably condense all of these later
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

  const handleExcludeGenresSelected = (selectedGenres: string[]) => {
    setRequestFormData(prevRequestFormData => ({
      ...prevRequestFormData,
      excludeGenres: selectedGenres
    }));
  };

  const handlePopularitySelected = (e: React.ChangeEvent<HTMLInputElement>, newPopularity: string) => {
    setRequestFormData(prevRequestFormData => ({
      ...prevRequestFormData,
      popularity: newPopularity as PlaylistRequest['popularity']
    }));
  };

  const handleDupeArtistsSelected = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setRequestFormData(prevRequestFormData => ({
      ...prevRequestFormData,
      allowDuplicateArtists: value === 'true' ? true : false
    }));
  };

  const handleIncludeRefSongsSelected = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setRequestFormData(prevRequestFormData => ({
      ...prevRequestFormData,
      includeReferenceSongs: value === 'true' ? true : false
    }));
  };

  const handleGenTitleAndDescSelected = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setRequestFormData(prevRequestFormData => ({
      ...prevRequestFormData,
      generateTitleAndDescription: value === 'true' ? true : false
    }));
  };

  const handleSongCountSelected = (e: SelectChangeEvent<number>) => {
    setRequestFormData((prevRequestFormData) => ({
      ...prevRequestFormData,
      songCount: Number(e.target.value)
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

  const id = useId();

  return (
    <div className='generate-form-container'>
      <div className='vibe flex-column'>
        <label className='section-label'>Vibe</label>
        <TextField
          name='vibe'
          multiline
          rows={3}
          maxRows={3}
          onChange={updateFormInput}
          placeholder='Describe the vibe of the playlist you want to generate'
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#b3b3b3',
              '& fieldset': {
                borderColor: '#b3b3b3'
              },
              '&:hover fieldset': {
                borderColor: '#1ed760'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1ed760',
                borderWidth: '2px'
              }
            }
          }} />
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
      <div>
        <label>Exclude Genres</label>
        <GenreSelector onGenresSelected={handleExcludeGenresSelected} />
      </div>
      <div>
        <FormControl>
          <label>Song Popularity</label>
          <RadioGroup
            aria-labelledby={`${id}-label`}
            defaultValue="mainstream"
            name="radio-buttons-group"
            onChange={handlePopularitySelected}
          >
            <FormControlLabel value="mainstream" control={<Radio />} label="Mainstream" />
            <FormControlLabel value="balanced" control={<Radio />} label="Balanced" />
            <FormControlLabel value="underground" control={<Radio />} label="Underground" />
          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <FormControl>
          <label>Allow Duplicate Artists?</label>
          <RadioGroup
            aria-labelledby={`${id}-label`}
            defaultValue="true"
            name="radio-buttons-group"
            onChange={handleDupeArtistsSelected}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <FormControl>
          <label>Include Reference Songs?</label>
          <RadioGroup
            aria-labelledby={`${id}-label`}
            defaultValue="true"
            name="radio-buttons-group"
            onChange={handleIncludeRefSongsSelected}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <FormControl>
          <label>Generate Title and Description?</label>
          <RadioGroup
            aria-labelledby={`${id}-label`}
            defaultValue="true"
            name="radio-buttons-group"
            onChange={handleGenTitleAndDescSelected}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <FormControl>
          <Select
            value={requestFormData.songCount}
            label="Song Count"
            onChange={handleSongCountSelected}
          >
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={25}>50</MenuItem>
            <MenuItem value={25}>75</MenuItem>
            <MenuItem value={25}>100</MenuItem>
            <MenuItem value={25}>125</MenuItem>
            <MenuItem value={25}>150</MenuItem>
            <MenuItem value={25}>175</MenuItem>
            <MenuItem value={25}>200</MenuItem>
            <MenuItem value={25}>225</MenuItem>
            <MenuItem value={25}>250</MenuItem>
            <MenuItem value={25}>275</MenuItem>
            <MenuItem value={25}>300</MenuItem>
            <MenuItem value={25}>325</MenuItem>
            <MenuItem value={25}>350</MenuItem>
            <MenuItem value={25}>375</MenuItem>
            <MenuItem value={25}>400</MenuItem>
            <MenuItem value={25}>425</MenuItem>
            <MenuItem value={25}>450</MenuItem>
            <MenuItem value={25}>475</MenuItem>
            <MenuItem value={25}>500</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className='notes flex-column'>
        <label className='section-label'>Additional Notes</label>
        <TextField
          name='notes'
          multiline
          rows={3}
          maxRows={3}
          onChange={updateFormInput}
          placeholder='Describe the vibe of the playlist you want to generate'
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#b3b3b3',
              '& fieldset': {
                borderColor: '#b3b3b3'
              },
              '&:hover fieldset': {
                borderColor: '#1ed760'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1ed760',
                borderWidth: '2px'
              }
            }
          }} />
      </div>
      <button onClick={generateBtnClicked}>Generate</button>
    </div>
  );
}
