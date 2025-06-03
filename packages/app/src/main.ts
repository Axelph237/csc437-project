import {
    Auth,
    define,
    History,
    Switch
} from "@calpoly/mustang";
import { html } from "lit";
import { PageHeaderElement } from "./components/page-header";
import {LandingViewElement} from "./views/landing-view.ts";
import {RecipeViewElement} from "./views/recipe-view.ts";

const routes = [
    {
        path: "/app/recipe/:id",
        view: (params: Switch.Params) => html`
            <recipe-view recipe-id=${params.id}></recipe-view>
        `
    },
    {
        path: "/app",
        view: () => html`
            <landing-view></landing-view>
        `
    },
    {
        path: "/",
        redirect: "/app"
    }
];

define({
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "recipe:history", "recipe:auth");
        }
    },
    "page-header": PageHeaderElement,
    // Views
    "landing-view": LandingViewElement,
    "recipe-view": RecipeViewElement,
});