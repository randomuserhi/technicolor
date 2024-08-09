import { html, Macro, MacroElement } from "@/rhu/macro.js";
import { Style } from "@/rhu/style.js";
import { theme } from "../theme.js";
import { flower } from "./flower.js";
const style = Style(({ style }) => {
    const wrapper = style.class `
    width: 100%;
    height: 100vh;
    position: relative;

    background-color: ${theme.backgroundPrimary};
    color: ${theme.foregroundPrimary};
    `;
    const bottomCurve = style.class `
    position: absolute;
    bottom: -1px;
    width: 100%;
    background-color: transparent;
    `;
    wrapper.content = style.class `
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 0 500px;
    `;
    style `
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
    const header = style.class `
    position: absolute;
    top: 0px;
    width: 100%;
    display: flex;
    height: 70px;
    align-items: center;
    justify-content: center;
    `;
    header.main = style.class `
    font-size: 1.5rem;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    `;
    header.actionList = style.class `
    font-family: geist-bold; 
    font-size: 1rem;
    display: flex; 
    gap: 50px;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    `;
    style `
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
    const backdrop = style.class `
    position: absolute; 
    top: 0; 
    width: 100%; 
    height: 100%; 
    color: rgba(255, 255, 255, 0.05); 
    overflow: hidden; 
    font-size: 5rem; 
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    -webkit-mask-image: radial-gradient(circle at 60% 60%, transparent, black 97%);
    mask-image: radial-gradient(circle at 60% 60%, transparent 00%, black 40%);
    line-height: 5rem;
    `;
    style `
    ${backdrop}>div {
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
        animation-name: scroll;
        animation-duration: 20s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-play-state: running;
        animation-delay: -10s;
    }
    ${backdrop}>div>p {
        display: inline-block
    }

    @keyframes scroll {
        0% {
            transform: translate3d(0%, 0, 0);
        }
        100% {
            transform: translate3d(-50%, 0, 0);
        }
    }
    `;
    return {
        wrapper,
        backdrop,
        bottomCurve,
        header
    };
});
export const landing = Macro(class Landing extends MacroElement {
    constructor(dom, bindings) {
        super(dom, bindings);
    }
}, html `
    <div m-id="wrapper" class="${style.wrapper}">
        ${flower()}
        <!--<div style="position: absolute; top: 70px; display: flex; width: 100%; height: 1px;">
            <div style="flex: 1; background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, transparent 90%);"></div>
            <div style="flex: 1; background: linear-gradient(90deg, transparent 10%, rgba(255, 255, 255, 1) 100%);"></div>
        </div>-->
        <div class="${style.backdrop}">
    ${(() => {
    let html = "";
    for (let i = 0; i < 2; ++i) {
        html += (() => {
            return `
            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 5; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(255, 0, 0, 1);">T</span>RANSFORM`;
                        else
                            html += `TRANSFORM`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>

            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 6; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(255, 83, 0, 1);">E</span>NGINEER`;
                        else
                            html += `ENGINEER`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>

            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 7; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(255, 165, 0, 1);">C</span>HANGE`;
                        else
                            html += `CHANGE`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>

            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 8; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(255, 210, 0, 1);">H</span>YBRID`;
                        else
                            html += `HYBRID`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>

            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 7; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(255, 255, 0, 1);">N</span>ATURE`;
                        else
                            html += `NATURE`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>

            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 8; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(128, 192, 0, 1);">I</span>NVENT`;
                        else
                            html += `INVENT`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>

            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 6; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(0, 128, 0, 1);">C</span>ATALYSE`;
                        else
                            html += `CATALYSE`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>

            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 6; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(0, 64, 128, 1);">O</span>PERATE`;
                        else
                            html += `OPERATE`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>

            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 6; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(0, 0, 255, 1);">L</span>EAGUE`;
                        else
                            html += `LEAGUE`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>

            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 7; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(38, 0, 193, 1);">O</span>BEISM`;
                        else
                            html += `OBEISM`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>

            <div>
                ${(() => {
                let html = "";
                for (let i = 0; i < 2; ++i) {
                    html += `<p>`;
                    for (let j = 0; j < 7; ++j) {
                        if (j % 2 === 0)
                            html += `<span style="color: rgba(75, 0, 130, 1);">R</span>UMBLE`;
                        else
                            html += `RUMBLE`;
                    }
                    html += `</p>`;
                }
                return html;
            })()}
            </div>`;
        })();
    }
    return html;
})()}
        </div>
        <div class="${style.wrapper.content}">
            <div style="position: relative; top: 0px; width: 100%;">
                <div class="${style.header}">
                    <div style="flex: 1"></div>
                    <div class="${style.header.main}">TECHNICOLOR</div>
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
