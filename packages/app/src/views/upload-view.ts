import { html, css } from "lit";
import reset from "../styles/reset.css.ts";
import { property, state } from "lit/decorators.js";
import {Recipe} from "server/models";
import {Msg} from "../messages.ts";
import {define, Form, View} from "@calpoly/mustang";
import {Model} from "../model.ts";
import {Credential} from "server/models";

export class UploadViewElement extends View<Model, Msg> {
    static uses = define({
        "mu-form": Form.Element,
    });

    @property({ attribute: "user-id" })
    userId?: string;

    @state()
    get profile(): Credential | undefined {
        return this.model.profile;
    }

    constructor() {
        super("recipe:model");
    }

    override render() {
        return html`
            <main class="page">
                <h1>Create a new Recipe</h1>
                <mu-form id="upload-form" @mu-form:submit=${this.handleSubmit}>
                    
                    <label>
                        Name
                        <input type="text" placeholder="Enter name" name="name"  />
                    </label>

                    <label>
                        Example Img
                        <input type="url" placeholder="https://" name="exampleImg"  />
                    </label>

                    <label>
                        Prep Time (in minutes)
                        <input type="number" placeholder="10" min="0" value="10" name="prepTime"  />
                    </label>

                    <label>
                        Cook Time (in minutes)
                        <input type="number" placeholder="10" min="0" value="10" name="cookTime"  />
                    </label>

                    <label>
                        Serves
                        <input type="number" placeholder="4" min="1" value="4" name="serves"  />
                    </label>

                    <label>
                        Ingredients
                        <input type="text" placeholder="Enter ingredients (separated by semicolons)" name="ingredients"  />
                    </label>

                    <label>
                        Steps
                        <input type="text" placeholder="Enter steps (separated by semicolons)" name="method"  />
                    </label>
                    
                </mu-form>
            </main>
    `;
    }

    handleSubmit(event: Form.SubmitEvent<Recipe>) {
        const newRecipe = event.detail as Recipe;
        newRecipe.method = event.detail.method.split(";");
        newRecipe.ingredients = event.detail.ingredients.split(";");

        this.dispatchMessage([
            "recipe/create",
            {
                recipe: newRecipe,
                userId: this.userId!,
                onSuccess: () => console.log("Upload success"),
                onFailure: (error: Error) =>
                    console.log("ERROR:", error)
            }
        ]);
    }


    static styles = [ reset.styles, css`
        .page {
            width: 100%;
            
            display: flex;
            flex-direction: column;
            
            align-items: center;
            justify-content: center;
            
            padding: 20px;
        }
        #upload-form {
            width: fit-content;

            display: flex;
            flex-direction: column;

            align-items: start;
            justify-content: center;
        }
        label {
            gap: 0;
        }
    `];
}