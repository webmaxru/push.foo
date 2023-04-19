import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { authSlice } from './authSlice';
import { notificationCountSlice } from './notificationCountSlice';
import { subscriptionSlice } from './subscriptionSlice';

// https://blog.openreplay.com/state-management-in-next-js-with-redux-toolkit/
// https://stackoverflow.com/a/73761411/1310228

const makeStore = () =>
  configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [notificationCountSlice.name]: notificationCountSlice.reducer,
      [subscriptionSlice.name]: subscriptionSlice.reducer,
    },
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);