const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("in a flash!");
});


const { MongoClient } = require('mongodb');
const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g3qco.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
    console.log('connection err',err);
  const serviceCollection = client.db("Flash").collection("service");
  console.log('database connected successfully')

  app.get('/services', (req, res)=> {
    serviceCollection.find()
    .toArray((err, items) => {
        res.send(items);
        console.log('from database', items);
    })
})

app.get('/service/:id', (req,res) => {
    console.log(req.params.id);
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, items) => {
      res.send(items);
      console.log(items);
    })
  })

  app.post("/addservice", (req, res) => {
    const newEvent = req.body;
    console.log("adding new event", newEvent);
    serviceCollection.insertOne(newEvent).then((result) => {
        console.log("inserted count", result.insertedCount)
        res.send(result.insertedCount > 0);
    });
  });


});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });