import { html, Macro, MacroElement } from "@/rhu/macro.js";
import { Style } from "@/rhu/style.js";
import { theme } from "../theme.js";

const style = Style(({ style }) => {
    const wrapper = style.class`
    width: 200px;
    height: auto;
    position: relative;
    overflow: hidden;
    `;
    /*style`
    @media screen and (max-width: 780px) {
        ${wrapper} {
            padding: 0px 7px;
        }
    }
    `;*/

    const row = style.class`
    display: flex;
    width: 100%;
    color: #777; /* TODO: Theme color */
    `;

    const highlight = style.class`
    color: ${theme.foregroundPrimary}
    `;

    return {
        wrapper,
        row,
        highlight
    };
});

export const intro = Macro(class Intro extends MacroElement {
    constructor(dom: Node[], bindings: any) {
        super(dom, bindings);
    }
}, html`
    <div m-id="wrapper" class="${style.wrapper}">
        <div class="${style.row}">
            TRANSFORM<span class="${style.highlight}">T</span>RANSFORMTRANSFORM
        </div>
        <div class="${style.row}">
            ENGINEERING<span class="${style.highlight}">E</span>NGINEERINGENGINEERING
        </div>
        <div class="${style.row}">
            CHANGE<span class="${style.highlight}">C</span>HANGECHANGE
        </div>
        <div class="${style.row}">
            HYBRID<span class="${style.highlight}">H</span>YBRIDHYBRID
        </div>
        <div class="${style.row}">
            NATURE<span class="${style.highlight}">N</span>ATURENATURE
        </div>
        <div class="${style.row}">
            INVENT<span class="${style.highlight}">I</span>NVENTINVENT
        </div>
        <div class="${style.row}">
            CATALYSE<span class="${style.highlight}">C</span>ATALYSECATALYSE
        </div>
        <div class="${style.row}">
            OPERATE<span class="${style.highlight}">O</span>PERATEOPERATE
        </div>
        <div class="${style.row}">
            SCALESCA<span class="${style.highlight}">L</span>ESCALE
        </div>
        <div class="${style.row}">
            THEORYTHE<span class="${style.highlight}">O</span>RYTHEORY
        </div>
        <div class="${style.row}">
            SURREALSUR<span class="${style.highlight}">R</span>EALSURREAL
        </div>
    </div>
    `);
