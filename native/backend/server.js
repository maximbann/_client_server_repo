//MAKE SURE YOU HAVE MYSQL2 AS IT USES UPDATED CONNECTION AND NOT OUTDATED AS MYSQL1
const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();
const db = mysql.createConnection({
    host:"34.105.126.58", // This is the main connection point
    // host:"mystic-aileron-456600-s8.us-west1.sql.google.internal", // This is the cloned testing branch
    port:"3306",
    user:"Zach",
    password:"abcd1234",
    database:"homeownerApp",
    // ssl: {
    //     ca: fs.readFileSync('certificates/server-ca.pem'),
    //     cert: fs.readFileSync('certificates/client-cert.pem'),
    //     key: fs.readFileSync('certificates/client-key.pem')
    // }
    
    // waitForConnections: true,
    // connectionLimit: 10
})

const express = require("express");
const cors = require('cors');

const app = express();
//cors needed to use mysql
app.use(cors());

//express needed to use mysql
app.use(express.json());


// Insert sign in data into database
app.post('/Signup', (req, res) =>{

    //havent a clue why order matters here but i think its the array in db.query, i guess
    const sql = "INSERT INTO login (`name`,`password`,`email`) VALUES (?)";
    const vals = [
        req.body["name"],
        req.body["password"],
        req.body["email"]
    ]
    db.query(sql,[vals], (err,data) => {
        if(err){
            return res.json(err);
        }
        console.log("QUERY MADE ----------------------------------")
        return res.json(data);
    })
})

app.get('/GetUID', (req, res) =>{
    const sql = "SELECT uid FROM login WHERE email = ?";

    db.query(sql,[req.body.email], (err, data) => {
        if(err){
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get('/GetHouseholdID', (req, res) =>{
    const sql = "SELECT householdid FROM household_users WHERE uid = ?";

    db.query(sql,[req.body.uid], (err, data) => {
        if(err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

//selection for database to make sure input matches to an existing account
app.post('/Login', (req, res) =>{

    //havent a clue why order matters here but i think its the array in db.query, i guess
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
    
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        
        if(err){
            return res.json(err);
        }
        if(data.length > 0){
            console.log("-------------------------MADE QUERY----------------------------");
            return res.json("Success")
        } else{
            return res.json("Failure")
        }
    })
    
})

app.post('/addTask', (req, res) => {
    console.log("query made +++++++++++++++++++++++++++++++++++++++++");
    const sql = "INSERT INTO tasks (`title`, `location`, `dueDate`, `notes`,`frequency`,`completed`) VALUES (?)";
    
    const vals = [

        req.body["title"],
        req.body["location"],
        req.body["dueDate"],
        req.body["notes"],
        req.body["frequency"],
        req.body["completed"]
    ]
    db.query(sql,[vals],(err,data) => {
        if(err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

// Get for address of a household
app.get('/MyAddress', (req, res) => {

    const sql = "SELECT * FROM household_details WHERE householdid = ?"; //  

    db.query(sql, [req.body.householdid], (err, data) => {
        if(err){
            return res.json(err);
        }
        return res.json(data);
    })
})

// Inserting a household with an address
app.post('/NewHousehold', (req, res) =>{

    //havent a clue why order matters here but i think its the array in db.query, i guess
    const sql = "INSERT INTO household_details (street_addr, apt, city, state, zip) VALUES (?)";
    const vals = [
        req.body["street_addr"],
        req.body["apt"],
        req.body["city"],
        req.body["state"],
        req.body["zip"]
    ]

    db.query(sql,[vals], (err,data) => {
        if(err){
            return res.json(err);
        }
        return res.json(data);
    })
})

app.post('/JoinHousehold', (req, res) =>{

    const sql = "INSERT INTO household_users (uid, householdid) VALUES (?)";
    const vals = [
        req.body["uid"],
        req.body["householdid"]
    ]

    db.query(sql,[vals], (err,data) => {
        if(err){
            return res.json(err);
        }
        return res.json(data);
    })
})

app.post('/AddAppliance', (req, res) =>{
    const sql = "INSERT INTO appliances (room, name, make, model, maintenance_period) VALUES (?)";
    const vals = [
        req.body["room"],
        req.body["name"],
        req.body["make"],
        req.body["model"],
        req.body["maintenance_period"]
    ]

    db.query(sql,[vals], (err,data) => {
        if(err){
            return res.json(err);
        }
        return res.json(data);
    })
})

app.listen(8080, ()=> {
    console.log("listening");
})


