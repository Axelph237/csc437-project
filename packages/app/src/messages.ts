import { Recipe, Credential } from "server/models";

export type Msg =
    | ["title/set", { title: string }]
    | ["profile/save", { userid: string; profile: Credential }]
    | ["profile/select", { userid: string }]
    | ["recipes/view"]
    | ["recipe/select", { recipeId: string }]
    | ["recipe/create", { recipe: Recipe, userId: string, onSuccess?: () => any, onFailure?: (error: Error) => void }]
    | ["recipe/delete", { recipeId: string }]