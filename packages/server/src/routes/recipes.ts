import express, { Request, Response } from "express";
import { Recipe } from "../models/recipe";

import Recipes from "../services/recipe-svc";

const router = express.Router();

// GET (collection)
router.get("/", (_, res: Response) => {
    Recipes.index()
        .then((list: Recipe[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

// GET (resource)
router.get("/:recipeId", (req: Request, res: Response) => {
    const { recipeId } = req.params;

    Recipes.get(recipeId)
        .then((recipe: Recipe) => res.json(recipe))
        .catch((err) => res.status(404).send(err));
});

// CREATE
router.post("/", (req: Request, res: Response) => {
    const newRecipe = req.body;

    Recipes.create(newRecipe)
        .then((recipe: Recipe) =>
            res.status(201).json(recipe)
        )
        .catch((err) => res.status(500).send(err));
});

// UPDATE
router.put("/:recipeId", (req: Request, res: Response) => {
    const { recipeId } = req.params;
    const newRecipe = req.body;

    Recipes.update(recipeId, newRecipe)
        .then((recipe: Recipe) => res.json(recipe))
        .catch((err) => res.status(404).end());
});

// DELETE
router.delete("/:recipeId", (req: Request, res: Response) => {
    const { recipeId } = req.params;

    Recipes.remove(recipeId)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;