import * as React from "react";
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import Home from "./component/Home";
import Signup from "./component/Signup";
import LoginForm from "./component/LoginForm";
import AddQuestionForm from "./component/AddQuestionForm";
import AssessmentDetails from "./component/AssessmentDetails";
import AssessmentFrom from "./component/AssessmentForm";
import UserAssessment from "./component/UserAssessment";
import SuccessPage from "./component/SuccessPage";
import AssessmentHistory from "./component/student/AssessmentHistory";
import AssessmentUpdate from "./component/AssessmentUpdate";
import AssessmentQuestionUpdate from "./component/AssessmentQuestionUpdate";
import UserListPage from "./component/UserListPage";
import UserProfile from "./component/UserProfile";
import StudentFeedback from "./component/StudentFeedback";
import Instructions from "./component/Instructions";
import Protect from "./component/Protect";
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";
import QuestionCategory from "./component/QuestionCategory";
import QuestionDetail from "./component/QuestionDetail";
import SideBar from "./component/SideBar";
const Loading = React.lazy(() => import("./component/Loading"));

const Layout = () => {
  const location = useLocation();
  const noSideBarRoutes = ['/login', '/signup', '/forgot-password']
  return (
    <>
      {!noSideBarRoutes.includes(location.pathname) && <SideBar />}
      <Outlet />
    </>

  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/login",
        element: (<LoginForm />),
      },
      {
        path: "/signup",
        element: (<Signup />)
      },
      {
        path: "/",
        element: (<Protect><Home /></Protect>)
      }, {
        path: "/createAssessment",
        element: (<Protect><AssessmentFrom /></Protect>)
      },
      {
        path: "/assessment/:id",
        element: (<Protect><AssessmentDetails /></Protect>)
      },
      {
        path: "/addNewQuestion/:id",
        element: (<Protect><AddQuestionForm /></Protect>)
      }, {
        path: "/userAssessment/:id",
        element: (<Protect><UserAssessment /></Protect>)
      },
      {
        path: "/SubmitSuccessfull/:assessmentId",
        element: (<Protect><SuccessPage /></Protect>)
      }, {
        path: "/assessmentHistory/:id",
        element: (<Protect><AssessmentHistory /></Protect>)
      }, {
        path: "/updateAssessment/:id",
        element: (<Protect><AssessmentUpdate /></Protect>)
      }, {
        path: "/assessmentQuestonUpdate",
        element: (<Protect><AssessmentQuestionUpdate /></Protect>)
      },
      {
        path: "/studentList",
        element: (<Protect><UserListPage /></Protect>)
      }, {
        path: "/userprofile/:id",
        element: (<Protect><UserProfile /></Protect>)
      }, {
        path: "/studentfeedback/:id",
        element: (<Protect><StudentFeedback /></Protect>)
      }, {
        path: "/instruction/:assessmentId",
        element: (<Protect><Instructions /></Protect>)
      }, {
        path: "/forgot-password",
        element: (<ForgotPassword />)
      }, {
        path: "reset-password/:token",
        element: (<ResetPassword />)
      }, {
        path: "/question-category",
        element: (<QuestionCategory />)
      }, {
        path: "/question-bank/:topic",
        element: (<QuestionDetail />)
      }
    ]
  }
]);
function App() {
  return (
    <div className="app">
      <React.Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </React.Suspense>
    </div>
  );
}

export default App;
