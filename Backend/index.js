const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;
//mongodb connection

console.log(process.env.MONGODB_URL);
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Database"))
  .catch((err) => console.log(err));

//Schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmpassword: String,
  image: String,
});

const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("server is ruuning");
  const { email } = req.body;
  userModel.findOne({ email: email }, (err, result) => {
    // console.log(result);
    console.log(err);
    if (result) {
      res.send({ message: "Email id is already register", alert: false });
    } else {
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "Successfully sign up", alert: true });
    }
  });
});

app.post("/signup", async (req, res) => {
  // console.log("first");
  // console.log(req.body);
  const { email } = req.body;
  let query = { email: email };
  let result = await userModel.findOne(query);
  if (result) {
    res.status(401).json(err)
  } else {
    const data = await userModel.create(req.body);
res.status(201).json(data)
  }
});

//api login
app.post("/login", async(req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  let query = { email: email, password: password };
  let result = await userModel.findOne(query);
    if (result) {
      // console.log(result);
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.status(200).json(dataSend)
    } else {
      res.status(401).json("Email is not available, please sign up")
    }
  }
);

//product section

const SchemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product", SchemaProduct);

//save product in data
//api
app.post("/uploadProduct", async (req, res) => {
  // console.log(req.body)
  const data = await productModel.create(req.body);
  res.status(201).json(data)
});

//
app.get("/product", async (req, res) => {
  const data = await productModel.find({});
  res.send(data);
});

/***Payment with PayStack */
// app.use(cors())
// app.post("/paystack",async(req,res)=>{
  
  

//   const params = JSON.stringify({
//     "email" : req.query,
//     "amount" : "200000"
//   })

//   const options = {
//     hostname: "api.paystack.co",
//     port : 443,
//     path : '/transaction/initialize',
//     method : 'POST',
//     headers : {
//       Authorization: 'Bearer sk_test_2df9e34c499fb3c8a793151aababd63918a7227f',
//       'content-Type': 'application/json'
          
//     }
//   }

//   const reqpaystack = https.request(options, respaystack => {
//     let data = ''

//     respaystack.on('data', (chunk) =>{
//       data += chunk
//     })

//     respaystack.on('end',() =>{
//       res.send(data)
//       console.log(JSON.parse(data))
//     })
//   }).on('error', error => {
//     console.error(error)
//   })

//   req.write(params)
//   res.end()
// });

// app.listen(port , ()=>{
//   //Code....
// })

//server is running
app.listen(PORT, () => console.log("server is running at port : " + PORT));
