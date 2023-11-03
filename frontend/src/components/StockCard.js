import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "../assets/stockGraphs/AAPL.png";
import Image2 from "../assets/stockGraphs/AMZN.png";
import { Grid } from "@mui/material";
import './StockCard.css';

export default function StockCard(props) {
  const cardInfo = props.cardInfo;
  const priceDirection = cardInfo.percentChange.includes("-") ? "-" : "+";
  return (
        <Grid className="stock-card" item xs={6} md={6}>
          <Card sx={{ width: 200, borderRadius: "1em" }}>
            <CardMedia component="img" height="90" image={Image} alt="" />
            <CardContent>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                color="gray"
              >
                {cardInfo.name}
              </Typography>
              <Typography variant="h5" color="black">
                {cardInfo.ticker} ${cardInfo.price}
              </Typography>
              {/* Edge case to consider soon: no price change -> black text */}
              <Typography variant="body1" color={priceDirection === "-" ? "red" : "green"}>
                {priceDirection} ${cardInfo.priceChange} ({cardInfo.percentChange}%)
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Expand</Button>
            </CardActions>
          </Card>
        </Grid>
  );
}
