import { create } from "zustand";
import { createDefaultFont } from "../utils/fontUtils";
import { persist } from "zustand/middleware";

export type Line = number[];
export type GlyphData = {
    lines: Line[],
    width: number,
    start: number
}

export type FontProject = {
    glyph: Record<string, GlyphData>,
    name: string,
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
    ascender: number,
    descender: number,
    xHeight: number
}

export const useFontProject = create<FontProject>()(persist(() => {

    return createDefaultFont()
}, { name: "font-project" }))


