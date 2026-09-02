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
