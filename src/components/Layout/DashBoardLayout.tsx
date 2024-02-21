import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashBoardLayout = () => {
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
