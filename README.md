# 🚀 Opportunity Hub - Backend API Documentation

Welcome to the **Opportunity Hub & Event Management System** backend API documentation. This document provides frontend developers with comprehensive details on all available endpoints, required headers, request payloads, URL parameters, authentication/role restrictions, and sample JSON responses.

---

## 🌐 Base URLs

- **Production (Vercel):** `https://backend-task-3-zr8a.vercel.app`
- **Local Development:** `http://localhost:8000`

> **Base API Prefix:** `/api/v1`  
> Example Full URL: `https://backend-task-3-zr8a.vercel.app/api/v1/opportunities`

---

## 🔑 Authentication & Headers

### Common Request Headers
| Header | Required For | Format / Value | Description |
| :--- | :--- | :--- | :--- |
| `Content-Type` | All `POST`, `PUT`, `PATCH` requests | `application/json` | Specifies JSON body payload |
| `Authorization`| Protected Endpoints | `Bearer <accessToken>` | JWT access token received on Login |

### User Roles & Access Hierarchy
- **`USER`**: Students / regular candidates (default role upon signup).
- **`ORGANIZER`**: Event organizers with permissions to create, update, delete opportunities and access organizer ML analytics.
- **`ADMIN`**: Platform administrators with access to user management, event risk scoring, and full administrative tools.

### ⏱️ Rate Limiting Notice
All authentication endpoints (`/api/v1/auth/*`) are protected by a rate limiter allowing a maximum of **10 requests per 15 minutes** per IP address. Exceeding this limit will return HTTP `429 Too Many Requests`.

---

## 🚦 Standard Status Codes & Error Format

### Standard Response Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created (signup, create opportunity, application).
- `400 Bad Request`: Validation failure or invalid parameters.
- `401 Unauthorized`: Missing or invalid Bearer token.
- `403 Forbidden`: Authenticated user does not have permission (wrong role).
- `404 Not Found`: Resource or user not found.
- `429 Too Many Requests`: Rate limit exceeded on authentication endpoints.
- `500 Internal Server Error`: Server or upstream microservice error.

### Error Response Schema
```json
{
  "success": false,
  "message": "Error description message"
}
```

---

## 📑 Quick Navigation

