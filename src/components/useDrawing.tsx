import { useState, useRef, useCallback, type PointerEvent } from "react";
import * as simplify from "simplify-path";
import { Editor, useEditor } from "../hooks/useEditor";
import type { Line } from "../hooks/useFont";


export function useDrawing(viewbox: readonly [number, number, number, number]) {
    const canvasRef = useRef<SVGSVGElement>(null);
    const [editedLine, setEditedLine] = useState<null | Line>(null)
    const onPointerDown = useCallback((e: PointerEvent<SVGSVGElement>) => {
        if (!canvasRef.current || e.buttons !== 1) {
            return;
        }
        if (useEditor.getState().tool === "draw") {

            const { x, y } = getCanvasPosition(canvasRef.current, e, viewbox);
            setEditedLine(() => [x, y])
        }
    }, [viewbox]);

    const onPointerUp = useCallback((e: PointerEvent<SVGSVGElement>) => {
        if (!canvasRef.current || !editedLine) {
            return;
        }
        const { x, y } = getCanvasPosition(canvasRef.current, e, viewbox);
        if (editedLine) {
            const finalLine = optimizePoints([...editedLine, x, y]);
            console.log(finalLine)
            Editor.addLine(finalLine);
        }
        setEditedLine(null);
    }, [editedLine, viewbox]);

    const onPointerMove = useCallback((e: PointerEvent<SVGSVGElement>) => {
        if (!canvasRef.current || !editedLine) {
            return;
        }
        const { x, y } = getCanvasPosition(canvasRef.current, e, viewbox);

        if (editedLine) {
            setEditedLine([...editedLine, x, y]);
        }


    }, [editedLine, viewbox])

    const onClickElement = useCallback((i: number) => {
        if (useEditor.getState().tool === "erase") {

            Editor.removeLine(i);
        }
    }, []);

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onClickElement,
        editedLine,
        canvasRef
    }
}


export function getCanvasPosition(canvasRef: SVGSVGElement, e: PointerEvent<SVGSVGElement>, viewbox: readonly [number, number, number, number]) {
    const pointPosition = canvasRef.getBoundingClientRect();
    const tx = (e.clientX - pointPosition.left) / pointPosition.width;
    const ty = (e.clientY - pointPosition.top) / pointPosition.height;
    const x = viewbox[0] + tx * viewbox[2];
    const y = 1000 - (viewbox[1] + ty * viewbox[3]);
    return { x, y };
}


export function optimizePoints(points: number[]): number[] {

    const pointArray = points.reduce(
        ([points, lastPoint], n) => {
            if (lastPoint === undefined) {
                return [points, n] as [[number, number][], number | undefined];
            } else {
                const a = [...points, [lastPoint, n] as [number, number]];
                return [a, undefined] as [[number, number][], number | undefined];
            }
        },
        [[], undefined] as [[number, number][], number | undefined]
    )[0];
    const newPoints = simplify.default(pointArray, 1) as [number, number][];
    console.log(`was ${points.length} and now it's ${newPoints.length}`)
    return newPoints.flat();

}

export function pointToSVGPath(points: number[]) {
    return points.reduce((oldTxt: string, item: number, index: number) => {
        return `${oldTxt} ${index % 2 === 0 ? `L ${item},` : 1000 - item}`;
    }, `M ${points[0]}, ${1000 - points[1]}`);
}
