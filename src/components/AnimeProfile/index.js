import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import styles from "./animeProfile.module.css";
import { Typography } from "@material-ui/core";
import EpisodesList from "../EpisodesList";
import { Skeleton } from "@material-ui/lab";

const GET_ANIME = gql`
  query getAnime($id: Int!) {
    Media(id: $id) {
      id
      title {
        romaji
        native
      }
      status
      description
      episodes
      bannerImage
      coverImage {
        extraLarge
        color
      }
      streamingEpisodes {
        site
        title
        thumbnail
        url
      }
    }
  }
`;

const IMG_PLACEHOLDER_URL =
  "https://i1.wp.com/oij.org/wp-content/uploads/2016/05/placeholder.png?ssl=1";

function AnimeProfile({ match }) {
  const { data, loading, error } = useQuery(GET_ANIME, {
    variables: { id: match.params.animeId }
  });

  if (error) {
    console.error(error);
    return null;
  }

  const animeData = data && data.Media;
  return (
    <main>
      <header className={styles.header}>
        {!loading ? (
          <img
            src={animeData.bannerImage || IMG_PLACEHOLDER_URL}
            alt={animeData.title.romaji}
            className={styles.bannerImage}
          />
        ) : (
          <Skeleton
            variant="rect"
            height={350}
            className={styles.bannerImage}
          />
        )}
      </header>
      <article className={styles.descriptionContainer}>
        {!loading ? (
          <img
            src={animeData.coverImage.extraLarge}
            alt={animeData.title.romaji}
            className={styles.coverImage}
            style={{ background: animeData.coverImage.color }}
          />
        ) : (
          <Skeleton variant="rect" className={styles.coverImage} />
        )}
        {!loading ? (
          <Typography
            variant="h6"
            color="textSecondary"
            className={styles.title}
          >
            {animeData.title.romaji}
          </Typography>
        ) : (
          <Skeleton width={300} className={styles.titlePlaceholder} />
        )}
        {!loading ? (
          <Typography
            variant="caption"
            className={styles.description}
            color="textSecondary"
            dangerouslySetInnerHTML={{ __html: animeData.description }}
          />
        ) : (
          <Skeleton className={styles.descriptionPlaceholder} height={200} />
        )}
      </article>
      {!loading && (
        <article className={styles.animeDataContainer}>
          <section className={styles.episodesContainer}>
            {animeData.streamingEpisodes.length ? (
              <EpisodesList episodes={animeData.streamingEpisodes} />
            ) : (
              <Typography
                className={styles.emptyList}
                variant="h2"
                color="textSecondary"
              >
                No episodes yet
              </Typography>
            )}
          </section>
        </article>
      )}
    </main>
  );
}

export default AnimeProfile;
