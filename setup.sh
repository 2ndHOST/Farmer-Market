#!/bin/bash

echo "🌱 Setting up Farmer Market project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create environment files if they don't exist
echo "⚙️  Setting up environment files..."

if [ ! -f .env ]; then
    echo "📝 Creating backend/.env from example..."
    cp .env.example .env
    echo "✅ Backend environment file created"
else
    echo "✅ Backend .env already exists"
fi

cd ..

if [ ! -f .env ]; then
    echo "📝 Creating frontend/.env from example..."
    cp .env.example .env
    echo "✅ Frontend environment file created"
else
    echo "✅ Frontend .env already exists"
fi

# Setup Prisma
echo "🗄️  Setting up database..."
cd backend
npx prisma generate
npx prisma migrate dev --name init

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start backend: cd backend && npm run dev"
echo "2. Start frontend: npm run dev"
echo ""
echo "The app will be available at:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:3000"
echo ""
echo "For development, the backend uses dev OTP mode (no Twilio required)."
echo "Check the console for the generated OTP when testing login."
