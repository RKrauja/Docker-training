# Choose base image
FROM python:3.12-slim AS builder

# Add app source code to the image
WORKDIR /app

# Copy the dependencies file (for node this would be package.json)

COPY requirements.txt ./

# Install dependencies
RUN pip install --prefix=/install/dependencies -r requirements.txt

# Copy source code
COPY . .

FROM python:3.12-slim AS production

WORKDIR /app

COPY --from=builder /install/dependencies /usr/local
COPY --from=builder /app .

# Create an environment variable for the app
ENV PORT=8080

# Set the port that the app will run on
EXPOSE 8080

# Set the run command for the app
CMD ["python", "main.py"]

