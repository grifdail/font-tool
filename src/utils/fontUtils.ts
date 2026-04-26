import opentype, { Font } from "opentype.js"
import type { FontProject, GlyphData, Line } from "../hooks/useFont"
import getStroke from "perfect-freehand"

export const DEFAULT_GLYPH_LIST = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz.!?,:;+-*/\\%$\"'()[]{}#&<>=@_|"
const DEFAULT_GLYPH = Object.fromEntries(Array.from(DEFAULT_GLYPH_LIST).map(l => ([l, createEmptyGlyph()])))

export function createEmptyGlyph(): GlyphData {
    return ({ width: 650, lines: [], start: 0 })
}

export function addDefaultGlyph(font: FontProject): FontProject {
    return { ...font, glyph: { ...DEFAULT_GLYPH, ...font.glyph } }
}

export function exportFont(font: FontProject) {
    // this .notdef glyph is required.
    const notdefGlyph = new opentype.Glyph({
        name: '.notdef',
        advanceWidth: 650,
        path: new opentype.Path()
    });

    const spaceGlyph = new opentype.Glyph({
        name: 'space',
        unicode: " ".codePointAt(0),
        advanceWidth: 650,
        path: new opentype.Path()
    });

    const glyphs = Object.entries(font.glyph).map(([char, glyphData]) => {
        const aPath = convertLineToPath(glyphData.lines, glyphData.start || 0)


        // more drawing instructions...
        const aGlyph = new opentype.Glyph({
            name: char,
            unicode: char.codePointAt(0),
            advanceWidth: glyphData.width,
            path: aPath
        });
        return aGlyph;
    })

    return new Font({
        familyName: font.name,
        styleName: 'Medium',
        unitsPerEm: 1000,
        ascender: font.ascender,
        descender: font.descender,
        glyphs: [notdefGlyph, spaceGlyph, ...glyphs]
    });


}

function convertLineToPath(lines: Line[], xOffset: number) {
    const aPath = new opentype.Path()
    lines.forEach(line => {
        if (line.length >= 4) {
            addLineOutline(aPath, line.map((p, i) => (i % 2) === 0 ? p - xOffset : p));

        }
    })

    return aPath
}

export function updateGlyph(font: FontProject, glyphId: string, cb: (g: GlyphData) => GlyphData): FontProject {
    return {
        ...font,
        glyph: {
            ...font.glyph,
            [glyphId]: cb(font.glyph[glyphId] || createEmptyGlyph())
        }
    }
}

function addLineOutline(aPath: opentype.Path, line: Line, weight: number = 50) {
    weight *= 0.5
    const points: [number, number, number][] = [];
    for (let i = 0; i < line.length; i += 2) {
        points.push([line[i + 0], line[i + 1], 1])
    }
    const s = getStroke(points, {
        size: weight,
        simulatePressure: false,
        easing() {
            return 1
        },
    })
    aPath.moveTo(s[0][0], s[0][1])

    s.forEach(p => aPath.lineTo(p[0], p[1]))

}

export function createDefaultFont() {
    return addDefaultGlyph({
        glyph: {},
        name: "Font",
        weight: 400,
        ascender: 800,
        descender: -300,
        xHeight: 500,
    })
}