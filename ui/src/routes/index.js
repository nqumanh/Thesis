import { useRoutes } from "react-router-dom";
import Login from "views/Login";
import Layout from "layout";
import Dashboard from "views/DashboardStudent";
import CourseDetailStudent from "views/CourseDetailStudent";
import Setting from "views/Setting";
import Profile from "views/Student/Profile";
import Message from "views/Message";
import Warning from "views/Student/Warning";
import DashboardEducator from "views/Educator/DashboardEducator";
import CourseDetailEducator from "views/Educator/CourseDetailEducator";
import StudentResult from "views/Educator/StudentResult";
import NotFound from "views/NotFound";

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
                { path: "", element: (role === "student") ? <Dashboard /> : <DashboardEducator /> },
                { path: "profile", element: <Profile /> },
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