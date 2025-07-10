import { Card, Typography } from "@mui/joy";

function ComingSoonCard() {
  return (
    <Card
      variant={"outlined"}
      color={"primary"}
      sx={{ minWidth: 243, maxWidth: 500 }}
    >
      <Typography
        level="title-md"
        textColor="inherit"
        textAlign="center"
        sx={{ textTransform: "capitalize" }}
      >
        Coming Soon
      </Typography>
    </Card>
  );
}

export default ComingSoonCard;
