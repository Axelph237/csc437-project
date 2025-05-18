// src/index.ts
import express, { Request, Response } from "express";
import { connect } from "./services/mongo";

import Recipes from "./services/recipe-svc";


const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("Cluster0"); // :( boring cluster name

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/recipes/:recipeId", (req: Request, res: Response) => {
    const { recipeId } = req.params;

    Recipes.get(recipeId).then((data) => {
        if (data) res
            .set("Content-Type", "application/json")
            .send(JSON.stringify(data));
        else res
            .status(404).send();
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});