import {RootState} from "../../app/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectUserInfo = createSelector(
  (state: RootState) => state.userState.userInfo, (state) => state
);

export const selectUnreadNotificationCount = createSelector(
  (state: RootState) => state.userState.unreadNotificationCount, (state) => state
);

export const selectCompanyUsers = createSelector(
  (state: RootState) => state.userState.companyUsers, (state) => state
);

