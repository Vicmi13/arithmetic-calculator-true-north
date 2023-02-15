import * as React from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "id",
  },
  {
    id: "operation",
    numeric: false,
    disablePadding: false,
    label: "Operation",
  },
  {
    id: "response",
    numeric: false,
    disablePadding: false,
    label: "Operation response",
  },
  {
    id: "cost",
    numeric: true,
    disablePadding: false,
    label: "Cost",
  },
  {
    id: "balance",
    numeric: true,
    disablePadding: false,
    label: "Balance",
  },
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Date",
  },

  {
    id: "delete",
    numeric: false,
    disablePadding: false,
  },
];

const HeadCellRecord = (props) => {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default HeadCellRecord;
