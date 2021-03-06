const express = require("express");
const mysql = require("../db/mysql");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const sql = `SELECT * FROM ward`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ wards: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/single", async (req, res) => {
  try {
    const sql = `SELECT * FROM ward 
    WHERE W_id = ${req.query.wId}`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ ward: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { wType, wFloor, wTotalBeds, wReservedBeds } = req.body;
    const sql = `INSERT INTO ward (W_Type, W_Floor, W_TotalBeds, W_ReservedBeds)
      VALUES ('${wType}', '${wFloor}', ${wTotalBeds},${wReservedBeds});`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Added Ward Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const sql = `DELETE FROM ward WHERE W_id = ${req.query.wId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(202).json({ message: "Deleted Ward Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.patch("/update", async (req, res) => {
  try {
    const { wId, wType, wFloor, wTotalBeds, wReservedBeds } = req.body;
    const sql = `UPDATE ward
    SET W_Type = '${wType}', W_Floor = '${wFloor}', W_TotalBeds='${wTotalBeds}', W_ReservedBeds= '${wReservedBeds}'
    WHERE W_id = ${wId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Updated Ward Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/relatedPatients", async (req, res) => {
  try {
    const sql = `SELECT ward.W_id,patient.P_id,patient.P_Name,patient.P_Disease,patient.P_BedNo
    FROM ward
    RIGHT JOIN patient
    ON ward.W_id = patient.W_id
    WHERE patient.W_id = ${req.query.WId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ patients: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/relatedNurses", async (req, res) => {
  try {
    const sql = `SELECT ward.W_id,nurse.N_id,nurse.N_Name,nurse.N_Position,nurse.N_CellNo,nurse.N_Shift
    FROM ward
    RIGHT JOIN nurse
    ON ward.W_id = nurse.W_id
    WHERE nurse.W_id = ${req.query.WId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ nurses: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
