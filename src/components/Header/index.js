import React, { useEffect, useContext, useState, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import QueryVariables from "../../context/QueryVariables";
import classnames from "classnames";

import styles from "./header.module.css";
import useMedia from "../../hooks/useMedia";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_CATEGORY_TAGS = gql`
  query {
    MediaTagCollection {
      category
    }
  }
`;

let timeout;
function Header({ location }) {
  const {
    search: contextSearch,
    setSearch: setContextSearch,
    sort,
    setSort,
    setCategory,
    category
  } = useContext(QueryVariables);
  const { data, loading, error } = useQuery(GET_CATEGORY_TAGS);
  const uniqueCategories = useMemo(() => {
    if (loading) return [];
    return [
      ...new Set(
        data.MediaTagCollection.map(({ category }) => category).filter(Boolean)
      )
    ];
  }, [loading, data]);

  const [search, setSearch] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const matchSmall = useMedia("(max-width: 768px)");
  const isRoot = useMemo(() => location.pathname === "/", [location]);
  const inputSmallFocused = useMemo(() => matchSmall && inputFocused, [
    matchSmall,
    inputFocused
  ]);

  useEffect(
    function searchTermCleanup() {
      if (isRoot) return;

      setSearch("");
    },
    [isRoot, setSearch]
  );

  useEffect(() => {
    timeout = setTimeout(() => {
      setContextSearch(search);
      if (search) {
        setSort("SEARCH_MATCH");
        setCategory("");
        return;
      }

      setSort("SCORE_DESC");
    }, 500);
  }, [setContextSearch, search, setSort, setCategory]);

  function onSearchChange(e) {
    clearTimeout(timeout);
    setSearch(e.target.value);
  }

  function onSortSelect(e) {
    setSort(e.target.value);
  }

  function onCategorySelect(e) {
    setCategory(e.target.value);
  }

  function toggleInputFocused() {
    setInputFocused(state => !state);
  }

  if (error) console.error(error);

  return (
    <AppBar position="sticky">
      <Toolbar className={styles.headerContainer}>
        {(!matchSmall || !isRoot) && (
          <Link className={styles.link} to="/">
            {matchSmall && <HomeIcon />}
            {!matchSmall && <Typography variant="h6">Anime List</Typography>}
          </Link>
        )}
        {isRoot && (
          <>
            <div
              className={classnames(styles.search, {
                [styles.smallSearch]: inputFocused || !!search
              })}
            >
              <div className={styles.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{ input: styles.input }}
                value={search}
                onChange={onSearchChange}
                inputProps={{ "aria-label": "search" }}
                onFocus={toggleInputFocused}
                onBlur={toggleInputFocused}
              />
            </div>
            {!contextSearch && !inputSmallFocused && (
              <>
                <FormControl
                  classes={{ root: styles.selectContainerWithMargin }}
                >
                  <InputLabel className={styles.colorWhite}>
                    Category
                  </InputLabel>
                  {!error && (
                    <Select
                      value={category}
                      className={styles.colorWhite}
                      classes={{ icon: styles.colorWhite }}
                      disabled={loading}
                      onChange={onCategorySelect}
                    >
                      {uniqueCategories.map(category => (
                        <MenuItem value={category} key={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
                <FormControl classes={{ root: styles.selectContainer }}>
                  <InputLabel className={styles.colorWhite}>Sort</InputLabel>
                  <Select
                    value={sort}
                    onChange={onSortSelect}
                    className={styles.colorWhite}
                    classes={{ icon: styles.colorWhite }}
                  >
                    <MenuItem value={"SCORE_DESC"}>Score</MenuItem>
                    <MenuItem value={"POPULARITY_DESC"}>Popularity</MenuItem>
                    <MenuItem value={"TRENDING_DESC"}>Trending</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(Header);
