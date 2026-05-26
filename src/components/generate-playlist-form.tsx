'use client';
import { useState } from 'react';

export default function GeneratePlaylistForm() {
  const [formInput, setFormInput] = useState('');

  // This will be used for playlist generation, but currently just console logs ai response to whatever a user types in the form
  const generateBtnClicked = async(e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({prompt: formInput})
    });
    const result = await res.json();
    console.log(result.output);
  }

  const updateFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormInput(e.target.value);
  };
  return (
    <div>
      <form onSubmit={generateBtnClicked}>
        <input type="text"
        value={formInput}
        onChange={updateFormInput}></input>
        <button type="submit">Generate</button>
      </form>
    </div>
  );
}
