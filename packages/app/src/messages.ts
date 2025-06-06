import { Recipe } from "server/models";

export type Msg =
    | ["title/set", { title: string }]
    | ["recipes/view"]
    | ["recipe/select", { recipeId: string }]
    | ["recipe/create", { recipe: Recipe, userId: string, onSuccess?: () => any, onFailure?: (error: Error) => void }]
    | ["recipe/delete", { recipeId: string, onSuccess?: () => any, onFailure?: (error: Error) => void }]