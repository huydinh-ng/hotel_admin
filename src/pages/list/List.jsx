import Sidebar from "../../components/sidebar/Sidebar";
import Datatable from "../../components/datatable/Datatable";
import classes from "./list.module.css";

const List = ({ columns }) => {
  return (
    <div className={classes.list}>
      <Sidebar />
      <div className={classes.listContainer}>
        <Datatable columns={columns} />
      </div>
    </div>
  );
};

export default List;
