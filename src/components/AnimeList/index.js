import React, { useMemo, useRef } from "react";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import styles from "./animeList.module.css";
import { Link } from "react-router-dom";
import useAnimeListQuery from "./hooks/useAnimeListQuery";
import { Skeleton } from "@material-ui/lab";
import { Typography } from "@material-ui/core";
import useMedia from "../../hooks/useMedia";

export default function EpisodesList() {
  const {
    data,
    loading,
    loadingPagination,
    placeholderCount,
    error
  } = useAnimeListQuery();
  const matchExtraSmall = useMedia("(max-width: 320px)");
  const matchSmall = useMedia("(max-width: 425px)");
  const matchMedium = useMedia("(max-width: 768px)");
  const imageRef = useRef(null);
  const imageMeasuresFromEl = {};
  const cols = useMemo(() => {
    if (matchExtraSmall) return 1;
    if (matchSmall) return 2;
    if (matchMedium) return 4;
    return 5;
  }, [matchExtraSmall, matchSmall, matchMedium]);

  const imageMeasures = useMemo(() => {
    if (matchExtraSmall) return { height: 436, width: 288 };
    if (matchSmall) return { height: 283, width: 186 };
    if (matchMedium) return { height: 251, width: 165 };
    return { height: 268, width: 176 };
  }, [matchExtraSmall, matchSmall, matchMedium]);

  if (error) {
    console.error(error);
    return null;
  }

  if (!loading && !data.Page.media.length)
    return (
      <section>
        <Typography
          variant="h3"
          color="textSecondary"
          className={styles.noAnime}
        >
          No anime found :(
        </Typography>
      </section>
    );

  if (imageRef.current) {
    imageMeasuresFromEl.height = imageRef.current.height;
    imageMeasuresFromEl.width = imageRef.current.width;
  }

  return (
    <section className={styles.cardContainer}>
      <GridList cellHeight="auto" cols={cols} spacing={10}>
        {!loading &&
          data.Page.media.map((show, index) => (
            <GridListTile key={show.id}>
              <Link to={`/${show.id}`}>
                <img
                  src={show.coverImage.large}
                  alt={show.title.romaji}
                  ref={!index ? imageRef : undefined}
                  className={styles.image}
                />
                <GridListTileBar
                  title={show.title.romaji}
                  subtitle={<span>score: {show.meanScore / 10}</span>}
                />
              </Link>
            </GridListTile>
          ))}
        {(loading || loadingPagination) &&
          Array.from(Array(placeholderCount), (_, index) => (
            <GridListTile key={index}>
              <Skeleton
                variant="rect"
                {...imageMeasures}
                {...imageMeasuresFromEl}
              />
            </GridListTile>
          ))}
      </GridList>
    </section>
  );
}
