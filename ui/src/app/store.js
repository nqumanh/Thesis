import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../features/theme/themeSlice'

export default configureStore({
    reducer: {
        theme: themeReducer
    }
})