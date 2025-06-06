import {
    Auth,
    define,
    History, Store,
    Switch
} from "@calpoly/mustang";
import { html } from "lit";
import { PageHeaderElement } from "./components/page-header";
import {LandingViewElement} from "./views/landing-view.ts";
import {RecipeViewElement} from "./views/recipe-view.ts";
import update from "./update.ts";
import {init, Model} from "./model.ts";
import {Msg} from "./messages.ts";
import {UploadViewElement} from "./views/upload-view.ts";

const routes = [
    {
        path: "/app/recipe/:id",
        view: (params: Switch.Params) => html`
            <recipe-view recipe-id=${params.id}></recipe-view>
        `
    },
    {
        path: "/app/recipes/upload",
        view: (user: Auth.User) => html`
            <upload-view user-id=${user.username} ></upload-view>
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
    },
    {
        path: "/login.html",
        view: () => { window.location.href = "/login/" } // not janky at all :)
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
    "mu-store": class AppStore
        extends Store.Provider<Model, Msg>
    {
        constructor() {
            super(update, init, "recipe:auth");
        }
    },
    // Custom elements
    "page-header": PageHeaderElement,
    // Views
    "landing-view": LandingViewElement,
    "recipe-view": RecipeViewElement,
    "upload-view": UploadViewElement
});