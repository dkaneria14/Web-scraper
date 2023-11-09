from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import DataBase
from api import email
import datetime
import pytz
import json
import uvicorn
from yFinanceTempFix.yfFix import YFinance

app = FastAPI()
# Include relevant routers for endpoints
app.include_router(email.router)

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
    "http://localhost:80",
    "http://127.0.0.1:80",
    "http://localhost",
    "http://stockwatch.cloud",
    "http://www.stockwatch.cloud",
    "https://stockwatch.cloud",
    "https://www.stockwatch.cloud"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stockList/{stockName}")

def get_stock_info(stockName:str):
    # Using mock data can save on network calls while testing/working with modeling data.
    # mock = json.loads('{"address1":"345 Park Avenue","city":"San Jose","state":"CA","zip":"95110-2704","country":"United States","phone":"408 536 6000","fax":"408 537 6000","website":"https://www.adobe.com","industry":"Software - Infrastructure","industryKey":"software-infrastructure","industryDisp":"Software - Infrastructure","sector":"Technology","sectorKey":"technology","sectorDisp":"Technology","longBusinessSummary":"Adobe Inc., together with its subsidiaries, operates as a diversified software company worldwide. It operates through three segments: Digital Media, Digital Experience, and Publishing and Advertising. The Digital Media segment offers products, services, and solutions that enable individuals, teams, and enterprises to create, publish, and promote content; and Document Cloud, a unified cloud-based document services platform. Its flagship product is Creative Cloud, a subscription service that allows members to access its creative products. This segment serves content creators, students, workers, marketers, educators, enthusiasts, communicators, and consumers. The Digital Experience segment provides an integrated platform and set of applications and services that enable brands and businesses to create, manage, execute, measure, monetize, and optimize customer experiences from analytics to commerce. This segment serves marketers, advertisers, agencies, publishers, merchandisers, merchants, web analysts, data scientists, developers, and executives across the C-suite. The Publishing and Advertising segment offers products and services, such as e-learning solutions, technical document publishing, web conferencing, document and forms platform, web application development, and high-end printing, as well as Advertising Cloud offerings. The company offers its products and services directly to enterprise customers through its sales force and local field offices, as well as to end users through app stores and through its website at adobe.com. It also distributes products and services through a network of distributors, value-added resellers, systems integrators, software vendors and developers, retailers, and original equipment manufacturers. The company was formerly known as Adobe Systems Incorporated and changed its name to Adobe Inc. in October 2018. Adobe Inc. was founded in 1982 and is headquartered in San Jose, California.","fullTimeEmployees":29239,"companyOfficers":[{"maxAge":1,"name":"Mr. Shantanu  Narayen","age":58,"title":"Chairman & CEO","yearBorn":1964,"fiscalYear":2022,"totalPay":{"raw":4437938,"fmt":"4.44M","longFmt":"4,437,938"},"exercisedValue":{"raw":0,"fmt":null,"longFmt":"0"},"unexercisedValue":{"raw":0,"fmt":null,"longFmt":"0"}},{"maxAge":1,"name":"Mr. Daniel J. Durn","age":56,"title":"CFO and Executive VP of Finance, Technology Services & Operations","yearBorn":1966,"fiscalYear":2022,"totalPay":{"raw":4787321,"fmt":"4.79M","longFmt":"4,787,321"},"exercisedValue":{"raw":0,"fmt":null,"longFmt":"0"},"unexercisedValue":{"raw":0,"fmt":null,"longFmt":"0"}},{"maxAge":1,"name":"Mr. David  Wadhwani","age":50,"title":"President of Digital Media Business","yearBorn":1972,"fiscalYear":2022,"totalPay":{"raw":3146622,"fmt":"3.15M","longFmt":"3,146,622"},"exercisedValue":{"raw":0,"fmt":null,"longFmt":"0"},"unexercisedValue":{"raw":0,"fmt":null,"longFmt":"0"}},{"maxAge":1,"name":"Mr. Scott K. Belsky","age":42,"title":"Chief Strategy Officer and Executive VP of Design & Emerging Products","yearBorn":1980,"fiscalYear":2022,"totalPay":{"raw":1357368,"fmt":"1.36M","longFmt":"1,357,368"},"exercisedValue":{"raw":0,"fmt":null,"longFmt":"0"},"unexercisedValue":{"raw":0,"fmt":null,"longFmt":"0"}},{"maxAge":1,"name":"Dr. Anil S. Chakravarthy","age":54,"title":"President of Digital Experience Business","yearBorn":1968,"fiscalYear":2022,"totalPay":{"raw":1482338,"fmt":"1.48M","longFmt":"1,482,338"},"exercisedValue":{"raw":0,"fmt":null,"longFmt":"0"},"unexercisedValue":{"raw":0,"fmt":null,"longFmt":"0"}},{"maxAge":1,"name":"Mr. Mark S. Garfield","age":51,"title":"Senior VP, Chief Accounting Officer & Corporate Controller","yearBorn":1971,"fiscalYear":2022,"exercisedValue":{"raw":0,"fmt":null,"longFmt":"0"},"unexercisedValue":{"raw":0,"fmt":null,"longFmt":"0"}},{"maxAge":1,"name":"Ms. Cynthia A. Stoddard","age":65,"title":"Senior VP & Chief Information Officer","yearBorn":1957,"fiscalYear":2022,"exercisedValue":{"raw":0,"fmt":null,"longFmt":"0"},"unexercisedValue":{"raw":0,"fmt":null,"longFmt":"0"}},{"maxAge":1,"name":"Mr. Jonathan  Vaas","title":"Vice President of Investor Relations","fiscalYear":2022,"exercisedValue":{"raw":0,"fmt":null,"longFmt":"0"},"unexercisedValue":{"raw":0,"fmt":null,"longFmt":"0"}},{"maxAge":1,"name":"Mr. Dana  Rao","age":52,"title":"Executive VP, General Counsel, Chief Trust Officer & Corporate Secretary","yearBorn":1970,"fiscalYear":2022,"exercisedValue":{"raw":0,"fmt":null,"longFmt":"0"},"unexercisedValue":{"raw":0,"fmt":null,"longFmt":"0"}},{"maxAge":1,"name":"Ms. Gloria  Chen","age":57,"title":"Chief People Officer & Executive VP of Employee Experience","yearBorn":1965,"fiscalYear":2022,"exercisedValue":{"raw":0,"fmt":null,"longFmt":"0"},"unexercisedValue":{"raw":0,"fmt":null,"longFmt":"0"}}],"auditRisk":5,"boardRisk":5,"compensationRisk":5,"shareHolderRightsRisk":1,"overallRisk":2,"governanceEpochDate":1698796800,"compensationAsOfEpochDate":1672444800,"maxAge":86400,"priceHint":2,"previousClose":565.45,"open":568.81,"dayLow":568.81,"dayHigh":589,"regularMarketPreviousClose":565.45,"regularMarketOpen":568.81,"regularMarketDayLow":568.81,"regularMarketDayHigh":589,"dividendYield":0.0115,"exDividendDate":1111622400,"payoutRatio":0,"fiveYearAvgDividendYield":0.12,"beta":1.324,"trailingPE":52.65709,"forwardPE":34.607666,"volume":1486981,"regularMarketVolume":1486981,"averageVolume":2628462,"averageVolume10days":2554310,"averageDailyVolume10Day":2554310,"bid":587.4,"ask":587.74,"bidSize":800,"askSize":900,"marketCap":267078975488,"fiftyTwoWeekLow":297.35,"fiftyTwoWeekHigh":589,"priceToSalesTrailing12Months":14.141638,"fiftyDayAverage":537.7868,"twoHundredDayAverage":448.0859,"trailingAnnualDividendRate":0,"trailingAnnualDividendYield":0,"currency":"USD","fromCurrency":null,"toCurrency":null,"lastMarket":null,"coinMarketCapLink":null,"algorithm":null,"tradeable":false,"symbol":"ADBE","peRatio":14.8397,"pegRatio":2.6,"estimates":[{"period":"0q","growth":{"raw":0.033,"fmt":"0.03"}},{"period":"+1q","growth":{"raw":0.099,"fmt":"0.10"}},{"period":"0y","growth":{"raw":0.0069999998,"fmt":"0.01"}},{"period":"+1y","growth":{"raw":0.1,"fmt":"0.10"}},{"period":"+5y","growth":{"raw":0.0883601,"fmt":"0.09"}},{"period":"-5y","growth":{}}],"enterpriseValue":254029381632,"profitMargins":0.27115,"floatShares":454307446,"sharesOutstanding":455300000,"sharesShort":4914063,"sharesShortPriorMonth":4335154,"sharesShortPreviousMonthDate":1694736000,"dateShortInterest":1697155200,"sharesPercentSharesOut":0.0108,"heldPercentInsiders":0.0029499999,"heldPercentInstitutions":0.86402,"shortRatio":1.59,"shortPercentOfFloat":0.0108,"impliedSharesOutstanding":455300000,"category":null,"bookValue":34.596,"priceToBook":16.955717,"fundFamily":null,"legalType":null,"lastFiscalYearEnd":1669939200,"nextFiscalYearEnd":1701475200,"mostRecentQuarter":1693526400,"earningsQuarterlyGrowth":0.235,"netIncomeToCommon":5120999936,"trailingEps":11.14,"forwardEps":16.95,"lastSplitFactor":"2:1","lastSplitDate":1116892800,"enterpriseToRevenue":13.451,"enterpriseToEbitda":36.089,"52WeekChange":0.8712976,"SandP52WeekChange":0.14050531,"lastDividendValue":0.0065,"lastDividendDate":1111622400,"exchange":"NMS","quoteType":"EQUITY","underlyingSymbol":"ADBE","shortName":"Adobe Inc.","longName":"Adobe Inc.","firstTradeDateEpochUtc":524323800,"timeZoneFullName":"America/New_York","timeZoneShortName":"EST","uuid":"bccf427f-30a1-3360-9ce4-c77a8198c902","messageBoardId":"finmb_24321","gmtOffSetMilliseconds":-18000000,"currentPrice":553.6,"targetHighPrice":622.45,"targetLowPrice":403.65,"targetMeanPrice":569.7,"targetMedianPrice":580.01,"recommendationMean":2,"recommendationKey":"buy","numberOfAnalystOpinions":27,"totalCash":7516000256,"totalCashPerShare":16.508,"ebitda":7039000064,"totalDebt":4096000000,"quickRatio":1.124,"currentRatio":1.249,"totalRevenue":18886000640,"debtToEquity":25.963,"revenuePerShare":41.106,"returnOnAssets":0.14355,"returnOnEquity":0.33971,"grossProfits":15441000000,"freeCashflow":7317875200,"operatingCashflow":8030000128,"earningsGrowth":0.26,"revenueGrowth":0.103,"grossMargins":0.87885004,"ebitdaMargins":0.37271,"operatingMargins":0.34702998,"financialCurrency":"USD"}')
    # return mock
    stock = YFinance(stockName)
    return stock.info

@app.get("/stocklistDB")

def get_list():
    obj = DataBase()
    return obj.get_stocks()

@app.get("/stock/{stockName}")
def filter(stockName: str):
    wholeStockInfo = yf.Ticker(stockName)
    
    shortName = wholeStockInfo.info["shortName"]
    currentPrice = float(wholeStockInfo.info["currentPrice"])
    est_timezone = pytz.timezone('US/Eastern')
    current_time = str(datetime.datetime.now().time())
    current_date = str(datetime.date.today())
    
    
    my_json_string = json.dumps({'stockName': stockName, 'shortName': shortName, 'currentPrice': currentPrice, 'currentDate': current_date, 'currentTime': current_time})
    my_json = json.loads(my_json_string)
    return my_json

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)