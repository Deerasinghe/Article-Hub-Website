const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://netscore51:12345678N@article-hub.ay6bt.mongodb.net/?retryWrites=true&w=majority&appName=Article-Hub", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

// Define Schemas
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Define Models
const Article = mongoose.model("Article", articleSchema);
const Contact = mongoose.model("Contact", contactSchema);

// Routes

/** 
 * @route GET /articles
 * @desc Get all articles
 */
app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles." });
  }
});

/** 
 * @route POST /articles
 * @desc Add a new article
 */
app.post("/articles", async (req, res) => {
  try {
    const { title, content, link } = req.body;
    if (!title || !content || !link) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    const newArticle = new Article({ title, content, link });
    await newArticle.save();
    res.status(201).json({ message: "Article added successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add article." });
  }
});

/** 
 * @route PUT /articles/:id
 * @desc Update an article
 */
app.put("/articles/:id", async (req, res) => {
  try {
    const { title, content, link } = req.body;
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, link },
      { new: true }
    );
    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found." });
    }
    res.status(200).json({ message: "Article updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update article." });
  }
});

/** 
 * @route DELETE /articles/:id
 * @desc Delete an article
 */
app.delete("/articles/:id", async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).json({ error: "Article not found." });
    }
    res.status(200).json({ message: "Article deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete article." });
  }
});

/** 
 * @route POST /contact
 * @desc Handle contact form submission
 */
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message." });
  }
});

/** 
 * @route GET /contact-messages
 * @desc Get all contact messages
 */
app.get("/contact-messages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

/** 
 * @route DELETE /contact-messages/:id
 * @desc Delete a contact message
 */
app.delete("/contact-messages/:id", async (req, res) => {
  try {
    const deletedMessage = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found." });
    }
    res.status(200).json({ message: "Message deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
