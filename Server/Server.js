// git remote add origin https://github.com/JagtapKishor104/Node-Server.git

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
    if (data.length > 0) {
        res.send({
            msg: "all user data",
            response: 200,
            result: data
        });
    } else {
        res.send({
            msg: "No Data Found",
            response: 404
        });
    }
});

app.get('/', (req, res) => {
    res
      .status(200)
      .send('Hello server is running')
      .end();
  });
// get data by id
app.get('/employee/:id', async (req, res) => {
    console.log('employee id', req.params.id);
    if (req.params.id) {
        const chkid = mongoose.isValidObjectId(req.params.id);
        if (chkid === true) {
            const employee_id_data = await EmployeeModel.findById({ _id: req.params.id });
            if (employee_id_data == null) {
                res.send({
                    msg: 'single data not data',
                    response: 404,
                    // result: employee_id_data
                })
            }
            else {
                res.send({
                    msg: "employee single data ",
                    response: 200,
                    result: employee_id_data
                });
            }
        }
        else {
            res.send({
                msg: "invalid user id"
            })
        }
    }
    else {
        res.send({
            msg: "employee id Not Generated"
        })
    }
});


// post data to Mongodb Database
app.post('/employee', async (req, res) => {
    console.log(req.body, 'employee postdata');
    const chkdataexit = await EmployeeModel.findOne({ $or: [{ uemail: req.body.email }, { umobile: req.body.mobile }] });
    if (chkdataexit) {
        if (chkdataexit.uemail === req.body.email && chkdataexit.umobile === req.body.mobile) {
            res.send({
                msg: "Mobile number and Email already exists"
            })
        } else
            if (chkdataexit.uemail === req.body.email) {
                res.send({
                    msg: "email id already exits"
                });
            }

            else
                if (chkdataexit.umobile === req.body.mobile) {
                    res.send({
                        msg: "mobile number already exits"
                    });
                }


    }
    else {
        // save db 
        const data = new EmployeeModel(
            {
                ufname: req.body.fname,
                ulname: req.body.lname,
                uemail: req.body.email,
                umobile: req.body.mobile,
                usalary: req.body.salary
            }
        );
        data.save((err, result) => {
            if (err) {
                console.log('create db failed', err);
            }
            else {
                res.send({
                    msg: 'employee data created',
                    data: result
                });
            }
        });
    }
});

// delete single data by using _id
app.delete('/employee/:id', async (req, res) => {

    console.log('remove employee', req.params.id);

    const chkvalidid = mongoose.isValidObjectId(req.params.id);
    if (chkvalidid === true) {
        const iddata = await EmployeeModel.deleteOne({ _id: req.params.id });
        if (iddata.deletedCount === 1) {
            res.send({
                msg: "employee removed",
                response: 200
            });
        }


        else {
            res.send({
                msg: "employee not found",
                response: 404,
            });
        }

    } else {
        res.send({
            msg: "invalid id please enter valid id"
        });
    }


});

// 
// update data using _id
app.put('/employee/:id', async (req, res) => {
    console.log(req.params.id)
    const updatedata = await EmployeeModel.updateOne({ _id: req.params.id }, {
        $set:
        {
            uemail: req.body.email,
            ufname: req.body.fname,
            ulname: req.body.lname,
            umobile: req.body.mobile,
            usalary: req.body.salary
        }
    });

    if (updatedata.modifiedCount===1) {
        res.send({
            msg: "data updated",
            updatedata:updatedata.modifiedCount
            });
    }
    else
    {
        res.send({
            msg:"Value remain Same"
        })
    }

});

// server Address
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server running ... ${PORT}`);
});
app.set("port",PORT)
