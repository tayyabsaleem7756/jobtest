import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICompany, ICompanyToken} from "../../interfaces/company";
import {fetchCompanies, fetchCompanyTokens} from "./thunks";

export interface CompanyState {
  companies: ICompany[];
  companyTokens: ICompanyToken[];
}

const initialState: CompanyState = {
  companies: [],
  companyTokens: []
};

export const companiesSlice = createSlice({
  name: 'companiesSlice',
  initialState,
  reducers: {
    addCompanyToken: (state, action: PayloadAction<ICompanyToken>) => {
      state.companyTokens = [...state.companyTokens, action.payload];
    },
    editCompanyToken: (state, action: PayloadAction<ICompanyToken>) => {
      state.companyTokens = state.companyTokens.map((companyToken) => {
        if (companyToken.id === action.payload.id) return action.payload
        return companyToken
      });
    },
    deleteToken: (state, action: PayloadAction<number>) => {
      state.companyTokens = [...state.companyTokens.filter(token => token.id !== action.payload)]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCompanies.fulfilled, (state, {payload}) => {
        state.companies = payload;
      }
    );

    builder.addCase(
      fetchCompanyTokens.fulfilled, (state, {payload}) => {
        state.companyTokens = payload;
      }
    );
  }
});


export const {addCompanyToken, editCompanyToken, deleteToken} = companiesSlice.actions;


export default companiesSlice.reducer;