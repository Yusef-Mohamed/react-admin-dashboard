import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import { AuthProvider } from "./context/UserContextProvider";
import { ThemeProvider } from "./context/ThemeContextProvider";
import DashBoardLayout from "./components/Layout/DashBoardLayout";
import DashboardHome from "./pages/dashboardHome/DashboardHome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UsersPage from "./pages/users/UsersPage";
import UserFormPage from "./pages/users/UserFormPage";
import { Toaster } from "./components/ui/toaster";
import CategoriesPage from "./pages/categoires/CategoriesPage";
import CategoryFormPage from "./pages/categoires/CategoryFormPage";
import CoursesPage from "./pages/courses/CoursesPage";
import CourseFormPage from "./pages/courses/CourseFormPage";
import LessonsPage from "./pages/lessons/LessonsPage";
import LessonFormPage from "./pages/lessons/LessonFormPage";
import BlogsPage from "./pages/blogs/BlogsPage";
import BlogFormPage from "./pages/blogs/BlogFormPage";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              <Route index element={<Login />} />
              <Route path="/dashboard" element={<DashBoardLayout />}>
                <Route path="overview" element={<DashboardHome />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="users/:id" element={<UserFormPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/:id" element={<CategoryFormPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="courses/:id" element={<CourseFormPage />} />
                <Route path="lessons" element={<LessonsPage />} />
                <Route path="lessons/:id" element={<LessonFormPage />} />
                <Route path="blogs" element={<BlogsPage />} />
                <Route path="blogs/:id" element={<BlogFormPage />} />
              </Route>
            </Routes>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
