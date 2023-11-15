#!/bin/bash
killall node uvicorn # In case any instances of node or uvicorn was improperly stopped in the past. 
cd ./frontend/ && npm run start & cd ./backend/ && source venv/bin/activate && uvicorn stockWatchAPI:app --reload