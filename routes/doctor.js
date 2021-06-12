const express = require("express");
const mysql = require("../db/mysql");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const sql = `SELECT * FROM doctor`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ doctors: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/single", async (req, res) => {
  try {
    const sql = `SELECT * FROM doctor 
    WHERE D_id = ${req.query.dId}`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ doctor: results });
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
      res.status(201).json({
        message: "Added Doctor Data Successfully",
        D_id: results.insertId,
      });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const sqlDelete = `DELETE FROM doctor_nurse WHERE D_id = ${req.query.dId};`;
    mysql.query(sqlDelete, function (error, results) {
      if (error) throw error;
      const sql = `DELETE FROM doctor WHERE D_id = ${req.query.dId};`;
      mysql.query(sql, function (error, results) {
        if (error) throw error;
        res.status(202).json({ message: "Deleted Doctor Data Successfully" });
      });
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

router.get("/relatedNurses", async (req, res) => {
  try {
    const sql = `SELECT doctor_nurse.D_id,nurse.N_id,nurse.N_Name,nurse.N_Position,nurse.N_CellNo,nurse.N_Shift
    FROM doctor_nurse
    RIGHT JOIN nurse
    ON doctor_nurse.N_id = nurse.N_id
    WHERE doctor_nurse.D_id = ${req.query.dId};`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(200).json({ nurses: results });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/setRelatedNurses", async (req, res) => {
  try {
    const sqlInner = req.body.N_id.map(
      (id) => `(${req.body.D_id}, ${id})`
    ).join(",");
    const sql = `INSERT INTO doctor_nurse(D_id,N_id)
    VALUES ${sqlInner}`;
    mysql.query(sql, function (error, results) {
      if (error) throw error;
      res.status(201).json({ message: "Added Nurses Id's Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.patch("/updateRelatedNurses", async (req, res) => {
  try {
    const sqlDelete = `DELETE FROM doctor_nurse WHERE D_id = ${req.body.D_id};`;
    mysql.query(sqlDelete, function (error, results) {
      if (error) throw error;
      if (req.body.N_id.length > 0) {
        const sqlInner = req.body.N_id.map(
          (id) => `(${req.body.D_id}, ${id})`
        ).join(",");
        const sql = `INSERT INTO doctor_nurse(D_id,N_id)
      VALUES ${sqlInner}`;
        mysql.query(sql, function (error, results) {
          if (error) throw error;
          res.status(201).json({ message: "Updated Nurses Id's Successfully" });
        });
      } else {
        res.status(201).json({ message: "Updated Nurses Id's Successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
