import {useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Fallback from "../assets/stockGraphs/AAPL.png";
import { Grid } from "@mui/material";
import './StockCard.css';
import {CircularProgress} from "@mui/material";


export default function StockCard(props) {
  const [refreshing, setRefreshing] = useState(false);
  const cardInfo = props.cardInfo;
  const priceDirection = cardInfo.percentChange.includes("-") ? "-" : "+";

  const refreshTicker = () => {
    // setRefreshing(true);
    props.onClick(cardInfo.ticker);
  }

  return (
        <Grid className="stock-card-grid" item>
          <Card className="stock-card" sx={{ width: 200, borderRadius: "1em"}} onClick={refreshTicker} >
            <CardMedia component="img" height="90" image={Fallback} alt="" />
            {refreshing ? <CircularProgress /> : <CardContent>
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
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
                ${cardInfo.priceChange} ({cardInfo.percentChange}%)
              </Typography>
            </CardContent>}
            <CardActions>
              <Button size="small">Expand</Button>
            </CardActions>
          </Card>
        </Grid>
  );
}
