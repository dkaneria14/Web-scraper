@echo off

taskkill /F /IM node.exe
taskkill /F /IM uvicorn.exe

cd .\frontend\
start npm run start

cd ..\backend\
call venv\Scripts\activate
uvicorn stockWatchAPI:app --reload
