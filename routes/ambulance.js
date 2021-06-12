const express = require("express");
const mysql = require("../db/mysql");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const sql = `SELECT * FROM ambulance`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ ambulances: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/single", async (req, res) => {
  try {
    const sql = `SELECT * FROM ambulance
    WHERE A_id = ${req.query.aId}`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ ambulance: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { aChasisNo, aEngineNo, aRoute, aModel } = req.body;
    const sql = `INSERT INTO ambulance (A_ChasisNo, A_EngineNo, A_Route, A_Model)
      VALUES ('${aChasisNo}', '${aEngineNo}', '${aRoute}','${aModel}');`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Added Ambulance Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const sql = `DELETE FROM ambulance WHERE A_id = ${req.query.aId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(202).json({ message: "Deleted Ambulance Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.patch("/update", async (req, res) => {
  try {
    const { aId, aChasisNo, aEngineNo, aRoute, aModel } = req.body;
    const sql = `UPDATE ambulance
    SET A_ChasisNo = '${aChasisNo}', A_EngineNo = '${aEngineNo}', A_Route='${aRoute}', A_Model= '${aModel}'
    WHERE A_id = ${aId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Updated Ambulance Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/relatedPatients", async (req, res) => {
  try {
    const sql = `SELECT ambulance.A_id,patient.P_id,patient.P_Name,patient.P_Disease,patient.P_BedNo
    FROM ambulance
    RIGHT JOIN patient
    ON ambulance.A_id = patient.A_id
    WHERE patient.A_id = ${req.query.AId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ patients: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
