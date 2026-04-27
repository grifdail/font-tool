
import { useEffect, useMemo, useState } from "react";
import { useFontProject } from "../hooks/useFont";
import { DEFAULT_GLYPH_LIST, exportFont } from "../utils/fontUtils";
import { useDebounce } from "@uidotdev/usehooks";
import { Menu, MenuItem } from "@szhsin/react-menu";
import styled from "styled-components";
import { IconFontSize } from "./Icon";


const StyledFooter = styled.footer`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1rem;

    & > div.controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.3rem;

        & label {
            word-wrap: nowrap;
            flex: 0 0 auto;
        }

        & input {
            flex: 1 1 auto;
        }

        & input[type="number"] {
            appearance: none;
            -moz-appearance: textfield;
            we

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        }

        & button {
            flex: 0 0 auto;
        }
    }

    & > textarea {
        align-self: stretch;
        display: block;
        resize: none;
        flex: 1 1 auto;
    }

`

const PREVIEW_TEXT = {
    List: DEFAULT_GLYPH_LIST,
    QuickBrownFox: "The quick brown fox jumps over the lazy dog",
    LoremIpsum: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    Autogram: "This pangram contains four As, one B, two Cs, one D, thirty Es, six Fs, five Gs, seven Hs, eleven Is, one J, one K, two Ls, two Ms, eighteen Ns, fifteen Os, two Ps, one Q, five Rs, twenty-seven Ss, eighteen Ts, two Us, seven Vs, eight Ws, two Xs, three Ys, & one Z.",
    Minautor: `I know what's going on here.
I know what's going on here. Okay? I do. And if you want me to wander backstage to... "spill the beans..."... 

It's the final question, right? 
They're in the loop! I'm the only one out of the loop it would seem. 
And if we check my POINT TOTAL HERE, I don't NEED to walk to the front! Because I KNOW what it is! It's a big ol' GOOSE EGG, GANG! A FAT ZERO! HELLO! A LITTLE LATE ADDITION TO NUMERICAL SYMBOL CHART BROUGHT TO US BY OUR FRIENDS IN ARABIA. A LITTLE BIT OF TRIVIA ABOUT THE HISTORY OF NUMBERS. THAT KIND OF LITTLE TIDBIT WOULD SERVE ME WELL IN MOST TRIVIA GAMES, UNLESS IT HAD BEEN RIGGED FROM THE BEGINNING! OHHH, I'VE ONLY JUST BEGUN TO PULL THE THREAD ON THIS SWEATER! FRIENDS! YOU WOULD THINK, IN A GAME, WHERE THERE ARE ONLY TWO POSSIBLE CORRECT CHOICES, THAT ONE WOULD STUMBLE INTO THE RIGHT ANSWER EVERY SO OFTEN, WOULDN'T YOU? IN FACT, THE PROBABILITY OF NEVER GUESSING RIGHT IN THE FULL GAME IS A STATISTICAL WONDER! AND YET, HERE WE ARE! 

Introduced in the top of the game as a champion, what do you think that MEANS? 
Icarus, flying too close to the sun... But it seems, DAEDALUS, our little MASTER CRAFTER over here, HAD SOME WAX WINGS OF HIS OWN. He wanted to see his son fall from the sky, OH how CLOSE to the SUN HE FLEW! WELL, I'M NOT! HAVING IT! 
I've SOLVED your labyrinth, PUZZLEMASTER! 

THE MINOTAUR'S ESCAPED, AND YOU'RE GONNA GET THE HORNS, BUDDY.`
}

export function PreviewFooter() {

    const font = useFontProject();

    const debouncedFont = useDebounce(font, 1000);



    const fontUrl = useMemo(() => {
        const font = exportFont(debouncedFont);
        const blob = new Blob([font.toArrayBuffer()], { type: "font/otf" });
        const url = URL.createObjectURL(blob);
        return url;
    }, [debouncedFont])

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(fontUrl)
        }
    }, [fontUrl])


    const style = useMemo(() => `
        @font-face {
            font-family: "test";
            src: url("${fontUrl}") format("opentype");
        }

    textarea.preview {
        font-family: "test";
        color: black;
    }
    `, [fontUrl])


    const [previewText, setPreviewText] = useState(PREVIEW_TEXT.List);
    const [fontSize, setFontSize] = useState(45);
    return <StyledFooter>
        <style >{style}</style>
        <div className="controls">
            <label><IconFontSize></IconFontSize> Size</label>
            <input type="range" min="5" max="200" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))}></input>
            <input type="number" min="5" max="200" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))}></input>
            <Menu menuButton={<button>Presets</button>}>
                {
                    Object.entries(PREVIEW_TEXT).map(([name, content]) => <MenuItem onClick={() => setPreviewText(content)} key={name}>{name}</MenuItem>)
                }
            </Menu>
        </div>

        <textarea className="preview" value={previewText} style={{ fontSize: `${fontSize}px` }} onChange={e => setPreviewText(e.target.value)}></textarea>
    </StyledFooter>;
}
