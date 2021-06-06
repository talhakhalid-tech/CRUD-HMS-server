const express = require("express");
const mysql = require("../db/mysql");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const sql = `SELECT * FROM doctor`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      console.log(results);
      res.status(201).json({ doctors: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { dName, dSpecialization, dCellNo, dShift } = req.body;
    const sql = `INSERT INTO doctor (D_Name, D_Specialization, D_CellNo, D_Shift)
      VALUES ('${dName}', '${dSpecialization}', '${dCellNo}','${dShift}');`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Added Doctor Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const sql = `DELETE FROM doctor WHERE D_id = ${req.query.dId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(202).json({ message: "Deleted Doctor Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.patch("/update", async (req, res) => {
  try {
    const { dId, dName, dSpecialization, dCellNo, dShift } = req.body;
    const sql = `UPDATE doctor
    SET D_Name = '${dName}', D_Specialization = '${dSpecialization}', D_CellNo='${dCellNo}', D_Shift= '${dShift}'
    WHERE D_id = ${dId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Updated Doctor Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
