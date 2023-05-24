const express = require("express");

const app = express();

app.listen(5001, () => {
    console.log("Server is running on port 5001");
})

app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application" });
});