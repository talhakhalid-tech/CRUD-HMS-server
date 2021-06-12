const express = require("express");
const mysql = require("../db/mysql");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const sql = `SELECT * FROM nurse`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ nurses: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { nName, nPosition, nCellNo, nShift, wId } = req.body;
    const sql = `INSERT INTO nurse (N_Name, N_Position, N_CellNo, N_Shift,W_id)
      VALUES ('${nName}', '${nPosition}', '${nCellNo}','${nShift}',${wId});`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({
        message: "Added Nurse Data Successfully",
        N_id: results.insertId,
      });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/relatedDoctors", async (req, res) => {
  try {
    const sql = `SELECT doctor_nurse.N_id,doctor.D_id,doctor.D_Name,doctor.D_Specialization,doctor.D_CellNo,doctor.D_Shift
    FROM doctor_nurse
    RIGHT JOIN doctor
    ON doctor_nurse.D_id = doctor.D_id
    WHERE doctor_nurse.N_id = ${req.query.NId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ doctors: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/relatedPatients", async (req, res) => {
  try {
    const sql = `SELECT patient_nurse.N_id,patient.P_id,patient.P_Name,patient.P_Disease,patient.P_BedNo
    FROM patient_nurse
    RIGHT JOIN patient
    ON patient_nurse.P_id = patient.P_id
    WHERE patient_nurse.N_id = ${req.query.NId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ patients: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/setRelatedPatients", async (req, res) => {
  try {
    const sqlInner = req.body.P_id.map(
      (id) => `(${id}, ${req.body.N_id})`
    ).join(",");
    const sql = `INSERT INTO patient_nurse(P_id,N_id)
    VALUES ${sqlInner}`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Added Patients Id's Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const sqlDelete1 = `DELETE FROM patient_nurse WHERE N_id = ${req.query.nId};`;
    mysql.query(sqlDelete1, function (error, results) {
      if (error) throw error;
      const sqlDelete2 = `DELETE FROM doctor_nurse WHERE N_id = ${req.query.nId};`;
      mysql.query(sqlDelete2, function (error, results) {
        if (error) throw error;
        const sql = `DELETE FROM nurse WHERE N_id = ${req.query.nId};`;
        mysql.query(sql, function (error, results) {
          if (error) throw error;
          res.status(202).json({ message: "Deleted Nurse Data Successfully" });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.patch("/update", async (req, res) => {
  try {
    const { nId, nName, nPosition, nCellNo, nShift, wId } = req.body;
    const sql = `UPDATE nurse
    SET N_Name = '${nName}', N_Position = '${nPosition}', N_CellNo='${nCellNo}', N_Shift= '${nShift}',W_id=${wId}
    WHERE N_id = ${nId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Updated Nurse Data Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.patch("/updateRelatedPatients", async (req, res) => {
  try {
    const sqlDelete = `DELETE FROM patient_nurse WHERE N_id = ${req.body.N_id};`;
    mysql.query(sqlDelete, function (error, results) {
      if (error) throw error;
      if (req.body.P_id.length > 0) {
        const sqlInner = req.body.P_id.map(
          (id) => `(${id}, ${req.body.N_id})`
        ).join(",");
        const sql = `INSERT INTO patient_nurse(P_id,N_id)
      VALUES ${sqlInner}`;
        mysql.query(sql, function (error, results) {
          if (error) throw error;
          res
            .status(201)
            .json({ message: "Updated Patients Id's Successfully" });
        });
      } else {
        res.status(201).json({ message: "Updated Patient Id's Successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
