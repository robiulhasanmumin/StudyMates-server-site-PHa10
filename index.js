const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://studyMates:cmbpKoBwGcpgtBrU@cluster0.5tck6.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("study_mate")
    const partnersCollection = db.collection("partner")
    const connectionCollection = db.collection("connection")


    app.post("/partner", async(req,res)=>{
      const newPartner = req.body
      const result = await partnersCollection.insertOne(newPartner)
      res.send(result)
    })

    app.get("/partner", async (req,res)=>{
      const result = await partnersCollection.find().sort({rating : -1}).toArray();
      res.send(result)
    })

    

    app.get("/connection",async(req,res)=>{
      const result = await connectionCollection.find().toArray()
      res.send(result)
    })

    app.get("/connection/:email/:partnerId",async(req,res)=>{
       const {email,partnerId} = req.params
       const exist = await connectionCollection.findOne({email,partnerId })
       res.send({exist : !!exist})
    })

    app.post("/connection", async (req,res)=>{
      const newConnection = req.body
      const result = await connectionCollection.insertOne(newConnection)
      res.send(result)

    })

    app.delete("/connection/:id", async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await connectionCollection.deleteOne(query)
      res.send(result)
    })

    app.put("/connection/:id", async(req,res)=>{
      try{
        const id = req.params.id
        const update = req.body
        const query = {_id: new ObjectId(id)} 
        const updateConnection = {
          $set : update
        }
        const result = await connectionCollection.updateOne(query, updateConnection)
        res.send(result)
      }
      catch{
        res.status(401).send({error:true, message:"Update Failed"})
      }

    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);



app.get("/",(req,res)=>{
  res.send("Hello World")
})

app.listen(port,()=>{
  console.log("Our Server is running port : ", port);
})