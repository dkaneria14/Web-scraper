import pymongo 
from pymongo import MongoClient
from pymongo.server_api import ServerApi

class DataBase:
    

    def __init__(self):
        uri = "mongodb+srv://stock-admin:secure_pass123@cluster0.csya3y9.mongodb.net/?retryWrites=true&w=majority"
        # Create a new client and connect to the server
        client = MongoClient(uri, server_api=ServerApi('1'))
        db = client["StockDataBase"]
        self.collection = db["StockNames"]


    def get_stocks(self):
        obj = self.collection.find_one()
        return(obj["stocks"])

  


