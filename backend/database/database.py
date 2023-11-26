import pymongo 
import certifi
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime, timedelta
from pydantic import BaseModel


class Stock(BaseModel):
    name:str
    threshold:float
    isAbove:bool
    date:str

class User(BaseModel):
    email: str
    stockList:list[Stock]
        

class EmailRequest(BaseModel):
    email: str


class DataBase:
    DB = None
    def __init__(self):
        uri = "mongodb+srv://stock-admin:secure_pass123@cluster0.csya3y9.mongodb.net/?retryWrites=true&w=majority"
        # Create a new client and connect to the server
        client = MongoClient(uri, server_api=ServerApi('1'),tlsCAFile=certifi.where())
        DataBase.DB = client["StockDataBase"]
        self.collection = DataBase.DB["StockNames"]


    def get_stocks(self):
        self.collection = DataBase.DB["StockNames"]
        obj = self.collection.find_one()
        return(obj["stocks"])

    def get_verified_email(self, email: str):
        self.collection = DataBase.DB["VerifiedEmails"]
        existing_email = self.collection.find_one({'email': email}, {'_id': 0})
        return existing_email

    def add_verified_email(self, email:str):
        self.collection = DataBase.DB["VerifiedEmails"]
        if DataBase.get_verified_email(self, email):
            return False
        else:
            return self.collection.insert_one({'email': email}).inserted_id

    def store_verification_code(self, email: str, code: str):
        self.collection = DataBase.DB["VerificationCodes"]
        query = {"email": email}
        # Update or insert verification code into db
        return self.collection.update_one(query, {"$set": {'email': email,'code': code, 'timestamp': datetime.now()}}, upsert=True)


    def check_code_valid(self, email: str, code: str):
        self.collection = DataBase.DB["VerificationCodes"]
        query = {"email": email, "code": code}
        document = self.collection.find_one(query)
        if document:
            timestamp = document.get("timestamp")
            if timestamp and (datetime.now() - timestamp) < timedelta(minutes=5):
                self.collection.delete_one({ "_id": document.get('_id')})
                return True
        return False

    def insert_user_data(self,user:User):
        self.collection = DataBase.DB["UserInformation"]
        query = {"email": user.email}
        user_data = self.collection.find_one(query)



        if user_data:
            new_stock_list = { "$push": { 'stockList':  user.stockList[0].model_dump()} }
            self.collection.update_one(query, new_stock_list)
        else:
            self.collection.insert_one(user.model_dump())
     
    
    def get_user_data(self, email: str):
        self.collection = DataBase.DB["UserInformation"]
        query = {"email": email}
        user_data = self.collection.find_one(query)
        if not user_data: return None
        # Convert ObjectId to string
        if user_data and "_id" in user_data:
            user_data["_id"] = str(user_data["_id"])

        return user_data