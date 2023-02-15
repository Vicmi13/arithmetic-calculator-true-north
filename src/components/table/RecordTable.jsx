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
import { deleteRecord, getRecordsByUser } from "../../services/RecordService";
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
import { IconButton, Typography } from "@mui/material";

const EnhancedTable = () => {
  const selectorUserToken = useSelector(selectUserToken);
  const customHeader = addAuthorizationToHeader(selectorUserToken);
  const decodedToken = jwt_decode(selectorUserToken);

  const selectorOperationRegistered = useSelector(selectOperationRegistered);
  const dispatch = useDispatch();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [recordList, setRecordList] = useState([]);
  const [totalRecords, setTotalRecords] = useState();

  /** Pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (selectorOperationRegistered) {
      dispatch(operationRegistered());
      recoverRecordsByUser(order, orderBy, page, rowsPerPage);
    }
  }, [selectorOperationRegistered]);

  useEffect(() => {
    recoverRecordsByUser(order, orderBy, page, rowsPerPage);
  }, [order, orderBy, page, rowsPerPage]);

  const recoverRecordsByUser = async (order, orderBy, newPage, newRows) => {
    try {
      let userId;
      if (!!decodedToken.id) userId = decodedToken.id;
      const queryParams = {
        page: newPage,
        pageSize: newRows,
        userId,
        order,
        orderBy,
      };
      const { data, status } = await getRecordsByUser(
        customHeader,
        queryParams
      );
      if (!!data.refreshedToken) {
        dispatch(storeToken(data));
      }
      if (!!data.records) {
        setRecordList(data.records);
        setTotalRecords(data.totalRecords);
      }
      // console.log("RECORDS", data.records);
    } catch (error) {
      dispatch(
        alertDetail({
          severity: "error",
          message: data.errorDetail || error,
        })
      );
      dispatch(showAlert());
    }
  };

  const removeRecord = async (id) => {
    try {
      const { status } = await deleteRecord(customHeader, id);
      if (status === 200) recoverRecordsByUser();
    } catch (error) {
      dispatch(
        alertDetail({
          severity: "error",
          message: "Error removing record, please try later",
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalRecords) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <HeadCellRecord
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {recordList
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      // tabIndex={-1}
                      key={row.id}
                    >
                      <TableCell component="th" scope="row">
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
                          onClick={() => removeRecord(row.id)}
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

          {!recordList.length && (
            <Typography variant="h6" component="h4" style={{ marginTop: 50 }}>
              There aren't records yet, please use the calculator
            </Typography>
          )}
        </TableContainer>

        {totalRecords && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalRecords}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  );
};

export default EnhancedTable;
