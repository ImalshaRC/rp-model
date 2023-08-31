const express = require("express");
const multer = require("multer");
const path = require("path");
const performObjectDetection = require("./model");

const app = express();
const port = 3000;

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // The destination folder where uploaded files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

// Define a route to handle image uploads
app.post("/upload", upload.single("image"), (req, res) => {
  // Get the uploaded image path
  const uploadedImagePath = req.file.path;

  performObjectDetection(uploadedImagePath, (error, output) => {
    if (error) {
      console.error("Object detection error:", error);
      return res.status(500).json({ error: "Object detection error." });
    }

    console.log(output);

    const match = output.match(/"label":\s*"([^"]+)"/);

    var labelValue = "";

    if (match) {
      labelValue = match[1];
    } else {
      console.log("Label not found.");
    }

    res.json({
      message: "Image uploaded and processed successfully.",
      result: labelValue, // Add the uploaded image path to the response
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
