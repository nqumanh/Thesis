import { useRoutes } from "react-router-dom";
import Login from "views/Login";
import Layout from "layout";
import CourseList from "views/Student/CourseListStudent";
import CourseDetailStudent from "views/CourseDetailStudent";
import Setting from "views/Setting";
import StudentProfile from "views/Student/Profile";
import Message from "views/Message";
import Warning from "views/Student/Warning";
import CourseListEducator from "views/Educator/CourseListEducator";
import CourseDetailEducator from "views/Educator/CourseDetailEducator";
import StudentResult from "views/Educator/StudentResult";
import NotFound from "views/NotFound";
import Dashboard from "views/Dashboard";
import ChildCourseList from "views/Parents/CourseList";
import ParentsProfile from "views/Parents/Profile";

const Routes = () => {
    const role = localStorage.getItem('role');
    // if (role === "student")
    // if (role === "educator")
    // if (role === "parents")

    return useRoutes([
        { path: "login", element: <Login /> },
        {
            path: "/",
            element: <Layout />,
            children: [
                { path: "", element: (role === "student") ? <CourseList /> : (role === "educator") ? <CourseListEducator /> : <ChildCourseList /> },
                { path: "dashboard", element: <Dashboard /> },
                { path: "profile", element: (role === "student") ? <StudentProfile /> : <ParentsProfile /> },
                { path: "warning", element: <Warning /> },
                { path: "message", element: <Message /> },
                { path: "setting", element: <Setting /> },
                { path: "course/student", element: (role === 'educator') ? <StudentResult /> : <NotFound /> },
                { path: "course", element: (role === "student") ? <CourseDetailStudent /> : <CourseDetailEducator /> },
            ],
        },
    ]);
}

export default Routes;