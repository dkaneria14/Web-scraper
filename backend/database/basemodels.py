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
