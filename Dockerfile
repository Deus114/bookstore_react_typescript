# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

COPY . .

# Set biến môi trường khi build
ARG VITE_BACKEND_URL
ARG VITE_USER_CREATE_DEFAULT_PASSWORD
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_USER_CREATE_DEFAULT_PASSWORD=$VITE_USER_CREATE_DEFAULT_PASSWORD

RUN npm install
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host", "--port", "3000"]