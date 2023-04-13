import { configureStore } from '@reduxjs/toolkit'
import fetchPayment from './payment'


export const store = configureStore({
    reducer: {
        payment:fetchPayment
    }
    })