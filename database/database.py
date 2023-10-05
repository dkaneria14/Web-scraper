import pymongo 
from pymongo import MongoClient
from pymongo.server_api import ServerApi


uri = "mongodb+srv://stock-admin:secure_pass123@cluster0.csya3y9.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["StockDataBase"]
collection = db["People"]

post = {"_id:":1,"name":"Dev","score":5, "age":23}

collection.insert_one(post)
print("Success!")
