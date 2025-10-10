import { useEffect, useRef } from 'react';
import badge from "../assets/badge.png";
import { Stack, Button } from "@mui/joy";

interface Props {
    avatarUrl: string;
    userName: string;
}

function AvatarComposer({ avatarUrl, userName }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
            const canvas = canvasRef.current;
            if (!canvas) return;
            try {
                const avatarImg = await loadImage(avatarUrl);
                const overlayImg = await loadImage(badge);

                const size = Math.max(avatarImg.width, avatarImg.height, 512);
                canvas.width = size;
                canvas.height = size;

                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.clearRect(0, 0, size, size);
                ctx.drawImage(avatarImg, 0, 0, size, size);
                ctx.drawImage(overlayImg, 0, 0, size, size);
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

    function handleDownload(): void {
        const canvas = canvasRef.current;
        if (!canvas) return;
        try {
            const link = document.createElement("a");
            link.download = userName+'_tc-crew.png';
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (e) {
            console.error("Fehler beim Herunterladen des Profilbilds", e);
        }
    };

    return (
        <Stack direction="column" spacing={4}>
            <canvas ref={canvasRef} style={{ width: "256px", height: "256px" }} />
            <Button onClick={handleDownload} variant="soft" color="primary">
                Profilbild herunterladen
            </Button>
        </Stack>
    );
}

export default AvatarComposer;