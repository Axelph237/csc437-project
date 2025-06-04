import { Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import {Recipe} from "server/models";

export default function update(
    message: Msg,
    apply: Update.ApplyMap<Model>,
    // user: Auth.User
) {
    console.log("Update message received");
    switch (message[0]) {
        case "recipe/select":
            loadSelectedRecipe(message[1])
                .then((selectedRecipe?: Recipe) => {
                    apply((model) => ({ ...model, selectedRecipe }))
                })
            break;
        case "recipes/view":
            loadRecipeList()
                .then((recipeList?: Recipe[]) => {
                    apply((model) => ({ ...model, recipeList }))
                })
            break;
        // put the rest of your cases here
        default:
            throw new Error(`Unhandled Auth message`);
    }
}

function loadSelectedRecipe(
    payload: { recipeId: string }
) {
    return fetch("/api/recipes/" + payload.recipeId)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return undefined;
        })
        .then((json: unknown) => {
            if(json) {
                console.log("Found recipe", json);
                return json as Recipe;
            }
        })
}

function loadRecipeList() {
    console.log("Loading recipe list....")
    return fetch("/api/recipes")
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return undefined;
        })
        .then((json: unknown) => {
            if(json) {
                console.log("Found recipes", json);
                return json as Recipe[];
            }
        })
}
