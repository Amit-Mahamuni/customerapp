const express = require("express");
const bodyParser = require("body-parser");
const path = require("path")
const cors = require('cors');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

mongoose.connect('mongodb://localhost:27017/custdb', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.static('public'));
app.use(fileUpload());

var corsOptions = {
    methods: "GET, POST, PATCH, PUT, DELETE, OPTIONS"
}


app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true, keepExtensions: true, uploadDir: __dirname + '/public/uploads' }));


app.listen(3000, function () {
    console.log("sever started on port 3000");
});


const CustomerSch = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        occupation: String,
        dob: Date,
        status: String,
        bio: String,
        profilePicture: String
    }
);

const Customer = mongoose.model("Customer", CustomerSch);

const customer = new Customer(
    {
        firstName: "Amit",
        lastName: "Mahamuni",
        occupation: "employed",
        dob: 1999 - 06 - 28,
        status: "Active",
        bio: "I am employed",
        profilePicture: "am.jpg"
    }
);

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//     );
//     next();
// });

app.get("/", function (req, res) {

    // customer.save().then(() => console.log("done"));

    Customer.find(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result)
        }
    });

});

app.get("/:cust_id", function (req, res) {

    Customer.findOne({ _id: req.params.cust_id }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            res.send(result)
        }
    });

});

app.delete("/:cust_id", function (req, res) {

    // console.log(req.params.cust_id);

    Customer.deleteOne({ _id: req.params.cust_id }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result)
        }
    });

});


app.post("/", function (req, res) {

    let newfilename;
    if (req.files != null || req.files != undefined) {
        const file = req.files.ProImg;
        newfilename = "ProImg_" + Date.now() + path.extname(file.name);

        file.mv(`${__dirname}/public/uploads/${newfilename}`, err => {
            if (err)
                console.error(err);
        });
    } else {
        newfilename = "null"
    }


    const customer = new Customer(
        {
            firstName: req.body.Firstname,
            lastName: req.body.Lastname,
            occupation: req.body.Occupation,
            dob: req.body.Dob,
            status: req.body.Status,
            bio: req.body.Bio,
            profilePicture: newfilename
        }
    );

    customer.save().then(() => {
        res.send({ status: true });
    });

});


app.post("/update/:id", function (req, res) {

    // console.log(req.body);   
    let newfilename;
    if (req.files != null || req.files != undefined) {
        const file = req.files.ProImg;
        newfilename = "ProImg_" + Date.now() + path.extname(file.name);

        file.mv(`${__dirname}/public/uploads/${newfilename}`, err => {
            if (err)
                console.error(err);
        });
    } else {
        newfilename = "null"
    }

    const customer = {
        firstName: req.body.Firstname,
        lastName: req.body.Lastname,
        occupation: req.body.Occupation,
        dob: req.body.Dob,
        status: req.body.Status,
        bio: req.body.Bio,
        profilePicture: newfilename
    }

    console.log(clean(customer));

    Customer.updateOne({ _id: req.params.id }, { $set: clean(customer) }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send({ status: true })
        }
    });


});

function clean(obj) {
    for (var propName in obj) {
        if (obj[propName] === "null" || obj[propName] === "undefined") {
            delete obj[propName];
        }
    }
    return obj
}