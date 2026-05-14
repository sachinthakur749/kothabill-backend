# KothaBill Backend Architecture Specification

## 1. Tech Stack
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT (jsonwebtoken) & BcryptJS
- **Validation:** Zod
- **Notifications:** Expo Server SDK

## 2. Database Schema (Prisma)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  OWNER
  TENANT
}

enum BillStatus {
  DUE
  PAID
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  phone         String    @unique
  password      String
  role          Role
  photoURL      String?
  address       String?
  roomCode      String?   // For Owners: Their unique identification code
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  rooms         Room[]    @relation("OwnerRooms")
  tenantLinks   TenantLink[] @relation("TenantUser")
  notifications Notification[]
}

model Room {
  id          String    @id @default(uuid())
  ownerId     String
  owner       User      @relation("OwnerRooms", fields: [ownerId], references: [id])
  roomNumber  String
  roomCode    String    @unique // Generated code for linking
  address     String
  createdAt   DateTime  @default(now())

  tenantLinks TenantLink[]
  bills       Bill[]
}

model TenantLink {
  id        String   @id @default(uuid())
  ownerId   String
  roomId    String
  userId    String
  user      User     @relation("TenantUser", fields: [userId], references: [id])
  room      Room     @relation(fields: [roomId], references: [id])
  joinedAt  DateTime @default(now())
  isActive  Boolean  @default(true)

  bills     Bill[]
}

model Bill {
  id          String     @id @default(uuid())
  roomId      String
  ownerId     String
  tenantId    String
  room        Room       @relation(fields: [roomId], references: [id])
  tenantLink  TenantLink @relation(fields: [tenantId], references: [id])
  month       String     // Format: "YYYY-MM"
  rent        Float
  electricity Float
  water       Float
  dustbin     Float
  note        String?
  status      BillStatus @default(DUE)
  total       Float
  createdAt   DateTime   @default(now())
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  billId    String?
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## 3. API Endpoints

### Auth
- `POST /api/auth/register`: Create a new user (Owner or Tenant).
- `POST /api/auth/login`: Authenticate and return JWT.
- `GET /api/auth/me`: Get current user profile.

### Rooms (Owner)
- `POST /api/rooms`: Create a new room (generates `roomCode`).
- `GET /api/rooms`: List all rooms owned by the user.
- `POST /api/rooms/join`: (Tenant) Join a room using a code.

### Tenants (Owner)
- `GET /api/tenants`: List all active tenants.
- `GET /api/tenants/:id`: Get detailed tenant info and bill history.

### Bills
- `POST /api/bills`: (Owner) Create a new monthly bill.
- `GET /api/bills/tenant/:tenantId`: Get bill history for a specific tenant.
- `GET /api/bills/my`: (Tenant) Get current and past bills for the logged-in tenant.
- `PATCH /api/bills/:id/status`: Update bill status (PAID/DUE).

### Notifications
- `GET /api/notifications`: Get all notifications for the user.
- `PATCH /api/notifications/:id/read`: Mark as read.

## 4. Security & Middlewares
- **authMiddleware:** Verifies JWT and attaches `user` to request.
- **roleMiddleware:** Restricts access to Owner-only or Tenant-only routes.
- **errorHandler:** Centralized error handling for API responses.
- **Validation:** Zod schemas for all input data.
