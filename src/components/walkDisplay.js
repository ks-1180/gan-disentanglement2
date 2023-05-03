import { Card, CardContent, CardMedia, Slider } from "@mui/material";

function valuetext(value) {
  return `${value}`;
}

export function WalkDisplay({direction, walk}) {
  const path = `/walks/${direction.value}/${walk}.jpg`;
  console.log(path);
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
{/*         <Slider
          aria-label="Temperature"
          defaultValue={10}
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={10}
        /> */}
      </CardContent>
      {/* <CardActions>
                  <Button size="small">View</Button>
                  <Button size="small">Edit</Button>
                </CardActions> */}
    </Card>
  );
}
