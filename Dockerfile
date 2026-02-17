# Stage 1: Build frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve backend with built frontend
FROM node:22-alpine
WORKDIR /app/server
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/index.js ./
COPY --from=frontend-builder /app/frontend/dist ./client/build

EXPOSE 8080
CMD ["node", "index.js"]
