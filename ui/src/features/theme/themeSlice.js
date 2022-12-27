import { createSlice } from '@reduxjs/toolkit'

export const themSlice = createSlice({
    name: 'theme',
    initialState: {
        name: 'default'
    },
    reducers: {
        choooseTheme: (state, action) => {
            state.name = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { choooseTheme } = themSlice.actions

export default themSlice.reducer