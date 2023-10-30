# Web-scraper

Pip libraries to install (use `pip install -r requirements.txt` to install them for you): 
-pymongo
-fastapi
-yfinance
-uvicorn

To start fresh on a new machine without affecting your host machine's python setup:
(Steps 1 to 4 are only required for the initial setup. Though Step 2 to activate the virtual environment as needed for dev work)
1. Create a virtual environment `python3 -m venv venv`
2. Activate the virtual environment (if unix based: `source ./venv/bin/activate`, windows: ``)
3. Install required python libraries `pip install -r requirements.txt`
4. Install node modules for React `cd frontend && npm i`
5. Start flask backend server `uvicorn stockWatchAPI:app --reload`
6. Start React front-end `npm run start` (for dev only, instructions will be replaced for prod and the whole stack containerized hopefully)
7. Deactivate virtual env when done with `deactivate`