import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer'
import commonReducer from './reducers/commonReducer'
import postsReducer from './reducers/postsReducer'


const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    posts: postsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
