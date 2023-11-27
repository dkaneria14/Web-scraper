from fastapi import FastAPI, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from database.database import DataBase
from database.basemodels import EmailRequest,User
from api import email
from datetime import datetime
import json
import pytz
import uvicorn
import yfinance as yf
import time
from yFinanceTempFix.yfFix import YFinance
from apscheduler.schedulers.background import BackgroundScheduler
from emails import StockEmail

app = FastAPI()

app.include_router(email.router)

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
    "http://localhost:80",
    "http://127.0.0.1:80",
    "http://localhost",
    "http://stockwatch.cloud",
    "http://www.stockwatch.cloud",
    "https://stockwatch.cloud",
    "https://www.stockwatch.cloud"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
scheduler = BackgroundScheduler()
scheduler.start()

@app.on_event("startup")
async def startup_event():
    obj = DataBase()
    scheduler.add_job(obj.getUserBase, "interval", seconds=3600)


@app.post("/insertList")
async def insert_user(user:User):
    obj = DataBase()
    #Send out the following a stock email
    StockEmail().follow_stock_email(user.email,user.stockList)
    #Complete insertion into User Information
    obj.insert_user_data(user)



@app.get("/getUserSetStockValues")
def get_stock_threshold_values(email: str = Query(...)):
    obj = DataBase()
    return obj.get_user_data(email)

@app.get("/stockList/{stockName}")
def get_stock_info(stockName: str):
    stock = YFinance(stockName)
    return stock.info

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


if __name__ == "__main__":
    uvicorn.run("stockWatchAPI:app", host="0.0.0.0", port=8000, reload=True)