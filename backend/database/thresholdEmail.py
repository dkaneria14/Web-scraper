from ..emailService import EmailService

#Dummy information till Arshads code is merged

def reachedThreshold(self,userEmail,stockList):
        email = EmailService()

        body = "The following stocks have reached threshold price: \n"
      
        for stock in stockList:
            body += f"{stock.name}\n" 
        
        body += "Happy trading! -StockWatch™"
        
        email.send_email("Your Threshold(s) have been hit!",body,userEmail)
