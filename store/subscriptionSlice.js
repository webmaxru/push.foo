import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFeatureAvailable: true,
  pushSubscription: null,
  subscriptionId: null,
};

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setIsFeatureAvailable: (state, action) => {
      state.isFeatureAvailable = action.payload;
    },
    setPushSubscription: (state, action) => {
      state.pushSubscription = action.payload;
    },
    setSubscriptionId: (state, action) => {
      state.subscriptionId = action.payload;
    },
  },
});

export const { setIsFeatureAvailable, setPushSubscription, setSubscriptionId } = subscriptionSlice.actions;
export const selectIsFeatureAvailable = (state) =>
  state.subscription.isFeatureAvailable;
export const selectPushSubscription = (state) =>
  state.subscription.pushSubscription;
export const selectSubscriptionId = (state) =>
  state.subscription.subscriptionId;

export default subscriptionSlice.reducer;
