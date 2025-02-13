const http = require('http');
const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors')
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const port = 3000;

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:"1980",
    database: 'imi_his_db',
    port: 3307
  });


app.use(cors())
app.use(express.json())
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
    res.json({
        "Name":"project lab 4",
        "Author":"Charoenporn Bouyam",
        "APIs":[
            {"api_name":"/getDoctors/","method":"get"},
            {"api_name":"/getDoctor/:id","method":"get"},
            {"api_name":"/addDoctor/","method":"post"},
            {"api_name":"/editDoctor/","method":"put"},
            {"api_name":"/editDoctor/","method":"delete"},
        ]
    });
});

app.get('/getDoctors/', (req, res) => {
    let sql = 'SELECT * FROM doctor';
    connection.query(sql, function(err, results, fields) {
          res.json(results);
        }
      );
});

app.get('/getdoctor/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT * FROM doctor WHERE doctor_id = ?';
    connection.query(sql,[id], function(err, results, fields) {
          res.json(results);
        }
      );
});

app.get('/getpatients/', (req, res) => {
    let sql = 'SELECT * FROM patient';
    connection.query(sql, function(err, results, fields) {
          res.json(results);
        }
      );
});

app.get('/getpatient/:id', (req, res) => {
    let sql = 'SELECT * FROM patient';
    connection.query(sql, function(err, results, fields) {
          res.json(results);
        }
      );
});

app.get('/getemrs/', (req, res) => {
    let sql = 'SELECT * FROM Medical_Record';
    connection.query(sql, function(err, results, fields) {
          res.json(results);
        }
      );
});

app.get('/getemr/:id', (req, res) => {
    let sql = 'SELECT * FROM Medical_Record';
    connection.query(sql, function(err, results, fields) {
          res.json(results);
        }
      );
});

// app.post('/addDoctor',urlencodedParser, (req, res) => {
//   console.log(req.body);
//     let sql = 'INSERT INTO doctor(name, telephone, status) VALUES (?,?,?)';
//     let values = [req.body.name,req.body.telephone,req.body.status];
//     let message = "Cannot Insert";
//     connection.query(sql,values, function(err, results, fields) {
//       if(results) { message = "Inserted";}
//           res.json({error:false,data:results,msg:message});
//         }
//       );
// });

app.post("/addDoctor", (req, res) => {
  const { name, telephone, status } = req.body;
  const sql = "INSERT INTO Doctor (name, telephone, status) VALUES (?, ?, ?)";
  connection.query(sql, [name, telephone, status], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.status(201).json({ 
              message: "เพิ่มแพทย์สำเร็จ", 
              id: result.insertId 
          });
      }
  });
});

app.put("/editDoctor", (req, res) => {
  const { doctor_ID, name, telephone, status } = req.body;
  const sql = "UPDATE Doctor SET name = ?, telephone = ?, status = ? WHERE doctor_ID = ?";
  connection.query(sql, [name, telephone, status, doctor_ID], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.json({ 
              message: "แก้ไขข้อมูลแพทย์สำเร็จ", 
              changedRows: result.changedRows 
          });
      }
  });
});

app.delete("/editDoctor/:doctor_ID", (req, res) => {
  console.log(req.params); // ตรวจสอบค่าที่ได้รับจาก URL
  const { doctor_ID } = req.params;

  if (!doctor_ID) {
      return res.status(400).json({ error: "doctor_ID is required" });
  }

  const sql = "UPDATE Doctor SET status = 1 WHERE doctor_ID = ?";
  connection.query(sql, [doctor_ID], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ 
          message: "ลบแพทย์สำเร็จ", 
          affectedRows: result.affectedRows 
      });
  });
});





