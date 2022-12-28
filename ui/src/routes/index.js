import { useRoutes } from "react-router-dom";
import Layout from "layout";
import Login from "views/Login";
import Message from "views/Message";

import CourseList from "views/Student/CourseListStudent";
import CourseDetailStudent from "views/Student/CourseDetailStudent";
import StudentProfile from "views/Student/Profile";
import Warning from "views/Student/Warning";
import Dashboard from "views/Dashboard";

import ChildCourseList from "views/Parents/CourseList";
import ParentsProfile from "views/Parents/Profile";

import CourseListEducator from "views/Educator/CourseListEducator";
import CourseDetailEducator from "views/Educator/CourseDetailEducator";
import EducatorDashboard from "views/Educator/Dashboard";

import Setting from "views/Setting";
import NotFound from "views/NotFound";
import StudentDetail from "views/Educator/StudentDetail";
import StudentDashboard from "views/Student/Dashboard";

const Routes = () => {
    const role = localStorage.getItem('role');

    return useRoutes([
        { path: "login", element: <Login /> },
        {
            path: "/",
            element: <Layout />,
            children: [
                { path: "", element: (role === "student") ? <CourseList /> : (role === "educator") ? <CourseListEducator /> : <ChildCourseList /> },
                { path: "dashboard", element: (role === "educator") ? <EducatorDashboard /> : (role === "student") ? <StudentDashboard /> : <Dashboard /> },
                { path: "profile", element: (role === "student") ? <StudentProfile /> : <ParentsProfile /> },
                { path: "warning", element: <Warning /> },
                { path: "message", element: <Message /> },
                { path: "setting", element: <Setting /> },
                { path: "course/student", element: (role === 'educator') ? <StudentDetail /> : <NotFound /> },
                { path: "course", element: (role === "student") ? <CourseDetailStudent /> : <CourseDetailEducator /> },
            ],
        },
    ]);
}

export default Routes;