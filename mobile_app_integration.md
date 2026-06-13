# KothaBill Mobile App Integration Guide

This guide maps the frontend mobile screens (React Native/Flutter/Swift/etc.) to the backend REST API endpoints.

---

## 🔑 Global Configuration

- **Base URL:** `https://your-app.onrender.com`
- **Headers:** All authenticated requests must include the JWT bearer token:
  ```http
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json
  ```

---

## 📱 Screen Flows & API Mappings

### 1. Auth Flow Screens

#### Screen: Login
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "owner@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "owner@example.com",
        "phone": "+9779812345678",
        "role": "OWNER", // or "TENANT"
        "photo_url": null,
        "address": null,
        "created_at": "2026-06-13T22:21:26.000Z",
        "updated_at": "2026-06-13T22:21:26.000Z"
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```
- **Action:** Save the `token` in local storage (SecureStore/EncryptedSharedPreferences) and route the user based on `role` (`OWNER` Dashboard or `TENANT` Dashboard).

#### Screen: Register
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "tenant@example.com",
    "phone": "+9779876543210",
    "password": "securepassword123",
    "role": "TENANT" // OWNER or TENANT
  }
  ```
- **Response (201 Created):** Same structure as Login response.

---

### 🏡 Owner Screens (Role: OWNER)

#### Screen: Owner Dashboard / Room List
Displays all rooms owned by the landlord along with active tenant counts.
- **Method:** `GET`
- **Endpoint:** `/api/rooms`
- **Headers:** Authenticated
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Rooms fetched successfully",
    "data": [
      {
        "id": "room-uuid-1",
        "owner_id": "owner-uuid",
        "room_number": "101",
        "room_code": "XY89A12B", // Code given to tenants to join
        "address": "Baneshwor, Kathmandu",
        "created_at": "2026-06-13T10:00:00.000Z",
        "active_tenants": "1" // Tenant count
      }
    ]
  }
  ```

#### Screen: Create Room
Landlord adds a new room to rent out.
- **Method:** `POST`
- **Endpoint:** `/api/rooms`
- **Request Body:**
  ```json
  {
    "room_number": "202",
    "address": "Baneshwor, Kathmandu"
  }
  ```
- **Response (201 Created):** Returns the created room details with its generated unique `room_code`.

#### Screen: Tenant Directory
Displays all active tenants currently renting rooms from the landlord.
- **Method:** `GET`
- **Endpoint:** `/api/tenants`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Tenants fetched successfully",
    "data": [
      {
        "link_id": "tenant-link-uuid", // Use this ID for billing!
        "room_id": "room-uuid",
        "room_number": "101",
        "room_code": "XY89A12B",
        "address": "Baneshwor, Kathmandu",
        "user_id": "tenant-user-uuid",
        "name": "Jane Doe",
        "email": "tenant@example.com",
        "phone": "+9779876543210",
        "photo_url": null,
        "joined_at": "2026-06-13T12:00:00.000Z",
        "is_active": true
      }
    ]
  }
  ```

#### Screen: Tenant Profile & Bill History
Shows full history of a tenant's bills and room details.
- **Method:** `GET`
- **Endpoint:** `/api/tenants/:link_id` (e.g., `/api/tenants/tenant-link-uuid`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Tenant details fetched successfully",
    "data": {
      "link_id": "tenant-link-uuid",
      "room_id": "room-uuid",
      "room_number": "101",
      "name": "Jane Doe",
      "email": "tenant@example.com",
      "phone": "+9779876543210",
      "bills": [
        {
          "id": "bill-uuid-1",
          "month": "2026-05",
          "rent": 10000,
          "electricity": 800,
          "water": 200,
          "dustbin": 100,
          "total": 11100,
          "status": "PAID",
          "created_at": "2026-05-31T18:00:00.000Z"
        }
      ]
    }
  }
  ```

#### Screen: Create Monthly Bill
Landlord creates a bill for a tenant.
- **Method:** `POST`
- **Endpoint:** `/api/bills`
- **Request Body:**
  ```json
  {
    "tenant_id": "tenant-link-uuid",
    "month": "2026-06", // YYYY-MM
    "rent": 10000,
    "electricity": 1200,
    "water": 250,
    "dustbin": 100,
    "note": "AC usage was high this month." // Optional
  }
  ```
- **Response (201 Created):** Returns the created bill with `total` automatically calculated (sum of all amounts) and status defaulted to `DUE`.

#### Screen: Mark Bill as Paid/Due
Landlord updates a bill's payment status.
- **Method:** `PATCH`
- **Endpoint:** `/api/bills/:bill_id/status`
- **Request Body:**
  ```json
  {
    "status": "PAID" // Can be "PAID" or "DUE"
  }
  ```
- **Response (200 OK):** Returns the updated bill object.

---

## 🔑 Tenant Screens (Role: TENANT)

#### Screen: Join Room
Tenant links their account to an owner's room using a room code.
- **Method:** `POST`
- **Endpoint:** `/api/rooms/join`
- **Request Body:**
  ```json
  {
    "room_code": "XY89A12B"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Joined room successfully",
    "data": {
      "room": {
        "id": "room-uuid",
        "room_number": "101",
        "address": "Baneshwor, Kathmandu"
      },
      "link": {
        "id": "tenant-link-uuid",
        "room_id": "room-uuid",
        "joined_at": "2026-06-13T12:00:00.000Z",
        "is_active": true
      }
    }
  }
  ```

#### Screen: Tenant Bills (My Bills)
Tenant views all bills generated for them.
- **Method:** `GET`
- **Endpoint:** `/api/bills/my`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Bills fetched successfully",
    "data": [
      {
        "id": "bill-uuid-1",
        "room_id": "room-uuid",
        "month": "2026-06",
        "rent": 10000,
        "electricity": 1200,
        "water": 250,
        "dustbin": 100,
        "total": 11550,
        "status": "DUE",
        "note": "AC usage was high this month.",
        "room_number": "101",
        "address": "Baneshwor, Kathmandu"
      }
    ]
  }
  ```

---

## 🔔 Notifications Screen (All Roles)

#### Screen: Notifications Center
Displays active log list of user alerts.
- **Method:** `GET`
- **Endpoint:** `/api/notifications`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Notifications fetched successfully",
    "data": [
      {
        "id": "notification-uuid",
        "user_id": "user-uuid",
        "bill_id": "bill-uuid-1", // Optional link to the bill
        "message": "A new bill has been generated for June 2026.",
        "is_read": false,
        "created_at": "2026-06-13T13:00:00.000Z"
      }
    ]
  }
  ```

#### Action: Mark Notification as Read
Triggered when user clicks on a notification.
- **Method:** `PATCH`
- **Endpoint:** `/api/notifications/:notification_id/read` (e.g. `/api/notifications/notification-uuid/read`)
- **Response (200 OK):** Returns the updated notification object with `is_read` set to `true`.
