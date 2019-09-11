import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import useEvent from "../../../hooks/useEvent";
import QueryVariables from "../../../context/QueryVariables";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_ANIMES = gql`
  query getAnimes(
    $page: Int!
    $sort: [MediaSort]!
    $search: String
    $tagCategory: String
  ) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        total
        perPage
        currentPage
        hasNextPage
      }
      media(
        sort: $sort
        search: $search
        isAdult: false
        type: ANIME
        tagCategory: $tagCategory
      ) {
        id
        meanScore
        coverImage {
          large
        }
        title {
          romaji
          english
          native
        }
      }
    }
  }
`;

function updateQuery(prev, { fetchMoreResult }) {
  if (!fetchMoreResult) return prev;
  if (!prev) return fetchMoreResult;
  return {
    ...prev,
    Page: {
      ...fetchMoreResult.Page,
      media: [...prev.Page.media, ...fetchMoreResult.Page.media]
    }
  };
}

export default function useAnimeListQuery() {
  const { sort, search, category } = useContext(QueryVariables);
  const [loadingPagination, setLoadingPagination] = useState(false);
  const variables = useMemo(
    () => ({
      page: 1,
      sort,
      search: search || undefined,
      tagCategory: category || undefined
    }),
    [sort, search, category]
  );

  const { data, loading, error, fetchMore, refetch, ...rest } = useQuery(
    GET_ANIMES,
    { variables }
  );

  const placeholderCount = useMemo(() => {
    if (loading) return 20;
    const { total, perPage, currentPage, hasNextPage } = data.Page.pageInfo;
    if (!hasNextPage) return 0;
    return Math.min(perPage, total - perPage * currentPage);
  }, [data, loading]);

  useEffect(() => {
    refetch(variables);
  }, [refetch, variables]);

  const loadMore = useCallback(
    async function loadMore() {
      const element = window.document.scrollingElement;
      const scrollPosition = Math.floor(
        element.scrollHeight - element.scrollTop - 300
      );

      if (
        scrollPosition > window.innerHeight ||
        loading ||
        error ||
        loadingPagination ||
        !data.Page.pageInfo.hasNextPage
      ) {
        return;
      }

      setLoadingPagination(true);
      await fetchMore({
        variables: {
          ...variables,
          page: data.Page.pageInfo.currentPage + 1
        },
        updateQuery
      });
      setLoadingPagination(false);
    },
    [data, error, fetchMore, loading, loadingPagination, variables]
  );

  useEvent("scroll", loadMore);

  return {
    data,
    loading,
    error,
    fetchMore,
    refetch,
    loadingPagination,
    placeholderCount,
    ...rest
  };
}
