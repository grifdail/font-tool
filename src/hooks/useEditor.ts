import { create } from "zustand";
import { useFontProject, type Line } from "./useFont";
import { createDefaultFont, exportFont, updateGlyph } from "../utils/fontUtils";
import { saveAs } from "file-saver";


type ToolType = "draw" | "erase"
type EditorStore = {
    editedPage: string,
    tool: ToolType

}

export const useEditor = create<EditorStore>()(() => {
    return {
        editedPage: "A",
        tool: "draw"
    }
})

export const Editor = {
    toggleTool(tool?: ToolType) {
        useEditor.setState(state => ({ tool: tool ? tool : (state.tool === "draw" ? "erase" : "draw") }))
    },
    moveNext() {
        useEditor.setState((state) => {
            const glyphs = Object.keys(useFontProject.getState().glyph);
            const currentIndex = glyphs.indexOf(state.editedPage);
            if (currentIndex >= 0) {
                return { editedPage: glyphs[(currentIndex + 1) % glyphs.length] }
            }
            return state;
        })
    },
    setEditedGlyph(editedPage: string) {
        useEditor.setState({ editedPage })
    },
    movePrev() {
        useEditor.setState((state) => {
            const glyphs = Object.keys(useFontProject.getState().glyph);
            const currentIndex = glyphs.indexOf(state.editedPage);
            if (currentIndex >= 0) {
                return { editedPage: glyphs[(currentIndex === 0 ? glyphs.length : currentIndex) - 1] }
            }
            return state;
        })

    },
    removeLine(i: number) {
        useFontProject.setState((s) => updateGlyph(s, useEditor.getState().editedPage, (g) => {
            return {
                ...g,
                lines: g.lines.toSpliced(i, 1)
            }
        }))
    },
    addLine(l: Line) {
        useFontProject.setState((s) => updateGlyph(s, useEditor.getState().editedPage, (g) => {
            return {
                ...g,
                lines: [...g.lines, l]
            }
        }))
    },
    resetGlyph() {
        useFontProject.setState((s) => updateGlyph(s, useEditor.getState().editedPage, (g) => {
            return {
                ...g,
                lines: []
            }
        }))
    },
    setGlyphSize(start: number, width: number) {
        useFontProject.setState((s) => updateGlyph(s, useEditor.getState().editedPage, (g) => {
            return {
                ...g,
                start: Math.max(Math.min(start, 1000), 0),
                width: Math.max(Math.min(width, 1000), 0)
            }
        }))
    },
    resetFont() {
        useFontProject.setState(createDefaultFont())
    },
    exportAndDownload() {
        const f = useFontProject.getState();
        const op = exportFont(f);

        saveAs(new Blob([op.toArrayBuffer()], { type: "font/otf" }), "font.otf")
    }
}