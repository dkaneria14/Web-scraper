from decouple import config
import smtplib
import ssl
from email.message import EmailMessage

class EmailService:
    # Sender email username
    EMAIL = config('EMAIL')
    # Gmail App Password
    PASSWORD = config('PASSWORD')

    def send_email(self, subject, body, email):
        EMAIL = EmailService.EMAIL
        msg = EmailMessage()
        msg['From'] = EMAIL 
        msg['To'] = email
        msg['Subject'] = subject
        msg.set_content(body)
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp_server:
            smtp_server.login(EMAIL, EmailService.PASSWORD)
            smtp_server.sendmail(EMAIL, email, msg.as_string())