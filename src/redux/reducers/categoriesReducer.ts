import { createSlice } from "@reduxjs/toolkit";


type ReduxCategory = {
  id: string,
  name: string
}

type CategoriesState = {
  selectedId: string | null,
  list: ReduxCategory[]
}

const initialState: CategoriesState = {
  selectedId: null,
  list: []
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {

  }
})

export const categoriesActions = categoriesSlice.actions

export default categoriesSlice.reducer
