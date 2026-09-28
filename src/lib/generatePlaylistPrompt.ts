import { PlaylistRequest } from '@/types/playlist';

export function generatePlaylistPrompt(data: PlaylistRequest) {
  return `
        You are an expert music curator whose job is to design and generate a playlist that reflects the user's requested vibe while respecting all constraints and preferences.

        ---

        You MUST take into account the following inputs (priority order):
        1. FILTERS, OPTIONS & RULES -> Strict constraints that must be followed exactly
        2. VIBE -> Overall thematic direction of the playlist
        3. NOTES -> Additional context that refines the interpretation of the vibe
        4. REFERENCE SONGS -> Use them as anchors for style, energy and vocal tone

        If any inputs conflict, follow priority order strictly.

        VIBE:
        ${data.vibe}

        NOTES:
        ${data.notes || 'None'}

        REFERENCE SONGS:
        ${data.referenceSongs?.length ? data.referenceSongs.map((song) => `- ${song.title} by ${song.artist}`).join('\n') : 'None'}

        FILTERS:
        - Duplicate artists allowed: ${data.allowDuplicateArtists ? 'Yes' : 'No'} (If no, DO NOT under ANY circumstance include an artist more than once)
        - Include reference songs: ${data.includeReferenceSongs ? 'Yes' : 'No'}
        - Artists and genres to COMPLETELY EXCLUDE:
        -- Artists: ${data.excludeArtists?.join(', ') || 'None'}
        -- Genres: ${data.excludeGenres?.join(', ') || 'None'}
        -- Do not consider these artists or genres at ANY stage of generation, even as inspiration or reference
        -- If a song matches an excluded artist or genre, it is invalid regardless of fit and should be ignored

        OPTIONS:
        - Popularity: Provide an equal mix of popular artists and lesser-known ones. Avoid making the playlist generic/full of very mainstream artists and their biggest hits.
        - Playlist title & description: ${
          data.generateTitleAndDescription ? `Generate both a playlist title and a short description (1-2 sentences) that reflects the vibe` : `Return empty strings for playlistTitle and playlistDescription`
        }

        RULES:
        - Return exactly 50 songs. No more, no less.
        - When using reference songs, focus on song-level matching, not artist-level matching.
        - Use only verified artists and songs
        - Use only songs that are on spotify
        - Each song must include BOTH title and artist
        - Do not include duplicate songs
        - Only include covers or remixes of songs if they fit the vibe but the original versions do not.
        - Do NOT default to an artist's most popular or most streamed songs. Song selection MUST be based on sonic fit (vibe, production, vocals, mood), not popularity within the artist's catalog.
        - Any artists or genres to exclude MUST NOT appear under ANY circumstance. Do not override exclusions no matter how much they fit the vibe.
        - Return ONLY valid JSON. No markdown, no comments, no trailing commas.
        - Do not include explanations, commentary or formatting outside of the JSON object.

        OUTPUT FORMAT:
        {
            "playlistTitle": "",
            "playlistDescription": "",
            "songs": [{
                "title": "",
                "artist": ""
            }]
        }

    `;
}
