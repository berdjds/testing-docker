#!/bin/sh

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

while ! nc -z mysql 3306; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "Failed to connect to MySQL after $MAX_RETRIES retries. Proceeding anyway..."
    break
  fi
  echo "Attempt $RETRY_COUNT/$MAX_RETRIES: MySQL is not ready yet... waiting 5 seconds"
  sleep 5
done

if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
  echo "MySQL is ready!"
fi

# Start the application even if MySQL is not ready
echo "Starting the application..."
node app.js
