import yfinance as yf
from fastapi import FastAPI

app = FastAPI()

@app.get("/my-first-api")

def hello(name: str):
    msft = yf.Ticker(name)
    return msft.info