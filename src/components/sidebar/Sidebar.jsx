import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link, useNavigate } from "react-router-dom";
import classes from "./sidebar.module.css";
import Cookies from "js-cookie";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("access_token");
    navigate("/login");
  };
  return (
    <div className={classes.sidebar}>
      <div className={classes.top}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className={classes.logo}>Admin Page</span>
        </Link>
      </div>
      <div className={classes.center}>
        <ul>
          <p className={classes.title}>MAIN</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className={classes.icon} />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className={classes.title}>LISTS</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className={classes.icon} />
              <span>Users</span>
            </li>
          </Link>
          <Link to="/hotels" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className={classes.icon} />
              <span>Hotels</span>
            </li>
          </Link>
          <Link to="/rooms" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className={classes.icon} />
              <span>Rooms</span>
            </li>
          </Link>
          <Link to="/transactions" style={{ textDecoration: "none" }}>
            <li>
              <LocalShippingIcon className={classes.icon} />
              <span>Transactions</span>
            </li>
          </Link>
          <p className={classes.title}>NEW</p>
          <Link to={"/hotels/new"} style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className={classes.icon} />
              <span>New Hotel</span>
            </li>
          </Link>
          <Link to={"/rooms/new"} style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className={classes.icon} />
              <span>New Room</span>
            </li>
          </Link>
          <p className={classes.title}>USER</p>
          <li onClick={handleLogout}>
            <ExitToAppIcon className={classes.icon} />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
