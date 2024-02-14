import pandas as pd

fortune_500_url = "https://filebin.net/5awrqt2ax0xfzbda/Fortune_500_Plus.xlsx"
# Source File (Copied to Drive): https://docs.google.com/spreadsheets/d/16kH6ebwgHymzFuIfhROPAa6GLXClAhOrdkdLcbviNck/edit?usp=sharing
fortune_500_df = pd.read_excel(fortune_500_url)

# stock_symbols = fortune_500_df['Ticker Symbol'].tolist()

json_data = fortune_500_df.set_index("Ticker Symbol")["Company Name"].to_dict()

print(json_data)