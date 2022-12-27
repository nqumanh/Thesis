import { configureStore } from '@reduxjs/toolkit'
import themeReducer from 'features/theme/themeSlice'
import messageReducer from 'features/message/messageSlice'

export default configureStore({
    reducer: {
        theme: themeReducer,
        message: messageReducer,
    }
})