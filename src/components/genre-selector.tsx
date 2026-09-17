import genreDataJson from '@/data/genres.json';
import { List, ListItem, ListItemText, ListItemIcon, Collapse, Checkbox } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState, useEffect, Fragment } from 'react';
import _ from 'lodash';

// Represent the JSON data as a type so typescript knows neither field will ever be undefined
type GenreData = {
  genre: string;
  subgenres: string[];
};

// For updating the parent component (the generate playlist form itself)
interface GenreSelectorProps {
    onGenresSelected: (genres: string[]) => void;
}

export default function GenreSelector({ onGenresSelected }: GenreSelectorProps) {
  const genreData = genreDataJson as GenreData[];
  const [openItems, setOpenItems] = useState<boolean[]>(() => Array(57).fill(false));
  const [checkedGenres, setCheckedGenres] = useState<string[]>([]);

    useEffect(() => {
        // Notify parent component when genres/subgenres are checked/unchecked
        onGenresSelected(checkedGenres);
    }, [checkedGenres]);

  const handleToggle = (toggleIndex: number) => {
    // Ensures the correct genre is expanded/collapsed
    setOpenItems((prevOpenItems) =>
      prevOpenItems.map((item, index) => (index === toggleIndex ? !item : item))
    );
  };

  const handleCheckGenre = (genre: string, index: number) => {
    // Grab the checked genres subgenres
    const genreAndSubgenres = [genre, ...genreData[index].subgenres];

    setCheckedGenres((prevCheckedGenres) => {
      // If the genre is on the list, means we are currently unchecking
      if (prevCheckedGenres.includes(genre)) {
        // So we want to remove the genre from the list AND any of its subgenres that are currently checked
        return prevCheckedGenres.filter((item) => !genreAndSubgenres.includes(item));
      }

      // Otherwise, add/check the genre and all of its subgenres
      return [
        ...prevCheckedGenres,
        ...genreAndSubgenres.filter((item) => !prevCheckedGenres.includes(item)),
      ];
    });
  };

  const handleCheckSubgenre = (subgenre: string) => {
    setCheckedGenres((prevCheckedGenres) => {
      if (prevCheckedGenres.includes(subgenre)) {
        // Subgenres are individually checked/unchecked, so just remove the specific subgenre when unchecking
        return prevCheckedGenres.filter((item) => item !== subgenre);
      }

      return [...prevCheckedGenres, subgenre];
    });
  };

  return (
    <div className='genre-list'>
      <List className='flex-column'>
        {genreData.map((data, index) => (
          <Fragment key={index}>
            <ListItem
              key={index}
              onClick={() => handleToggle(index)}
              sx={{
                width: '300px'
              }}
            >
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
                  checked={checkedGenres.includes(data.genre)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleCheckGenre(data.genre, index)}
                />
              </ListItemIcon>
              <ListItemText
                primary={data.genre}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '14px'
                  }
                }}
              />
              {openItems[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openItems[index]} timeout="auto" unmountOnExit>
              <List disablePadding>
                {data.subgenres?.map((item, subIndex) => (
                  <ListItem key={subIndex} sx={{ pl: 6 }}>
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
                        checked={checkedGenres.includes(item)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleCheckSubgenre(item)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '14px'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Fragment>
        ))}
      </List>
    </div>
  );
}
