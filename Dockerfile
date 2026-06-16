# 1. Node environment ni set chestunnam
FROM node:18-alpine AS build

WORKDIR /app

# 2. Dependencies install chestunnam
COPY package*.json ./
RUN npm install

# 3. Code copy chesi Vite production build generate chestunnam
COPY . .
RUN npm run build

# 4. Production build low-weight image loki copy chestunnam
FROM node:18-alpine

WORKDIR /app

# 5. Production run avvadaniki kavalsina serve package install chestunnam
RUN npm install -g serve

# 6. Build folder ni copy chestunnam
COPY --from=build /app/dist ./dist

# 7. Back4App port 3000 expose chestunnam
EXPOSE 3000

# 8. App ni single page application (SPA) ga static ga serve chestunnam
CMD ["serve", "-s", "dist", "-l", "3000"]
