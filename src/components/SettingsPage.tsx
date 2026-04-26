import styled from "styled-components";
import { useFontProject } from "../hooks/useFont";
import { navigate } from "wouter/use-browser-location";

const StyledAboutPage = styled.div`
    text-align: left;
    padding: 1rem;
    display: grid;
    grid-template-columns: max-content 1fr 80px;
    gap: 1rem;

    & > button {
        grid-column: 1 / 4;
    }
    & > div {
        display: grid;
        grid-column-start : 1;
        grid-column-end: 4;

        &.range-field {
            grid-template-columns: subgrid;

            & input:first-of-type {
                grid-column: 1 / 3;
            }
            & input:last-of-type {
                grid-column: 3 / 4;
                text-align: right;
                font-family: monospace;
                border: none;
            }
        }
    }
`

export function SettingsPage() {
    const font = useFontProject();

    return <StyledAboutPage>
        <button onClick={() => navigate("/edit")}>Close</button>
        <div className="text-field">
            <label>Font Name</label>
            <input
                value={font.name}
                onChange={e => useFontProject.setState({ name: e.target.value })}
            ></input>
        </div>
        <div className="text-field">
            <label>Author</label>
            <input
                value={font.author}
                onChange={e => useFontProject.setState({ author: e.target.value })}
            ></input>
        </div>
        <div className="range-field">
            <label>Ascends</label>
            <input
                value={font.ascender}
                type="range"
                min={0}
                max={1000}
                onChange={e => useFontProject.setState({ ascender: parseInt(e.target.value) })}
            ></input>
            <input
                type="number"
                value={font.ascender} onChange={e => useFontProject.setState({
                    ascender: Math.max(Math.min(parseInt(e.target.value), 1000), 0)
                })}></input>
        </div>

        <div className="range-field">
            <label>X-Height</label>

            <input
                value={font.xHeight}
                type="range"
                min={0}
                max={1000}
                onChange={e => useFontProject.setState({ xHeight: parseInt(e.target.value) })}
            ></input>
            <input
                type="number"
                value={font.xHeight}
                onChange={e => useFontProject.setState({
                    xHeight: Math.max(Math.min(parseInt(e.target.value), 1000), 0)
                })}></input>
        </div>

        <div className="range-field">
            <label>Descent</label>
            <input
                value={-font.descender}
                type="range"
                min={0}
                max={1000}
                onChange={e => useFontProject.setState({ descender: -parseInt(e.target.value) })}
            ></input>
            <input
                type="number"
                min="-1000"
                max="0"
                value={font.descender}
                onChange={e => useFontProject.setState({
                    descender: -Math.max(Math.min(-parseInt(e.target.value), 1000), 0)
                })}></input>
        </div>

        <div className="range-field">
            <label>Stroke Weight</label>
            <input
                value={font.strokeWeight}
                type="range"
                min={1}
                max={200}
                onChange={e => useFontProject.setState({ strokeWeight: parseInt(e.target.value) })}
            ></input>
            <input
                type="number"
                value={font.strokeWeight}
                onChange={e => useFontProject.setState({
                    strokeWeight: Math.max(Math.min(parseInt(e.target.value), 200), 0)
                })}></input>
        </div>
    </StyledAboutPage >
}