- [0. System & Health](#0-system--health)
- [1. Authentication (`/api/v1/auth`)](#1-authentication)
- [2. User Management (`/api/v1/users`)](#2-user-management)
- [3. Opportunities (`/api/v1/opportunities`)](#3-opportunities)
- [4. Recommendations (`/api/v1/recommendations`)](#4-recommendations)
- [5. Machine Learning (`/api/v1/ml`)](#5-machine-learning)
- [6. Admin Management (`/api/v1/admin`)](#6-admin-management)

---

## 0. System & Health

### 🟢 Server Health Check
- **Method:** `GET`
- **Endpoint:** `/`
- **Auth Required:** ❌ None
- **Headers:** None
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Opportunity Hub Backend Running"
}
```

---

## 1. Authentication

> **Base Route:** `/api/v1/auth`  
> **Rate Limit:** 10 requests / 15 minutes per IP

### 1.1 Send Registration OTP
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/send-otp`
- **Auth Required:** ❌ None
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "alex.johnson@example.com"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "test_otp": "209208"
}
```

---

### 1.2 Verify Registration OTP
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/verify-otp`
- **Auth Required:** ❌ None
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "alex.johnson@example.com",
  "otp": "209208"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "OTP verified successfully. You can now signup."
}
```

---

### 1.3 User Signup
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/signup`
- **Auth Required:** ❌ None (Requires verified OTP first)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex.johnson@example.com",
  "password": "StrongPassword123!",
  "role": "ORGANIZER" 
}
```
*(Password must be at least 8 characters. `role` is optional and defaults to `"USER"`. Can be `"USER"`, `"ORGANIZER"`, or `"ADMIN"`).*
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "6ac34e2c6f61537f06a6de5d",
    "name": "Alex Johnson",
    "email": "alex.johnson@example.com",
    "role": "ORGANIZER"
  }
}
```

---

### 1.4 User Login
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/login`
- **Auth Required:** ❌ None
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "alex.johnson@example.com",
  "password": "StrongPassword123!"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "6ac34e2c6f61537f06a6de5d",
    "name": "Alex Johnson",
    "email": "alex.johnson@example.com",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "48b61c94d039e71..."
}
```

---

### 1.5 User Logout
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/logout`
- **Auth Required:** ❌ None (but needs `refreshToken`)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "refreshToken": "48b61c94d039e71..."
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.5 Forgot Password (Request OTP)
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/forgot-password`
- **Auth Required:** ❌ None
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "alex.johnson@example.com"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "OTP has been generated successfully.",
  "test_otp": "787459"
}
```

---

### 1.6 Reset Password (With OTP)
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/reset-password`
- **Auth Required:** ❌ None
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "alex.johnson@example.com",
  "otp": "787459",
  "newPassword": "NewStrongPassword123!"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 1.7 Change Password (Logged-in User)
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/change-password`
- **Auth Required:** ✅ YES
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "currentPassword": "StrongPassword123!",
  "newPassword": "NewStrongPassword123!"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 2. User Management

> **Base Route:** `/api/v1/users`

### 2.1 Get Current User Profile
- **Method:** `GET`
- **Endpoint:** `/api/v1/users/profile`
- **Auth Required:** ✅ YES (Any Authenticated User)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "user": {
    "id": "6ac34e2c6f61537f06a6de5d",
    "name": "Alex Johnson",
    "email": "alex.johnson@example.com",
    "role": "USER",
    "skills": ["JavaScript", "React", "Node.js"],
    "savedOpportunities": [],
    "createdAt": "2026-10-05T07:13:46.000Z",
    "updatedAt": "2026-10-05T07:13:46.000Z"
  }
}
```

---

### 2.2 Update User Skills
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/users/skills`
- **Auth Required:** ✅ YES (Any Authenticated User)
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "skills": ["React", "TypeScript", "Next.js", "Python"]
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Skills updated successfully",
  "skills": ["React", "TypeScript", "Next.js", "Python"]
}
```

---

### 2.3 Bookmark / Save Opportunity
- **Method:** `POST`
- **Endpoint:** `/api/v1/users/save/:opportunityId`
- **URL Parameter:** `opportunityId` (MongoDB ObjectId)
- **Auth Required:** ✅ YES (Any Authenticated User)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Opportunity saved successfully",
  "savedOpportunities": [
    "6ac34d3c1468dc852a213e62"
  ]
}
```

---

### 2.4 Get My Applications
- **Method:** `GET`
- **Endpoint:** `/api/v1/users/applications`
- **Auth Required:** ✅ YES (Any Authenticated User)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "count": 1,
  "applications": [
    {
      "_id": "6ac34d476f61537f06a6de5c",
      "user": "6ac34e2c6f61537f06a6de5d",
      "opportunity": {
        "_id": "6ac34d3c1468dc852a213e62",
        "title": "Fullstack Hackathon 2026",
        "organization": "Tech Innovations",
        "deadline": "2026-11-04T07:05:00.000Z"
      },
      "status": "applied",
      "createdAt": "2026-10-05T07:10:00.000Z"
    }
  ]
}
```

---

## 3. Opportunities

> **Base Route:** `/api/v1/opportunities`

### 3.1 Get All Opportunities
- **Method:** `GET`
- **Endpoint:** `/api/v1/opportunities`
- **Auth Required:** ❌ None
- **Headers:** None
- **Response (`200 OK`):**
```json
{
  "success": true,
  "count": 2,
  "opportunities": [
    {
      "_id": "6ac34d3c1468dc852a213e62",
      "title": "Fullstack Hackathon 2026",
      "description": "Annual student hackathon for building AI & Web apps.",
      "organization": "Tech Innovations",
      "category": "Hackathon",
      "skillsRequired": ["Node.js", "React"],
      "location": "Online",
      "deadline": "2026-11-04T07:05:00.000Z",
      "applicationLink": "https://example.com/apply",
      "createdBy": {
        "_id": "6ac34d3c1468dc852a213e5f",
        "name": "Organizer Name",
        "email": "organizer@example.com"
      },
      "createdAt": "2026-10-05T07:05:00.000Z"
    }
  ]
}
```

---

### 3.2 Get Opportunity by ID
- **Method:** `GET`
- **Endpoint:** `/api/v1/opportunities/:id`
- **URL Parameter:** `id` (MongoDB ObjectId)
- **Auth Required:** ❌ None
- **Headers:** None
- **Response (`200 OK`):**
```json
{
  "success": true,
  "opportunity": {
    "_id": "6ac34d3c1468dc852a213e62",
    "title": "Fullstack Hackathon 2026",
    "description": "Annual student hackathon for building AI & Web apps.",
    "organization": "Tech Innovations",
    "category": "Hackathon",
    "skillsRequired": ["Node.js", "React"],
    "location": "Online",
    "deadline": "2026-11-04T07:05:00.000Z",
    "applicationLink": "https://example.com/apply",
    "createdBy": {
      "_id": "6ac34d3c1468dc852a213e5f",
      "name": "Organizer Name",
      "email": "organizer@example.com"
    }
  }
}
```

---

### 3.3 Create Opportunity
- **Method:** `POST`
- **Endpoint:** `/api/v1/opportunities`
- **Auth Required:** ✅ YES (`ORGANIZER` or `ADMIN` role required)
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "title": "Frontend Engineering Internship",
  "description": "We are seeking a proactive Frontend Intern skilled in React and Tailwind CSS.",
  "organization": "Global Solutions Ltd",
  "category": "Internship",
  "skillsRequired": ["React", "JavaScript", "HTML/CSS"],
  "location": "Remote",
  "deadline": "2026-12-01T23:59:59.000Z",
  "applicationLink": "https://company.com/careers/intern"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Opportunity created",
  "opportunity": {
    "_id": "6ac34d476f61537f06a6de5b",
    "title": "Frontend Engineering Internship",
    "description": "We are seeking a proactive Frontend Intern skilled in React and Tailwind CSS.",
    "organization": "Global Solutions Ltd",
    "category": "Internship",
    "skillsRequired": ["React", "JavaScript", "HTML/CSS"],
    "location": "Remote",
    "deadline": "2026-12-01T23:59:59.000Z",
    "applicationLink": "https://company.com/careers/intern",
    "createdBy": "6ac34d3c1468dc852a213e5f",
    "createdAt": "2026-10-05T07:10:00.000Z"
  }
}
```

---

### 3.4 Update Opportunity
- **Method:** `PUT`
- **Endpoint:** `/api/v1/opportunities/:id`
- **URL Parameter:** `id` (Opportunity ObjectId)
- **Auth Required:** ✅ YES (`ORGANIZER` or `ADMIN` role required)
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <accessToken>`
- **Request Body:** (Same validation as Create Opportunity)
```json
{
  "title": "Senior Frontend Internship",
  "description": "Updated description with updated requirements and benefits.",
  "organization": "Global Solutions Ltd",
  "category": "Internship",
  "skillsRequired": ["React", "TypeScript", "Tailwind CSS"],
  "location": "Hybrid",
  "deadline": "2026-12-15T23:59:59.000Z",
  "applicationLink": "https://company.com/careers/intern-updated"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Opportunity updated",
  "opportunity": {
    "_id": "6ac34d476f61537f06a6de5b",
    "title": "Senior Frontend Internship",
    "organization": "Global Solutions Ltd",
    "category": "Internship"
  }
}
```

