import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.json({
        "message": "Hello world!"
    })
});

app.get("/login", (req, res) => {


})

app.listen(port, () => {
    console.log(`Rendezvous backend is running on port ${port}`);
});
