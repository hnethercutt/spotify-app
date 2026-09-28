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
    allowDuplicateArtists: true,
    includeReferenceSongs: true,
    generateTitleAndDescription: true
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
    <div className='generate-form-container flex-column'>
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
      <div className='search-bar-section flex-column'>
        <label className='section-label'>Reference Songs (Optional)</label>
        {requestFormData.referenceSongs?.map((item, index) => (
          <div key={index}>
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
      <div className='search-bar-section flex-column'>
        <label className='section-label'>Artists to Exclude (Optional)</label>
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
      <div className='exclude-genre flex-column'>
        <label className='section-label'>Genres to Exclude (Optional)</label>
        <GenreSelector onGenresSelected={handleExcludeGenresSelected} />
      </div>
      <div className='radio-sections'>
        <FormControl>
          <label className='section-label'>Allow an artist to appear more than once?</label>
          <RadioGroup
            row
            aria-labelledby={`${id}-label`}
            defaultValue="true"
            name="radio-buttons-group"
            onChange={handleDupeArtistsSelected}
          >
            <FormControlLabel
              value="true"
              label="Yes"
              control={
                <Radio
                  sx={{
                    color: '#b3b3b3',
                    '&.Mui-checked': {
                      color: '#1ed760'
                    }
                  }}
                />}/>
            <FormControlLabel
              value="false"
              label="No"
              control={
                <Radio
                  sx={{
                    color: '#b3b3b3',
                    '&.Mui-checked': {
                      color: '#1ed760'
                    }
                  }}
                />}/>
          </RadioGroup>
        </FormControl>
      </div>
        {requestFormData.referenceSongs && requestFormData.referenceSongs.length > 0 && (
          <div className='radio-sections'>
            <FormControl>
              <label className='section-label'>Include Reference Songs?</label>
              <RadioGroup
                row
                aria-labelledby={`${id}-label`}
                defaultValue="true"
                name="radio-buttons-group"
                onChange={handleIncludeRefSongsSelected}
              >
                <FormControlLabel
                  value="true"
                  label="Yes"
                  control={
                    <Radio
                      sx={{
                        color: '#b3b3b3',
                        '&.Mui-checked': {
                          color: '#1ed760'
                        }
                      }}
                    />}/>
                <FormControlLabel
                  value="false"
                  label="No"
                  control={
                    <Radio
                      sx={{
                        color: '#b3b3b3',
                        '&.Mui-checked': {
                          color: '#1ed760'
                        }
                      }}
                    />}/>
              </RadioGroup>
            </FormControl>
          </div>
        )}
      <div className='radio-sections'>
        <FormControl>
          <label className='section-label'>Generate title and description?</label>
          <RadioGroup
            row
            aria-labelledby={`${id}-label`}
            defaultValue="true"
            name="radio-buttons-group"
            onChange={handleGenTitleAndDescSelected}
          >
            <FormControlLabel
              value="true"
              label="Yes"
              control={
                <Radio
                  sx={{
                    color: '#b3b3b3',
                    '&.Mui-checked': {
                      color: '#1ed760'
                    }
                  }}
                />}/>
            <FormControlLabel
              value="false"
              label="No"
              control={
                <Radio
                  sx={{
                    color: '#b3b3b3',
                    '&.Mui-checked': {
                      color: '#1ed760'
                    }
                  }}
                />}/>
          </RadioGroup>
        </FormControl>
      </div>
      <div className='notes flex-column'>
        <label className='section-label'>Additional Notes (Optional)</label>
        <TextField
          name='notes'
          multiline
          rows={3}
          maxRows={3}
          onChange={updateFormInput}
          placeholder='Add any additional notes here'
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
      <div className='generate-btn-container'>
        <button className='generate-btn' onClick={generateBtnClicked}>Generate</button>
      </div>
    </div>
  );
}
