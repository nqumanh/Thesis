import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const token = localStorage.getItem("token")

const getAxios = (url, params = {}) =>
    axios.get(url,
        {
            params: params,
        }, {
        headers: { Authorization: `Bearer ${token}` },
    }
    );

const login = (loginForm) =>
    axios.post(
        `${BASE_URL}/login`,
        loginForm,
    );

const getChannelsOfUser = (id) =>
    getAxios("http://localhost:5000/get-channels", { id: id })

const createNewChannel = (id, adminId, channelName, participants) =>
    axios.post(
        `${BASE_URL}/create-channel`,
        {
            id: id,
            adminId: adminId,
            name: channelName,
            participants: participants,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

const getMesseges = (id) =>
    getAxios("http://localhost:5000/get-messages", { id: id })

const sendMessage = (message) =>
    axios.post(
        `${BASE_URL}/create-message`,
        message,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

export {
    login,

    getChannelsOfUser,
    createNewChannel,

    getMesseges,
    sendMessage
};