import Header from "../Header";
import { Outlet } from "react-router-dom";

const With_nav = () => {
  return (
    <div className="relative">
      <Header />
      <Outlet />
    </div>
  );
};

export default With_nav;
