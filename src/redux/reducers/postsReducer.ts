import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'



export type ReduxPost = {
  id: string,
  imageUrl: string,
  likesCount: number,
  authorUid: string,
  desc: string
}

type PostsState = ReduxPost[]


const initialState: PostsState = [
  
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, { payload }: PayloadAction<ReduxPost[]>) {
      state.splice(0, state.length)
      state.push(...payload)
    }
  }
})

export const selectPosts = (state: RootState) => {
  return state.posts
}

export const postsActions = postsSlice.actions

export default postsSlice.reducer
