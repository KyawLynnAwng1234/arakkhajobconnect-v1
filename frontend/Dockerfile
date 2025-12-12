# ---------- BUILD STAGE ----------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy env file correctly
COPY .env /app/.env

# Now copy the rest of frontend code
COPY . .

RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM nginx:1.25-alpine

COPY --from=build /app/frontend_dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
