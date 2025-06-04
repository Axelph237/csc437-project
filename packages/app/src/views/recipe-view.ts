import { html, css } from "lit";
import reset from "../styles/reset.css.ts";
import { property, state } from "lit/decorators.js";
import {Recipe} from "server/models";
import {Msg} from "../messages.ts";
import {View} from "@calpoly/mustang";
import {Model} from "../model.ts";

export class RecipeViewElement extends View<Model, Msg> {
    @property({ attribute: "recipe-id" })
    recipeId?: string;

    @state()
    get recipe(): Recipe | undefined {
        return this.model.selectedRecipe;
    }

    constructor() {
        super("recipe:model");
    }

    override render() {
        return html`
            <div>
                <h1 class="recipe-label" style="background-image: url(${this.recipe?.exampleImg}); background-size: 100%">
                    <svg width="100%" height="2" viewBox="0 0 10 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" stroke-width="2" />
                    </svg>
                    
                    ${this.recipe?.name.toUpperCase()}
                    
                    <svg width="100%" height="2" viewBox="0 0 10 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" stroke-width="2" />
                    </svg>
                </h1>

                <div class="recipe-body">
                    <div class="ingredients-container">
                        <h2>
                            INGREDIENTS
                        </h2>
                        <ul>
                            ${this.recipe?.ingredients.map((ingredient) => html`<li>${ingredient}</li>`)}
                        </ul>
                    </div>

                    <div class="steps-container">
                        <h2>STEPS</h2>
                        <ol>
                            ${this.recipe?.method.map((step) => html`<li>${step}</li>`)}
                        </ol>
                    </div>
                </div>
            </div>
    `;
    }

    attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
    ) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (
            name === "recipe-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            // Dispatch recipe selection message
            this.dispatchMessage([
                "recipe/select",
                { recipeId: newValue }
            ]);
        }
    }

    static styles = [ reset.styles, css`
        .recipe-label {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            text-wrap: nowrap;

            gap: 10px;

            padding: 40px;

            width: 100%;
        }

        .recipe-body {
            display: flex;
            flex-direction: column;

            @media screen and (min-width: 48rem) {
                display: grid;
                grid-template-columns: 1fr 2fr;
            }

            column-gap: 20px;

            padding: 20px;

            border-top: 1px solid var(--color-text);

        }

        .ingredients-container {
            border-right: 1px solid var(--color-text);
            padding: 10px;
        }

        .steps-container {
            padding: 10px;
        }
    `];
}