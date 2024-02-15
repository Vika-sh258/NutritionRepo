import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { height } from "@mui/system";

const DisplayTable = ({ data }) => {
  const headerCellStyle = {
    fontWeight: "bold",
    backgroundColor: "#333", 
    color: "#fff", 
    position: 'sticky',
    top: 0
  };

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="modal-inner-content" style={{height:"340px"}}>
      <TableContainer component={Paper} style={{height:"340px"}}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <Tooltip title={`${column.toUpperCase()}`} arrow key={column}>
                  <TableCell
                    style={headerCellStyle}
                    key={column}
                  >{`${column.split('_').pop().toUpperCase()}`}</TableCell>
                </Tooltip>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{    overflowY: "auto" }}>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {typeof row[column] === "boolean"
                      ? row[column].toString().charAt(0).toUpperCase() + row[column].toString().slice(1)
                      : row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DisplayTable;
