import { Card, CardContent, CardMedia, Slider } from "@mui/material";

function valuetext(value) {
  return `${value}`;
}

export function WalkDisplay({direction, walk}) {
  const path = `/walks/${direction.value}/${walk}.jpg`;
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia component="img" image={path} alt="s" />
      <CardContent sx={{ flexGrow: 1 }}>
      </CardContent>
    </Card>
  );
}
