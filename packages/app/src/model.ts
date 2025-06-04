import { Recipe, Credential } from "server/models";

export interface Model {
    selectedRecipe?: Recipe;
    recipeList?: Recipe[];
    profile?: Credential;
    pageTitle?: string;
}

export const init: Model = {};