import { Recipe, Credential } from "server/models";

export type Msg =
    | ["profile/save", { userid: string; profile: Credential }]
    | ["profile/select", { userid: string }]
    | ["recipes/view"]
    | ["recipe/select", { recipeId: string }]
    | ["recipe/create", { recipe: Recipe }]
    | ["recipe/delete", { recipeId: string }]