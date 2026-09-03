# 🌾 KisanSetu

### Smart Agricultural Procurement Scheduling & Queue Management Platform

KisanSetu is a digital platform designed to make agricultural procurement easier, faster, and more transparent for farmers. It helps farmers book procurement slots, receive tokens, track queue status, and monitor procurement progress without spending long hours waiting at procurement centers.

🔗 **Live Demo:** https://kisan-setu-liard.vercel.app

---

## 🧩 Problem Statement

| Field | Details |
|---|---|
| Problem Statement ID | 26032 |
| Title | Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status. |
| Organization | Ministry of Consumer Affairs, Food & Public Distribution |
| Department | Department of Consumer Affairs (DoCA) |
| Category | Software |
| Theme | Smart Automation |

Farmers often face:

- ⏳ Long queues at procurement centers
- ❓ Unclear procurement schedules
- 🚜 Crowded mandi / procurement centers
- 🕐 Unnecessary waiting time
- 📉 Difficulty tracking procurement status
- 📡 Lack of real-time queue information

## 💡 Expected Solution

Develop a platform that:

- ✅ Enables farmer registration and slot booking
- ✅ Provides real-time queue management
- ✅ Sends SMS/app notifications
- ✅ Tracks procurement status end-to-end

## 🚀 Our Solution

KisanSetu provides a common digital platform where farmers can:

1. 📝 Register on platform
2. 🌱 Add crop and quantity details
3. 📍 Select nearby procurement center
4. 📅 View available dates and time slots
5. 🎟️ Book procurement slot
6. 🔖 Receive digital token
7. 👀 Track live queue status
8. 🔔 Receive important notifications
9. 📊 Track procurement progress
10. 💰 Check payment/procurement status

## ⭐ Key Features

### 🧑‍🌾 Farmer Module
- Farmer registration and login
- Farmer profile management
- Crop details & quantity declaration
- Procurement center selection
- Slot booking & digital token generation
- Queue status tracking
- Booking history & notifications

### 🏢 Procurement Center Module
- Center dashboard
- Daily slot management
- Farmer queue management & verification
- Token management
- Procurement status updates
- Daily capacity management & queue monitoring

### 🛠️ Admin Module
- Manage farmers, procurement centers, and crops
- Manage slots
- Monitor bookings and procurement activity
- View system statistics
- Manage users and permissions

## 🔄 Smart Queue Management

KisanSetu reduces physical crowding by assigning farmers specific procurement slots.

```
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
```

## 🛠️ Technology Stack

**🎨 Frontend:** React, Vite, TypeScript

**⚙️ Backend:** Node.js, Express.js, TypeScript, REST API

**🗄️ Database:** PostgreSQL, Prisma ORM (managed via Neon)

**🔐 Authentication & Security:** JWT Authentication, bcrypt password hashing, Role-based access control, Zod validation, CORS protection, Environment variables for sensitive configuration

### 📡 API

Backend provides REST APIs for: Authentication, Farmers, Procurement Centers, Crops, Slot Management, Bookings, Queue Management, Procurement Tracking, Notifications

### 🔒 Security Practices

- Password hashing using bcrypt
- JWT-based authentication
- Input validation using Zod
- Role-based authorization
- CORS configuration
- Environment-based secrets
- Database access through Prisma ORM

> ⚠️ Never expose database credentials, connection strings, API keys, or other secrets in this README or in the public repository.

## 📂 Project Structure

```
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
```

## 🔮 Future Scope

- 🗣️ Multi-language support (Hindi & regional languages)
- 📩 SMS notifications
- 💬 WhatsApp notifications
- 📱 Mobile application
- 🛰️ GPS-based procurement center discovery
- 🤖 AI-based queue prediction (demand and arrival forecasting)
- 🌾 Crop quality prediction
- 💳 Digital payment integration
- 🏛️ Government procurement API integration
- 📡 Real-time center capacity monitoring
- 📊 Analytics dashboard
- 🗺️ Multi-state deployment

## 🎯 Vision

KisanSetu aims to create a simpler and more transparent procurement experience for farmers. Instead of farmers spending hours waiting in physical queues, KisanSetu enables them to plan their visit through digital scheduling and real-time queue information.

**Less waiting. Better planning. Smarter procurement.** 🌾✨

## 📦 Repository

https://github.com/mbajiya047/KisanSetu

## 📜 License

This project is licensed under the MIT License.
