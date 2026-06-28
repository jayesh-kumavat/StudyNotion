import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import SessionExpiryWarning from "./components/common/SessionExpiryWarning";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import WishlistPage from "./components/core/Dashboard/WishlistPage";
import Cart from "./components/core/Dashboard/Cart";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import AllCategories from "./pages/AllCategories";
import CourseDetails from "./pages/CourseDetails";
import SearchResults from "./pages/SearchResults";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import Leaderboard from "./components/core/Dashboard/Gamification/Leaderboard";
import LearningPaths from "./components/core/Dashboard/LearningPaths";
import AdminDashboard from "./components/core/Dashboard/Admin/AdminDashboard";
import UserManagement from "./components/core/Dashboard/Admin/UserManagement";
import CourseModeration from "./components/core/Dashboard/Admin/CourseModeration";
import Transactions from "./components/core/Dashboard/Admin/Transactions";
import CategoryManagement from "./components/core/Dashboard/Admin/CategoryManagement";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="w-screen min-h-screen bg-white dark:bg-slate-900 flex flex-col font-inter transition-colors duration-300">
      <Navbar />
      <SessionExpiryWarning />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="catalog" element={<AllCategories />} />
          <Route path="catalog/:catalogName" element={<Catalog />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path="search" element={<SearchResults />} />

          <Route path="signup" element={<OpenRoute><Signup /></OpenRoute>} />
          <Route path="login" element={<OpenRoute><Login /></OpenRoute>} />
          <Route path="forgot-password" element={<OpenRoute><ForgotPassword /></OpenRoute>} />
          <Route path="verify-email" element={<OpenRoute><VerifyEmail /></OpenRoute>} />
          <Route path="update-password/:id" element={<OpenRoute><UpdatePassword /></OpenRoute>} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/Settings" element={<Settings />} />
            <Route path="dashboard/cart" element={<Cart />} />
            <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
            <Route path="dashboard/wishlist" element={<WishlistPage />} />
            <Route path="dashboard/learning-paths" element={<LearningPaths />} />
            <Route path="dashboard/leaderboard" element={<Leaderboard />} />
            <Route path="dashboard/instructor" element={<Instructor />} />
            <Route path="dashboard/add-course" element={<AddCourse />} />
            <Route path="dashboard/my-courses" element={<MyCourses />} />
            <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
            <Route path="dashboard/admin" element={<AdminDashboard />} />
            <Route path="dashboard/admin/users" element={<UserManagement />} />
            <Route path="dashboard/admin/courses" element={<CourseModeration />} />
            <Route path="dashboard/admin/transactions" element={<Transactions />} />
            <Route path="dashboard/admin/categories" element={<CategoryManagement />} />
          </Route>

          <Route element={<PrivateRoute><ViewCourse /></PrivateRoute>}>
            <Route
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
