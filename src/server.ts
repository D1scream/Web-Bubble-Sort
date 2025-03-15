import express from "express";
import { bubbleSort } from "./bubbleSort";
import db from "./controllers/db.controller";

const app = express();
app.use(express.json());

db.init().catch(console.error);

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "./src/public" });
});

app.get("/:id", async (req, res) => {
    const nums = await db.get(parseInt(req.params.id));
    if (!nums) return res.status(404).json({ error: 'Not found' });
    res.json(nums);
});

app.post("/sort", async (req, res) => {
    const { array } = req.body;
    if (!array?.length || !Array.isArray(array)) {
        return res.status(400).json({ error: 'Invalid array' });
    }
    
    const sorted = bubbleSort(array);
    const id = await db.save(sorted);
    res.json({ id, sorted });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
