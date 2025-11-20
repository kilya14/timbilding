// server/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import requestsRouter from "./routes/requests.js";
import programsRouter from "./routes/programs.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Teambuilding API is running");
});

// Маршруты API
app.use("/api/requests", requestsRouter);
app.use("/api/programs", programsRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
