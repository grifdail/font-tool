import styled from "styled-components";
import { Link } from "wouter";

const StyledAboutPage = styled.div`
    text-align: left;
    padding: 1rem;
`

export function AboutPage() {

    return <StyledAboutPage>
        <h1>Grifdail's font creator</h1>

        <p>Hi ! I'm <a href="https://grifdail.fr">Julien</a> and I made this litle tool to create font based on your own handwritting.</p>

        <p>To get started click next bellow and start drawing.</p>

        <Link href="/edit">Edit</Link>

        <p>
            You should try to keep you character in the green box. <br />
            The first horizontal line represent the ascend height of your font. This should be the height where you uppercase characters and tall letters extends to.<br />
            The next one is the x-height, it represent the height of the lowercase letters like 'a', 's' or 'x'.<br />
            Then there's the baseline. It's where all of your character will sit.<br></br>
            Finaly, the last horizontal line represent your font descent height. This is the height dropping character like 'p' or 'j' should go.<br></br>
            You can adjust the position of these guidew in your font setting<br></br>

            (Technically, you can ignore these guideline but your fon't will look more consistent and will align better if you stick to them)

        </p>
        <p>
            On the horizontal axis, the first green line represente the start of the character and the second one represent its width. <br></br>
            You can (and should) adjust these value for each character with the slider bellow.
        </p>
        <p>
            Press the Left and Right arrow at the top to go to the next character. You can also click on the character to quickly go to a specific glyph.
        </p>
        <p>
            You can preview your font at the bottom of the screen.
        </p>
        <p>
            This app use <a href='https://github.com/opentypejs/opentype.js'>opentype.js</a>. The source can be found <a href="">here</a>.
        </p>
    </StyledAboutPage>
}