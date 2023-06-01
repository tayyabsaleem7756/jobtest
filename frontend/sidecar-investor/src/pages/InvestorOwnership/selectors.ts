import {RootState} from "../../app/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectInvestorOwnership = createSelector(
  (state: RootState) => state.investorOwnershipState.investor, (state) => state
);

export const selectNotifications = createSelector(
  (state: RootState) => state.investorOwnershipState.notificationInfo, (state) => state
);

export const selectNotificationFilters = createSelector(
  (state: RootState) => state.investorOwnershipState.filters, (state) => state
);

export const selectShowUSD = createSelector(
  (state: RootState) => state.investorOwnershipState.showUSD, (state) => state
);