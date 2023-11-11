import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Table from "../../components/table/Table";

import classes from "./transaction.module.css";

const Transaction = () => {
  return (
    <div className={classes.transaction}>
      <Sidebar />
      <div className={classes.transactionContainer}>
        <div className={classes.listContainer}>
          <div className={classes.listTitle}>Transactions List</div>
          <Table type={"transaction"} />
        </div>
      </div>
    </div>
  );
};

export default Transaction;
