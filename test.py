import aiohttp
import asyncio
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Your User-Agent String',  # Replace with a valid User-Agent string
    'Accept-Language': 'en-US, en;q=0.5'
}

# Function to extract Product Title
def get_title(soup):
    try:
        title = soup.find("span", attrs={"id": 'productTitle'})
        title_value = title.text
        title_string = title_value.strip()
    except AttributeError:
        title_string = ""
    return title_string

# Function to extract Product Price
def get_price(soup):
    try:
        price = soup.find("span", attrs={'class': 'a-price'}).find('span', {'class': 'a-offscreen'}).text.strip()
    except AttributeError:
        price = ""
    return price

# Function to extract Product Rating
def get_rating(soup):
    try:
        rating = soup.find("span", attrs={'class': 'a-icon-alt'}).text.strip()
    except AttributeError:
        rating = ""
    return rating

# Function to extract Number of User Reviews
def get_review_count(soup):
    try:
        review_count = soup.find("span", attrs={'id': 'acrCustomerReviewText'}).text.strip()
    except AttributeError:
        review_count = ""
    return review_count

# Function to extract Availability Status
def get_availability(soup):
    try:
        available = soup.find("div", attrs={'id': 'availability'}).text.strip()
    except AttributeError:
        available = "Not Available"
    return available

async def fetch_product_data(session, url):
    async with session.get(url) as response:
        html = await response.text()
        soup = BeautifulSoup(html, 'html.parser')
        return soup

async def main():
    # Your URL list here
    urls = [
        "https://www.amazon.com/link1",
        "https://www.amazon.com/link2",
        # Add more URLs here
    ]

    async with aiohttp.ClientSession(headers=HEADERS) as session:
        tasks = [fetch_product_data(session, url) for url in urls]
        results = await asyncio.gather(*tasks)

    d = {"title": [], "price": [], "rating": [], "reviews": [], "availability": []}

    for soup in results:
        d['title'].append(get_title(soup))
        d['price'].append(get_price(soup))
        d['rating'].append(get_rating(soup))
        d['reviews'].append(get_review_count(soup))
        d['availability'].append(get_availability(soup))

    print(d)

if __name__ == '__main__':
    asyncio.run(main())
