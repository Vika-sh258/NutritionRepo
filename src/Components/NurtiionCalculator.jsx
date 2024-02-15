import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import csvtojson from "csvtojson";
import DisplayTable from "./DisplayTable";
import csvFile from "../Components/csvFile.csv";
import DeleteIcon from "@mui/icons-material/Delete";

import IconButton from "@mui/material/IconButton";

const NutritionCalculator = () => {
  const headerCellStyle = {
    fontWeight: "bold",
    backgroundColor: "#345", 
    color: "#fff", 
    position: 'sticky',
    top: 0
  };
  const [jsonData, setJsonData] = useState([]);
  const [statusValidForm, setStatusVAlidForm] = useState([]);
  const [rows, setRows] = useState([
    {
      serialNo: 1,
      Ingredient: "",
      quantity: 0,
      Energy: 0,
      Protein: 0,
      TotalFat: 0,
      MonounsaturatedFat: 0,
      PolyunsaturatedFat: 0,
      SaturatedFat: 0,
      TransFat: 0,
      Carbohydrate: 0,
      TotalSugar: 0,
      AddedSugar: 0,
    },
  ]);
  const [expanded, setExpanded] = useState(false);
  const addedRows = (field) => {
    let total = 0;
    rows.map((row) => {
      total = total + parseFloat(row[field]);
    });
    return total;
  };
  
  const [recipeName, setRecipeName] = useState("");
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        serialNo: rows.length + 1,
        Ingredient: "",
        quantity: 0,
        Energy: 0,
        Protein: 0,
        TotalFat: 0,
        MonounsaturatedFat: 0,
        PolyunsaturatedFat: 0,
        SaturatedFat: 0,
        TransFat: 0,
        Carbohydrate: 0,
        TotalSugar: 0,
        AddedSugar: 0,
      },
    ]);
  };

  const handleSubmit = () => {
    console.log(rows);
    if(recipeName===""){
      window.alert('Recipe Name Not Written!');
      return;
    }
    if(rows.filter((object)=>object.Ingredient==="").length>0){
      window.alert(`Row is incomplete, Ingredient missing`);
      return;

    }
    if(rows.filter((object)=>object.quantity==="").length>0){
      window.alert('Row is incomplete, Ingredient missing!');
      return;

    }
    if(rows.filter((object)=>object.quantity===0).length>0){
      window.alert('Row is incomplete, Ingredient missing!');
      return;

    }
    console.log("Form submitted");
  };

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(csvFile);
      const csvString = await response.text();
      const jsonArray = await csvtojson().fromString(csvString);
      setJsonData(jsonArray);
      setOptions(jsonArray.map((obj) => obj.Product));
    }
    fetchData();
  }, []);

  const handleDeleteRowClick = (serialNo) => {
    try {
      const updatedRows = rows.filter((row, i) => row.serialNo !== serialNo);
      setRows(
        updatedRows.map((row) => {
          return {
            ...row,
            serialNo: row.serialNo > serialNo ? row.serialNo - 1 : row.serialNo,
          };
        })
      );
      console.log(rows);
    } catch (error) {
      console.error("Error occured on Delete Row Click", error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (
      updatedRows[index]["Ingredient"] !== "" &&
      updatedRows[index]["quantity"] !== 0
    ) {
      let rowData = jsonData.find(
        (object) => object.Product === updatedRows[index]["Ingredient"]
      );
      updatedRows[index] = {
        ...updatedRows[index],
        Energy: (
          updatedRows[index]["quantity"] *
          0.01 *
          rowData["Energy (kcal)"]
        ).toFixed(2),
        Protein: (
          updatedRows[index]["quantity"] *
          0.01 *
          rowData["Protein (g)"]
        ).toFixed(2),
        TotalFat: (
          updatedRows[index]["quantity"] *
          0.01 *
          rowData["Total Fat (g)"]
        ).toFixed(2),
        MonounsaturatedFat: (
          updatedRows[index]["quantity"] *
          0.01 *
          rowData["Monounsaturated fats (g)"]
        ).toFixed(2),
        PolyunsaturatedFat: (
          updatedRows[index]["quantity"] *
          0.01 *
          rowData["Polyunsaturated fats (g)"]
        ).toFixed(2),
        SaturatedFat: (
          updatedRows[index]["quantity"] *
          0.01 *
          rowData["Saturated fats (g)"]
        ).toFixed(2),
        TransFat: (
          updatedRows[index]["quantity"] *
          0.01 *
          rowData["Trans fats (g)"]
        ).toFixed(2),
        Carbohydrate: (
          updatedRows[index]["quantity"] *
          0.01 *
          rowData["Carbohydrate (g)"]
        ).toFixed(2),
        TotalSugar: (
          updatedRows[index]["quantity"] *
          0.01 *
          rowData["Total sugar (g)"]
        ).toFixed(2),
        AddedSugar: (
          updatedRows[index]["quantity"] *
          0.01 *
          rowData["Added sugar (g)"]
        ).toFixed(2),
      };
      console.log(updatedRows, rowData, "update rows");
    }
    setRows(updatedRows);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Nutrition Calculator
      </Typography>
      <Typography>
        <TextField
          fullWidth
          name="alias"
          label="Recipe Name"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          size="small"
          required
          style={{
            marginTop: "10px", // Add space above the TextField
            backgroundColor: "#f5f5f5", // Light gray background color
            borderRadius: "5px", // Rounded corners
            padding: "5px", // Padding inside the TextField
            boxShadow: "0 5px 4px rgba(0, 0, 0, 0.1)", // Shadow for a subtle elevation effect
            // boxSizing: 'border-box', // Ensure padding and border are included in the total width/height
            // border: '1px solid #ccc' // Light gray border
          }}
        />
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell  style={headerCellStyle}>Serial No.</TableCell>
              <TableCell style={{ minWidth: 200 ,...headerCellStyle}}>Ingredient</TableCell>
              <TableCell style={{ maxWidth: 100 ,...headerCellStyle}}>Quantity (G)</TableCell>
              <TableCell  style={headerCellStyle}>Energy (KCal)</TableCell>
              <TableCell  style={headerCellStyle}>Protein (G)</TableCell>
              <TableCell
                onClick={() => setExpanded(!expanded)}
                style={{ cursor: "pointer", textDecoration: "underline", ...headerCellStyle }}
              >
                Total Fat (G) {expanded ? "[-]" : "[+]"}
              </TableCell>
              {expanded && (
                <>
                  <TableCell  style={headerCellStyle}>Monounsaturated Fats (G)</TableCell>
                  <TableCell  style={headerCellStyle}>Polyunsaturated Fats (G)</TableCell>
                  <TableCell  style={headerCellStyle}>Saturated Fats (G)</TableCell>
                  <TableCell  style={headerCellStyle}>Trans Fats (G)</TableCell>
                </>
              )}
              <TableCell style={headerCellStyle}>Total Sugar (G)</TableCell>
              <TableCell style={headerCellStyle}>Carbohydrate (G)</TableCell>
              <TableCell style={headerCellStyle}>Added Sugar (G)</TableCell>
              <TableCell style={headerCellStyle}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Autocomplete
                    value={row.Ingredient}
                    onChange={(e, newValue) =>
                      handleInputChange(index, "Ingredient", newValue)
                    }
                    options={options}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Ingredient"
                        variant="outlined"
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={row.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                  />
                </TableCell>
                {jsonData
                  .filter((object) => object.Product === row.Ingredient)
                  .map((item, index) => (
                    <React.Fragment key={index}>
                      <TableCell>{row.Energy}</TableCell>
                      <TableCell>{row.Protein}</TableCell>
                      <TableCell>{row.TotalFat}</TableCell>
                      {expanded && (
                        <>
                          <TableCell>{row.MonounsaturatedFat}</TableCell>
                          <TableCell>{row.PolyunsaturatedFat}</TableCell>
                          <TableCell>{row.SaturatedFat}</TableCell>
                          <TableCell>{row.TransFat}</TableCell>
                        </>
                      )}
                      <TableCell>{row.Carbohydrate}</TableCell>
                      <TableCell>{row.TotalSugar}</TableCell>
                      <TableCell>{row.AddedSugar}</TableCell>
                    </React.Fragment>
                  ))}
                <TableCell>
                  <IconButton
                    onClick={() => handleDeleteRowClick(row.serialNo)}
                  >
                    <DeleteIcon
                      style={{
                        color: "red",
                      }}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>
                <strong>Total</strong>
              </TableCell>
              <TableCell>
                <strong>All Ingredients</strong>
              </TableCell>
              <TableCell>
                <strong>{addedRows("quantity").toFixed(2)}</strong>
              </TableCell>
              <React.Fragment>
                <TableCell>
                  <strong>{addedRows("Energy").toFixed(2)}</strong>
                </TableCell>
                <TableCell>
                  <strong>{addedRows("Protein").toFixed(2)}</strong>
                </TableCell>
                <TableCell>
                  <strong>{addedRows("TotalFat").toFixed(2)}</strong>
                </TableCell>
                {expanded && (
                  <>
                    <TableCell>
                      <strong>
                        {addedRows("MonounsaturatedFat").toFixed(2)}
                      </strong>
                    </TableCell>
                    <TableCell>
                      <strong>
                        {addedRows("PolyunsaturatedFat").toFixed(2)}
                      </strong>
                    </TableCell>
                    <TableCell>
                      <strong>{addedRows("SaturatedFat").toFixed(2)}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{addedRows("TransFat").toFixed(2)}</strong>
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <strong>{addedRows("Carbohydrate").toFixed(2)}</strong>
                </TableCell>
                <TableCell>
                  <strong>{addedRows("TotalSugar").toFixed(2)}</strong>
                </TableCell>
                <TableCell>
                  <strong>{addedRows("AddedSugar").toFixed(2)}</strong>
                </TableCell>
              </React.Fragment>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Button
        onClick={handleAddRow}
        variant="contained"
        style={{ margin: "20px" }}
      >
        Add Row
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        style={{ margin: "20px" }}
      >
        Submit
      </Button>
    </div>
  );
};

export default NutritionCalculator;