---

### 3.5 Delete Opportunity
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/opportunities/:id`
- **URL Parameter:** `id` (Opportunity ObjectId)
- **Auth Required:** ✅ YES (`ORGANIZER` or `ADMIN` role required)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Opportunity deleted"
}
```

---

### 3.6 Get Opportunity Applicants
- **Method:** `GET`
- **Endpoint:** `/api/v1/opportunities/:id/applicants`
- **URL Parameter:** `id` (Opportunity ObjectId)
- **Auth Required:** ✅ YES (`ORGANIZER` or `ADMIN` role required)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "count": 1,
  "applicants": [
    {
      "_id": "6ac34d476f61537f06a6de5c",
      "user": {
        "_id": "6ac34e2c6f61537f06a6de5d",
        "name": "Alex Johnson",
        "email": "alex.johnson@example.com",
        "skills": ["React", "Node.js"]
      },
      "status": "applied",
      "createdAt": "2026-10-05T07:11:00.000Z"
    }
  ]
}
```

---

### 3.7 Apply to Opportunity
- **Method:** `POST`
- **Endpoint:** `/api/v1/opportunities/:id/apply`
- **URL Parameter:** `id` (Opportunity ObjectId)
- **Auth Required:** ✅ YES (`USER` role required)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Application submitted",
  "application": {
    "_id": "6ac34d476f61537f06a6de5c",
    "user": "6ac34e2c6f61537f06a6de5d",
    "opportunity": "6ac34d476f61537f06a6de5b",
    "status": "applied",
    "createdAt": "2026-10-05T07:11:00.000Z"
  }
}
```

