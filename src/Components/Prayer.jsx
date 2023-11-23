import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
export default function Prayer({name,time,image}) {
  return (
    <Card sx={{ width: "14vw" }}>
    <CardMedia
      component="img"
      alt=""
      height="140"
      image={image}
    />
    <CardContent>
      <h2>
      {name}
      </h2>
      <Typography variant="h3" color="text.secondary">
{time}
      </Typography>
    </CardContent>
  </Card>
  )
}
