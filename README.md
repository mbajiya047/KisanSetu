# KisanSetu

### Smart Agricultural Procurement Scheduling & Queue Management Platform

KisanSetu is a digital platform designed to make agricultural procurement easier, faster, and more transparent for farmers.

It helps farmers book procurement slots, receive tokens, track queue status, and monitor procurement progress without spending long hours waiting at procurement centers.

## Problem Statement

Farmers often face:

- Long queues at procurement centers
- Unclear procurement schedules
- Crowded mandi/procurement centers
- Unnecessary waiting time
- Difficulty tracking procurement status
- Lack of real-time queue information

KisanSetu addresses these problems through digital slot booking and smart queue management.

## Solution

KisanSetu provides a common digital platform where farmers can:

1. Register on platform
2. Add crop and quantity details
3. Select nearby procurement center
4. View available dates and time slots
5. Book procurement slot
6. Receive digital token
7. Track live queue status
8. Receive important notifications
9. Track procurement progress
10. Check payment/procurement status

## Key Features

### Farmer Module

- Farmer registration and login
- Farmer profile management
- Crop details
- Quantity declaration
- Procurement center selection
- Slot booking
- Digital token generation
- Queue status tracking
- Booking history
- Procurement status
- Notifications

### Procurement Center Module

- Center dashboard
- Daily slot management
- Farmer queue management
- Token management
- Farmer verification
- Procurement status updates
- Daily capacity management
- Queue monitoring

### Admin Module

- Manage farmers
- Manage procurement centers
- Manage crops
- Manage slots
- Monitor bookings
- Monitor procurement activity
- View system statistics
- Manage users and permissions

## Smart Queue Management

KisanSetu reduces physical crowding by assigning farmers specific procurement slots.

Example flow:

Farmer Registration
        ↓
Crop & Quantity Details
        ↓
Select Procurement Center
        ↓
Check Available Slots
        ↓
Book Slot
        ↓
Digital Token
        ↓
Live Queue Tracking
        ↓
Procurement Center Visit
        ↓
Verification & Weighing
        ↓
Procurement Completed
        ↓
Payment Status

## Technology Stack

### Frontend

- React
- Vite
- TypeScript

### Backend

- Node.js
- Express.js
- TypeScript
- REST API

### Database

- PostgreSQL
- Prisma ORM

### Authentication & Security

- JWT Authentication
- bcrypt password hashing
- Role-based access control
- Zod validation
- CORS protection
- Environment variables for sensitive configuration

API

Backend provides REST APIs for:

Authentication
Farmers
Procurement Centers
Crops
Slot Management
Bookings
Queue Management
Procurement Tracking
Notifications
Security

KisanSetu follows basic application security practices:

Password hashing using bcrypt
JWT-based authentication
Input validation using Zod
Role-based authorization
CORS configuration
Environment-based secrets
Database access through Prisma ORM
Future Scope

KisanSetu can be expanded with:

Multi-language support
Hindi and regional-language interface
SMS notifications
WhatsApp notifications
Mobile application
GPS-based procurement center discovery
AI-based queue prediction
Demand and arrival forecasting
Crop quality prediction
Digital payment integration
Government procurement API integration
Real-time center capacity monitoring
Analytics dashboard
Multi-state deployment
Live Demo

Frontend:
https://kisan-setu-liard.vercel.app

Database

KisanSetu uses PostgreSQL with Prisma ORM.

Database management is handled through Neon.

Never expose database credentials, connection strings, API keys, or other secrets in README or public repositories.

Vision

KisanSetu aims to create a simpler and more transparent procurement experience for farmers.

Instead of farmers spending hours waiting in physical queues, KisanSetu enables them to plan their visit through digital scheduling and real-time queue information.

Less waiting. Better planning. Smarter procurement.

Project Information

Project: KisanSetu
Problem Statement ID: 26032
Theme: Smart Automation
Category: Software
Focus: Agricultural Procurement Scheduling & Queue Management

Repository

https://github.com/mbajiya047/KisanSetu

License

This project is licensed under the MIT License.

## Project Structure

```text
KisanSetu/
│
├── api/
│
├── client/
│   └── Frontend application
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   └── Backend application
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── vercel.json
├── .gitignore
└── README.md


