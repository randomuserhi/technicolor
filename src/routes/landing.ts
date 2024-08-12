import { html, Macro, MacroElement } from "@/rhu/macro.js";
import { ClassName, Style } from "@/rhu/style.js";
import { theme } from "../theme.js";
import { flower } from "./flower.js";

const style = Style(({ style }) => {
    const wrapper = style.class<{ content: ClassName }>`
    width: 100%;
    height: 100vh;
    position: relative;

    background-color: ${theme.backgroundPrimary};
    color: ${theme.foregroundPrimary};
    `;
    /*style`
    @media screen and (max-width: 780px) {
        ${wrapper} {
            padding: 0px 7px;
        }
    }
    `;*/

    const bottomCurve = style.class`
    position: absolute;
    bottom: -1px;
    width: 100%;
    background-color: transparent;
    `;

    wrapper.content = style.class`
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 0 500px;
    `;
    style`
    @media screen and (max-width: 1920px) {
        ${wrapper.content} {
            padding: 0 250px;
        }
    }
    @media screen and (max-width: 1400px) {
        ${wrapper.content} {
            padding: 0 100px;
        }
    }
    @media screen and (max-width: 1200px) {
        ${wrapper.content} {
            padding: 0 50px;
        }
    }
    @media screen and (max-width: 1000px) {
        ${wrapper.content} {
            padding: 0 25px;
        }
    }
    `;

    const header = style.class<{ main: ClassName, actionList: ClassName }>`
    position: absolute;
    top: 0px;
    width: 100%;
    display: flex;
    height: 70px;
    align-items: center;
    justify-content: center;
    `;

    header.main = style.class`
    font-size: 2rem;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    `;
    style`
    @media screen and (max-width: 1000px) {
        ${header.main} {
            font-size: 1.5rem;
        }
    }
    `;

    header.actionList = style.class`
    font-family: geist-bold; 
    font-size: 1rem;
    display: flex; 
    gap: 50px;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    `;
    style`
    @media screen and (max-width: 1000px) {
        ${header.actionList} {
            display: none;
        }
    }

    ${header.actionList}>* {
        color: #aaaaaa;
    }
    ${header.actionList}>*:hover {
        color: #ffffff;
        cursor: pointer;
    }
    `;

    return {
        wrapper,
        bottomCurve,
        header
    };
});

export const landing = Macro(class Landing extends MacroElement {
    constructor(dom: Node[], bindings: any) {
        super(dom, bindings);
    }
}, html`
    <div m-id="wrapper" class="${style.wrapper}">
        ${flower()}
        <!--<div style="position: absolute; top: 70px; display: flex; width: 100%; height: 1px;">
            <div style="flex: 1; background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, transparent 90%);"></div>
            <div style="flex: 1; background: linear-gradient(90deg, transparent 10%, rgba(255, 255, 255, 1) 100%);"></div>
        </div>-->
        <div class="${style.wrapper.content}">
            <div style="position: relative; top: 0px; width: 100%;">
                <div class="${style.header}">
                    <div style="flex: 1"></div>
                    <div class="${style.header.main}">TECHNICOLOUR</div>
                    <div style="flex: 1"></div>
                </div>
                <div class="${style.header}">
                    <div style="flex: 1"></div>
                    <div class="${style.header.actionList}">
                        <div>ABOUT US</div>
                        <div>PROJECTS</div>
                    </div>
                </div>
            </div>
            <!-- 50px -->   
            <!--<div style="position: absolute; top: 50%; transform: translate(0%, -50%); padding: 0 200px;"> 
                <div style="font-family: geist-bold; font-size: 5rem; margin-bottom: 30px;">Bringing<br>STEM and Art<br>Together</div>
                <div style="font-family: geist; font-size: 1.5rem; color: #aaaaaa">Bring colour to your campus with a new society<br>that uses STEM with Art.</div>
            </div>-->
        </div>
        <svg class="${style.bottomCurve}" viewBox="0 0 1440 58" xmlns="http://www.w3.org/2000/svg">
            <path d="M -100 58 C -100 58 218.416 36.3297 693.5 36.3297 C 1168.58 36.3297 1487 58 1487 58 V 58 Z" fill="white"></path>
        </svg>
    </div>
    <div style="height: 100vh; padding: 50px;">
        MINJAE FILL THIS IN
    </div>
    `);
