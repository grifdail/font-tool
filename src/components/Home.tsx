import { Canvas } from "./Canvas";
import { HeaderMenu } from "./HeaderMenu";
import { PreviewFooter } from "./PreviewFooter";

export function Home() {
    return (
        <>
            <HeaderMenu />
            <Canvas />
            <PreviewFooter />
        </>
    )
}