require('dotenv').config();
<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
=======

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;
>>>>>>> 2f26930 (update commit)

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8c67l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

<<<<<<< HEAD
// Create a MongoClient
=======
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
>>>>>>> 2f26930 (update commit)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

<<<<<<< HEAD
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
=======
async function run() {
  try {
    // await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("DevPlanner");
    const userCollection = database.collection("Users");
    const taskCollection = database.collection("Tasks");

    // 🔹 Add a User
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
        console.error("❌ Error adding user:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // 🔹 Fetch All Users
    app.get("/users", async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // 🔹 Add a Task
    app.post("/tasks", async (req, res) => {
      try {
        const newTask = req.body;
        if (!newTask.userEmail || !newTask.taskName) {
          return res.status(400).json({ message: "User email and task name are required" });
        }

        const result = await taskCollection.insertOne(newTask);
        res.status(201).json(result);
      } catch (error) {
        console.error("❌ Error adding task:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // 🔹 Fetch Tasks by User
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

    // 🔹 Update Task
    app.put("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
>>>>>>> 2f26930 (update commit)
        const updatedTask = req.body;
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedTask }
        );
<<<<<<< HEAD
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

=======

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Task not found or not modified" });
        }

        res.json(result);
      } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // 🔹 Delete Task
    app.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Task not found" });
        }

        res.json(result);
      } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // Default Route
    app.get("/", (req, res) => {
      res.send("DevPlanner server is running");
    });
>>>>>>> 2f26930 (update commit)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
<<<<<<< HEAD

run().catch(console.dir);

// Start Server
app.listen(port, () => {
  console.log(`DevPlanner is running on port: ${port}`);
=======
run().catch(console.dir);

// Default Route
app.get('/', (req, res) => {
  res.send('DevPlanner server is running');
});

// Start Server
app.listen(port, () => {
  console.log(`DevPlanner server is running on port: ${port}`);
>>>>>>> 2f26930 (update commit)
});
