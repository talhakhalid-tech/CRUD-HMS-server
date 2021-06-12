const express = require("express");
const mysql = require("../db/mysql");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const sql = `SELECT * FROM patient`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ patients: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { pName, pDisease, pBedNo, dId, aId, wId } = req.body;
    const sql = `INSERT INTO patient (P_Name, P_Disease, P_BedNo, D_id, A_id, W_id)
      VALUES ('${pName}', '${pDisease}', ${pBedNo},${dId},${aId},${wId});`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Added Patient Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const sqlDelete = `DELETE FROM patient_nurse WHERE P_id = ${req.query.pId};`;
    mysql.query(sqlDelete, function (error, results) {
      if (error) throw error;
      const sql = `DELETE FROM patient WHERE P_id = ${req.query.pId};`;
      mysql.query(sql, function (error, results) {
        if (error) throw error;
        res.status(202).json({ message: "Deleted Patient Data Successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.patch("/update", async (req, res) => {
  try {
    const { pId, pName, pDisease, pBedNo, dId, aId, wId } = req.body;
    const sql = `UPDATE patient
    SET P_Name = '${pName}', P_Disease = '${pDisease}', P_BedNo='${pBedNo}', D_id= ${dId},A_id=${aId},W_id=${wId}
    WHERE P_id = ${pId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Updated Ward Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/relatedNurses", async (req, res) => {
  try {
    const sql = `SELECT patient_nurse.P_id,nurse.N_id,nurse.N_Name,nurse.N_Position,nurse.N_CellNo,nurse.N_Shift
    FROM patient_nurse
    RIGHT JOIN nurse
    ON patient_nurse.N_id = nurse.N_id
    WHERE patient_nurse.P_id = ${req.query.PId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ nurses: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
