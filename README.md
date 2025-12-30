📦 Inventory Backend

This repository contains the backend service for the Inventory application, built with Node.js + Express and connected to a MySQL database using migrations.

🚀 Backend Setup
1️⃣ Install Dependencies
npm install

2️⃣ Environment Configuration

Copy the example environment file:

cp .env.example .env


Update the .env file with your database credentials and required settings.

🗄️ Database Setup
Create Database

Create a new database in your MySQL server:

CREATE DATABASE inventorydb;

Update .env

Ensure the database configuration in .env matches your setup:

DB_NAME=inventory_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306

🧬 Running Migrations

Once the database and environment variables are configured, run:

npm run db:migrate


This will:

Create all required tables

Apply schema changes defined in migrations

▶️ Running the Application

Start the backend server:

npm run dev

🌐 Access the Application

Frontend: http://localhost:3000

Backend API: http://localhost:5000