---

### 3.8 Get Personalized Opportunity Recommendations
- **Method:** `GET`
- **Endpoint:** `/api/v1/opportunities/recommendations`
- **Auth Required:** ✅ YES (Any Authenticated User)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "recommendations": {
    "recommendations": [
      {
        "title": "Smart India Hackathon",
        "domain": "AI & ML",
        "similarity_score": 0.88,
        "mode": "Online"
      }
    ]
  }
}
```

---

## 4. Recommendations

> **Base Route:** `/api/v1/recommendations`

### 4.1 Get General Event Recommendations
- **Method:** `POST`
- **Endpoint:** `/api/v1/recommendations/recommend`
- **Auth Required:** ❌ None
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "domain": "Web Development",
  "skills": ["React", "Node.js", "Express"],
  "year": 3,
  "branch": "CSE",
  "mode": "Online"
}
```
*(Note: `skills` can be an array of strings or a comma-separated string)*
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "event_id": "EVT101",
        "title": "Fullstack Cloud Conclave",
        "domain": "Web Development",
        "match_score": 0.94
      }
    ]
  }
}
```

---

## 5. Machine Learning

> **Base Route:** `/api/v1/ml`  
> ⚠️ **Note:** Microservices on Render may take 30–45s on cold starts. Once active, response times are ~500–1000ms.

### 5.1 Student Event Recommendations
- **Method:** `POST`
- **Endpoint:** `/api/v1/ml/student/recommend`
- **Auth Required:** ✅ YES (`USER` role required)
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "domain": "Web Development",
  "skills": "JavaScript, React, Node.js",
  "year": 3,
  "branch": "CSE",
  "mode": "Online",
  "top_n": 5
}
```
*(Important: `skills` must be formatted as a comma-separated string)*
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "event_name": "Modern Web Summit",
        "domain": "Web Development",
        "similarity_score": 0.92
      }
    ]
  }
}
```

---

### 5.2 Predict Event Registrations (Organizer)
- **Method:** `POST`
- **Endpoint:** `/api/v1/ml/organizer/predict-registrations`
- **Auth Required:** ✅ YES (`ORGANIZER` role required)
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "event_name": "Web3 Summit 2026",
  "category": "Blockchain",
  "mode": "Online"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "predicted_registrations": 1450
  }
}
```

---

### 5.3 Organizer Event Demand Analytics
- **Method:** `GET`
- **Endpoint:** `/api/v1/ml/organizer/event-demand`
- **Auth Required:** ✅ YES (`ORGANIZER` role required)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "total_events": 45,
    "event_status": {
      "pending": 5,
      "approved": 38,
      "rejected": 2
    },
    "mode_distribution": {
      "online": 25,
      "offline": 15,
      "hybrid": 5
    }
  }
}
```

---

### 5.4 Organizer Platform Statistics
- **Method:** `GET`
- **Endpoint:** `/api/v1/ml/organizer/analytics`
- **Auth Required:** ✅ YES (`ORGANIZER` role required)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "platform_statistics": {
      "total_users": 150,
      "total_organizers": 12,
      "total_events": 45
    },
    "organizer_statistics": {
      "pending_verification": 2,
      "verified": 10
    },
    "event_statistics": {
      "pending": 5,
      "approved": 38,
      "rejected": 2
    }
  }
}
```

---

