# Secure Password Vault - MERN Stack

A production-ready password manager web application built with React, Node.js/Express, MongoDB, and JWT authentication.

## Features

✅ **User Authentication**
- Register & Login with email/password
- JWT-based authentication stored in httpOnly cookies
- Password hashing with bcrypt (salt rounds: 12)
- Protected routes on backend & frontend

✅ **Credential Management**
- Add, view, update, delete login credentials
- Passwords encrypted with AES-256-GCM before storage
- Search credentials by website name
- Show/hide password toggle
- Copy-to-clipboard functionality

✅ **Security**
- AES-256 encryption for stored passwords
- bcrypt password hashing (12 rounds)
- JWT access tokens with 15-minute expiry
- httpOnly cookies prevent XSS attacks
- Rate limiting on auth endpoints (20 req/15min)
- Helmet for HTTP headers security
- CORS configured for secure cross-origin requests
- NoSQL injection prevention with express-mongo-sanitize
- Input validation with express-validator
- Authorization checks: users can only access their own credentials

✅ **UI/UX**
- Clean, modern interface with gradient design
- Password masking by default
- Toast-like notifications
- Loading states
- Responsive grid layout for credentials
- Modal for add/edit credential

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt for password hashing
- crypto (built-in) for AES-256 encryption
- helmet, express-rate-limit, express-validator, express-mongo-sanitize

**Frontend:**
- React 18 + Vite
- Context API for state management
- Fetch API for HTTP calls
- CSS Grid & Flexbox

## Project Structure

```
server/
  src/
    index.js           # Express app setup
    config/
      db.js            # MongoDB connection
    models/
      User.js          # User schema
      Credential.js    # Credential schema
    controllers/
      authController.js      # Auth handlers
      credentialsController.js
    routes/
      auth.js          # Auth endpoints
      credentials.js   # CRUD endpoints
    middleware/
      auth.js          # JWT verification
      rateLimiter.js   # Rate limit config
    utils/
      crypto.js        # AES-256 encrypt/decrypt
      generateToken.js # JWT token generation

client/
  src/
    pages/
      AuthPage.jsx     # Login/Register
      Dashboard.jsx    # Main app
    components/
      Auth.jsx         # Login/Register forms
      CredentialList.jsx
      CredentialModal.jsx
    context/
      AuthContext.jsx
      CredentialContext.jsx
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Fill in .env
MONGO_URI=mongodb://localhost:27017/password-vault
PORT=5000
JWT_SECRET=your_super_secret_key_32_chars_min
JWT_EXPIRES_IN=15m
AES_SECRET=your_32_byte_hex_key_or_base64
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Start backend
npm run dev
```

### Frontend Setup

```bash
cd client
npm install

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`  
Backend will run on `http://localhost:5000`

## API Endpoints

### Auth Routes
```
POST   /api/auth/register    { name, email, password }
POST   /api/auth/login       { email, password }
POST   /api/auth/logout
GET    /api/auth/me          (Protected)
```

### Credential Routes (All Protected)
```
POST   /api/credentials                    { websiteName, websiteUrl?, username?, password, notes? }
GET    /api/credentials
GET    /api/credentials/:id
PUT    /api/credentials/:id                { websiteName, websiteUrl?, username?, password?, notes? }
DELETE /api/credentials/:id
```

## Security Best Practices Implemented

1. **Password Encryption:**
   - Passwords stored in database are encrypted using AES-256-GCM
   - Decryption only happens when authenticated user requests
   - Encryption key stored securely in environment variables

2. **Authentication:**
   - Passwords hashed with bcrypt (12 salt rounds)
   - JWT tokens expire after 15 minutes
   - Tokens stored in httpOnly cookies (prevents JavaScript XSS access)

3. **Authorization:**
   - Backend validates JWT on every protected route
   - Each user can only access/modify their own credentials
   - UserId extracted from JWT token, not from request body

4. **Rate Limiting:**
   - Auth endpoints limited to 20 requests per 15 minutes per IP
   - Mitigates brute-force attacks

5. **Input Validation:**
   - express-validator on both auth & credential routes
   - Password validation: minimum 8 characters, numbers + letters
   - Email format validation

6. **HTTP Security:**
   - Helmet middleware sets secure headers
   - CORS only allows frontend origin
   - Credentials included in CORS (for cookies)

7. **NoSQL Injection:**
   - express-mongo-sanitize removes `$` and `.` from input
   - Mongoose schema provides additional layer

## Environment Variables

**Backend .env:**
```
MONGO_URI=mongodb://localhost:27017/password-vault
PORT=5000
JWT_SECRET=generate_strong_random_string_32_chars_minimum
JWT_EXPIRES_IN=15m
AES_SECRET=generate_32_byte_hex_or_base64_for_aes256
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Generating Secure Keys:

```bash
# Generate JWT_SECRET (32 chars random):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate AES_SECRET (32 bytes hex for AES-256):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Error Handling

- Invalid credentials: 400 Bad Request
- Missing token: 401 Unauthorized
- Invalid token: 401 Unauthorized
- Insufficient permissions: 403 Forbidden
- Resource not found: 404 Not Found
- Server errors: 500 Internal Server Error

## Testing the App

1. Register new user
2. Login with credentials
3. Add a credential with website, username, password
4. Password is encrypted before storage
5. View credential - password is decrypted on retrieval
6. Toggle password visibility
7. Copy password to clipboard
8. Edit existing credential
9. Delete credential
10. Logout

## Future Enhancements

- Two-factor authentication (2FA)
- Refresh token rotation
- Credential categories/folders
- Password strength meter
- Audit logs for credential access
- Backup & export functionality
- Mobile app
- Biometric authentication

## License

MIT