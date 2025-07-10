import { Stack } from "@mui/joy";
import CookieConsent from "react-cookie-consent";
import ComingSoonCard from "../../components/ComingSoonCard";
import AuthButton from "../../components/AuthButton";

function PlaceholderPage() {
  return (
    <>
      <Stack
        direction="column"
        gap={3}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <ComingSoonCard />
        <AuthButton />
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
