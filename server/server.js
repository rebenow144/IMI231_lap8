const http = require('http');
const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

// สร้างการเชื่อมต่อไปยัง TiDB Cloud **โดยเพิ่ม SSL**
const connection = mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: '4HKH8pYjbujesX2.root',
    password: "TmSKywgRdHmL7IZV",
    database: 'imi_his_db',
    port: 4000,
    ssl: {
        rejectUnauthorized: true // หรือ false ถ้าคุณไม่มี CA certificate
    }
});

// ตรวจสอบว่าการเชื่อมต่อทำงานได้หรือไม่
connection.connect(err => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err);
        return;
    }
    console.log('✅ Connected to MySQL (TiDB Cloud)');
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
            {"api_name":"/deleteDoctor/:id","method":"delete"},
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

app.delete("/deleteDoctor/:id", (req, res) => {
  const doctor_id = req.params.id;
  
  if (!doctor_id) {
      return res.status(400).json({ error: "กรุณาระบุ ID ของแพทย์" });
  }

  const sql = "DELETE FROM Doctor WHERE doctor_id = ?";
  connection.query(sql, [doctor_id], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: "ไม่พบข้อมูลแพทย์" });
      }
      
      res.json({ 
          message: "ลบข้อมูลแพทย์สำเร็จ", 
          affectedRows: result.affectedRows 
      });
  });
});







