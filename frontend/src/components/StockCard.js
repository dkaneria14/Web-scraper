import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Uptrend from "../assets/stockGraphs/uptrend.png";
import Downtrend from "../assets/stockGraphs/downtrend.png";
import { Grid } from "@mui/material";
import './StockCard.css';
import { CircularProgress } from "@mui/material";
import StockDialog from "./StockDialog";
import { useState } from "react";

const trendOptions = {
  up: {textColor: 'green', img: Uptrend},
  down: {textColor: 'red', img: Downtrend},
};

export default function StockCard(props) {

  const { onClick, userEmail } = props;
  const { cardInfo, ...stockInfo } = props.stockData;

  // Dialog states 
  const [open, setOpen] = useState(false);
  // const [dialogStock, setDialogStock] = useState({});

  let priceDirection;
  if (!cardInfo.refreshing) {
    priceDirection = cardInfo.percentChange.includes("-") ? "-" : "+"
  }


  const handleStockDialog = () => {
    // setting stock info for that respective dialog box, then open dialog with setOpen = true 
    setOpen(true);
  }

  const refreshTicker = () => {
    onClick(cardInfo.ticker);
  }

  const trendDirection = priceDirection === "-" ? 'down' : "up";

  return (
    <Grid className="stock-card-grid" item>
      <Card className="stock-card" sx={{ width: 200, borderRadius: "1em" }} >
        <CardMedia component="img" height="90" image={trendOptions[trendDirection].img} alt="" onClick={refreshTicker} />
        {cardInfo.refreshing ? <CircularProgress sx={{ m: 3 }} /> : <CardContent onClick={refreshTicker}>
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
          >
            {cardInfo.name}<br/><br/>
          </Typography>
          <Typography variant="h5">
            {cardInfo.ticker} ${cardInfo.price}
          </Typography>
          {/* Edge case to consider soon: no price change -> black text */}
          <Typography variant="body1" color={trendOptions[trendDirection].textColor}>
            ${cardInfo.priceChange} ({cardInfo.percentChange}%)
          </Typography>
        </CardContent>}
        <CardActions>
          <Button size="small" onClick={handleStockDialog}>Expand</Button>
        </CardActions>
      </Card>
      {/* Only render on expand*/}
      {open ? <StockDialog open={open} setOpen={setOpen} stockInfo={stockInfo} userEmail={userEmail} /> : null}
    </Grid>
  );
}
