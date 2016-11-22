var express = require("express"),
    path = require("path")

const app = express();

app.use(express.static(__dirname));

app.get("/" , (req, res) => {
  res.status(200)
     .sendFile(path.resolve(__dirname, "./musicMedia.html"))
})

app.listen("5000", () => console.log("监听5000端口"))