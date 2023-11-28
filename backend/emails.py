from emailService import EmailService

from database.basemodels import Stock


class StockEmail:

    emailClient = None
    def __init__(self):
        self.emailClient = EmailService()

    def reached_threshold_email(self,userEmail,stockName,thresholdPrice):

        #Creating the body
        body = "The following stock: " +stockName+ " has reached threshold price: "+str(thresholdPrice)+ "\nHappy trading! -StockWatch™"
        
        #Final send out
        self.emailClient.send_email("Your Threshold(s) have been hit!",body,userEmail)

    def follow_stock_email(self,userEmail,stock):
        print(stock)
        
        body = "You have successfully signed up to watch " + stock +" stock."
        self.emailClient.send_email("Watching your Stock.",body,userEmail)

    def stock_removed_email(self, userEmail, stock):
        body = f'You have successfully removed {stock} from your watch list.'
        self.emailClient.send_email(f'Removed from Watch List - {stock}',body,userEmail)