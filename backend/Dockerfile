# syntax=docker/dockerfile:1
FROM python:3.11
WORKDIR /backend
# Copy python requirments separately to avoid invalidating docker cache on code changes
COPY requirements.txt ./requirements.txt
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "stockWatchAPI.py"]