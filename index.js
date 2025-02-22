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

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    console.log("Connected to MongoDB");

    const database = client.db("DevPlanner");
    const userCollection = database.collection("Users");
    const taskCollection = database.collection("Tasks");

    // Add a User
    app.post("/users", async (req, res) => {
      try {
        const { name, email, photoUrl } = req.body;
        if (!name || !email) {
          return res.status(400).json({ message: "Name and Email are required" });
        }

        const existingUser = await userCollection.findOne({ email });

        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        const result = await userCollection.insertOne({ name, email, photoUrl });
        res.status(201).json(result);
      } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // Fetch All Users
    app.get("/users", async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // Add a Task
    app.post("/tasks", async (req, res) => {
      try {
        const { title, description, category, userEmail } = req.body;
        if (!userEmail || !title) {
          return res.status(400).json({ message: "User email and task title are required" });
        }

        const newTask = { title, description, category, userEmail };
        const result = await taskCollection.insertOne(newTask);
        res.status(201).json(result);
      } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // Fetch Tasks by User
    app.get("/tasks", async (req, res) => {
      try {
        const { userEmail } = req.query;
        if (!userEmail) {
          return res.status(400).json({ message: "User email is required" });
        }

        const tasks = await taskCollection.find({ userEmail }).toArray();
        res.status(200).json(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // Update Task
    app.put("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedTask = req.body;
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedTask }
        );
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // Delete Task
    app.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // Default Route
    app.get("/", (req, res) => {
      res.send("DevPlanner server is running");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

// Default Route
app.get('/', (req, res) => {
  res.send('server is running');
});

// Start Server
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
