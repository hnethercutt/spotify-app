'use client';
import { useState } from 'react';
import type { PlaylistRequest } from '@/types/playlist';

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

  const [formInput, setFormInput] = useState('');

  const generateBtnClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: formInput }),
    });
    const result = await res.json();
    console.log(result.output);
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
      <form>
        <div>
          <div>
            <label>Vibe</label>
            <input type="text" name="vibe" onChange={updateFormInput}/>
          </div>
          {/* <div>
            <label>Additional Notes</label>
            <input type="text" name="notes" onChange={updateFormInput}/>
          </div> */}
          <button onClick={generateBtnClicked}>Generate</button>
        </div>
      </form>
    </div>
  );
}
