from pydantic import BaseModel

class Stock(BaseModel):
    name:str
    threshold:float
    isAbove:bool
    date:str

class User(BaseModel):
    email: str
    stockList: dict[str, Stock]
        

class EmailRequest(BaseModel):
    email: str

class EmailStockRequest(BaseModel):
    email: str
    stock: str
