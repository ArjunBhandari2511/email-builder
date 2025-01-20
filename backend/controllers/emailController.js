const path = require("path");
const fs = require("fs");
const multer = require("multer");

// 1. Get Email Layout
exports.getEmailLayout = (req, res) => {
  const layoutPath = path.join(__dirname, "../views/layout.html");
  fs.readFile(layoutPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading layout file!" });
    }
    res.status(200).send(data);
  });
};

// 2. Upload Image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    cb(null, uploadDir); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// Middleware for single file upload
const upload = multer({ storage }).single("image");

// Upload Image Handler
exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Error in multer upload:", err);
      return res.status(500).json({ message: "Error uploading image" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Send the correct image URL (relative to static path)
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
  });
};

// 3. Upload Email Config
exports.uploadEmailConfig = (req, res) => {
  console.log("Received Email Config:", req.body); // Log the received data

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Email config is empty or missing" });
  }

  // Respond with a success message
  res.status(200).json({ message: "Email configuration saved successfully", data: req.body });
};


// 4. Render and Download Template
exports.renderAndDownloadTemplate = (req, res) => {
  const { title, content, footer, imageUrls } = req.body;
  const layoutPath = path.join(__dirname, "../views/layout.html");

  fs.readFile(layoutPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading layout file" });
    }

    // Generate image HTML dynamically
    const imagesHtml = imageUrls
      .map((url) => `<img src="http://localhost:5000${url}" alt="Uploaded Image" />`) // Correct image URL
      .join(""); // Join images as a single string

    // Replace placeholders with actual data
    const customizedTemplate = data
      .replace("{{title}}", title)
      .replace("{{content}}", content)
      .replace("{{footer}}", footer)
      .replace("{{images}}", imagesHtml);

    // Send the customized template
    res.status(200).send(customizedTemplate);
  });
};
