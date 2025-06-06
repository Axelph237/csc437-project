import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import fs from "node:fs/promises";
import path from "path";
// Controllers
import Recipes from "./services/recipe-svc";
// Routers
import recipes from "./routes/recipes";
import auth from "./routes/auth";
// Definitions
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
// MongoDB connection
connect("Cluster0"); // :( boring cluster name

// Middleware
app.use(express.static(staticDir));
app.use(express.json());

// Route handlers
app.use("/api/recipes", recipes);
app.use("/auth", auth);

// Root routes
app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.use("/app", (req: Request, res: Response) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
        res.send(html)
    );
});

// Run server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});