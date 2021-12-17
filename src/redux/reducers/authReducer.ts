import { UserInfo } from '@firebase/auth'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'




type AuthState = {
  currentUser: UserInfo | null
}

const initialState: AuthState = {
  currentUser: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, { payload }: PayloadAction<UserInfo>) {
      state.currentUser = payload
    },
    logout(state) {
      state.currentUser = null
    }
  }
})

export const selectCurrentUser = (state: RootState) => {
  return state.auth.currentUser
}

export const selectIsAuthenticated = (state: RootState) => {
  return Boolean(state.auth.currentUser)
}

export const authActions = authSlice.actions

export default authSlice.reducer
