import {RootState} from "../../app/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectCompanies = createSelector(
  (state: RootState) => state.companiesState.companies, (state) => state
);

export const selectCompanyTokens = createSelector(
  (state: RootState) => state.companiesState.companyTokens, (state) => state
);
