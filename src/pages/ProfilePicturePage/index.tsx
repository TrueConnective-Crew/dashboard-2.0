// App.tsx
import type { TikTokUserResponse } from "../../utils/TikTokUserResponse.ts";
import AvatarComposer from "../../utils/ProfilePictureComposer.tsx";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

// MUI Joy
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Snackbar from "@mui/joy/Snackbar";
import Alert from "@mui/joy/Alert";
import {Divider} from "@mui/joy";

async function getProfilePicture(username: string) {
    const options = {
        method: "GET",
        url: "https://tiktok-api23.p.rapidapi.com/api/user/info",
        params: { uniqueId: username },
        headers: {
            "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
            "x-rapidapi-host": "tiktok-api23.p.rapidapi.com",
        },
    };

    try {
        const response = await axios.request(options);
        const result: TikTokUserResponse = response.data;
        console.log(result);
        return result.userInfo.user.avatarLarger;
    } catch (error) {
        console.error(error);
    }
}

type ToastState = {
    open: boolean;
    message: string;
    color: "success" | "warning" | "danger" | "neutral";
};

function ProfilePicturePage() {
    const [username, setUsername] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showComposer, setShowComposer] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localObjectUrl, setLocalObjectUrl] = useState<string | null>(null);

    // Ersatz für toaster.create(...)
    const [toast, setToast] = useState<ToastState>({
        open: false,
        message: "",
        color: "neutral",
    });

    const showToast = (
        message: string,
        color: ToastState["color"] = "neutral"
    ) => setToast({ open: true, message, color });

    const handleChooseOtherImage = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            showToast("Keine Datei ausgewählt", "warning");
            return;
        }
        // Revoke previous blob URL if any
        if (localObjectUrl) {
            URL.revokeObjectURL(localObjectUrl);
        }
        const url = URL.createObjectURL(file);
        setLocalObjectUrl(url);
        setAvatarUrl(url);
        setShowComposer(true);
        showToast("Eigenes Bild geladen", "success");
        // Reset input value to allow re-selecting the same file
        e.target.value = "";
    };

    useEffect(() => {
        return () => {
            if (localObjectUrl) {
                URL.revokeObjectURL(localObjectUrl);
            }
        };
    }, [localObjectUrl]);

    const handleGetProfilePicture = async () => {
        if (!username) {
            showToast("Bitte geben Sie einen Benutzernamen ein", "warning");
            return;
        }

        setIsLoading(true);
        setShowComposer(false);

        try {
            const url = await getProfilePicture(username);
            if (url) {
                setAvatarUrl(url);
                setShowComposer(true);
                showToast("Profilbild erfolgreich geladen", "success");
            } else {
                showToast("Kein Profilbild gefunden", "danger");
            }
        } catch (error) {
            console.error("Fehler:", error);
            const msg =
                error instanceof Error ? error.message : "Unbekannter Fehler";
            showToast(`Fehler beim Laden des Profilbilds: ${msg}`, "danger");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            minHeight="100dvh"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Card variant="outlined" sx={{ width: "auto", maxWidth: "100%" }}>
                <CardContent>
                    <Typography level="h2" textAlign="center" sx={{ mb: 2 }}>
                        TC Profilbild Generator
                    </Typography>

                    <Stack
                        direction="column"
                        alignItems="center"
                        spacing={2.5}
                        sx={{ mt: 1 }}
                    >
                        <Input
                            placeholder="TikTok Anmeldename"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            size="lg"
                            sx={{
                                width: 320,
                                "& input": { textAlign: "center" },
                            }}
                        />

                        <Button
                            onClick={handleGetProfilePicture}
                            loading={isLoading}
                            loadingIndicator="Generiere Profilbild..."
                            variant="solid"
                            color="primary"
                            size="lg"
                            sx={{ width: 320 }}
                        >
                            Profilbild generieren!
                        </Button>

                        {showComposer && avatarUrl && (
                            <AvatarComposer avatarUrl={avatarUrl}/>
                        )}

                        <Divider>
                            Oder
                        </Divider>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelected}
                            style={{ display: "none" }}
                        />
                        <Button
                            onClick={handleChooseOtherImage}
                            variant="soft"
                            color="primary"
                            size="lg"
                            sx={{ width: 320 }}
                        >
                            Eigenes Bild hochladen
                        </Button>

                    </Stack>
                </CardContent>
            </Card>

            <Snackbar
                open={toast.open}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                autoHideDuration={3000}
            >
                <Alert color={toast.color} variant="soft">
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ProfilePicturePage;
