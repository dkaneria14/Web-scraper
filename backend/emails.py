from emailService import EmailService

from database.basemodels import Stock
from decouple import config
from cryptography.fernet import Fernet


class StockEmail:

    emailClient = None
    def __init__(self):
        self.emailClient = EmailService()
        self.f = Fernet(str.encode(config('SYMMETRIC_KEY')))
        
        
    # Spam Laws Compliance
    def create_unsubscribe_link(self, userEmail: str):
        userEmailEncoded = str.encode(userEmail)
        # Leaking server port, shouldn't be used for prod. Just quick compliance with spam laws for hosted instance
        return f'\nTo unsubscribe from all emails and delete your account, click your unique link: https://stockwatch.cloud:8001/email/unsubscribe/{bytes.decode(self.f.encrypt(userEmailEncoded))}'


    def reached_threshold_email(self,userEmail,stockName,thresholdPrice):

        #Creating the body
        body = f'The following stock: {stockName} has reached the threshold price: {str(thresholdPrice)} \nHappy trading! -StockWatch {self.create_unsubscribe_link(userEmail)}'
        #Final send out
        self.emailClient.send_email("Your Threshold(s) have been hit!",body,userEmail)

    def follow_stock_email(self,userEmail,stock):
        print(stock)
        
        body = f'You have successfully signed up to watch {stock} stock. {self.create_unsubscribe_link(userEmail)}'
        self.emailClient.send_email("Watching your Stock.",body,userEmail)

    def stock_removed_email(self, userEmail, stock):
        body = f'You have successfully removed {stock} from your watch list. {self.create_unsubscribe_link(userEmail)}'
        self.emailClient.send_email(f'Removed from Watch List - {stock}',body,userEmail)