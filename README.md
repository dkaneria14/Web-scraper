# Web-scraper

#### Hosted at: [https://stockwatch.cloud/](https://stockwatch.cloud/)

Pip libraries to install (use `pip3 install -r requirements.txt` to install them for you): 
-pymongo
-fastapi
-yfinance
-uvicorn

To start fresh on a new machine without affecting your host machine's python setup:
(Steps 1 to 5 are only required for the initial setup)
#### *Experimental*: `setupRepo.sh` (unix based) and `setupRepo.cmd` (windows) automates this setup (1-5) for you.
1. In the backend directory `cd backend`, Create a virtual environment `python3 -m venv venv`.
2. Activate the virtual environment (if unix based: `source ./venv/bin/activate`, windows: `venv\Scripts\activate`) from within the backend folder.
3. Install required python libraries `pip3 install -r requirements.txt`
4. Install node modules for React within the frontend folder `cd ../frontend`, then `npm i`.
5. Create an `.env` file in the root of the project with the Email Account credentials.
```
EMAIL="stockwatch714@gmail.com"
PASSWORD="gmailAppPasswordFromDiscord"
```
To Run: 
#### *Experimental*: `rundev.sh` (unix based) and `rundev.cmd` (windows) automates this for you.
7. Start flask backend server `uvicorn stockWatchAPI:app --reload` from the backend directory
8. On another terminal, assuming starting from the repo's root directory, `cd frontend` and then Start React front-end `npm run start`.
9. When done working with backend, deactivate virtual env when done with `deactivate` or exit the terminal.

#### Overall, on an existing setup:
- Steps 2 and 6 to start the backend server. Step 7 to start the react dev frontend. 

# Changelog/Notes
## Nov 7, 2023
- Added containerization support. You can run the whole solution using `docker compose -f ./compose.yml up` from the root project directory. To rebuild containers `docker compose -f ./compose.yml build`. To specify a https server endpoint other than `127.0.0.1` for the container, before building, run `export RASP=stockwatch.cloud` where `stockwatch-cloud` is the desired endpoint. For Windows, replace `export` with `set`.

The following are meant to be run from project/repo root:
- `rundev.sh/.cmd` - Run the development server/react front end in one command from the root project directory.
- `setupRepo.sh/.cmd` - Sets up the repository when freshly cloned, adds main repo upstream, creates dummy .env file if not present (replace with actual password after creation), and installs dependencies for front/back end.