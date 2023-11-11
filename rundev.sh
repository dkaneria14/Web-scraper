#!/bin/bash
cd ./backend/ && uvicorn stockWatchAPI:app --reload & cd ./frontend/ && npm run start