# Event Management Backend API

Frontend reference for the routes in the supplied route and controller files.

## Base URL

The examples below assume these routers are mounted as follows:

| Router | Assumed prefix |
|---|---|
| `authRoutes` | `/api/auth` |
| `userRoutes` | `/api/users` |
| `opportunityRoutes` | `/api/opportunities` |
| `adminRoutes` | `/api/admin` |

The actual prefixes depend on the server entry point. Replace `http://localhost:3000` and the prefixes if your server uses different values.

## Headers and authentication

Send JSON headers when making a request with a JSON body:

```http
Content-Type: application/json
```

Protected routes also require:

```http
Authorization: Bearer <token>
```

Signup, login, and public opportunity listing/detail routes do not use the `auth` middleware in the supplied routes. All other routes below do.

## Authentication

### Create an account

```http
POST /api/auth/signup
```

**Request body:** Validated against `signupSchema`. The validator definition was not included, so the required fields cannot be listed reliably.

```json
{
  "fields": "Send the fields required by signupSchema"
}
```

**Success — `201 Created`**

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {}
}
```

`user` is returned by the auth service; its exact fields are not shown in the supplied files.

### Log in

```http
POST /api/auth/login
```

**Request body:** Validated against `loginSchema`. The validator definition was not included.

```json
{
  "fields": "Send the fields required by loginSchema"
}
```

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Login successful"
}
```

The controller adds the fields returned by the auth service to this response. Those fields, including the token property name, cannot be confirmed without `authService`.

## Users

### Get the current user's profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Request body:** None

**Success — `200 OK`**

```json
{
  "success": true,
  "user": {}
}
```

The user object excludes `password`; its remaining fields depend on the User model.

**User not found — `404 Not Found`**

```json
{
  "success": false,
  "message": "User not found"
}
```

### Update the current user's skills

```http
PATCH /api/users/skills
Authorization: Bearer <token>
Content-Type: application/json
```

**Request body**

```json
{
  "skills": ["JavaScript", "React"]
}
```

`skills` must be an array.

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Skills updated",
  "user": {}
}
```

The returned user excludes `password`.

**Invalid skills — `400 Bad Request`**

```json
{
  "success": false,
  "message": "Skills must be an array"
}
```

### Save an opportunity

```http
POST /api/users/save/:opportunityId
Authorization: Bearer <token>
```

Replace `:opportunityId` with the opportunity ID. The controller does not read a request body.

**Example**

```http
POST /api/users/save/OPPORTUNITY_ID
```

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Opportunity saved"
}
```

Saving an already-saved ID also returns this success response.

**User not found — `404 Not Found`**

```json
{
  "success": false,
  "message": "User not found"
}
```

## Opportunities

### List opportunities

```http
GET /api/opportunities
```

**Request body:** None

**Success — `200 OK`**

```json
{
  "success": true,
  "count": 0,
  "opportunities": []
}
```

### Get an opportunity

```http
GET /api/opportunities/:id
```

Replace `:id` with the opportunity ID.

**Request body:** None

**Success — `200 OK`**

```json
{
  "success": true,
  "opportunity": {}
}
```

The opportunity fields depend on the model/service.

**Opportunity not found — `404 Not Found`**

```json
{
  "success": false,
  "message": "Opportunity not found"
}
```

### Get recommendations

```http
GET /api/opportunities/recommendations
Authorization: Bearer <token>
```

**Request body:** None

**Success — `200 OK`**

```json
{
  "success": true,
  "recommendations": []
}
```

Recommendation item fields depend on the recommendation service.

### Create an opportunity

```http
POST /api/opportunities
Authorization: Bearer <token>
Content-Type: application/json
```

Requires the `ORGANIZER` or `ADMIN` role. The request is validated against `opportunitySchema`; that schema was not included, so the required fields cannot be listed reliably.

**Request body**

```json
{
  "fields": "Send the fields required by opportunitySchema"
}
```

**Success — `201 Created`**

```json
{
  "success": true,
  "message": "Opportunity created",
  "opportunity": {}
}
```

### Apply to an opportunity

```http
POST /api/opportunities/:id/apply
Authorization: Bearer <token>
```

Replace `:id` with the opportunity ID.

**Request body:** None

**Success — `201 Created`**

```json
{
  "success": true,
  "message": "Application submitted",
  "application": {}
}
```

The application fields depend on the opportunity service/model.

## Admin

### List users

```http
GET /api/admin/users
Authorization: Bearer <token>
```

Requires the `ADMIN` role.

**Request body:** None

**Success — `200 OK`**

```json
{
  "success": true,
  "users": []
}
```

User records exclude `password` and are sorted newest first.

## Errors and status codes

The supplied controllers explicitly define the error responses documented above. Authentication, authorization, validation, rate-limit, and unhandled service/database error responses are implemented in middleware or services that were not included, so their exact status codes and JSON bodies cannot be confirmed here.