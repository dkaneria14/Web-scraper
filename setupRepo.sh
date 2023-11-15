#!/bin/bash
test -f .env || printf 'EMAIL="stockwatch714@gmail.com"\nPASSWORD="REPLACEWITHACTUALPASS"' > .env
git remote add upstream https://github.com/dkaneria14/Web-scraper.git
cd backend && python3 -m venv venv && source ./venv/bin/activate && pip3 install -r requirements.txt && deactivate && echo "Backend Requirements Setup Completed."
cd ../frontend && npm i && echo "Frontend requirements setup completed."