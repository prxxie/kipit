import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";
import { Provider, Session } from "@supabase/supabase-js";
import { AppState } from "../store";

export interface AuthState {
  authState: boolean;
  userId: string | undefined;
  username: string | undefined;
  avatar: string | undefined;
}

const initialState: AuthState = {
  authState: false,
  userId: undefined,
  username: undefined,
  avatar: undefined
};

export const signInWithOAuth = createAsyncThunk(
  'auth/signInWithOAuth',
  async (provider: Provider = 'github') => {
    const { data } = await supabase.auth.signInWithOAuth({
      provider,
    })

    return data
  }
)

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return session
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    const { error } = await supabase.auth.signOut()

    if (error) throw error;

    return true
  }
)

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(state, action) {
      state.authState = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProfile.fulfilled, (state, action) => {
        if (!action.payload) {
          state.authState = false
          return
        }

        const payload: Session | null = action.payload
        const user = payload?.user
        const provider: string | undefined = payload?.user?.app_metadata?.provider

        state.userId = user?.id

        switch (provider) {
          case "github":
            state.username = user?.user_metadata?.full_name
            state.avatar = user?.user_metadata?.avatar_url
            break;

          default:
            break;
        }

        state.authState = true
      })
      .addCase(signOut.fulfilled, state => {
        state.authState = false
      })
  },
});

export default authSlice.reducer;