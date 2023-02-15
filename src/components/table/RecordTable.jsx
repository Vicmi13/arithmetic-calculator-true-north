import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import jwt_decode from "jwt-decode";
import DeleteIcon from "@mui/icons-material/Delete";

import EnhancedTableToolbar from "./Toolbar";
import HeadCellRecord from "./HeadCellRecord";
import { getRecordsByUser } from "../../services/RecordService";
import { addAuthorizationToHeader } from "../../utils/request";
import { selectUserToken, storeToken } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  operationRegistered,
  selectOperationRegistered,
} from "../../features/operation/operationSlice";
import { alertDetail, showAlert } from "../../features/alert/alertSlice";
import { sanitizeDate } from "../../utils/utils";
import { typeOperationFormat } from "../../utils/operations";
import { IconButton } from "@mui/material";
import { red } from "@mui/material/colors";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTable = () => {
  const selectorUserToken = useSelector(selectUserToken);
  const selectorOperationRegistered = useSelector(selectOperationRegistered);
  const dispatch = useDispatch();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = React.useState([]);
  const [recordList, setRecordList] = useState([]);

  /** Pagination */
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    recoverRecordsByUser();
  }, []);

  useEffect(() => {
    if (selectorOperationRegistered) {
      console.log("==== operationRegistered", selectorOperationRegistered);
      recoverRecordsByUser();
    }
  }, [selectorOperationRegistered]);

  const recoverRecordsByUser = async () => {
    try {
      const customHeader = addAuthorizationToHeader(selectorUserToken);
      const decodedToken = jwt_decode(selectorUserToken);
      let userId;
      if (!!decodedToken.id) userId = decodedToken.id;
      const queryParams = { page, pageSize: rowsPerPage, userId };
      const { data, status } = await getRecordsByUser(
        customHeader,
        queryParams
      );
      if (!!data.refreshedToken) {
        dispatch(storeToken(data));
      }
      if (!!data.records) {
        setRecordList(data.records);
      }
      console.log("RECORDS", data.records);
    } catch (error) {
      console.log("ERROR HERE", error);
      dispatch(
        alertDetail({
          severity: "error",
          message: data.errorDetail || error,
        })
      );
      dispatch(showAlert());
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => {
    console.log("name isSelected", name);
    selected.indexOf(name) !== -1;
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            {/* TODO row count debe ser todos los items
            no solo los de esa pagina */}
            <HeadCellRecord
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={recordList.length}
            />
            <TableBody>
              {stableSort(recordList, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell> */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        // padding="none"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="left">
                        {typeOperationFormat(row.operation.type)}
                      </TableCell>
                      <TableCell align="center">
                        {row.operation_response}
                      </TableCell>
                      <TableCell align="center">{row.amount}</TableCell>
                      <TableCell align="center">$ {row.user_balance}</TableCell>
                      <TableCell align="center">
                        {sanitizeDate(row.createdAt)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => console.log("clicked", row.id)}
                          aria-label="delete"
                          sx={{ color: "#df4646" }}
                        >
                          <DeleteIcon> </DeleteIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </Box>
  );
};

export default EnhancedTable;
