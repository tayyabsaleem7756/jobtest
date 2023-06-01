import {createAsyncThunk} from "@reduxjs/toolkit";
import API from "../../api";

// TODO: Consider using RTK Query

export const fetchFundInvestorDetail = createAsyncThunk(
  "fundInvestor/investorDetail", async (externalId: string, thunkAPI) => {
    try {
      return await API.getFundInvestments(externalId);
    } catch (error) {
      return thunkAPI.rejectWithValue({error: error.message});
    }
  });

export const fetchInvestorProfiles = createAsyncThunk(
  "fundInvestor/investorProfiles", async (_, thunkAPI) => {
    try {
      return await API.getInvestorProfiles();
    } catch (error) {
      return thunkAPI.rejectWithValue({error: error.message});
    }
  });