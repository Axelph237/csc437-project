import { Recipe, Credential } from "server/models";

export interface Model {
    selectedRecipe?: Recipe;
    recipeList?: Recipe[],
    profile?: Credential;
}

export const init: Model = {};