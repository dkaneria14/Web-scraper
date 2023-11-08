from fastapi import APIRouter
from emailService import EmailService
from pydantic import BaseModel
from database.database import DataBase
import secrets

# Init router
router = APIRouter()

# Email Verification/Send Email code. This endpoint will have to be changed once user accounts are added - wouldn't want random users to be able to just bruteforce
# and check if a user is registered but for now, good enough.
@router.get("/email/verified/{email}")
def checkEmailVerification(email: str):
    data = DataBase()
    return data.get_verified_email(email)

def generate_verification_code():
    code = secrets.randbelow(1000000)
    return f'{code:06d}'

class EmailAddress(BaseModel):
    email: str

@router.post('/email/send_code/')
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

@router.post('/email/validate_code/')
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
