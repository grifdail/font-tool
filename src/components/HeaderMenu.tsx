import { Menu, MenuItem } from "@szhsin/react-menu";
import { IconChevonLeft, IconMenu, IconPreview, IconDownload, IconInfo, IconChevonRight, IconDraw, IconErase, IconReset } from "./Icon";
import styled from "styled-components";
import { Editor, useEditor } from "../hooks/useEditor";
import { useFontProject } from "../hooks/useFont";

const Header = styled.header`
    display: flex;
    gap: 0.3rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;

    & span {
        flex-grow: 1;
        font-size: 2rem;
        margin: 0
    }

`

export function HeaderMenu() {
    const font = useFontProject();
    const tool = useEditor(s => s.tool);
    const editedGlyph = useEditor(s => s.editedPage);

    return <Header>
        <button onClick={Editor.movePrev}><IconChevonLeft></IconChevonLeft></button>
        <button onClick={() => Editor.toggleTool()}>{tool === "draw" ? <IconDraw></IconDraw> : <IconErase></IconErase>} </button>
        <button onClick={() => Editor.resetGlyph()}><IconReset></IconReset></button>

        <Menu menuButton={<span>{editedGlyph}</span>} portal overflow="auto">
            {Object.keys(font.glyph).map(key => <MenuItem key={key} onClick={() => Editor.setEditedGlyph(key)}>{key}</MenuItem>)}
            <MenuItem onClick={() => Editor.resetFont()}><IconReset /> Reset</MenuItem>

        </Menu>

        <Menu menuButton={<button><IconMenu></IconMenu></button>}>
            <MenuItem onClick={() => Editor.resetFont()}><IconReset /> Reset</MenuItem>
            <MenuItem><IconPreview></IconPreview> Preview</MenuItem>
            <MenuItem onClick={() => Editor.exportAndDownload()}><IconDownload></IconDownload> Download</MenuItem>
            <MenuItem><IconInfo></IconInfo> About</MenuItem>
        </Menu>
        <button onClick={Editor.moveNext}><IconChevonRight></IconChevonRight></button>
    </Header>;
}
