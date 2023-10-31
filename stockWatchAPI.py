
import yfinance as yf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import DataBase
from emailService import EmailService
from pydantic import BaseModel
import datetime
import pytz
import json
import secrets

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000"
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


# Email Verification/Send Email code. This endpoint will have to be changed once user accounts are added - wouldn't want random users to be able to just bruteforce
# and check if a user is registered but for now, good enough.
@app.get("/email/verified/{email}")
def checkEmailVerification(email: str):
    data = DataBase()
    return data.get_verified_email(email)

def generate_verification_code():
    code = secrets.randbelow(1000000)
    return f'{code:06d}'

class EmailAddress(BaseModel):
    email: str

@app.post('/email/send_code/')
async def send_code(emailData: EmailAddress):
    db = DataBase()
    email = emailData.email
    code = generate_verification_code()
    subject = "StockWatch Verification Code"
    body = "Your verification code is: " + code + "."
    service = EmailService()
    x = db.store_verification_code(email, code)
    print(x)
    try:
        service.send_email(subject, body, email)
        return f"Code successfully sent to: {email}"
    except:
        return None

class ValidateVerificationCode(BaseModel):
    email: str
    code: str

@app.post('/email/validate_code/')
async def validate_code(data: ValidateVerificationCode):
    db = DataBase()
    email = data.email
    code = data.code
    validCode = db.check_code_valid(email, code)
    if (validCode):
        # Add email to verified list of emails
        db.add_verified_email(email)
        # Create a welcome email for verifying
        subject = "Thank you for verifying your email"
        body = "Your email has been verified for use on StockWatch. Watch your stock around the clock."
        service = EmailService()
        service.send_email(subject, body, email)
        return "Code verified"
    else:
        return None
