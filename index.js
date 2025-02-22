require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8c67l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function run() {
  try {
    console.log("Connected to MongoDB");
    const db = client.db("DevPlanner");
    const userCollection = db.collection("Users");
    const taskCollection = db.collection("Tasks");

    // 🔹 Create or Update User (Google Sign-in Fix)
    app.post("/users", async (req, res) => {
      try {
        const { name, email, photoUrl } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const existingUser = await userCollection.findOne({ email });

        if (existingUser) {
          // Update user info if they signed in with Google
          await userCollection.updateOne({ email }, { $set: { name, photoUrl } });
          return res.status(200).json({ message: "User updated successfully" });
        }

        const result = await userCollection.insertOne({ name, email, photoUrl });
        res.status(201).json(result);
      } catch (error) {
        console.error("❌ Error adding user:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // 🔹 Add a Task (Prevent Duplicates)
    app.post("/tasks", async (req, res) => {
      try {
        const { userEmail, taskName, description, category } = req.body;
        if (!userEmail || !taskName) return res.status(400).json({ message: "User email and task name are required" });

        const existingTask = await taskCollection.findOne({ userEmail, taskName });
        if (existingTask) return res.status(400).json({ message: "Task already exists" });

        const result = await taskCollection.insertOne({ userEmail, taskName, description, category });
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
        if (!userEmail) return res.status(400).json({ message: "User email is required" });

        const tasks = await taskCollection.find({ userEmail }).toArray();
        res.status(200).json(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    app.listen(port, () => console.log(`DevPlanner server is running on port: ${port}`));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);
