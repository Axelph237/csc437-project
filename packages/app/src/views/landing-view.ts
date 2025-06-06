import { html, css } from "lit";
import reset from "../styles/reset.css.ts";
import { state } from "lit/decorators.js";
import {Msg} from "../messages.ts";
import {Auth, Observer, View} from "@calpoly/mustang";
import {Model} from "../model.ts";
import {Recipe} from "server/models";

export class LandingViewElement extends View<Model, Msg> {
    _authObserver = new Observer<Auth.Model>(this, "recipe:auth");

    @state()
    get recipes(): Recipe[] | undefined {
        return this.model.recipeList;
    }

    @state()
    userId?: string;

    constructor() {
        super("recipe:model");
    }

    override render() {
        return html`
            <ul id="recipe-carousel-container">
                ${this.recipes?.map((recipe: Recipe) => html`
                    <a href="/app/recipe/${recipe._id}">
                        <li class="recipe-card ${this.userId && recipe.author === this.userId && "owned"}">
                            <h2 style="z-index:99;pointer-events:none;">${recipe.name}</h2>
                            ${recipe.exampleImg && html`<img class="recipe-card-bg" alt="example img" src="${recipe.exampleImg}" />`}
                        </li>
                    </a>
                `)}
                <a href="/app/upload">
                    <li class="add-card">
                        <h2>Add New Recipe</h2>
                    </li>
                </a>
            </ul>
    `;
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

        this.dispatchMessage([ "recipes/view" ]);
    }

    static styles = [ reset.styles, css`
        #recipe-carousel-container {
            width: 100%;
            place-self: center;
            list-style-type: none;
            
            display: grid;
            @media (width <= 28rem) {
                grid-template-columns: repeat(1, 1fr);
            }
            @media (min-width: 28rem) and (max-width: 36rem) {
                grid-template-columns: repeat(2, 1fr);
            }
            @media (min-width: 36rem) and (max-width: 46rem) {
                grid-template-columns: repeat(4, 1fr);
            }
            @media (min-width: 46rem) {
                grid-template-columns: repeat(6, 1fr);
            }
            gap: 10px;
            
            padding: 20px;
        }
        .recipe-card {
            position: relative;
            
            border-radius: 1rem;
            
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            
            overflow: hidden;
            
            width: 100%;
            height: 150px;
            
            padding: 6px;
            
            cursor: pointer;
        }
        .recipe-card > h2 {
            font-size: 1.25rem;
            display: none;
        }
        .recipe-card:hover > h2 {
            display: block;
        }
        .recipe-card > * > svg {
            display: none;
            position: absolute;
            width: 30px;
            height: 30px;
            bottom: 10px;
            right: 10px;
            color: white;
            transition: all;
            transition-duration: 150ms;
        }
        .recipe-card > * > svg:hover {
            scale: 120%;
        }
        .recipe-card:hover > * > svg {
            display: block;
        }
        .recipe-card-bg {
            position: absolute;
            width: 200%;
            height: 200%;
            object-fit: cover;
            transition: all 100ms ease-in-out;
        }
        .recipe-card-bg:hover {
            filter: blur(4px) brightness(60%);
        }
        .add-card {
            position: relative;
            
            border: 2px dashed;
            color: var(--color-text);
            border-color: var(--color-text);
            border-radius: 1rem;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            overflow: hidden;

            width: 100%;
            height: 150px;

            padding: 6px;

            cursor: pointer;
            
            transition: all;
            transition-duration: 150ms;
        }
        .add-card > h2 {
            font-size: 1.25rem;
        }
        .add-card:hover {
            border-color: var(--color-lavender-DARK);
            color: var(--color-lavender-DARK);
        }
        a {
            color: white;
            text-decoration: none !important;
        }
        
    `];
}