import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

export const notificationCountSlice = createSlice({
  name: 'notificationCount',
  initialState,
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },

    increment: (state) => {
      state.value += 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { set, increment, reset } = notificationCountSlice.actions;
export const selectNotificationCount = (state) => state.notificationCount.value;
export default notificationCountSlice.reducer;
