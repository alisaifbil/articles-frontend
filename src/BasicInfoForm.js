
import React, {  useState } from "react";

import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
const axios = require("axios").default;
const URL = 'https://express-app-hazel.vercel.app/';

function BasicInfoForm() {

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleNameChange = (event) => {
    event.preventDefault();
    let searchText = event.target.value;
    setName(searchText);
  };

  const handleEmailChange = (event) => {
    event.preventDefault();
    let searchText = event.target.value;
    setEmail(searchText);
  };

  const submitForm = () => {
    axios
      .post(`${URL}/sendEmail`, {
        headers: { "Content-Type": "application/json" ,
        'Access-Control-Allow-Origin': '*'},
        body: {
          name: name,
          sendTo: email
        },
      })
      .then((response) => {
        console.log(response);
        if(response.status === 200){
            alert('Email Sent');
        }
        else {
            alert('Failure in sending email');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectCategory = (event) => {
    event.preventDefault();
    let selection = event.target.value;
    setCategory(selection);
  };

  return (
    <div>
      <Grid sx={{ p: 2, m: 2, backgroundColor: "#ff8a65" }}>
        <Typography variant="h5">Sign Up For More!</Typography>
        <Grid sx={{ m: 3 }} alignItems="flex-start" container>
          <TextField
            id="name"
            className="text"
            label="Enter Name"
            variant="outlined"
            size="small"
            value={name}
            onChange={handleNameChange}
          />
          <TextField
            sx={{ ml: 2 }}
            id="email"
            className="text"
            label="Enter Email"
            variant="outlined"
            size="small"
            value={email}
            onChange={handleEmailChange}
          />
          <FormControl sx={{ ml: 2, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Sort By"
              onChange={selectCategory}
            >
              <MenuItem value={"business"}>Business</MenuItem>
              <MenuItem value={"health"}>Health</MenuItem>
              <MenuItem value={"sports"}>Sports</MenuItem>
              <MenuItem value={"technology"}>Technology</MenuItem>
            </Select>
          </FormControl>
          <Button
            sx={{ ml: 2, backgroundColor: "#c41c00", color: "white" }}
            onClick={submitForm}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default BasicInfoForm;
