import { Schema, model } from "mongoose";
import {Recipe} from "../models/recipe";

const RecipeSchema = new Schema<Recipe>(
    {
        name: { type: String, required: true, trim: true },
        exampleImg: { type: String, trim: true },
        prepTime: Number,
        cookTime: Number,
        serves: Number,
        ingredients: [String],
        method: [String]
    },
    { collection: "recipes" }
);

const RecipeModel = model<Recipe>(
    "Recipes",
    RecipeSchema
);

function index(): Promise<Recipe[]> {
        return RecipeModel.find();
}

function get(recipeId: String): Promise<Recipe> {
        return RecipeModel.find({ _id: recipeId })
            .then((list) => list[0])
            .catch((err) => {
                    throw `${recipeId} Not Found`;
            });
}

export default { index, get };