require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Fallback route to serve index.html for any unrecognized routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Use the port from Railway or fallback to 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
