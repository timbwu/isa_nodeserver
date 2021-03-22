const express = require('express');
const mysql = require('mysql');
const path = require('path');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '123456',
    database: 'iass'
});

con.connect(err => {
    if (err) throw err;
    console.log("Connected to DB!");
});

const app = express();

app.use(express.static(path.join(__dirname, 'js')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/admin", (req, res) => {
    // Create table
    const createTableQuery = "CREATE TABLE IF NOT EXISTS quotes (id int AUTO_INCREMENT PRIMARY KEY, author varchar(255), quote varchar(255))";
    con.query(createTableQuery, (err, res) => {
        if (err) throw err;
    });
    res.sendFile(path.join(__dirname + '/frontend/admin.html'));
});

app.get("/admin/data", (req, res) => {
    let dataQuery = "SELECT * FROM quotes";
    con.query(dataQuery, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post("/admin/add/:qid", (req, res) => {
    let author = req.body.author;
    let quote = req.body.quote;
    let addQuery = "INSERT INTO quotes(author, quote) VALUES ('"+author+"', '"+quote+"')";
    con.query(addQuery, (err, res) => {
        if (err) throw err;
        console.log("Added");
    });
});

app.post("/admin/save", (req, res) => {
    let dropSql = "DROP TABLE quotes"
    con.query(dropSql, (err, res) => {
        if (err) throw err;
    });

    let createSql = "CREATE TABLE IF NOT EXISTS quotes (id int AUTO_INCREMENT PRIMARY KEY, author varchar(255), quote varchar(255))";
    con.query(createSql, (err, res) => {
        if (err) throw err;
    });
    
    req.body.forEach(element => {
        let author = element.author;
        let quote = element.quote;
        let addQuery = "INSERT INTO quotes(author, quote) VALUES ('"+author+"', '"+quote+"')";
        con.query(addQuery, (err, res) => {
            if (err) throw err;
        });
    });
});

app.put("/admin/update/:qid", (req, res) => {
    let id = req.body.id;
    let author = req.body.author;
    let quote = req.body.quote;
    let updateQuery = "UPDATE quotes SET author = '" + author + "', quote = '" + quote + "' WHERE id = " + id;
    con.query(updateQuery, (err, res) => {
        if (err) throw err;
        console.log("Updated");
    });
});

app.delete("/admin/delete/:qid", (req, res) => {
    let id = req.body.id;
    let deleteQuery = "DELETE FROM quotes WHERE id = " + id;
    con.query(deleteQuery, (err, res) => {
        if (err) throw err;
        console.log("Deleted");
    });
});

app.get("/reader/all", (req, res) => {
    let sql = "SELECT * FROM quotes";
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/reader/latest", (req, res) => {
    let sql = "SELECT * FROM quotes ORDER BY id DESC LIMIT 1";
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.get("/reader", (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/reader.html'));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});