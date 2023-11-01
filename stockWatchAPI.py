
import yfinance as yf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import DataBase
import datetime
import pytz
import json

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stockList/{stockName}")

def get_stock_info(stockName:str):
    # stock_symbol = "NVDA"
    print (stockName)
    nvda_stock = yf.Ticker(stockName)
    return nvda_stock.info

@app.get("/stocklistDB")

def get_list():
    obj = DataBase()
    return obj.get_stocks()

@app.get("/stock/{stockName}")
def filter(stockName: str):
    wholeStockInfo = yf.Ticker(stockName)
    
    shortName = wholeStockInfo.info["shortName"]
    currentPrice = float(wholeStockInfo.info["currentPrice"])
    est_timezone = pytz.timezone('US/Eastern')
    current_time = str(datetime.datetime.now().time())
    current_date = str(datetime.date.today())
    
    
    my_json_string = json.dumps({'stockName': stockName, 'shortName': shortName, 'currentPrice': currentPrice, 'currentDate': current_date, 'currentTime': current_time})
    my_json = json.loads(my_json_string)
    return my_json
       