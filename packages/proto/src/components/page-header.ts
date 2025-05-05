import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css.ts";

export class PageHeaderElement extends LitElement {
    override render() {
        return html`
      <header>
          <!-- Website title -->
          <span style="height: min-content">
              <svg class="icon">
                  <use href="icons.svg#icon-pot" />
              </svg>
              RECIPES
          </span>
          
          <!-- Page title -->
          <slot name="page-title">
              Page Title
          </slot>
          
          <!-- Dark/Light mode toggle -->
          <label style="cursor: pointer; user-select: none;">
              <svg class="icon">
                  <use href="icons.svg#icon-dark-mode" />
              </svg>
              <input id="dark-mode-btn" type="button" autocomplete="off" style="display: none;"/>
              light mode
          </label>
      </header>
    `;
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