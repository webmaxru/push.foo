import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  InApp: 0,
  IconBadge: 0,
};

export const notificationCountSlice = createSlice({
  name: 'notificationCount',
  initialState,
  reducers: {
    incrementInAppCount: (state) => {
      state.InApp += 1;
    },
    resetInAppCount: (state) => {
      state.InApp = 0;
    },
    incrementIconBadgeCount: (state) => {
      state.IconBadge += 1;
    },
    resetIconBadgeCount: (state) => {
      state.IconBadge = 0;
    },
  },
});

export const {
  incrementInAppCount,
  resetInAppCount,
  incrementIconBadgeCount,
  resetIconBadgeCount,
} = notificationCountSlice.actions;
export const selectNotificationInAppCount = (state) =>
  state.notificationCount.InApp;
export const selectNotificationIconBadgeCount = (state) =>
  state.notificationCount.IconBadge;
export default notificationCountSlice.reducer;
