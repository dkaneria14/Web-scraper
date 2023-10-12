import yfinance as yf
from fastapi import FastAPI
from database.database import DataBase

app = FastAPI()

@app.get("/my-first-api")

def hello(name: str):
    msft = yf.Ticker(name)
    return msft.info

@app.get("/stocklist")

def get_list():
    obj = DataBase()
    return obj.get_stocks()