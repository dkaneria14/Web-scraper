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
    stock:Stock
    
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
        return self.collection.insert_one({'email': email, 'code': code, 'timestamp': datetime.now()}).inserted_id


    def check_code_valid(self, email: str, code: str):
        self.collection = DataBase.DB["VerificationCodes"]
        document = self.collection.find_one({"email": email, "code": code},{'_id': 0})
        if document:
            timestamp = document.get("timestamp")
            if timestamp and (datetime.now() - timestamp) < timedelta(minutes=5):
                # If found, then let's delete the code and return that its validity
                return True
        return False

    def insert_user_data(self,user:User):
        self.collection = DataBase.DB["UserInformation"]
        return self.collection.insert_one(user)
    
    def get_user_data(self, email: str):
        self.collection = DataBase.DB["UserInformation"]
        query = {"email": email}
        user_data = self.collection.find_one(query)

        # Convert ObjectId to string
        if user_data and "_id" in user_data:
            user_data["_id"] = str(user_data["_id"])

        return user_data