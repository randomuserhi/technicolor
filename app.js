import { html, Macro, MacroElement } from "@/rhu/macro.js";
import { Style } from "@/rhu/style.js";
import { landing } from "./routes/landing.js";
import { theme } from "./theme.js";
const style = Style(({ style }) => {
    const wrapper = style.class `
    font-family: microgramma;

    width: 100%;
    height: 100%;

    overflow: auto;
    `;
    const body = style.class `
    flex: 1;
    `;
    return {
        wrapper,
        body
    };
});
const App = Macro(class App extends MacroElement {
    constructor(dom, bindings) {
        super(dom, bindings);
    }
}, html `
    <div class="${theme} ${style.wrapper}">
        ${landing()}
    </div>
    `);
let _app = undefined;
export function app() {
    if (_app === undefined)
        throw new Error("App has not loaded yet.");
    return _app;
}
const __load__ = () => {
    _app = Macro.create(App());
    document.body.replaceChildren(..._app.dom);
};
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", __load__);
}
else {
    __load__();
}
