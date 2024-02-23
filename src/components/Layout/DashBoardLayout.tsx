import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/UserContextProvider";
import { getCookie } from "../../lib/cookies";

const DashBoardLayout = () => {
  const { logout } = useAuth();
  const user = getCookie("user");
  const token = getCookie("token");
  if (user?.role !== "admin" && !token) {
    logout();
    return <Navigate to="/" />;
  }
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DashBoardLayout;
