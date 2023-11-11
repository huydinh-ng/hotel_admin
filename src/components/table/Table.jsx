import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useFetch from "../../hooks/useFetch";
import classes from "./table.module.css";

const List = ({ type }) => {
  const { data: dataTransactions } = useFetch(
    `/transactions${type === "home" ? "/lastest" : "/"}`
  );

  const convertFormatDate = (d) => {
    const newDate = new Date(d);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const date = newDate.getDate();
    return `${date}/${month}/${year}`;
  };

  const stylestatus = (status) => {
    if (status === "Booked") {
      return classes.booked;
    } else if (status === "Checkin") {
      return classes.checkin;
    } else {
      return classes.checkout;
    }
  };

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>
              <input type="checkbox" />
            </TableCell>
            <TableCell className={classes.tableCell}>ID</TableCell>
            <TableCell className={classes.tableCell}>User</TableCell>
            <TableCell className={classes.tableCell}>Hotel</TableCell>
            <TableCell className={classes.tableCell}>Room</TableCell>
            <TableCell className={classes.tableCell}>Date</TableCell>
            <TableCell className={classes.tableCell}>Price</TableCell>
            <TableCell className={classes.tableCell}>Payment Method</TableCell>
            <TableCell className={classes.tableCell}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataTransactions?.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell className={classes.tableCell}>
                <input type="checkbox" />
              </TableCell>
              <TableCell className={classes.tableCell}>
                {transaction._id}
              </TableCell>
              <TableCell className={classes.tableCell}>
                <div className={classes.cellWrapper}>
                  {transaction.user.username}
                </div>
              </TableCell>
              <TableCell className={classes.tableCell}>
                {transaction.hotel.name}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {transaction.room.join(", ")}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {convertFormatDate(transaction.dateStart)} -{" "}
                {convertFormatDate(transaction.dateEnd)}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {transaction.price}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {transaction.payment}
              </TableCell>
              <TableCell className={classes.tableCell}>
                <span className={stylestatus(transaction.status)}>
                  {transaction.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
