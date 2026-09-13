import { PlaylistRequest, SpotifySong } from "@/types/playlist";
import _ from 'lodash';

export async function generatePlaylist(requestData: PlaylistRequest) {
    const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: requestData }),
    });
    const result = await res.json();
    console.log(result.output);
}

export async function fetchSearchResults(searchTerm: string): Promise<Array<SpotifySong>> {
    let spotifySongs: SpotifySong[] = [];

    await fetch(`/api/search?q="${encodeURIComponent(searchTerm)}"`).then(async function(_apiResponse) {
        const searchResults = await _apiResponse.json();
        spotifySongs = _.map(searchResults.items, function(_searchResultItem) {
            return {
                title: _searchResultItem.name,
                artist: _searchResultItem.artists[0].name,
                album: _searchResultItem.album.name,
                coverArtUrl: _searchResultItem.album.images[0].url,
                id: _searchResultItem.id
            }
        });
    }).catch((err: Error) => {
        console.error('Error retrieving search results', err.message);
    });

    return spotifySongs;
}