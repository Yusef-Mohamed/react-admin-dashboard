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
                <Route index element={<DashboardHome />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="users/:id" element={<UserFormPage />} />
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
