import {createAsyncThunk} from "@reduxjs/toolkit";
import API from "../../api";

// TODO: Consider using RTK Query

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies", async (_, thunkAPI) => {
    try {
      return await API.getCompanies();
    } catch (error) {
      return thunkAPI.rejectWithValue({error: error.message});
    }
  });

export const fetchCompanyTokens = createAsyncThunk(
  "companies/fetchCompanyTokens", async (_, thunkAPI) => {
    try {
      return await API.getCompanyTokens();
    } catch (error) {
      return thunkAPI.rejectWithValue({error: error.message});
    }
  });