import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Check if token is still valid on app load
function getValidToken() {
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null;
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      // Token expired — clear everything
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }
    return token;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
}

const initialState = {
  signupData: null,
  loading: false,
  token: getValidToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;