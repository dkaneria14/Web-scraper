from fastapi import APIRouter, status, HTTPException, Depends
from pydantic import BaseModel
from database.database import DataBase, EmailRequest
from datetime import datetime, timedelta
from jose import JWTError, jwt
from decouple import config
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Can't protect variables anyways, python only has conceptual private/protected :(
__ALGORITHM = config('AUTH_ALGORITHM')
__SECRET_KEY = config('SECRET_KEY')
__ACCESS_TOKEN_EXPIRE_MINUTES = 30


class ValidateVerificationCode(BaseModel):
    email: str
    code: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, __SECRET_KEY, algorithm=__ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, __SECRET_KEY, algorithms=[__ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    db = DataBase()
    user = db.get_verified_email(token_data.username)
    if user is None:
        raise credentials_exception
    return user

@router.get('/auth/loggedin')
async def loggedin_user(currentUser: Annotated[EmailRequest, Depends(get_current_user)]):
    return currentUser;

@router.post('/auth/login')
async def login_with_code(data: ValidateVerificationCode):
    db = DataBase()
    email = data.email
    code = data.code
    registeredUser = db.get_verified_email(email)
    if not (registeredUser): raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email not registered")
    validCode = db.check_code_valid(email, code)
    if not (validCode): raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or login code")
    access_token_expires = timedelta(minutes=__ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}