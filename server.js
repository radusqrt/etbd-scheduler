const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

app.use(fileUpload());

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files == null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  console.log("[server post] file = ", file);
  file.mv(
    `${__dirname}/client/public/uploads/${file.name.replace(" ", "")}`,
    (err) => {
      if (err) {
        console.log(err);
        console.error(err);
        return res.status(500).send(err);
      }

      res.json({
        fileName: file.name,
        filePath: `/uploads/${file.name.replace(" ", "")}`,
      });
    }
  );
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resove(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server started..."));
