from .emailService import EmailService

from database.database import Stock
class StockEmail:

    emailClient = None
    def __init__(self):
        self.emailClient = EmailService()

    def reached_threshold_email(self,userEmail,stockList):

        #Creating the body
        body = "The following stocks have reached threshold price: \n"
        for stock in stockList:
            body += f"{stock.name}\n"     
        body += "Happy trading! -StockWatch™"
        
        #Final send out
        self.emailClient.send_email("Your Threshold(s) have been hit!",body,userEmail)

    def follow_stock_email(self,userEmail,stock:Stock):
        
        body = "You have succesfully signed up to watch " +stock.name+" stock."
        self.emailClient.send_email("Watching your Stock.",body,userEmail)