import { Editor, useEditor } from "../hooks/useEditor";
import { useFontProject, type GlyphData } from "../hooks/useFont";
import { IconStart, IconWidth } from "./Icon";
import { pointToSVGPath, useDrawing } from "./useDrawing";

const STROKE_HEIGHT = 50;


function GliphView({ glyph, onClickElement }: {
    glyph: GlyphData;
    onClickElement: (i: number) => void;
}) {

    return <g>
        {
            glyph.lines.map((l, i) => <path
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="black"
                fill="none"
                onPointerUp={(e) => {
                    console.log(e);
                    e.preventDefault();
                    e.stopPropagation();
                    onClickElement(i);
                }}
                strokeWidth={STROKE_HEIGHT} key={i}
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
    const canvasHeight = 400 * viewbox[3] / viewbox[2];
    const editedCanvas = useEditor(e => e.editedPage);
    const glyph = (font.glyph[editedCanvas])
    const { canvasRef, onPointerDown, onPointerMove, onPointerUp, editedLine, onClickElement } = useDrawing(viewbox);


    return <section>
        <svg

            ref={canvasRef}
            width={400}
            height={canvasHeight}
            viewBox={viewbox.join(" ")}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
                border: "1px solid black", background: `repeating-conic-gradient(#80808030 0 25%, #0000 0 50%)    50% / ${BACKGROUND_GRID_SIZE}px ${BACKGROUND_GRID_SIZE}px`
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
                    editedLine ? <path strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="none" strokeWidth={STROKE_HEIGHT} d={pointToSVGPath(editedLine)}></path> : null
                }

            </g>
        </svg>
        <div>
            <div>
                <IconStart></IconStart><input type='range' min={0} max={1000} value={glyph.start || 0} onChange={e => Editor.setGlyphSize(parseInt(e.target.value), glyph.width)} />
            </div>
            <div>
                <IconWidth></IconWidth><input type='range' min={0} max={1000} value={glyph.width || 650} onChange={e => Editor.setGlyphSize(glyph.start || 0, parseInt(e.target.value))} />
            </div>

        </div>
    </section>;
}



