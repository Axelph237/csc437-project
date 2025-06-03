import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import { state } from "lit/decorators.js";
import {Recipe} from "../models/recipe.ts";

export class LandingViewElement extends LitElement {
    @state()
    recipes: Recipe[] | undefined = undefined;

    get src() {
        return `/api/recipes/`;
    }

    override render() {
        return html`
            <ul id="recipe-carousel-container">
                ${this.recipes?.map((recipe: Recipe) => html`
                    <a href="/app/recipe/${recipe._id}">
                        <li class="recipe-card">
                            <h2 style="z-index:99;pointer-events:none;">${recipe.name}</h2>
                            ${recipe.exampleImg && html`<img class="recipe-card-bg" alt="example img" src="${recipe.exampleImg}" />`}
                        </li>
                    </a>
                `)}
            </ul>
    `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    hydrate() {
        fetch(this.src)
            .then(res => res.json())
            .then((json: object) => {
                if(json) {
                    this.recipes = json as Recipe[];
                }
            })
            .catch(err => console.error(err))
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
            
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            
            overflow: hidden;
            
            box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
            
            width: 100%;
            height: 150px;
            
            padding: 6px;
            border-radius: 2rem;
            
            cursor: pointer;
        }
        .recipe-card > h2 {
            font-size: 1.25rem;
            display: none;
        }
        .recipe-card:hover > h2 {
            display: block;
        }
        .recipe-card-bg {
            position: absolute;
            
            top: 0;
            left: 0;
            
            width: 100%;
            height: 100%;
            
            object-fit: cover;
            
            transition: all 100ms ease-in-out;
        }
        .recipe-card-bg:hover {
            filter: blur(4px) brightness(60%);
        }
    `];
}