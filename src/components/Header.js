import { useContext } from "react";
import "../css/header.css";

import Menu from "./Menu";
import { DataContext } from "../App";
const Header = () => {
  const { navActive } = useContext(DataContext);

  return (
    <>
      <div className="header">
        <h3>{navActive}</h3>
        <Menu />
      </div>
    </>
  );
};

export default Header;
