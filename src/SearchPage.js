import React, { useEffect, useState } from "react";

import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Grid,
  TableHead,
  TextField,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArticlesTable from "./ArticlesTable";
const axios = require("axios").default;

function handleSort(sortParameter, articlesArray) {

  let sortParam = sortParameter;
  let sortedArr = articlesArray;

  if (sortParam === "category") {
    sortedArr.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortParam === "newest") {
    sortedArr.sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
  } else if (sortParam === "oldest") {
    sortedArr.sort((a, b) => a.publishedOn.localeCompare(b.publishedOn));
  } else if (sortParam === "ascending") {
    sortedArr.sort((a, b) => a.metaTitle.localeCompare(b.metaTitle));
  } else {
    sortedArr.sort((a, b) => b.metaTitle.localeCompare(a.metaTitle));
  }
  return sortedArr;
}

function SearchPage() {
  const [rows, setRows] = useState([]);
  const [sortParam, setSortParam] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/getAll")
      .then((response) => {
        setRows([...response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSearchBarChange = (event) => {
    event.preventDefault();
    let searchText = event.target.value;
    setSearchTitle(searchText);
  };

  const handleSearch = () => {
    const result = rows.filter(articles => articles.metaTitle.includes(searchTitle));
    setRows([...result]);
  }

  const sortArticles = (event) => {
    event.preventDefault();
    let selection = event.target.value;
    setSortParam(selection);
  };

  return (
    <Grid style={{ margin: "25px" }}>
      <Grid style={{ marginBottom: "10px" }} alignItems="flex-start" container>
        <TextField
          id="search-bar"
          className="text"
          label="Enter Title"
          variant="outlined"
          placeholder="Search By Title Name"
          size="small"
          value={searchTitle}
          onChange={handleSearchBarChange}
        />
        <IconButton aria-label="search" onClick={handleSearch}>
          <SearchIcon style={{ fill: "blue" }} />
        </IconButton>

        <FormControl sx={{ ml: 4, minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortParam}
            label="Sort By"
            onChange={sortArticles}
          >
            <MenuItem value={"category"}>Category</MenuItem>
            <MenuItem value={"newest"}>Newest</MenuItem>
            <MenuItem value={"oldest"}>Oldest</MenuItem>
            <MenuItem value={"ascending"}>Ascending</MenuItem>
            <MenuItem value={"descending"}>Descending</MenuItem>
          </Select>
        </FormControl>
        <IconButton
          aria-label="sortButton"
          onClick={() => setRows([...handleSort(sortParam, rows)])}
        >
          <SearchIcon style={{ fill: "blue" }} />
        </IconButton>
        {/* <Button onClick={() => setRows([...handleSort(sortParam, rows)])}>
          Update
        </Button> */}
      </Grid>

      <ArticlesTable articles={rows} />
    </Grid>
  );
}

export default SearchPage;
