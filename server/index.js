const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create the uploads directory if it doesn't exist
const fs = require("fs");
const dir = path.join(__dirname, "uploads");
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// Route to handle the file upload
app.post("/api/evaluation", upload.any(), (req, res) => {
    console.log("Files received:", req.files);
    req.files.forEach(file => {
        console.log(`File uploaded: ${file.path}`);
    });
    const size = req.files.reduce((acc, file) => acc + file.size, 0);
    res.json({ message: "Files uploaded successfully!", size });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
