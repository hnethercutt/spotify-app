import genreDataJson from '@/data/genres.json';
import { List, ListItem, ListItemText, ListItemIcon, Collapse, Checkbox } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState, useEffect, Fragment } from 'react';
import _ from 'lodash';

type GenreData = {
  genre: string;
  subgenres: string[];
};

interface GenreSelectorProps {
    onGenresSelected: (genres: string[]) => void;
}

export default function GenreSelector({ onGenresSelected }: GenreSelectorProps) {
  const genreData = genreDataJson as GenreData[];
  const [openItems, setOpenItems] = useState<boolean[]>(() => Array(57).fill(false));
  const [checkedGenres, setCheckedGenres] = useState<string[]>([]);

    useEffect(() => {
        onGenresSelected(checkedGenres);
    }, [checkedGenres]);

  const handleToggle = (toggleIndex: number) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.map((item, index) => (index === toggleIndex ? !item : item))
    );
  };

  const handleCheckGenre = (genre: string, index: number) => {
    const genreAndSubgenres = [genre, ...genreData[index].subgenres];

    setCheckedGenres((prevCheckedGenres) => {
      if (prevCheckedGenres.includes(genre)) {
        return prevCheckedGenres.filter((item) => !genreAndSubgenres.includes(item));
      }

      return [
        ...prevCheckedGenres,
        ...genreAndSubgenres.filter((item) => !prevCheckedGenres.includes(item)),
      ];
    });
  };

  const handleCheckSubgenre = (subgenre: string) => {
    setCheckedGenres((prevCheckedGenres) => {
      if (prevCheckedGenres.includes(subgenre)) {
        return prevCheckedGenres.filter((item) => item !== subgenre);
      }

      return [...prevCheckedGenres, subgenre];
    });
  };

  return (
    <List>
      {genreData.map((data, index) => (
        <Fragment key={index}>
          <ListItem key={index} onClick={() => handleToggle(index)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                sx={{ color: 'white' }}
                disableRipple
                checked={checkedGenres.includes(data.genre)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => handleCheckGenre(data.genre, index)}
              />
            </ListItemIcon>
            <ListItemText primary={data.genre} />
            {openItems[index] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openItems[index]} timeout="auto" unmountOnExit>
            <List disablePadding>
              {data.subgenres?.map((item, subIndex) => (
                <ListItem key={subIndex} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      sx={{ color: 'white' }}
                      disableRipple
                      checked={checkedGenres.includes(item)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleCheckSubgenre(item)}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Fragment>
      ))}
    </List>
  );
}
