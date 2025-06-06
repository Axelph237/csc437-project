import { html, css } from "lit";
import reset from "../styles/reset.css.ts";
import { property, state } from "lit/decorators.js";
import {Recipe} from "server/models";
import {Msg} from "../messages.ts";
import {Auth, Observer, View} from "@calpoly/mustang";
import {Model} from "../model.ts";

export class RecipeViewElement extends View<Model, Msg> {
    _authObserver = new Observer<Auth.Model>(this, "recipe:auth");

    @property({ attribute: "recipe-id" })
    recipeId?: string;

    @state()
    userId?: string;

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
                <div class="recipe-label">
                    <div class="recipe-label-bg" style="background: url(${this.recipe?.exampleImg})"></div>
                    
                    <svg width="100%" height="2" viewBox="0 0 10 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"  style="z-index: 99;">
                        <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" stroke-width="2" />
                    </svg>
                    
                    <h1 style="z-index: 99;">${this.recipe?.name.toUpperCase()}</h1>
                    
                    <svg width="100%" height="2" viewBox="0 0 10 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"  style="z-index: 99;">
                        <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" stroke-width="2" />
                    </svg>
                    
                    ${this.userId && this.userId === this.recipe?.author && html`
                        <button id="trash-btn" @click=${this.handleDelete}>
                            <svg class="icon">
                                <use href="/icons/icons.svg#icon-trash" />
                            </svg>
                        </button>
                    `}
                </div>

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

    handleDelete() {
        console.log("Attempting delete");
        if (this.recipeId)
            this.dispatchMessage([ "recipe/delete", { recipeId: this.recipeId, onSuccess: () => history.pushState({}, "", "/app") } ]);

    }

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe((auth: Auth.Model) => {
            const { user } = auth;

            if (user && user.authenticated ) {
                this.userId = user.username;
            } else {
                this.userId = undefined;
            }
        });
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
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            text-wrap: nowrap;
            gap: 10px;
            padding: 40px;
            width: 100%;
            height: 300px;
            overflow: hidden;
        }
        .recipe-label-bg {
            content: "";
            position: absolute;
            inset: -10px;
            filter: blur(4px) brightness(70%);
            pointer-events: none;
            z-index: 0;
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

        .cutout-text {
            --img-url: url("/");
            font-size: 4rem;
            text-wrap: wrap;
            font-weight: bold;
            background: var(--img-url) no-repeat center center;
            background-size: cover;

            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;

            /* Optional for Firefox */
            background-clip: text;
            color: transparent;
        }
        #trash-btn {
            position: absolute;
            background:none;
            border:none;
            width: 50px;
            height: 50px;
            bottom: 10px;
            right: 10px;
            color: white;
            transition: all;
            transition-duration: 150ms;
            cursor: pointer;
        }
        #trash-btn:hover {
            scale: 120%
        }
        #trash-btn > svg {
            width: 100%;
            height: 100%;
        }
    `];
}