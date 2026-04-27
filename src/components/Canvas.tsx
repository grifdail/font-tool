import styled from "styled-components";
import { Editor, useEditor } from "../hooks/useEditor";
import { useFontProject, type GlyphData } from "../hooks/useFont";
import { IconStart, IconWidth } from "./Icon";
import { pointToSVGPath, useDrawing } from "./useDrawing";
import { useWindowSize } from "@uidotdev/usehooks";
import type { MouseEvent } from "react";

const ControlsDiv = styled.div`
    
    padding: 1rem;

    display: grid;
    grid-template-columns: max-content 1fr 80px;
    gap: 0.1rem 1rem; 
    padding: 0.3rem 1rem;

    & > div {
        display: grid;
        grid-column-start : 1;
        grid-column-end: 4;

        grid-template-columns: subgrid;
        & label {
            grid-column: 1 / 2;
            text-align: left;
            display: flex;
            justify-content: start;
            align-items: center;
        }

        & input:first-of-type {
            grid-column: 2 / 3;
        }
        & input:last-of-type {
            grid-column: 3 / 4;
            text-align: right;
            font-family: monospace;
            border: none;
        }
        
    }
`

function GliphView({ glyph, onClickElement }: {
    glyph: GlyphData;
    onClickElement: (i: number, e: MouseEvent) => void;
}) {
    const fontWeight = useFontProject(s => s.strokeWeight) || 50;
    return <g>
        {
            glyph.lines.map((l, i) => <path
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="black"
                fill="none"
                onPointerUp={(e) => {
                    console.log(e);
                    onClickElement(i, e);
                }}
                strokeWidth={fontWeight} key={i}
                d={pointToSVGPath(l)} />)
        }

    </g>;
}

const margin = 100;


function VLine({ y, name, color = "#177d9c" }: { y: number, name: string, color?: string }) {
    return <>
        <text x={-margin + 10} y={1000 - y - 20} fontSize={50} color={color} display={"none"}>{name}</text>
        <line x1={0 - margin} y1={1000 - y} x2={1000 + margin} y2={1000 - y} stroke={color} strokeWidth={2}></line>
    </>;
}
const BACKGROUND_GRID_SIZE = 100;

function HLine({ x, color = "#889c17" }: { x: number, color?: string }) {
    return <>
        <line x1={x} y1={-margin} x2={x} y2={2000} stroke={color} strokeWidth={2}></line>
    </>;
}
export function Canvas() {
    const font = useFontProject();
    const emDim = 1000 - font.descender + (1000 - font.ascender)
    const viewbox = [-margin, -margin, 1000 + margin * 2, emDim + margin * 2] as const;
    const { width: baseWidth, height: baseHeight } = useWindowSize();
    let svgWidth = Math.min((baseWidth || 0) * 0.90, 400);

    let canvasHeight = svgWidth * viewbox[3] / viewbox[2];
    if (canvasHeight > (baseHeight || 700) * 0.6) {
        const f = (baseHeight || 700) * 0.6 / canvasHeight
        svgWidth *= f;
        canvasHeight *= f;
    }
    const editedCanvas = useEditor(e => e.editedPage);
    const glyph = (font.glyph[editedCanvas])
    const { canvasRef, onPointerDown, onPointerMove, onPointerUp, editedLine, onClickElement } = useDrawing(viewbox);


    return <section>
        <svg

            ref={canvasRef}
            width={svgWidth}
            height={canvasHeight}
            viewBox={viewbox.join(" ")}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
                touchAction: "none",
                border: "1px solid black",
                background: `repeating-conic-gradient(#80808030 0 25%, #0000 0 50%)    50% / ${BACKGROUND_GRID_SIZE}px ${BACKGROUND_GRID_SIZE}px`
            }}
        >
            <VLine y={0} name={"baseLine"} />
            <VLine y={font.ascender} name={"Ascender"} />
            <VLine y={font.xHeight} name={"xHeight"} />
            <VLine y={font.descender} name={"xHeight"} />
            <HLine x={glyph?.start || 0} />
            <HLine x={(glyph?.start || 0) + (glyph?.width || 650)} />
            <rect stroke="green" strokeWidth={4} fill="none" x1={0} width={1000} y1={0} height={emDim} ></rect>
            <g>


                {
                    glyph ? <GliphView glyph={glyph} onClickElement={onClickElement} /> : null
                }


                {
                    editedLine ? <path strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="none" strokeWidth={font.strokeWeight} d={pointToSVGPath(editedLine)}></path> : null
                }

            </g>
        </svg>
        <ControlsDiv>
            <div>
                <label><IconStart></IconStart> Start</label>
                <input type='range' min={0} max={1000} value={glyph.start || 0} onChange={e => Editor.setGlyphSize(parseInt(e.target.value), glyph.width)} />
                <input type="number" min={0} max={1000} value={glyph.start} onChange={e => Editor.setGlyphSize(parseInt(e.target.value), glyph.width)} ></input>
            </div>
            <div>
                <label><IconWidth></IconWidth> Width</label>
                <input type='range' min={0} max={1000} value={glyph.width || 650} onChange={e => Editor.setGlyphSize(glyph.start || 0, parseInt(e.target.value))} />
                <input type="number" min={0} max={1000} value={glyph.width} onChange={e => Editor.setGlyphSize(glyph.start || 0, parseInt(e.target.value))} ></input>
            </div>

        </ControlsDiv>
    </section>;
}



