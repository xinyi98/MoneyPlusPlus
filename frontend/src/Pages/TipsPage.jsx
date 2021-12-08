import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
  Typography,
} from '@material-ui/core';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import he from 'he';
import styles from '../Styles/TipsPage.module.css';

const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/search';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    minWidth: 345,
    height: 286,
  },
  title: {
    height: 66,
  },
});

export default function TipsPage() {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [results, setResults] = useState(20);

  useEffect(() => {
    fetch(
      `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&type=video&q=financialTips&maxResults=${results}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items);
      });
  }, [results]);

  return (
    <div>
      <div className={styles.tipsTitle}>Financial Tips</div>
      {items ? (
        <ul className={styles.tipsContent}>
          {items.map((item) => {
            const { id = {}, snippet = {} } = item;
            const { title, thumbnails = {} } = snippet;
            const { medium = {} } = thumbnails;
            return (
              <li key={id.videoId}>
                <Card className={classes.root}>
                  <CardActionArea>
                    <a
                      href={`https://www.youtube.com/watch?v=${id.videoId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <CardMedia
                        component="img"
                        alt=""
                        height={medium.height}
                        width={medium.width}
                        image={medium.url}
                      />
                      <CardContent className={classes.title}>
                        <h3>{he.decode(title)}</h3>
                      </CardContent>
                    </a>
                  </CardActionArea>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Typography variant="h5">
          Sorry. The tips video service is unavailable now. Please try again later or contact our
          developers.
          <SentimentVeryDissatisfiedIcon />
        </Typography>
      )}
      <Button
        variant="contained"
        color="secondary"
        className={styles.loadMore}
        startIcon={<RotateLeftIcon />}
        onClick={() => setResults(results + 5)}
      >
        Load More
      </Button>
    </div>
  );
}
