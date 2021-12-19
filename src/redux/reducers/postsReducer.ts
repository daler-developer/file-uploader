import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'



export type ReduxPost = {
  id: string,
  image: {
    url: string,
    path: string,
    size: number,
    createdAt: string
  },
  likesCount: number,
  authorUid: string,
  desc: string,
  isFavourite: boolean,
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
    },
    deletePost(state, { payload }: PayloadAction<string>) {
      state.splice(0, state.length)
      const filtered = state.filter((post) => post.id !== payload)
      state.push(...filtered)
    },
    addPost(state, { payload }: PayloadAction<ReduxPost>) {
      state.push(payload)
    },
    makePostFavourite(state, { payload }: PayloadAction<string>) {
      const post = state.find((post) => post.id === payload)
      if (post) post.isFavourite = true
    },
    removePostFavourite(state, { payload }: PayloadAction<string>) {
      const post = state.find((post) => post.id === payload)
      if (post) post.isFavourite = false
    },
  }
})

export const selectPosts = (state: RootState) => {
  return state.posts
}

export const postsActions = postsSlice.actions

export default postsSlice.reducer
