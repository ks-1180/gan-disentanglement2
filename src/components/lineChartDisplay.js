// display most relevant line charts (10)

import { Card, CardContent } from "@mui/material";
import { LineChart } from "@component/components/lineChart";

export function LineChartDisplay(props) {
    const attributes = [
        "Arched_Eyebrows",
        "Bags_Under_Eyes",
        "Bald",
        "Bangs",
        "Big_Lips",
        "Black_Hair",
        "Blond_Hair",
        "Brown_Hair",
        "Bushy_Eyebrows",
        "Chubby"
    ]

    return (
        <Card
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <CardContent 
                sx={{ 
                    flexGrow: 1,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '20px'
                }}>
                {attributes.map((attribute, index) => (
                    <div key={index}>
                        <LineChart {...props} attribute={attribute}/>
                    </div>
                ))}
            </CardContent>
        </Card>
    );

}