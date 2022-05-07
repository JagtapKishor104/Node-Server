require('dotenv').config();

const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const EmployeeModel = require('./model/employee');
const app = express();
app.use(cors());
app.use(bodyparser.json());

// Database Connnection 

mongoose.connect(process.env.mongodburl, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('db connection failed...', err);
    }
    else {
        console.log('db connection success...');
    }
});

// get data from server
app.get('/employee', async (req, res) => {
    console.log('employee getdata');
    const data = await EmployeeModel.find();
    if (data.length>0) {
        res.send({
            msg: "all user data",
            response:200,
            result: data
        });
    } else {
        res.send({
            msg: "No Data Found",
            response:404
        });
    }
});

// server Address
const PORT = process.env.PORT | 3000;
app.listen(PORT, () => {
    console.log(`server running ... ${PORT}`);
});
