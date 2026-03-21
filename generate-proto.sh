#!/bin/bash

# Define paths
PROTO_DIR="./proto-schema"
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"
FRONTEND_OUT="$FRONTEND_DIR/src/generated"

echo "🚀 Starting Protobuf compilation..."

# 1. Clean and recreate frontend generated directory
rm -rf "$FRONTEND_OUT"
mkdir -p "$FRONTEND_OUT"

# 2. Generate TypeScript for Next.js
# Using ts-proto for clean, idiomatic TypeScript interfaces
echo "📦 Generating TypeScript for Next.js..."
protoc --plugin=./frontend/node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out="$FRONTEND_OUT" \
    --proto_path="$PROTO_DIR" \
    --ts_proto_opt=esModuleInterop=true,outputJsonMethods=true \
    "$PROTO_DIR"/*.proto

# 3. Generate Kotlin for Spring Boot
# Note: We usually let Gradle handle this, but this command forces a refresh
echo "☕ Generating Kotlin for Spring Boot..."
cd "$BACKEND_DIR"
./gradlew generateProto
cd ..

echo "✅ Compilation complete!"
echo "Check $FRONTEND_OUT for your Next.js types."