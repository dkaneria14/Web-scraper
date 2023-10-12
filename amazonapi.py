import yfinance as yf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import DataBase


app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/my-first-api")

def hello(name: str):
    msft = yf.Ticker(name)
    return msft.info

@app.get("/stocklist")

def get_list():
    obj = DataBase()
    return obj.get_stocks()