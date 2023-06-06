import { Card, CardContent, CardMedia, Slider } from "@mui/material";
import RadarChart from "@component/components/radarChart";

export function RadarChartDisplay(props) {
    return (
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ flexGrow: 1}}>
            <RadarChart {...props}/>
          </CardContent>
        </Card>
      );
}