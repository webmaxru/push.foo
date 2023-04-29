import { createSlice } from '@reduxjs/toolkit';

import { defaultNotification } from '../src/shared/pushHelpers';

const initialState = {
  value: defaultNotification,
  formik: null
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.value = action.payload;
    },
    setNotificationFormik: (state, action) => {
        state.formik = action.payload;
      },
    resetNotification: (state) => {
      state.value = defaultNotification;
    },
  },
});

export const { setNotification, resetNotification, setNotificationFormik } = notificationSlice.actions;
export const selectNotification = (state) => state.notification.value;
export const selectNotificationFormik = (state) => state.notification.formik;

export default notificationSlice.reducer;
