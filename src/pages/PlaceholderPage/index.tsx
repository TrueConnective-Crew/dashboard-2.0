import {Stack} from "@mui/joy";
import ComingSoonCard from "../../components/ComingSoonCard";

function PlaceholderPage() {
    return (
        <Stack
            direction="row"
            sx={{
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
            }}
        >
            <ComingSoonCard />
        </Stack>
    )
}

export default PlaceholderPage;