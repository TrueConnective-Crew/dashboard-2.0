import { useAuth0 } from "@auth0/auth0-react";
import {Button, Skeleton, Typography} from "@mui/joy";

function AuthButton() {
  const { isLoading, isAuthenticated, error, loginWithRedirect, logout } =
    useAuth0();

  if (isLoading) {
    return (
      <Skeleton variant={"inline"} animation="pulse" loading={isLoading}>
        <Button variant="soft" onClick={() => loginWithRedirect()}>
          Login / Register
        </Button>
      </Skeleton>
    );
  }

  if (error) {
    return <Typography level="body-md">Oops... {error.message}</Typography>;
  }

  if (isAuthenticated) {
    return (
      <Button
        variant="soft"
        onClick={() =>
          logout({
            logoutParams: { returnTo: window.location.origin },
          })
        }
      >
        Log out
      </Button>
    );
  } else {
    return (
      <Button variant="soft" onClick={() => loginWithRedirect()}>
        Login / Register
      </Button>

    );
  }
}

export default AuthButton;
