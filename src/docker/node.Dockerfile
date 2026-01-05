FROM node:20-slim
RUN apt-get update && apt-get install -y time && rm -rf /var/lib/apt/lists/*
