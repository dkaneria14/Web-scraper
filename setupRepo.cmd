@echo off
IF NOT EXIST .env (
    echo EMAIL="stockwatch714@gmail.com"> .env
    echo PASSWORD="REPLACEWITHACTUALPASS">> .env
)

git remote add upstream https://github.com/dkaneria14/Web-scraper.git

cd backend
python3 -m venv venv
call venv\Scripts\activate
pip3 install -r requirements.txt
call venv\Scripts\deactivate
echo Backend Requirements Setup Completed.

cd ..
cd frontend
npm install
echo Frontend requirements setup completed.
