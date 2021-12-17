import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'



type ModalsType = 'add-post'

type AlertType = {
  type: 'success' | 'error',
  text: string
}

type CommonState = {
  alert: AlertType | null,
  imageViewingUrl: string | null,
  currentVisibleModal: ModalsType | null
}

const initialState: CommonState = {
  alert: null,
  imageViewingUrl: null,
  currentVisibleModal: null
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    openAlert(state, { payload }: PayloadAction<AlertType>) {
      state.alert = payload
    },
    closeAlert(state) {
      state.alert = null
    },
    setImageViewingUrl(state, { payload }: PayloadAction<string | null>) {
      state.imageViewingUrl = payload
    },
    setCurrentVisibleModal(state, { payload }: PayloadAction<ModalsType | null>) {
      state.currentVisibleModal = payload
    }
  }
})

export const selectAlert = (state: RootState) => {
  return state.common.alert
}

export const selectImageViewingUrl = (state: RootState) => {
  return state.common.imageViewingUrl
}

export const selectCurrentVisibleModal = (state: RootState) => {
  return state.common.currentVisibleModal
}

export const commonActions = commonSlice.actions

export default commonSlice.reducer
