import {createSlice} from "@reduxjs/toolkit"

function getValidUser() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!token || !user) {
    localStorage.removeItem("user");
    return null;
  }
  return JSON.parse(user);
}

const initialState = {
    user: getValidUser(),
    loading: false,
};

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
    },
});

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;