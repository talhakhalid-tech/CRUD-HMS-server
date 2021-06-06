const express = require("express");
const mysql = require("../db/mysql");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const sql = `SELECT * FROM ward`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      console.log(results);
      res.status(201).json({ wards: results });
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

module.exports = router;
