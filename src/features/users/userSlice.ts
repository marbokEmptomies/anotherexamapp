import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser } from '../../services/authServices';
import { User } from '../../../types/types';

interface UserState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const registerUserAsync = createAsyncThunk(
  'user/registerUser',
  async (user: User) => {
    const response = await registerUser(user);
    return response;
  }
);

export const loginUserAsync = createAsyncThunk('user/login', async (credentials: {email:string,password:string}) => {
    const response = await loginUser(credentials.email, credentials.password);
    return response.data;
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.token = null;
      state.status = 'idle';
      state.error = null;

      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        console.log("TOKEN in slice: ", state.token)

        localStorage.setItem('token', state.token as string)
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
  },
});

export const { clearUserState } = userSlice.actions;

export default userSlice.reducer;
