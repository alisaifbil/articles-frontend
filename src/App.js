import React, { useEffect, useState } from "react";
import {
  IconButton,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArticlesTable from "./ArticlesTable";
import BasicInfoForm from "./BasicInfoForm"; 
import { Navigate } from "react-router-dom";
const axios = require("axios").default;
const URL = 'https://express-app-hazel.vercel.app/';

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

function App() {
  const [rows, setRows] = useState([]);
  const [sortParam, setSortParam] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [redirectTo, setRedirectTo] = useState("");
  const [allowRedirection, setAllowRedirection] = useState(false);

  useEffect(() => {
    axios
      .get(`${URL}/getAll`)
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
    axios.get(`${URL}/findByTitle`, {
      headers: {'Content-Type': 'application/json'},
      params: {
        metaTitle: searchTitle
      }
    }
    )
      .then((response) => {
        console.log(response);
        if (response.data !== null) {
          let urlParams = response.data;
          setRedirectTo(`/${urlParams.category}/${urlParams.metaTitle}`);
          setAllowRedirection(true);
        } else {
          setRedirectTo(`/PageNotFound`);
          setAllowRedirection(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sortArticles = (event) => {
    event.preventDefault();
    let selection = event.target.value;
    setSortParam(selection);
  };

  return (
    <div>
      {allowRedirection ? <Navigate to={`${redirectTo}`} /> : ""}

      <Grid style={{ margin: "25px" }}>
        <Grid
          style={{ marginBottom: "10px" }}
          alignItems="flex-start"
          container
        >
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
        </Grid>

        <ArticlesTable articles={rows} />
        <BasicInfoForm />
      </Grid>
    </div>
  );
}

export default App;
