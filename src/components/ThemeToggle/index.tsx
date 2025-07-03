// src/components/ThemeToggle.tsx
import { IconButton } from "@mui/joy";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { useColorScheme } from "@mui/joy/styles";

function ThemeToggle() {
    const { mode, setMode } = useColorScheme();

    return (
        <IconButton
            variant="soft"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
        >
            {mode === "light" ? <MdDarkMode /> : <MdLightMode />}
        </IconButton>
    );
}


export default ThemeToggle;