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

export {
    login,
    getChannelsOfUser
};