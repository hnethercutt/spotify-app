import genreData from '@/data/genres.json';
import { List, ListItem, ListItemText, ListItemIcon, Collapse, Checkbox } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState, useEffect, Fragment } from 'react';
import _ from 'lodash';

// For updating the parent component (the generate playlist form itself)
interface GenreSelectorProps {
    onGenresSelected: (genres: string[]) => void;
}

export default function GenreSelector({ onGenresSelected }: GenreSelectorProps) {
  const [checkedGenres, setCheckedGenres] = useState<string[]>([]);

    useEffect(() => {
        // Notify parent component when genres/subgenres are checked/unchecked
        onGenresSelected(checkedGenres);
    }, [checkedGenres]);


  const handleCheckGenre = (genre: string) => {
    setCheckedGenres((prevCheckedGenres) => {
      // If the genre is on the list, means we are currently unchecking
      if (prevCheckedGenres.includes(genre)) {
        return prevCheckedGenres.filter((item) => item !== genre);
      }

      // Otherwise, add/check the genre
      return [...prevCheckedGenres, genre];
    });
  };

  return (
    <List className='flex-column'>
      {genreData.map((genre, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <Checkbox
              size='small'
              edge="start"
              sx={{
                color: '#b3b3b3',
                '&.Mui-checked': {
                  color: '#1ed760'
                },
              }}
              disableRipple
              checked={checkedGenres.includes(genre)}
              onClick={(e) => e.stopPropagation()}
              onChange={() => handleCheckGenre(genre)}
            />
          </ListItemIcon>
          <ListItemText
            primary={genre}
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: '14px'
              }
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}
