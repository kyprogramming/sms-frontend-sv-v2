# ---- Stage 1: Build ----
FROM node:18-alpine as builder

WORKDIR /app

# Copy dependencies first
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Run the build
RUN npm run build

# ---- Stage 2: Runtime ----
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.svelte-kit/output ./.svelte-kit/output

# Expose port
EXPOSE 3000

# Start the preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]