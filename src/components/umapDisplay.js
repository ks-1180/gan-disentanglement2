import { Card, CardContent, CardMedia, Slider } from "@mui/material";
import Scatterplot from "@component/components/umapScatterplot";

export function UmapDisplay(props) {
    return (
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Scatterplot {...props}/>
          </CardContent>
          {/* <CardActions>
                      <Button size="small">View</Button>
                      <Button size="small">Edit</Button>
                    </CardActions> */}
        </Card>
      );
}