import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import classes from "./datatable.module.css";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const token = Cookies.get("access_token");
  const [list, setList] = useState();
  const { data } = useFetch(`/${path}`);
  const { data: transactions } = useFetch("/transactions");

  useEffect(() => {
    setList(data);
  }, [data]);

  const handleDelete = async (id) => {
    console.log(id);
    try {
      await axios.delete(`/${path}/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setList(list.filter((item) => item._id !== id));
    } catch (err) {}
  };

  const warning = (text) => {
    confirmAlert({
      title: "Warning",
      message: `This ${text} is in transaction! To delete this ${text} please delete the transaction before`,
      buttons: [
        {
          label: "Leave",
        },
      ],
    });
  };

  const submitDelete = (id) => {
    console.log(id);
    if (
      path === "hotels" &&
      transactions.map((t) => t.hotel._id).includes(id)
    ) {
      warning("hotel");
    } else if (
      path === "rooms" &&
      transactions
        .map((transaction) => transaction.hotel)
        .map((hotel) => hotel.rooms)
        .join(" ")
        .toString()
        .includes(id)
    ) {
      warning("room");
    } else if (
      path === "users" &&
      transactions.map((t) => t.user._id).includes(id)
    ) {
      warning("users");
    } else {
      confirmAlert({
        title: "Confirm to delete",
        message: "Are you sure delete?",
        buttons: [
          {
            label: "Yes",
            onClick: () => handleDelete(id),
          },
          {
            label: "No",
          },
        ],
      });
    }
  };

  const GridRows = list || [{ _id: 1 }];
  const GridCol = columns;
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className={classes.cellAction}>
            <Link
              to={`/${path}/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <div className={classes.viewButton}>Edit</div>
            </Link>
            <div
              className={classes.deleteButton}
              onClick={() => submitDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className={classes.datatable}>
      <div className={classes.datatableTitle}>
        <div>
          <span className={classes.path}>{path}</span> List
        </div>
        <Link to={`/${path}/new`} className={classes.link}>
          Add New
        </Link>
      </div>
      <DataGrid
        className={classes.datagrid}
        rows={GridRows}
        columns={GridCol.concat(actionColumn)}
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
