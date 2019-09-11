import React, { useState } from "react";
import client from "../../client";
import { ApolloProvider } from "@apollo/react-hooks";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "../Header";
import AnimeList from "../AnimeList";
import AnimeProfile from "../AnimeProfile";
import QueryVariables from "../../context/QueryVariables";

import "./global.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("SCORE_DESC");
  
  const [category, setCategory] = useState("");

  const contextValue = {
    search,
    setSearch,
    sort,
    setSort,
    category,
    setCategory
  };

  return (
    <ApolloProvider client={client}>
      <QueryVariables.Provider value={contextValue}>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path="/" component={AnimeList} />
            <Route path="/:animeId" component={AnimeProfile} />
          </Switch>
        </BrowserRouter>
      </QueryVariables.Provider>
    </ApolloProvider>
  );
}
