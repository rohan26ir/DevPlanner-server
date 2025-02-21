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

// Root Route - Check if API is Running
app.get("/", (req, res) => {
  res.send("DevPlanner API is running...");
});

async function run() {
  try {
    await client.connect();

    const database = client.db('DevPlanner');
    const UserCollection = database.collection('Users');
    const taskCollection = database.collection('Tasks');

    
    // Post User (Store user details on first login)
  
    app.post('/users', async (req, res) => {
      try {
        const { uid, name, email, photoURL } = req.body;

        // Check if user exists
        const existingUser = await UserCollection.findOne({ uid });

        if (existingUser) {
          return res.status(200).json({ message: "User already exists" });
        }

        // Insert new user
        const newUser = { uid, name, email, photoURL };
        const result = await UserCollection.insertOne(newUser);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Add Task
    app.post('/tasks', async (req, res) => {
      try {
        const newTask = req.body;
        const result = await taskCollection.insertOne(newTask);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get Tasks
    app.get('/tasks', async (req, res) => {
      try {
        const tasks = await taskCollection.find().toArray();
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Update Task
    app.put('/tasks/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const updatedTask = req.body;
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedTask }
        );
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Delete Task
    app.delete('/tasks/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

// Start Server
app.listen(port, () => {
  console.log(`DevPlanner is running on port: ${port}`);
});
