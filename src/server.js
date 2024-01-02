const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbURL = "mongodb://127.0.0.1:27017/feedbackDB";

async function connectToDatabase() {
  try {
    await mongoose.connect(dbURL, mongooseOptions);
    console.log("MongoDB'ye bağlandı");
  } catch (error) {
    console.error("MongoDB Bağlantı Hatası:", error);
  }
}

connectToDatabase();

const feedbackSchema = new mongoose.Schema({
  text: String,
  rating: Number,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

app.post("/api/feedback", async (req, res) => {
  const { text, rating } = req.body;

  try {
    const newFeedback = new Feedback({ text, rating });
    await newFeedback.save();
    console.log("Geri bildirim kaydedildi:", newFeedback);
    res.json({ success: true, message: "Geri bildirim başarıyla kaydedildi" });
  } catch (error) {
    console.error("Sunucu tarafında hata:", error);
    res.status(500).json({ success: false, message: "İç Sunucu Hatası" });
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