### 5.5 Event Risk Assessment (Admin)
- **Method:** `POST`
- **Endpoint:** `/api/v1/ml/admin/event-risk`
- **Auth Required:** ✅ YES (`ADMIN` role required)
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "budget": 50000,
  "expected_attendees": 500
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "admin_status": "NEEDS REVIEW",
    "risk_score": 51.16,
    "review_priority": "MEDIUM",
    "anomaly_score": -0.0116
  }
}
```

---

### 5.6 Get Supported Technical Domains
- **Method:** `GET`
- **Endpoint:** `/api/v1/ml/domains`
- **Auth Required:** ✅ YES (Any Authenticated User)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "domains": [
      "AI & ML",
      "App Development",
      "Business & Product",
      "Cloud & DevOps",
      "Cybersecurity",
      "Data Science",
      "Design",
      "Electronics",
      "IoT",
      "Programming",
      "Robotics",
      "Web Development"
    ]
  }
}
```

---

### 5.7 Categorize Skills / Event to Domain
- **Method:** `POST`
- **Endpoint:** `/api/v1/ml/categorize`
- **Auth Required:** ✅ YES (Any Authenticated User)
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "skills_text": "Machine Learning, PyTorch, Deep Neural Networks, Computer Vision"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "predicted_domain": "AI & ML",
    "confidence": 0.935
  }
}
```

---

### 5.8 Single Review Sentiment Analysis
- **Method:** `POST`
- **Endpoint:** `/api/v1/ml/sentiment`
- **Auth Required:** ✅ YES (Any Authenticated User)
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "review_text": "The speaker was excellent and the hands-on session was very helpful!"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "sentiment": "positive",
    "confidence": 0.89
  }
}
```

---

### 5.9 Batch Sentiment Analysis
- **Method:** `POST`
- **Endpoint:** `/api/v1/ml/sentiment/batch`
- **Auth Required:** ✅ YES (Any Authenticated User)
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "reviews": [
    "Amazing workshop, learned a lot!",
    "Audio quality was poor and hard to follow.",
    "Decent overview of the topic."
  ]
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "positive": 1,
      "negative": 1,
      "neutral": 1
    },
    "details": [
      {
        "text": "Amazing workshop, learned a lot!",
        "sentiment": "positive",
        "confidence": 0.91
      },
      {
        "text": "Audio quality was poor and hard to follow.",
        "sentiment": "negative",
        "confidence": 0.86
      },
      {
        "text": "Decent overview of the topic.",
        "sentiment": "neutral",
        "confidence": 0.65
      }
    ]
  }
}
```

---

## 6. Admin Management

> **Base Route:** `/api/v1/admin`

### 6.1 Get All Users (Admin)
- **Method:** `GET`
- **Endpoint:** `/api/v1/admin/users`
- **Auth Required:** ✅ YES (`ADMIN` role required)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 25,
  "users": [
    {
      "_id": "6ac20995e5b5e82036895ee2",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER",
      "skills": ["Python", "FastAPI"],
      "savedOpportunities": [],
      "createdAt": "2026-10-04T08:08:53.821Z"
    }
  ]
}
```
- **Forbidden Response (`403 Forbidden`):**
```json
{
  "success": false,
  "message": "Access denied"
}
```

---

## 💡 Frontend Integration Best Practices

1. **Token Persistence & Refresh:**  
   Store `accessToken` in memory or secure storage. Use `Authorization: Bearer <accessToken>` in your Axios or Fetch interceptor.
2. **Handle Cold Starts Gracefully:**  
   When calling `/api/v1/ml/*` and `/api/v1/opportunities/recommendations`, display an informative loading state (e.g. *"AI models are initializing..."*) because Render spin-up can take 30–45s on idle.
3. **Respect Rate Limits:**  
   Do not continuously retry `/api/v1/auth/*` requests if you receive a `429` error. Wait until the 15-minute window resets.
4. **Exact Field Match for ML:**  
   - For `/api/v1/ml/categorize`: send `{ "skills_text": "..." }`.
   - For `/api/v1/ml/sentiment`: send `{ "review_text": "..." }`.
   - For `/api/v1/ml/sentiment/batch`: send `{ "reviews": ["...", "..."] }`.
   - For `/api/v1/ml/student/recommend`: send `skills` as a comma-separated string (e.g. `"React, Node.js"`).
