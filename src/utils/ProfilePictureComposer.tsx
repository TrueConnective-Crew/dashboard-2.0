import { useEffect, useRef } from 'react';
import badge from "../assets/badge.png"; // Original
import badge1 from "../assets/badge1.png"; // Orange
import badge2 from "../assets/badge2.png"; // Rot
import {Stack, Dropdown, MenuButton, Menu, MenuItem, ListDivider, Typography} from "@mui/joy";

interface Props {
    avatarUrl: string;
    userName: string;
}

function AvatarComposer({ avatarUrl, userName }: Props) {
    const canvasRef_original = useRef<HTMLCanvasElement>(null);
    const canvasRef_orange = useRef<HTMLCanvasElement>(null);
    const canvasRef_red = useRef<HTMLCanvasElement>(null);

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((res, rej) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = src;
        });
    };

    useEffect(() => {
        let isCancelled = false;
        const render = async () => {
            const canvas_original = canvasRef_original.current;
            const canvas_orange = canvasRef_orange.current;
            const canvas_red = canvasRef_red.current;
            if (!canvas_original) return;
            if (!canvas_orange) return;
            if (!canvas_red) return;
            try {
                const avatarImg = await loadImage(avatarUrl);
                const overlayImg_original = await loadImage(badge);
                const overlayImg_orange = await loadImage(badge1);
                const overlayImg_red = await loadImage(badge2);

                const size = Math.max(avatarImg.width, avatarImg.height, 512);
                canvas_original.width = size;
                canvas_original.height = size;

                canvas_orange.width = size;
                canvas_orange.height = size;

                canvas_red.width = size;
                canvas_red.height = size;

                //
                // Render the original image
                //
                const ctx_original = canvas_original.getContext("2d");
                if (!ctx_original) return;

                ctx_original.clearRect(0, 0, size, size);
                ctx_original.drawImage(avatarImg, 0, 0, size, size);
                ctx_original.drawImage(overlayImg_original, 0, 0, size, size);

                //
                // Render the orange variant
                //
                const ctx_orange = canvas_orange.getContext("2d");
                if (!ctx_orange) return;

                ctx_orange.clearRect(0, 0, size, size);
                ctx_orange.drawImage(avatarImg, 0, 0, size, size);
                ctx_orange.drawImage(overlayImg_orange, 0, 0, size, size);

                //
                // Render the red variant
                //
                const ctx_red = canvas_red.getContext("2d");
                if (!ctx_red) return;

                ctx_red.clearRect(0, 0, size, size);
                ctx_red.drawImage(avatarImg, 0, 0, size, size);
                ctx_red.drawImage(overlayImg_red, 0, 0, size, size);

            } catch (e) {
                console.error("Fehler beim Rendern des Profilbilds", e);
            }
        };
        if (!isCancelled && avatarUrl) {
            void render();
        }
        return () => {
            isCancelled = true;
        };
    }, [avatarUrl]);

    function triggerDownload(canvas: HTMLCanvasElement | null, fileName: string) {
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = fileName;
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    function handleDownloadAll(): void {
        try {
            triggerDownload(canvasRef_original.current, `${userName}_tc-crew-original.png`);
            triggerDownload(canvasRef_orange.current, `${userName}_tc-crew-orange.png`);
            triggerDownload(canvasRef_red.current, `${userName}_tc-crew-red.png`);
        } catch (e) {
            console.error("Fehler beim Herunterladen der Profilbilder", e);
        }
    };

    function handleDownloadVariant(variant: string): void {
        try {
            let target: HTMLCanvasElement | null = null;
            let suffix = variant;
            switch (variant) {
                case "original":
                    target = canvasRef_original.current;
                    break;
                case "orange":
                    target = canvasRef_orange.current;
                    break;
                case "red":
                    target = canvasRef_red.current;
                    break;
                default:
                    target = canvasRef_original.current;
                    suffix = "original";
            }
            triggerDownload(target, `${userName}_tc-crew-${suffix}.png`);
        } catch (e) {
            console.error("Fehler beim Herunterladen des Profilbilds", e);
        }
    };

    return (
        <Stack direction="column" spacing={4}>
            <Stack direction={"row"} spacing={4}>
                <Stack direction={"column"} spacing={2}>
                    <canvas ref={canvasRef_original} style={{ width: "256px", height: "256px" }} />
                    <Typography textAlign={"center"}>Original</Typography>
                </Stack>

                <Stack direction={"column"} spacing={2}>
                    <canvas ref={canvasRef_orange} style={{ width: "256px", height: "256px" }} />
                    <Typography textAlign={"center"}>Orange</Typography>
                </Stack>

                <Stack direction={"column"} spacing={2}>
                    <canvas ref={canvasRef_red} style={{ width: "256px", height: "256px" }} />
                    <Typography textAlign={"center"}>Red</Typography>
                </Stack>
            </Stack>

            <Dropdown>
                <MenuButton>Download Profilepicture</MenuButton>
                <Menu>
                    <MenuItem onClick={handleDownloadAll}>All Profilepictures</MenuItem>
                    <ListDivider />
                    <MenuItem onClick={() => handleDownloadVariant("original")}>Original</MenuItem>
                    <MenuItem onClick={() => handleDownloadVariant("orange")}>Orange</MenuItem>
                    <MenuItem onClick={() => handleDownloadVariant("red")}>Red</MenuItem>
                </Menu>
            </Dropdown>
            
        </Stack>
    );
}

export default AvatarComposer;