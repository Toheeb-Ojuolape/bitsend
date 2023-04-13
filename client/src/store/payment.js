import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: JSON.parse(sessionStorage.getItem("sessionDetails")) ? JSON.parse(sessionStorage.getItem("sessionDetails")) : {},
  id:""
}

export const fetchPayment = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayment: (state, action) => {
      state.value = action.payload
      sessionStorage.setItem("sessionDetails",JSON.stringify(action.payload))
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPayment } = fetchPayment.actions

export default fetchPayment.reducer