import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const token = localStorage.getItem("token")

const getAxios = (url, params = {}) => {
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

const getStudentById = (id) =>
    getAxios("http://localhost:5000/GetStudentById", { id: id })

const getNumberOfCoursesOfStudent = (id) =>
    getAxios("http://localhost:5000/GetNumberOfCoursesOfStudent", { id: id })

const getResponseWarningPercentageOfStudent = (id) =>
    getAxios("http://localhost:5000/GetResponseWarningPercentageOfStudent", { id: id })

const getNumberOfAssessmentsOfStudent = (id) =>
    getAxios("http://localhost:5000/GetNumberOfAssessmentsOfStudent", { id: id })

const getCourseByCode = (codeModule, codePresentation) =>
    getAxios("http://localhost:5000/GetCourseByCode", { CodeModule: codeModule, CodePresentation: codePresentation })

const getWarnings = (id) =>
    getAxios("http://localhost:5000/GetWarnings", { id: id })

const addFeedbackToWarning = (id, feedback) =>
    axios.put(
        `${BASE_URL}/AddFeedbackToWarning`,
        {
            id: id,
            feedback: feedback,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

const getCourseListOfStudentByParentsId = (id) =>
    getAxios("http://localhost:5000/GetCourseListOfStudentByParentsId", { Id: id })

const getStudentAssessments = (studentId, codeModule, codePresentation) =>
    getAxios("http://localhost:5000/GetStudentAssessments", { StudentId: studentId, CodeModule: codeModule, CodePresentation: codePresentation })

export {
    login,

    getChannelsOfUser,
    createNewChannel,

    getMesseges,
    sendMessage,

    getStudentById,
    getNumberOfCoursesOfStudent,
    getResponseWarningPercentageOfStudent,
    getNumberOfAssessmentsOfStudent,
    getCourseByCode,

    getWarnings,
    addFeedbackToWarning,

    getStudentAssessments,

    getCourseListOfStudentByParentsId,
};