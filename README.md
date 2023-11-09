# Web-scraper

Pip libraries to install (use `pip install -r requirements.txt` to install them for you): 
-pymongo
-fastapi
-yfinance
-uvicorn

To start fresh on a new machine without affecting your host machine's python setup:
(Steps 1 to 5 are only required for the initial setup. Though Step 2 to activate the virtual environment as needed for dev work)
1. Create a virtual environment `python3 -m venv venv`
2. Activate the virtual environment (if unix based: `source ./venv/bin/activate`, windows: `venv\Scripts\activate`)
3. Install required python libraries `pip install -r requirements.txt`
4. Install node modules for React `cd frontend && npm i`
5. Create an `.env` file in the root of the project with the Email Account credentials. ie. Note: You do have to have 2 step auth on to use App Passwords
```
EMAIL="stockwatch714@gmail.com"
PASSWORD="gmailAppPassword"
```
5. Start flask backend server `uvicorn stockWatchAPI:app --reload`
6. Start React front-end `npm run start` (for dev only, instructions will be replaced for prod and the whole stack containerized hopefully)
7. Deactivate virtual env when done with `deactivate`

# Changelog
## Nov 7, 2023
- Added containerization support. You can run the whole solution using `docker compose -f ./compose.yml up` from the root project directory. To rebuild containers `docker compose -f ./compose.yml build`. To specify a https server endpoint other than `127.0.0.1` for the container, before building, run `export RASP=stockwatch.cloud` where `stockwatch-cloud` is the desired endpoint. For Windows, replace `export` with `set`.
