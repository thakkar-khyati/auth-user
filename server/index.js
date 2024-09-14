const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRouter = require("./src/routes/user.routes");
dotenv.config();
const app = express();
const port = process.env.PORT || 5000

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3000/",
        ],
        methods: ["GET,POST,PATCH,PUT,DELETE"],
    })
);
app.use(bodyParser.json());

app.use("/users", userRouter);

app.listen(port, () => {
    console.log(`server running on ${port}`);
});