import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const getAxios = (url, params = {}) => {
    const token = localStorage.getItem("token")
    let config = {
        params: params,
        headers: { Authorization: `Bearer ${token}` },
    }
    return axios.get(url, config);
}

const login = (loginForm) =>
    axios.post(
        `${BASE_URL}/login`,
        loginForm,
    );

const getChannelsOfUser = (id) =>
    getAxios("http://localhost:5000/GetChannels", { id: id })

const createNewChannel = (id, adminId, channelName, participants) => {
    const token = localStorage.getItem("token")

    return axios.post(
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
}

const getMesseges = (id) =>
    getAxios("http://localhost:5000/get-messages", { id: id })

const sendMessage = (message) => {
    const token = localStorage.getItem("token")

    return axios.post(
        `${BASE_URL}/create-message`,
        message,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
}

const getStudentById = (id) =>
    getAxios("http://localhost:5000/GetStudentById", { id: id })

const getNumberOfCoursesOfStudent = (id) =>
    getAxios("http://localhost:5000/GetNumberOfCoursesOfStudent", { id: id })

const getResponseWarningPercentage = (id) =>
    getAxios("http://localhost:5000/GetResponseWarningPercentage", { ReceiverId: id })

const getNumberOfAssessmentsOfStudent = (id) =>
    getAxios("http://localhost:5000/GetNumberOfAssessmentsOfStudent", { id: id })

const getCourseByCode = (codeModule, codePresentation) =>
    getAxios("http://localhost:5000/GetCourseByCode", { CodeModule: codeModule, CodePresentation: codePresentation })

const getWarnings = (id) =>
    getAxios("http://localhost:5000/GetWarnings", { ReceiverId: id })

const addFeedbackToWarning = (id, feedback) => {
    const token = localStorage.getItem("token")

    return axios.put(
        `${BASE_URL}/AddFeedbackToWarning`,
        {
            Id: id,
            Feedback: feedback,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
}

const getCourseListOfStudentByParentsId = (id) =>
    getAxios("http://localhost:5000/GetCourseListOfStudentByParentsId", { Id: id })

const getStudentAssessments = (studentId, codeModule, codePresentation) =>
    getAxios("http://localhost:5000/GetStudentAssessments", { StudentId: studentId, CodeModule: codeModule, CodePresentation: codePresentation })

const getSentWarnings = (codeModule, codePresentation) =>
    getAxios("http://localhost:5000/GetSentWarnings", { CodeModule: codeModule, CodePresentation: codePresentation })

export {
    login,

    getChannelsOfUser,
    createNewChannel,

    getMesseges,
    sendMessage,

    getStudentById,
    getNumberOfCoursesOfStudent,
    getResponseWarningPercentage,
    getNumberOfAssessmentsOfStudent,
    getCourseByCode,

    getWarnings,
    addFeedbackToWarning,

    getStudentAssessments,

    getCourseListOfStudentByParentsId,
    getSentWarnings,
};