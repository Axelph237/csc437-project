import { Schema, model } from "mongoose";
import {Recipe} from "../models/recipe";

const RecipeSchema = new Schema<Recipe>(
    {
        name: { type: String, required: true, trim: true },
        author: { type: String },
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

function create(json: Recipe): Promise<Recipe> {
    console.log("Creating recipe:", json);
    const r = new RecipeModel(json);
    return r.save();
}

function update(
    recipeId: String,
    recipe: Recipe
): Promise<Recipe> {
    return RecipeModel.findOneAndUpdate({ _id: recipeId }, recipe, {
        new: true
    }).then((updated) => {
        if (!updated) throw `${recipeId} not updated`;
        else return updated as Recipe;
    });
}

function remove(recipeId: String): Promise<void> {
    return RecipeModel.findOneAndDelete({ _id: recipeId }).then(
        (deleted) => {
            if (!deleted) throw `${recipeId} not deleted`;
        }
    );
}

export default { index, get, create, update, remove };