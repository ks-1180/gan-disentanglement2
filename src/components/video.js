import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Slider from '@mui/material/Slider';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

export default function VideoCard() {
    const [value, setValue] = useState(0);
    const videoRef = useRef(null);

    const video_path = `/videos/w/Black_Hair/0.mp4`;

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // Update the slider's max value whenever the video's duration changes
            video.onloadedmetadata = () => {
                // setValue(0);
            };

            video.ontimeupdate = () => {
                // setValue(video.currentTime*20);
            };
        }

        return () => {
            if (video) {
                video.onloadedmetadata = null;
                video.ontimeupdate = null;
            }
        };
    }, []);


    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        videoRef.current.currentTime = newValue/20;
    };

    return (
        <Card sx={{ padding: 3 }}>
            <Box alignContent='center' justifyContent='center' alignItems='center'>
                <center>
                    <CardMedia
                        sx={{ maxWidth: 256 }}
                        component="video"
                        src={video_path}
                        ref={videoRef}
                        title="green iguana"
                    />
                </center>
            </Box>
            <Slider
                value={value}
                onChange={handleSliderChange}
                min={0}
                max={100}
            />
        </Card>
    );
}