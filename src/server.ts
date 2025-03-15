import express from "express";
import { bubbleSort } from "./bubbleSort";
import { getArray, saveSort, initDatabase } from "./db";

const app = express();
app.use(express.json());

initDatabase().catch(console.error);

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "./src/public" });
});
app.get("/:arrayId", async (req, res) => {
    const { arrayId } = req.params;
    const array = await getArray(parseInt(arrayId));
    res.json(array);
});

app.post("/sort", async (req, res) => {
    const { array } = req.body;
    
    if (!array?.length || !Array.isArray(array)) {
        return res.status(400).json({ error: 'Неверный массив' });
    }

    const sortedArray = bubbleSort(array);
    const arrayId = await saveSort(sortedArray);
    
    res.json({ sortedArray, arrayId });
});

app.listen(3000, () => console.log('Сервер запущен на 3000 порту'));
