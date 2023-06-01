import {createSlice} from '@reduxjs/toolkit';
import {fetchInvestorCompanyUsers, fetchUnreadNotificationCount, fetchUserInfo} from "./thunks";
import {UserInfo} from "../../interfaces/userInfo";
import {ICompanyUser} from "../../interfaces/companyUser";


export interface UserState {
  userInfo: UserInfo | null;
  unreadNotificationCount: number | null;
  companyUsers: ICompanyUser[] | null;
}

const initialState: UserState = {
  userInfo: null,
  unreadNotificationCount: null,
  companyUsers: null,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUserInfo.fulfilled, (state, {payload}) => {
        state.userInfo = payload;
      }
    );
    builder.addCase(
      fetchUnreadNotificationCount.fulfilled, (state, {payload}) => {
        state.unreadNotificationCount = payload;
      }
    );
    builder.addCase(
      fetchInvestorCompanyUsers.fulfilled, (state, {payload}) => {
        state.companyUsers = payload;
      }
    );
  }
});


export default userSlice.reducer;