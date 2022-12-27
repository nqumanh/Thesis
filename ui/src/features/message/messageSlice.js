import { createSlice } from '@reduxjs/toolkit'
import { getChannelsOfUser } from 'api'

export const messageSlice = createSlice({
    name: 'message',
    initialState: {
        currentChannelId: null,
        channels: []
    },
    reducers: {
        setCurrentChannel: (state, { payload }) => {
            state.currentChannelId = payload
        },
        getChannels: (state, { payload }) => {
            state.channels = payload
        },
        addChannel: (state, { payload }) => {
            state.channels.unshift(payload)
        }
    }
})

// Action creators are generated for each case reducer function
export const { getChannels, setCurrentChannel, addChannel } = messageSlice.actions

export default messageSlice.reducer

export function fetchChannels(id) {
    return async (dispatch) => {
        getChannelsOfUser(id).then((res) => {
            dispatch(getChannels(res.data))
        }).catch((err) => {
            console.log(err)
        })
    }
}