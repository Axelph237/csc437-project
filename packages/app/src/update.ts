import {Auth, Update} from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import {Recipe} from "server/models";

export default function update(
    message: Msg,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
) {
    console.log("Update message received");
    switch (message[0]) {
        case "recipe/select":
            loadSelectedRecipe(message[1])
                .then((selectedRecipe?: Recipe) => {
                    apply((model) => ({ ...model, selectedRecipe, pageTitle: selectedRecipe!.name }))
                })
            break;
        case "recipes/view":
            loadRecipeList()
                .then((recipeList?: Recipe[]) => {
                    apply((model) => ({ ...model, recipeList }))
                })
            break;
        case "title/set":
            apply((model) => ({ ...model, ...message[1] }))
            break;
        case "recipe/create":
            createRecipe(message[1], user)
                .then(() => {
                    const { onSuccess } = message[1]
                    if (onSuccess) onSuccess();
                })
                .catch((err: Error) => {
                    const { onFailure } = message[1];
                    if (onFailure) onFailure(err);
                })
            break;
        case "recipe/delete":
            deleteRecipe(message[1], user)
                .then(() => {
                    console.log("Successful delete")
                    const { onSuccess } = message[1]
                    if (onSuccess) onSuccess();
                })
                .catch((err: Error) => {
                    const { onFailure } = message[1];
                    if (onFailure) onFailure(err);
                })
            break;
        default:
            const unhandled: never = message[0]; // <-- never type
            throw new Error(`Unhandled message "${unhandled}"`);
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

function createRecipe(
    msg: {
        userId: string,
        recipe: Recipe
    },
    user: Auth.User
) {
    return fetch("/api/recipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...Auth.headers(user)
        },
        body: JSON.stringify(msg.recipe)
    })
        .then(async res => {
            if (res.ok) {
                return res.json()
            }
            throw Error(await res.text())
        })
        .then((json: unknown) => {
            if (json) {
                console.log("Created recipe", json)
                return json as Recipe;
            }
        })

}

function deleteRecipe(
    msg: {
        recipeId: string
    },
    user: Auth.User
) {
    return fetch(`/api/recipes/${msg.recipeId}`, {
        method: "DELETE",
        headers: {
            ...Auth.headers(user)
        }
    })
        .then(async res => {
            if (res.ok) {
                return;
            }
            throw Error(await res.text())
        })

}
