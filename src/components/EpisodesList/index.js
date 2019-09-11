import React, { useMemo } from "react";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import styles from "./episodesList.module.css";
import useMedia from "../../hooks/useMedia";

export default function EpisodesList({ episodes }) {
  const matchExtraSmall = useMedia("(max-width: 320px)");
  const matchSmall = useMedia("(max-width: 425px)");

  const cols = useMemo(() => {
    if (matchExtraSmall) return 1;
    if (matchSmall) return 2;
    return 3;
  }, [matchExtraSmall, matchSmall]);

  return (
    <GridList cellHeight={180} cols={cols} spacing={10}>
      {episodes.map(episode => (
        <GridListTile key={episode.title} className={styles.episode}>
          <a href={episode.url} target="_blank" rel="noopener noreferrer">
            <img
              src={episode.thumbnail}
              alt={episode.title}
              className={styles.image}
            />
            <GridListTileBar
              title={episode.title}
              subtitle={<span>by: {episode.site}</span>}
            />
          </a>
        </GridListTile>
      ))}
    </GridList>
  );
}
