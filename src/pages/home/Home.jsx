import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Widget from "../../components/widget/Widget";
import Table from "../../components/table/Table";

import classes from "./home.module.css";
import useFetch from "../../hooks/useFetch";

const Home = () => {
  const { data: user } = useFetch("/users");
  const { data: order } = useFetch("/transactions");
  const reduceTotalOrder = (order) => {
    return order
      .map((o) => o.price)
      .reduce((earning, price) => (earning += price), 0);
  };

  return (
    <div className={classes.home}>
      <Sidebar />
      <div className={classes.homeContainer}>
        <div className={classes.widgets}>
          <Widget type="user" quantity={user.length} />
          <Widget type="order" quantity={order.length} />
          <Widget type="earning" quantity={reduceTotalOrder(order)} />
          <Widget type="balance" quantity={reduceTotalOrder(order)} />
        </div>
        <div className={classes.listContainer}>
          <div className={classes.listTitle}>Latest Transactions</div>
          <Table type={"home"} />
        </div>
      </div>
    </div>
  );
};

export default Home;
