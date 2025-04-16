# Dockerfile

FROM node:18

WORKDIR /app

# Copy các file cần thiết từ builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host"]
