import { createSlice } from "@reduxjs/toolkit";

// Function to get the initial state from localStorage
const getInitialState = () => {
  const savedState = localStorage.getItem("authStatus");
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (e) {
      console.error("Failed to parse auth status from local storage", e);
    }
  }
  return { auth: false, userData: null };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.auth = true;
      state.userData = action.payload;
      try {
        localStorage.setItem("authStatus", JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save auth status to local storage", e);
      }
    },
    logout: (state) => {
      state.auth = false;
      state.userData = null;
      try {
        localStorage.removeItem("authStatus");
      } catch (e) {
        console.error("Failed to remove auth status from local storage", e);
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
