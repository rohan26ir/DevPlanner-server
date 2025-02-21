require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8c67l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    // console.log("Connected to MongoDB");

    const database = client.db('DevPlanner');
    const UserCollection = database.collection('Users');
    const taskCollection = database.collection('Tasks');

    // Post User
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await UserCollection.insertOne(newUser);
      res.json(result);
    });

    
    // Add Task
    app.post('/tasks', async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.json(result);
    });
    
    // Get Tasks
    app.get('/tasks', async (req, res) => {
      const tasks = await taskCollection.find().toArray();
      res.json(tasks);
    });

    // Update Task
    app.put('/tasks/:id', async (req, res) => {
      const { id } = req.params;
      const updatedTask = req.body;
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedTask }
      );
      res.json(result);
    });

    // Delete Task
    app.delete('/tasks/:id', async (req, res) => {
      const { id } = req.params;
      const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });


    
    
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

// Start Server
app.listen(port, () => {
  console.log(`DevPlanner is running on port: ${port}`);
});
