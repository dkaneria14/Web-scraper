import pandas as pd

fortune_500_url = "https://s3.amazonaws.com/oneclickdata/Fortune_500.xlsx"
fortune_500_df = pd.read_excel(fortune_500_url)

stock_symbols = fortune_500_df['Symbol'].tolist()

print(stock_symbols)