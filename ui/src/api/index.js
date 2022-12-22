import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const login = (loginForm) =>
    axios.post(
        `${BASE_URL}/login`,
        loginForm,
    );

export { login };