import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
    },
  },
});

// Selector function
export const selectUserProfile = (state) => state.user.profile;

export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
