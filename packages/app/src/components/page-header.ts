import { html, css } from "lit";
import reset from "../styles/reset.css.ts";
import {state} from "lit/decorators.js";
import {Auth, Events, Observer, View} from "@calpoly/mustang";
import {Model} from "../model.ts";
import {Msg} from "../messages.ts";

export class PageHeaderElement extends View<Model, Msg> {
    _authObserver = new Observer<Auth.Model>(this, "recipe:auth");

    @state()
    loggedIn = false;

    @state()
    userid?: string;

    @state()
    get pageTitle(): string | undefined {
        return this.model.pageTitle;
    }

    override render() {
        return html`
      <header>
          <!-- Website title -->
          <a style="height: min-content; user-select: none; color: white; text-decoration: none;" href="/">
              <svg class="icon">
                  <use href="/icons/icons.svg#icon-pot" />
              </svg>
              RECIPES
          </a>
          
          <!-- Page title -->
          ${this.pageTitle && html`<h2 id="page-title">
              ${this.pageTitle}
          </h2>`}
          
          <!-- Dark/Light mode toggle -->
          ${this.renderDarkModeButton()}
          
        <!-- User -->
          <span>${this.userid || "User"}</span>

          ${this.loggedIn ?
                  this.renderSignOutButton() :
                  this.renderSignInButton()
          }
      </header>
    `;
    }

    renderDarkModeButton() {
        const handleClickEvent = () => {
            const currTheme = localStorage.getItem("csc437-theme");
            const newTheme = currTheme === "light" ? "dark" : "light"

            localStorage.setItem("csc437-theme", newTheme);
            document.body.setAttribute("data-theme", newTheme);
        }

        return html`
            <button @click=${handleClickEvent} id="dark-mode-btn" style="cursor: pointer; user-select: none;">
                <svg class="icon">
                    <use href="/icons/icons.svg#icon-dark-mode" />
                </svg>
                light mode
            </button>
        `
    }

    renderSignOutButton() {
        return html`
        <button
            @click=${(e: UIEvent) => {
                Events.relay(e, "auth:message", ["auth/signout"])
            }}
        >
            Sign Out
        </button>
        `;
    }

    renderSignInButton() {
        // Navigation done programmatically to force page reload
        // And load static .html file
        return html`
            <button @click=${() => { window.location.href = "/login/" }}>
                Sign In...
            </button>
        `;
    }

    connectedCallback() {
        super.connectedCallback();

        this._authObserver.observe((auth: Auth.Model) => {
            const { user } = auth;
            console.log("User:", user);

            if (user && user.authenticated ) {
                this.loggedIn = true;
                this.userid = user.username;
            } else {
                this.loggedIn = false;
                this.userid = undefined;
            }
        });
    }

    static styles = [ reset.styles, css`
        header {
            position: sticky;
            top: 0;

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            padding: 10px;

            width: 100%;
            background: var(--color-header);

            font-family: "Geologica", serif;
            font-weight: 600;
            font-size: 1.5rem;
            color: var(--color-header-text);
            
            z-index: 999;
        }

        svg.icon {
            display: inline;
            height: 1em;
            width: 1em;
            vertical-align: center;
            fill: currentColor;
        }
    `];
}