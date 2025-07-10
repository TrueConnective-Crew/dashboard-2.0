import { Stack } from "@mui/joy";
import CookieConsent from "react-cookie-consent";
import ComingSoonCard from "../../components/ComingSoonCard";

function PlaceholderPage() {
  return (
    <>
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
      <CookieConsent
        buttonText="Okay, verstanden!"
        style={{ fontFamily: "Inter" }}
        buttonStyle={{ fontFamily: "Inter", fontWeight: "bold" }}
      >
        Diese Website nutzt Cookies um die Erfahrung der Nutzer zu verbessern.
      </CookieConsent>
    </>
  );
}

export default PlaceholderPage;
