import logo from "./logo.svg";
import "./App.css";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useTheme, styled } from "@mui/material/styles";
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
  MenuItem 
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import SearchIcon from "@mui/icons-material/Search";
const axios = require("axios").default;

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function App() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [sortParam, setSortParam] = React.useState('');
  // let rows = [];

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

  const handleSearch = () => {
    console.log("handle search");
  }

  const sortArticles = (event) => {
    setSortParam(event.target.value);
    let body;
    if(sortParam === "category"){
      body = {
        sortParam: 'category',
        order: 1
      }
    }
    else if (sortParam === "newest"){
      body = {
        sortParam: 'publishedOn',
        order: -1
      }
    }
    else if (sortParam === "oldest"){
      body = {
        sortParam: 'publishedOn',
        order: 1
      }
    }
    else if (sortParam === "ascending"){
      body = {
        sortParam: 'metaTitle',
        order: 1
      }
    }
    else{
      body = {
        sortParam: 'metaTitle',
        order: -1
      }
    }

    axios.get("http://localhost:3000/sortByProperty", body)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error)
    })
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid style={{ margin: "25px" }}>
      <Grid style={{marginBottom: '10px'}} alignItems="flex-start" container>
        <form>
          <TextField
            id="search-bar"
            className="text"
            // onInput={(e) => {
            //   setSearchQuery(e.target.value);
            // }}
            label="Enter Title"
            variant="outlined"
            placeholder="Search..."
            size="small"
          />
          <IconButton type="submit" aria-label="search" onClick={handleSearch}>
            <SearchIcon style={{ fill: "blue" }} />
          </IconButton>
        </form>

        <FormControl sx={{ml: 4, minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortParam}
            label="Sort By"
            onChange={sortArticles}
          >
            <MenuItem value={'category'}>Category</MenuItem>
            <MenuItem value={'newest'}>Newest</MenuItem>
            <MenuItem value={'oldest'}>Oldest</MenuItem>
            <MenuItem value={'ascending'}>Ascending</MenuItem>
            <MenuItem value={'descending'}>Descending</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">URL</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">
                  {row.metaTitle}
                </TableCell>
                <TableCell style={{ width: 200 }} align="center">
                  {row.category}
                </TableCell>
                <TableCell style={{ width: 200 }} align="center">
                  {row.ogUrl}
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default App;
