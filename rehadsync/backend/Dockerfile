FROM python:3.11

WORKDIR /app

COPY rehadsync/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY rehadsync/backend/app ./app

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]