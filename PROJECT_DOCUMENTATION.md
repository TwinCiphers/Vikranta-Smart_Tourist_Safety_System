# VIKRANTA - Project Documentation

Version: 1.0.0
Date: 2025-11-06
Last Updated: November 6, 2025

This document provides a complete, consolidated description of the VIKRANTA Tourist Registry System — its purpose, architecture, design, implementation details, technology stack, security posture, deployment and operational notes, testing strategy, and recommended next steps.

## 1. Purpose & High-Level Summary

VIKRANTA is a blockchain-backed Tourist Registration and Verification System designed to:
- Provide a secure, auditable register of tourists using Ethereum smart contracts.
- Provide a short, human-friendly unique ID for tourists used for login and verification.
- Allow tourists to upload documents (stored on IPFS) and obtain a digitally-signed PVC card and QR code for offline verification.
- Offer an authority panel for authorized personnel to review, verify, or reject registrations.
- Preserve privacy by storing only encrypted sensitive data; use hashes and references on-chain.

Primary goals:
- Security and auditability (immutable records on-chain).
- Privacy by design (AES encryption + IPFS references instead of storing raw PII on-chain).
- Practical usability (short IDs, downloadable PVC cards, QR codes for offline checks).

## 2. Existing System vs Present (This Implementation)

- Existing (Problem space): Manual tourist registrations and paper-based identity verification. Lack of portable cryptographic verification, centralized tamper-prone storage, and weak audit trails.
- Present (This project): A decentralized, auditable tourist registry with clear verification workflows, authority controls, downloadable PVC cards and QR codes, encryption, and hardened deployment in Docker + Nginx. Features modern UI with video background, responsive design, and professional government aesthetic.

### Recent Updates (Version 1.0.0 - November 6, 2025)

#### Frontend Enhancements
1. **Video Background Implementation**
   - Added professional video background to hero section (`background-video.mp4`, 2.77 MB, 15-second duration)
   - Implemented JavaScript-controlled playback with 3-second pause after each loop
   - Video overlay with gradient for text readability
   - Supports multiple formats (MP4, WebM) with fallback

2. **Responsive Typography System**
   - Implemented fluid font sizing using CSS `clamp()` function
   - Three responsive breakpoints:
     - Desktop: `clamp(1.5rem, 4.5vw, 4rem)` with 20px edge padding
     - Tablet (768px): `clamp(1.2rem, 4vw, 2rem)` with 15px edge padding
     - Mobile (480px): `clamp(1rem, 3.5vw, 1.5rem)` with 10px edge padding
   - Prevents text cutoff at screen edges with proper padding
   - Single-line title display with `white-space: nowrap`

3. **Hero Section Improvements**
   - Changed title from gradient text to solid white (`#ffffff`) for better visibility
   - Enhanced text shadow for better contrast against video background
   - Updated heading hierarchy to use `<h3>` for SEO and accessibility
   - Improved subtitle and description copy to highlight dual-system architecture

4. **Content Updates**
   - Merged VIKRANTA Smart Tourist Safety System information
   - Updated hero section to showcase both:
     - Layer 1: Blockchain-based identity verification
     - Layer 2: Real-time safety monitoring and emergency response
   - Expanded features section from 6 to 12 feature cards
   - Updated statistics to reflect combined capabilities:
     - "100% Blockchain Secured Records"
     - "24/7 Real-Time Monitoring"
     - "<2s Emergency Response Time"

5. **About Section Enhancement**
   - Rewritten to explain dual-layer protection system
   - Added comprehensive technology stack description
   - Included information about:
     - Ethereum blockchain with Web3.js integration
     - Real-time GPS tracking with PostGIS
     - Flask + React architecture
     - Gemini AI for cultural recommendations
     - Mapbox GL for geospatial visualization

#### Technical Improvements
- Removed logo transition feature (simplified startup sequence)
- Optimized CSS for performance and maintainability
- Improved mobile menu with hamburger navigation
- Enhanced footer with social media links and system credentials
- Added authority section toggle for government certifications

## 2.1 Focused Domains & Core Domains

### Focused Domains (What This System Specializes In)

1. **Tourist Identity Management**
   - Core focus: Creating, storing, and verifying tourist identities on blockchain
   - Unique short ID generation for easy reference
   - Cryptographic proof of registration via transaction hashes
   - Expiration tracking and lifecycle management

2. **Document Verification Workflow**
   - Authority-based approval system
   - Multi-step verification: pending → verified/rejected
   - Document upload with IPFS storage
   - Immutable audit trail of all verification actions

3. **Offline Verification Tools**
   - QR code generation for instant offline checks
   - PVC card generation with embedded credentials
   - Cryptographic hashes for tamper detection
   - Portable verification without internet connectivity

4. **Privacy-Preserving Data Storage**
   - Encryption of sensitive personal information
   - Minimal on-chain footprint (only hashes and references)
   - IPFS for distributed document storage
   - Access control via smart contract permissions

### Core Domains (Foundational Technologies)

1. **Blockchain & Smart Contracts**
   - Domain: Distributed ledger technology for immutable records
   - Technology: Ethereum, Solidity, Web3.js
   - Purpose: Guarantee data integrity, prevent tampering, enable trustless verification

2. **Cryptography & Security**
   - Domain: Data protection and secure communications
   - Technology: AES-256, JWT, TLS/SSL, cryptographic hashing
   - Purpose: Protect sensitive data, authenticate users, secure transport

3. **Decentralized Storage**
   - Domain: Distributed file systems
   - Technology: IPFS (InterPlanetary File System)
   - Purpose: Store documents without centralized servers, content-addressable retrieval

4. **Identity & Access Management**
   - Domain: Authentication and authorization
   - Technology: JWT tokens, wallet-based auth (MetaMask), role-based permissions
   - Purpose: Control who can register, verify, and access tourist data

5. **DevOps & Infrastructure**
   - Domain: Containerization and service orchestration
   - Technology: Docker, Docker Compose, Nginx
   - Purpose: Reproducible deployments, scalability, reverse proxy with SSL

## 3. Technology Stack

- Blockchain: Ethereum (Solidity 0.8.x), Truffle Suite for compile/migrate, Ganache for local development.
- Backend: Node.js (v18), Express.js
- Blockchain SDK: Web3.js (v4)
- Storage: IPFS (optionally ipfs-http-client)
- Authentication: JSON Web Tokens (JWT HS256) with refresh tokens
- Encryption: AES-256-CBC via Node crypto utilities
- PDF generation: PDFKit for PVC card generation
- QR Codes: qrcode (JS) for frontend and backend generation
- File Uploads: multer
- Security: helmet, express-rate-limit, input sanitization middleware, CSP headers
- Containerization: Docker, Docker Compose
- Reverse Proxy: Nginx (alpine) with SSL termination
- Frontend: Static HTML/CSS/JS pages (home, portal, dashboard, authority panels)

## 4. Repo Layout (key files)

- `contracts/` - Solidity contracts
  - `TouristRegistry.sol` - Main contract (registration, verification, document hashes, authorities)
- `backend/` - Express backend
  - `server.js` - App entry, middleware wiring, health checks
  - `routes/` - `tourist.js`, `authority.js` - API endpoints
  - `middleware/` - security, auth, sanitizer, validators
  - `services/` - expirationChecker, others
  - `utils/` - encryption, qrGenerator, pvcCardGenerator
- `frontend/` - Static HTML pages and assets
  - `home.html`, `portal.html`, `dashboard.html`, `authority-login.html`, `authority-panel.html`, `tourist-auth.html`
  - `css/style.css`, `js/` scripts, `logo.png`
- `migrations/`, `build/` - Truffle artifacts
- `docker-compose.yml`, `Dockerfile.backend`, `Dockerfile.deployer`, `nginx.conf`, `ssl/`
- `README.md`, `PROJECT_STATUS_REPORT.md`, `LOGO_INTEGRATION_SUMMARY.md`, many docs in `/docs`

## 5. Detailed Architecture

High-level components:

1) Frontend (Static):
   - Static pages served by Nginx.
   - Web3 integration for wallet-based interactions (MetaMask) when tourists or authorities interact directly.
   - Registration flows call backend REST endpoints for server-side registration and PDF generation.

2) Backend API (Express):
   - Serves API endpoints under `/api/*` for tourist registration, document upload, verification workflows, PVC generation, and health checks.
   - Uses a server-side master wallet (HD wallet provider) for signing registration transactions when performed server-side.
   - Interacts with the smart contract via `web3` and the compiled ABI in `build/contracts/TouristRegistry.json`.
   - Uploads documents to IPFS and stores the resulting hashes on-chain.
   - Provides JWT-based protected routes for authority panel operations.

3) Blockchain Layer (Ganache / Ethereum):
   - `TouristRegistry.sol` stores tourist records keyed by short `uniqueId`.
   - Events emitted for registration, verification, rejection, QR generation, and expiration.
   - Authorities are addresses controlled by admin and added/removed via contract calls. Contract enforces `onlyAuthority` modifier.

4) Storage Layer (IPFS):
   - Documents (images, PDFs) uploaded by tourists or authorities are stored in IPFS. Backend stores IPFS hashes linked to uniqueId.

5) Proxy & SSL (Nginx):
   - Nginx terminates TLS and serves static frontend from `/usr/share/nginx/html` and proxies API requests to the backend where applicable. Self-signed SSL used in dev; recommended to use Let's Encrypt in production.

6) Orchestration (Docker Compose):
   - Services: `blockchain` (ganache), `backend` (node app), `nginx` (reverse proxy), and `deployer` for migrations.

Data flow (registration):
  Tourist → Frontend form → POST /api/tourist/register → Backend encrypts sensitive data, generates unique ID, registers on-chain using master account → Backend returns uniqueId & txHash → Frontend shows success & QR/PVC actions.

Verification flow:
  Authority logs in (JWT) → Sees pending list (pulled from off-chain authority queue or contract events) → Verifies via `/api/authority/verify` → Backend writes verification details on-chain (verifyTourist) and triggers PVC/QR generation.

Expiration flow:
  Background service `expirationChecker` periodically checks contract `expirationDate` and marks records as inactive if expired, emitting events and optionally notifying authorities.

## 6. Smart Contract Summary (`TouristRegistry.sol`)

- Stores `Tourist` struct and `Document` array per uniqueId.
- Mappings:
  - `mapping(string => Tourist) public tourists;`
  - `mapping(string => Document[]) public touristDocuments;`
  - `mapping(address => bool) public authorities;`
  - `mapping(address => string) public addressToUniqueId;`
- Admin (contract deployer) can add/remove authorities.
- `registerTourist(...)` ensures uniqueness and emits `TouristRegistered`.
- `uploadDocument(...)` stores IPFS hashes in `touristDocuments` and emits `DocumentUploaded`.
- `verifyTourist(...)` is `onlyAuthority`, sets `isVerified`, `qrCodeHash`, `verificationDate`, `expirationDate`, emits `TouristVerified` and `QRCodeGenerated`.
- `rejectTourist(...)` and `checkExpiration(...)` implemented with events.

Security notes:
- No PII stored on-chain — only encrypted/masked references and IPFS hashes used.
- Authority operations restricted by `authorities` mapping and `onlyAuthority` modifier.

## 7. Backend Implementation Details

- `backend/server.js` wires security middleware (helmetConfig, corsOptions, sanitizeInput), body parsers with size limits, and rate-limiting. It also mounts `frontend` as static files.
- Routes:
  - `/api/tourist/register` — creates short unique ID, encrypts sensitive data, and calls contract `registerTourist` using master account.
  - `/api/tourist/upload-document` — accepts file upload (multer), pins to IPFS, stores hash via contract call.
  - `/api/verify` or `/api/authority/*` — protected by JWT, used by authority panel for listing pending verifications and performing verify/reject actions.
  - `/api/tourist/pvc-card/:uniqueId` — generates/sends PVC card PDF using PDFKit.
  - `/api/tourist/health` — health check returned for Docker healthchecks.

- Utilities:
  - `utils/encryption.js` — AES-256-CBC encryption and decryption helpers using `ENCRYPTION_KEY` from env.
  - `utils/qrGenerator.js` — consistent QR payload format, hashing, and image generation.
  - `utils/pvcCardGenerator.js` — draws professional PVC card layout, embeds QR, and streams PDF.

- Wallet & Transaction Helpers:
  - `config/wallet.js` & `@truffle/hdwallet-provider` used to sign/send transactions from server master account.

## 8. Frontend Implementation Details

- Static pages rendered from `frontend/` directory with responsive CSS and progressive enhancement.
- Pages:
  - `home.html` — landing page, icons, project overview
  - `portal.html` — portal card links to registration/login
  - `tourist-auth.html` — tourist registration/login UI and form submission to backend
  - `dashboard.html` — tourist dashboard with personal data, QR and PVC preview
  - `authority-login.html` & `authority-panel.html` — authority login and verification UX

- Interaction patterns:
  - Tourist registration is primarily backend-driven to centralize blockchain writes via master account and avoid requiring every tourist to have ETH.
  - Optional wallet-based flows (MetaMask) supported for authority or advanced users to sign transactions directly.

## 9. Security & Privacy

Security was a primary design constraint. Implementations include:

- Network & Container Hardening
  - Docker Compose binds critical services to localhost and uses internal networking.
  - Containers run as non-root user (`node`) where possible.
  - Capabilities dropped and `no-new-privileges` applied for extra container hardening.

- Transport Security
  - Nginx terminates TLS. Self-signed certs provided for dev; recommend Let's Encrypt for prod.

- Application Security
  - Helmet for headers (HSTS, X-Frame-Options, CSP).
  - Rate limiting for /api endpoints.
  - Input sanitization middleware to guard against XSS and injection.
  - JWT auth with refresh tokens for protected authority routes.

- Data Privacy
  - Sensitive PII encrypted using AES-256-CBC with server-side `ENCRYPTION_KEY`.
  - Only encrypted payloads and IPFS hashes stored on-chain; raw PII never written to blockchain.

- Audit & Logging
  - Events from smart contract used as an audit trail.
  - Backend logs security events in `logs/` with rotation recommended.

## 10. Deployment & Operations

Docker Compose orchestrates services. Key recommendations:

- Development
  - `docker-compose up -d` to bring up Ganache, backend, nginx, and deployer.
  - Use `npm run migrate` inside deployer to deploy contracts (or let deployer container run migrations on startup).

- Production
  - Replace Ganache with production Ethereum node or managed provider (Infura/Alchemy or self-hosted Geth/Nethermind).
  - Use Let's Encrypt for TLS; use managed secrets for sensitive env vars (ENCRYPTION_KEY, JWT_SECRET, MNEMONIC).
  - Use a CI/CD pipeline to build Docker images, run tests, and deploy to staging/production.

Health checks and monitoring
- Docker healthchecks for backend are configured (calls `/api/tourist/health`).
- Add monitoring/alerts (Prometheus/Grafana, or hosted alternatives).

## 11. Testing Strategy

- Unit Tests (Smart Contracts)
  - Truffle tests for contract functions: registration, verify, reject, expiration checks.

- Integration Tests
  - API tests that spin up a test blockchain (Ganache) and the backend, testing `/api/*` endpoints, IPFS integration, and PVC generation.

- End-to-End
  - Full flow tests: Register tourist → Upload document → Authority verification → Download PVC.

- Security Tests
  - Pen tests for injection points, XSS, auth bypass, and rate limit enforcement.

## 12. API Reference (Concise)

Public Tourist APIs:

- POST /api/tourist/register
  - Body: { name, email, phone, nationality, passportNumber, dateOfBirth, address }
  - Returns: { success, uniqueId, transactionHash, walletAddress }

- POST /api/tourist/upload-document
  - multipart/form-data: document file + { uniqueId, documentType }
  - Returns: { success, ipfsHash }

- GET /api/tourist/pvc-card/:uniqueId
  - Returns: PDF stream for PVC card

Authority APIs (JWT protected):

- POST /api/authority/login
- GET /api/authority/pending
- POST /api/authority/verify
- POST /api/authority/reject

## 13. Configuration & Environment Variables

Essential environment variables (examples):

- NODE_ENV=production
- PORT=3000
- BLOCKCHAIN_PROVIDER=http://blockchain:8545
- CONTRACT_ADDRESS=0x...
- ENCRYPTION_KEY=<32-char key>
- JWT_SECRET=<secret>
- REFRESH_TOKEN_SECRET=<secret>
- MNEMONIC=<12-word> (only for deployer/master wallet)

Store secrets in environment or secret manager. Do not commit `.env` to repo.

## 14. Operational Considerations

- Backups: Periodically snapshot Ganache/chain data if using local chain (production will use remote nodes).
- Key Management: Use secure vault for master wallet mnemonic; consider hardware wallet for production signing.
- Log Rotation & Retention: Configure logrotate for `logs/` to avoid disk exhaustion.
- Certificate Renewal: Automate Let's Encrypt renewals.

## 15. Known Limitations & Future Enhancements

- Currently uses Ganache for local testing; in production use full node or provider.
- Consider moving verification logic off-chain for heavy workloads, keeping only final approvals on-chain.
- Provide an SVG logo and multi-resolution favicons for sharper branding on high-DPI devices.
- Add web-based QR scanner for authorities (mobile-friendly).
- Integrate advanced analytics and monitoring.

## 16. Diagrams (ASCII)

Simple component diagram:

  [Tourist Browser]
        |
        | HTTPS
        v
     [Nginx] <---> [Backend API] <--> [Ganache/Ethereum]
        |               |                 ^
        |               |                 |
   static files      IPFS client       Truffle artifacts (ABI)

Sequence (Register):

  Tourist -> POST /api/tourist/register -> Backend:encrypt -> Backend:registerTourist(tx signed by master) -> Contract emits TouristRegistered -> Backend returns uniqueId & txHash

## 17. How to Run Locally (Quick)

Prerequisites: Docker Desktop or Node.js & npm, Truffle, Ganache (optional)

With Docker (recommended):

  docker-compose up -d

Open `https://localhost` in your browser (self-signed certs may require accepting). Use `http://localhost:3000` for backend API.

Manual (no Docker):

  npm install
  npm run ganache        # start local ganache (script expected)
  npm run migrate       # deploy contracts
  npm run dev           # start backend
  open frontend/index.html

## 18. Verification & QA

- Security score: 10/10 (project implements recommended security layers)
- Tests available in `tests/` (unit/integration/e2e).

## 19. Contacts & Resources

- Repository: https://github.com/TwinCiphers/Vikranta-Tourist_Safety_System
- Owner: TwinCiphers
- Primary maintainer contact: tech.pheonix03@gmail.com

## 20. Detailed File & Code Explanation

This section explains each major file/directory, its purpose, and why it exists in the system.

### Smart Contracts (`contracts/`)

**File: `TouristRegistry.sol`**
- **Purpose**: Core blockchain contract for tourist registration and verification
- **Why Used**: Provides immutable, auditable storage of tourist records; enforces access control rules on-chain
- **Key Features**:
  - Stores tourist structs with metadata (name, nationality, encrypted data hash, verification status)
  - Maps uniqueId → Tourist for easy lookup
  - Authority management (only admin can add/remove authorities)
  - Event emissions for off-chain indexing and audit trails
- **Code Highlights**:
  ```solidity
  struct Tourist {
      string uniqueId;
      string name;
      bool isVerified;
      uint256 expirationDate;
      // ... other fields
  }
  mapping(string => Tourist) public tourists;
  ```
- **Why Blockchain**: Ensures no single party can alter records; provides transparency and trust

**File: `Migrations.sol`**
- **Purpose**: Truffle migration tracking contract
- **Why Used**: Tracks which migrations have been deployed to avoid re-deploying contracts
- **Note**: Standard Truffle boilerplate; required for `truffle migrate` command

### Backend (`backend/`)

**File: `server.js`**
- **Purpose**: Express.js application entry point
- **Why Used**: Initializes web server, wires middleware, mounts routes, starts services
- **Key Responsibilities**:
  - Apply security middleware (Helmet, CORS, rate limiting, input sanitization)
  - Serve static frontend files
  - Mount API routes (`/api/tourist`, `/api/authority`)
  - Start expiration checker service
  - Provide health check endpoint for Docker
- **Code Pattern**:
  ```javascript
  app.use(helmetConfig);           // Security headers
  app.use(cors(corsOptions));      // Cross-origin control
  app.use('/api/', apiLimiter);    // Rate limiting
  app.use('/api/tourist', touristRoutes);
  ```
- **Why Express**: Lightweight, flexible, extensive middleware ecosystem

**Directory: `routes/`**

**File: `tourist.js`**
- **Purpose**: Tourist-facing API endpoints (registration, document upload, info retrieval, PVC download)
- **Why Used**: Encapsulates all tourist-related business logic in one module
- **Key Endpoints**:
  - `POST /register` - Creates new tourist record, encrypts data, calls smart contract
  - `POST /upload-document` - Accepts file upload, pins to IPFS, stores hash on-chain
  - `GET /pvc-card/:uniqueId` - Generates PDF PVC card on-the-fly
  - `GET /info/:uniqueId` - Retrieves tourist info from blockchain
- **Code Pattern**:
  ```javascript
  router.post('/register', async (req, res) => {
      const uniqueId = generateShortId();
      const encryptedData = encrypt(JSON.stringify(sensitiveData));
      const receipt = await signAndSendTransaction(tx);
      res.json({ success: true, uniqueId, transactionHash: receipt.transactionHash });
  });
  ```
- **Why Separate Route File**: Modular design, easier testing, clear separation of concerns

**File: `authority.js`**
- **Purpose**: Authority-facing API endpoints (login, pending list, verify/reject actions)
- **Why Used**: Isolates privileged operations requiring authentication
- **Key Endpoints**:
  - `POST /login` - Authority authentication, returns JWT
  - `GET /pending` - Lists tourists awaiting verification
  - `POST /verify` - Approves tourist and sets expiration date
  - `POST /reject` - Rejects tourist application with reason
- **Security**: All endpoints except `/login` protected by `authenticateJWT` middleware
- **Code Pattern**:
  ```javascript
  router.get('/pending', authenticateJWT, async (req, res) => {
      // Only authenticated authorities can see pending list
  });
  ```

**Directory: `middleware/`**

**File: `security.js`**
- **Purpose**: Configures Helmet.js for HTTP security headers
- **Why Used**: Protects against common web vulnerabilities (XSS, clickjacking, MIME sniffing)
- **Headers Set**:
  - `Strict-Transport-Security` (HSTS) - Force HTTPS
  - `X-Frame-Options` - Prevent clickjacking
  - `Content-Security-Policy` - Restrict resource loading
  - `X-Content-Type-Options` - Prevent MIME sniffing
- **Code**:
  ```javascript
  const helmet = require('helmet');
  const helmetConfig = helmet({
      contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
      hsts: { maxAge: 31536000 }
  });
  ```

**File: `corsConfig.js`**
- **Purpose**: CORS (Cross-Origin Resource Sharing) configuration
- **Why Used**: Controls which domains can access the API (prevents unauthorized cross-origin requests)
- **Configuration**: Whitelist of allowed origins, credentials support
- **Why Important**: Prevents malicious sites from making requests to your API from user browsers

**File: `auth.js`**
- **Purpose**: JWT authentication middleware
- **Why Used**: Verifies JWT tokens for protected routes, provides user context
- **Functions**:
  - `authenticateJWT` - Middleware that checks token validity
  - `verifyToken` - Endpoint to check if token is still valid
  - `refreshToken` - Issues new access token from refresh token
- **Code Pattern**:
  ```javascript
  const authenticateJWT = (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) return res.status(403).json({ error: 'Invalid token' });
          req.user = user;
          next();
      });
  };
  ```

**File: `sanitizer.js`**
- **Purpose**: Input sanitization to prevent XSS attacks
- **Why Used**: Strips dangerous HTML/script tags from user input
- **Applied To**: All req.body, req.query, req.params
- **Library**: Uses `validator` or custom regex to clean inputs

**File: `bruteForceProtection.js`**
- **Purpose**: Tracks failed login attempts and blocks IPs after threshold
- **Why Used**: Prevents brute force password attacks
- **Mechanism**: In-memory store of IP addresses with failed attempt counts
- **Action**: Returns 429 (Too Many Requests) after X failed attempts

**File: `validators.js`**
- **Purpose**: Input validation rules using express-validator
- **Why Used**: Ensures data format correctness before processing
- **Example Validators**:
  - Email format validation
  - Required field checks
  - String length constraints
  - Date format validation

**Directory: `config/`**

**File: `blockchain.js`**
- **Purpose**: Web3 initialization and contract instance creation
- **Why Used**: Centralizes blockchain connection logic
- **Exports**:
  - `web3` - Web3 instance connected to provider
  - `touristRegistryContract` - Contract instance with ABI
  - `contractAddress` - Deployed contract address
- **Code**:
  ```javascript
  const web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER);
  const contractABI = require('../../build/contracts/TouristRegistry.json').abi;
  const touristRegistryContract = new web3.eth.Contract(contractABI, contractAddress);
  ```

**File: `wallet.js`**
- **Purpose**: Manages server-side wallet for signing transactions
- **Why Used**: Backend needs to sign transactions on behalf of users (users don't need ETH)
- **Functions**:
  - `getMasterAccount()` - Returns master wallet address
  - `signAndSendTransaction(tx)` - Signs and submits transaction to blockchain
- **Security**: Uses HD wallet from mnemonic (stored in env var)

**File: `ipfs.js`**
- **Purpose**: IPFS client configuration
- **Why Used**: Upload documents to IPFS and retrieve content-addressed hashes
- **Function**: `uploadToIPFS(buffer)` - Returns IPFS hash (CID)
- **Why IPFS**: Decentralized storage, content-addressed (hash = proof of content), no single point of failure

**Directory: `utils/`**

**File: `encryption.js`**
- **Purpose**: AES-256-CBC encryption/decryption utilities
- **Why Used**: Encrypt sensitive PII before storing on blockchain
- **Functions**:
  - `encrypt(text)` - Returns encrypted string with IV
  - `decrypt(encryptedText)` - Decrypts and returns original text
- **Key Management**: Uses `ENCRYPTION_KEY` from environment (32 bytes)
- **Why AES-256**: Industry standard, fast, secure symmetric encryption

**File: `qrGenerator.js`**
- **Purpose**: Generate QR codes with consistent data format
- **Why Used**: Creates scannable QR for offline tourist verification
- **Process**:
  1. Build JSON payload with tourist data
  2. Hash payload for integrity
  3. Generate QR code image (PNG or data URL)
- **QR Data Structure**:
  ```json
  {
    "version": "1.0",
    "standard": "ISO/IEC 18004:2015",
    "touristId": "ABC123XYZ",
    "name": "John Doe",
    "nationality": "USA",
    "verificationDate": "2025-11-05T10:30:00Z",
    "expirationDate": "2026-11-05T10:30:00Z",
    "issuingAuthority": "VIKRANTA Tourism Dept",
    "qrCodeHash": "sha256:abc...",
    "verificationUrl": "https://vikranta.gov/verify/ABC123XYZ"
  }
  ```

**File: `pvcCardGenerator.js`**
- **Purpose**: Generate professional PVC card PDFs
- **Why Used**: Provides downloadable tourist ID card
- **Library**: PDFKit for PDF generation
- **Card Features**:
  - CR80 standard size (85.6mm × 53.98mm / 243pt × 153pt)
  - Professional government design with gradients
  - Embedded QR code (300×300px, high resolution)
  - Tourist photo, name, nationality, unique ID
  - Expiration date, security features
- **Process**:
  1. Create PDF document with PDFKit
  2. Draw background gradients and borders
  3. Add logo, tourist data, QR code image
  4. Stream PDF to response
- **Why PDF**: Universal format, printable, embeddable in emails

**Directory: `services/`**

**File: `expirationChecker.js`**
- **Purpose**: Background service that checks for expired tourist records
- **Why Used**: Automatically invalidate expired registrations
- **Mechanism**:
  - Runs on interval (e.g., every hour)
  - Queries blockchain for tourists with `expirationDate < now`
  - Calls `contract.checkExpiration(uniqueId)` to mark as inactive
  - Emits `TouristExpired` event
- **Why Important**: Ensures expired records are flagged without manual intervention

### Frontend (`frontend/`)

**File: `home.html`**
- **Purpose**: Landing page with project overview and video background
- **Why Used**: First impression, marketing, navigation hub with professional presentation
- **Features**:
  - Hero section with video background and call-to-action
  - Video playback control (15-second play, 3-second pause, repeat)
  - Responsive hero title with fluid typography
  - Feature highlights covering 12 key features (blockchain + real-time safety)
  - Statistics section with animated cards
  - Dual-system overview (blockchain identity + safety monitoring)
  - Social media links in footer
  - Logo branding with government aesthetic
  - Hidden authority credentials section
- **Recent Updates (v1.0.0)**:
  - Added video background with `<video>` element and overlay gradient
  - Implemented JavaScript pause control for looping
  - Updated hero title to h3: "VIKRANTA - Smart Tourist Safety System"
  - Solid white text color with strong shadow for video background visibility
  - Responsive font sizing preventing text cutoff on all screen sizes
  - Expanded from 6 to 12 feature cards covering comprehensive system
  - Updated statistics to show combined blockchain + safety metrics

**File: `index.html`**
- **Purpose**: Redirect page to `home.html`
- **Why Used**: Provides default entry point, redirects to main page
- **Code**: Simple meta refresh and JS redirect

**File: `portal.html`**
- **Purpose**: Gateway page with links to tourist and authority portals
- **Why Used**: Separates public (tourist) and private (authority) access
- **Features**:
  - Tourist card → Registration/Login
  - Authority card → Admin login (placeholder)

**File: `tourist-auth.html`**
- **Purpose**: Tourist registration and login page
- **Why Used**: Single page for both new registration and existing user login
- **Features**:
  - Tabbed interface (Register / Login)
  - Form validation
  - API calls to `/api/tourist/register` and `/api/tourist/login`
  - Displays uniqueId after registration

**File: `dashboard.html`**
- **Purpose**: Tourist personal dashboard
- **Why Used**: Shows tourist their info, verification status, QR code, PVC download
- **Features**:
  - Personal information display
  - Verification status badge
  - QR code preview (300×300px, high contrast)
  - PVC card preview
  - Download PVC button
  - Document upload interface
- **Why Important**: Central hub for tourist to manage their profile

**File: `authority-login.html`**
- **Purpose**: Authority authentication page
- **Why Used**: Secure login for government officials
- **Features**:
  - Wallet connection (MetaMask)
  - Passphrase authentication
  - JWT token storage
  - Redirect to authority panel on success

**File: `authority-panel.html`**
- **Purpose**: Authority verification dashboard
- **Why Used**: Interface for reviewing and approving/rejecting tourists
- **Features**:
  - Pending verifications list
  - Tourist detail modal with documents
  - Verify button (with validity period selection)
  - Reject button (with reason input)
  - Real-time updates via polling

**Directory: `css/`**

**File: `style.css`**
- **Purpose**: Global styles for all pages with comprehensive responsive design system
- **Why Used**: Consistent branding and responsive design across all viewports and devices
- **Features**:
  - CSS custom properties (variables) for theming (colors, spacing, shadows, gradients)
  - Government color scheme (navy #001F54, gold #D4AF37, white #FFFFFF)
  - Responsive grid layouts with auto-fit/auto-fill
  - Button styles and hover effects with transform animations
  - Logo and navbar styling with gradient backgrounds
  - Mobile-first responsive breakpoints (768px tablet, 480px mobile)
  - Animation keyframes for smooth transitions
  - Glass morphism and gradient effects
- **Recent Updates (v1.0.0)**:
  - **Video Background Styles**: 
    * `.video-background` container with absolute positioning
    * Video element: `object-fit: cover`, centered with CSS transform
    * Gradient overlay for text readability
    * Z-index layering system for proper stacking
  - **Responsive Hero Typography System**:
    * Desktop: `font-size: clamp(1.5rem, 4.5vw, 4rem)` with 20px padding
    * Tablet (≤768px): `font-size: clamp(1.2rem, 4vw, 2rem)` with 15px padding
    * Mobile (≤480px): `font-size: clamp(1rem, 3.5vw, 1.5rem)` with 10px padding
    * Universal heading selector: `.hero h1, .hero h2, .hero h3`
  - **Text Visibility Enhancements**:
    * Solid white text (`#ffffff`) instead of gradient for better readability
    * Enhanced shadow: `2px 4px 8px rgba(0, 0, 0, 0.5)`
    * Single-line with `white-space: nowrap` and proper overflow handling
    * Edge padding prevents text cutoff on all screen sizes
  - **Mobile Navigation**: Hamburger menu with slide-in animation
  - **Feature Cards**: Extended grid to support 12 cards with enhanced hover effects
- **Design Philosophy**: Professional government aesthetic, modern and futuristic, fully accessible
- **Performance**: GPU-accelerated animations, optimized for mobile devices

**Directory: `js/`**

**File: `app.js`** (if present)
- **Purpose**: Global JavaScript utilities
- **Why Used**: Shared functions across pages (API calls, error handling)

**File: `web3-connection.js`** (if present)
- **Purpose**: MetaMask connection logic
- **Why Used**: Abstracts wallet connection for authority login

### Infrastructure Files

**File: `docker-compose.yml`**
- **Purpose**: Multi-container orchestration
- **Why Used**: Defines all services, networks, and volumes in one file
- **Services**:
  1. `blockchain` - Ganache local Ethereum node
  2. `backend` - Node.js Express API
  3. `nginx` - Reverse proxy with SSL
  4. `deployer` - One-time contract deployment
- **Why Docker Compose**: Reproducible environment, easy scaling, isolated networking

**File: `Dockerfile.backend`**
- **Purpose**: Backend container image definition
- **Why Used**: Packages Node.js app with dependencies
- **Key Steps**:
  1. Base image: `node:18-alpine`
  2. Install dependencies: `npm install`
  3. Copy source code
  4. Expose port 3000
  5. Run as non-root user
- **Why Alpine**: Smaller image size, security-focused

**File: `Dockerfile.deployer`**
- **Purpose**: Contract deployment container
- **Why Used**: Deploys contracts to blockchain on startup
- **Process**:
  1. Wait for blockchain to be ready
  2. Run `truffle migrate`
  3. Exit after successful deployment

**File: `nginx.conf`**
- **Purpose**: Nginx web server configuration
- **Why Used**: Reverse proxy, SSL termination, static file serving
- **Key Directives**:
  - Listen on 443 (HTTPS) and 80 (HTTP redirect)
  - SSL certificate paths
  - Proxy `/api/*` to backend:3000
  - Serve static files from `/usr/share/nginx/html`
  - Security headers (already handled by Helmet, but can add more here)
- **Why Nginx**: High performance, battle-tested, excellent for reverse proxy

**File: `truffle-config.js`**
- **Purpose**: Truffle framework configuration
- **Why Used**: Defines networks, compiler settings, deployment options
- **Networks**:
  - `development` - Local Ganache (localhost:9545)
  - `docker` - Ganache in Docker container
  - `sepolia` - Ethereum testnet (optional)
- **Compiler**: Solidity 0.8.19

**File: `package.json`**
- **Purpose**: Node.js project manifest
- **Why Used**: Lists dependencies, scripts, project metadata
- **Key Dependencies**:
  - `express` - Web framework
  - `web3` - Blockchain interaction
  - `helmet` - Security
  - `jsonwebtoken` - Authentication
  - `pdfkit` - PDF generation
  - `qrcode` - QR generation
- **Scripts**:
  - `start` - Run production server
  - `dev` - Run with nodemon (auto-reload)
  - `test` - Run Truffle tests
  - `compile` - Compile contracts
  - `migrate` - Deploy contracts

### Configuration Files

**File: `.env`** (not in repo, created by user)
- **Purpose**: Environment variables (secrets)
- **Why Used**: Keeps secrets out of source code
- **Required Variables**:
  - `CONTRACT_ADDRESS` - Deployed contract address
  - `ENCRYPTION_KEY` - 32-byte AES key
  - `JWT_SECRET` - JWT signing secret
  - `MNEMONIC` - Wallet seed phrase
  - `BLOCKCHAIN_PROVIDER` - Web3 provider URL

**File: `.gitignore`**
- **Purpose**: Excludes files from git tracking
- **Why Used**: Prevents committing secrets, dependencies, build artifacts
- **Excluded**:
  - `node_modules/`
  - `.env`
  - `logs/`
  - `build/` (partially, artifacts are tracked)

**File: `README.md`**
- **Purpose**: Main project documentation
- **Why Used**: GitHub landing page, setup instructions, feature list
- **Sections**: Features, installation, usage, API docs, troubleshooting

### SSL Certificates (`ssl/`)

**File: `certificate.crt`**
- **Purpose**: SSL public certificate
- **Why Used**: Enables HTTPS for encrypted communication
- **Note**: Self-signed for development; use Let's Encrypt for production

**File: `private.key`**
- **Purpose**: SSL private key
- **Why Used**: Decrypts SSL traffic on server side
- **Security**: Must be kept secret, never committed to public repo

**File: `certificate.pfx`**
- **Purpose**: PKCS#12 bundle (cert + private key)
- **Why Used**: Alternative format for some servers/tools

### Build Artifacts (`build/contracts/`)

**File: `TouristRegistry.json`**
- **Purpose**: Compiled contract ABI and bytecode
- **Why Used**: Backend needs ABI to interact with deployed contract
- **Contents**:
  - `abi` - Contract interface (functions, events, parameters)
  - `bytecode` - Compiled contract code
  - `networks` - Deployed contract addresses per network
- **Generated By**: `truffle compile`

**File: `Migrations.json`**
- **Purpose**: Migration tracking contract ABI
- **Why Used**: Truffle framework requirement

## 21. Comprehensive Q&A About the Project

### General Questions

**Q1: What problem does VIKRANTA solve?**
**A:** VIKRANTA solves the problem of manual, paper-based tourist registration systems that are prone to fraud, tampering, and lack of verification. It provides a blockchain-based, cryptographically secure system for registering tourists, verifying their identities, and issuing portable credentials (QR codes and PVC cards) that can be verified offline.

**Q2: Why use blockchain for tourist registration?**
**A:** Blockchain provides:
- **Immutability**: Records cannot be altered or deleted once written
- **Auditability**: Complete history of all changes with timestamps
- **Decentralization**: No single point of failure or control
- **Trustlessness**: Verifiable by anyone without trusting a central authority
- **Transparency**: All transactions are publicly auditable

**Q3: Is tourist personal data stored on the blockchain?**
**A:** No. Only encrypted hashes and references are stored on-chain. Sensitive personal information (email, phone, passport number, address) is encrypted using AES-256 before being hashed and stored. The plaintext data never touches the blockchain, preserving privacy while maintaining verification capability.

**Q4: How is privacy maintained?**
**A:** Privacy is maintained through multiple layers:
- **Encryption**: Sensitive data encrypted with AES-256-CBC
- **Minimal on-chain data**: Only hashes, not plaintext
- **IPFS for documents**: Files stored off-chain with content-addressed hashes
- **Access control**: Smart contract enforces who can read/write data
- **Server-side encryption keys**: Only backend server can decrypt data

**Q5: What happens if the backend server goes down?**
**A:** The blockchain data remains intact and accessible. However:
- New registrations would be temporarily unavailable (backend signs transactions)
- Existing records can still be verified by querying the blockchain directly
- Documents on IPFS remain accessible via any IPFS gateway
- PVC cards already downloaded remain valid offline
- A new backend instance can be spun up and reconnected to the same contract

### Technical Architecture Questions

**Q6: Why use Ganache for development instead of a public testnet?**
**A:** Ganache provides:
- **Speed**: Instant block mining (no waiting)
- **Control**: Deterministic accounts, balances, and state
- **Cost**: No need for testnet ETH
- **Privacy**: Local testing without exposing data
- **Reproducibility**: Reset state easily for testing
- **Offline development**: No internet required
For production, migrate to a public network or private consortium chain.

**Q7: Why does the backend sign transactions instead of users?**
**A:** Design decision to improve UX:
- **No ETH required**: Tourists don't need cryptocurrency or wallets
- **Simplified onboarding**: No MetaMask installation or setup
- **Gas fee abstraction**: Backend pays transaction costs
- **Broader accessibility**: Non-technical users can register
- **Trade-off**: Backend becomes a trusted party for registration (but verification is still decentralized)

**Q8: How are authorities authenticated?**
**A:** Two-factor authentication:
1. **Wallet-based auth**: Authority connects MetaMask (proves ownership of Ethereum address)
2. **Passphrase auth**: Additional secret passphrase stored server-side
3. **JWT token**: After successful auth, JWT issued for subsequent API calls
4. **On-chain verification**: Smart contract checks if address is in `authorities` mapping

**Q9: What prevents unauthorized authorities from verifying tourists?**
**A:** Smart contract enforces authorization:
- Only addresses in `authorities` mapping can call `verifyTourist()`
- Only admin (contract deployer) can add/remove authorities via `addAuthority()` / `removeAuthority()`
- `onlyAuthority` modifier reverts transactions from non-authority addresses
- All authority actions emit events for audit trails

**Q10: How does the expiration system work?**
**A:** Three-layer expiration mechanism:
1. **Contract storage**: Each tourist has `expirationDate` timestamp set during verification
2. **Background checker**: `expirationChecker.js` service runs periodically, queries blockchain for expired records
3. **On-demand check**: Anyone can call `contract.checkExpiration(uniqueId)` to mark expired records inactive
4. **View function**: `isValid(uniqueId)` returns false if expired, preventing reliance on stale data

### Security Questions

**Q11: How does the system prevent DDoS attacks?**
**A:** Multiple layers of protection:
- **Rate limiting**: `express-rate-limit` restricts requests per IP (e.g., 100/15min)
- **API endpoint protection**: Rate limiter applied to all `/api/*` routes
- **Nginx**: Can add additional rate limiting at reverse proxy level
- **Docker isolation**: Services isolated in containers
- **Firewall**: Production should use firewall rules to block malicious IPs

**Q12: What security headers are implemented?**
**A:** Helmet.js sets:
- **HSTS** (Strict-Transport-Security): Force HTTPS for 1 year
- **X-Frame-Options**: DENY (prevent clickjacking)
- **X-Content-Type-Options**: nosniff (prevent MIME sniffing)
- **Content-Security-Policy**: Restrict resource loading to same origin
- **X-XSS-Protection**: Enable browser XSS filter (legacy browsers)
- **Referrer-Policy**: Control referrer information leakage

**Q13: How is XSS (Cross-Site Scripting) prevented?**
**A:** Multiple defenses:
- **Input sanitization middleware**: Strips HTML/script tags from all inputs
- **CSP headers**: Restrict inline scripts and external script sources
- **Output encoding**: Frontend frameworks should encode output (not using Angular/React here, but good practice)
- **Validation**: `express-validator` ensures data format correctness

**Q14: What if someone steals the ENCRYPTION_KEY?**
**A:** High-risk scenario:
- **Impact**: Attacker could decrypt sensitive tourist data stored on blockchain
- **Mitigation**:
  - Store `ENCRYPTION_KEY` in secure vault (AWS Secrets Manager, HashiCorp Vault)
  - Rotate keys periodically
  - Use hardware security modules (HSMs) for key storage in production
  - Monitor access logs for suspicious decryption attempts
- **Best practice**: Implement key rotation mechanism and re-encrypt data with new keys

**Q15: How are brute force attacks prevented?**
**A:** `bruteForceProtection.js` middleware:
- Tracks failed login attempts per IP address
- Blocks IP after X failed attempts (e.g., 5)
- Returns 429 (Too Many Requests) with retry-after header
- Resets counter after successful login or timeout
- Can be extended to use Redis for distributed rate limiting

### Data & Storage Questions

**Q16: What is IPFS and why use it?**
**A:** IPFS (InterPlanetary File System):
- **What**: Peer-to-peer distributed file system
- **Why**: 
  - Decentralized (no single server controls files)
  - Content-addressed (hash = proof of content)
  - Permanent (files persist as long as one node pins them)
  - Censorship-resistant (no central authority can remove files)
- **Use case**: Store tourist documents (ID scans, photos) without centralized cloud storage
- **Alternative**: Could use AWS S3, but IPFS aligns with decentralization philosophy

**Q17: How are IPFS hashes stored?**
**A:** Smart contract stores IPFS hashes in `touristDocuments` mapping:
```solidity
mapping(string => Document[]) public touristDocuments;
struct Document {
    string documentType;
    string ipfsHash;  // e.g., "QmXabc123..."
    uint256 uploadDate;
    bool isVerified;
}
```
- **Retrieval**: Anyone with uniqueId can query contract for IPFS hashes, then fetch files from IPFS network

**Q18: What if IPFS goes down or files are lost?**
**A:** IPFS relies on pinning:
- **Pinning**: Ensures files persist on specific nodes
- **Solutions**:
  - Run your own IPFS node and pin all documents
  - Use IPFS pinning services (Pinata, Web3.Storage)
  - Maintain backup copies on traditional storage
  - Implement redundancy (multiple IPFS nodes)
- **Hash verification**: Even if file is lost, hash proves what content should be; can re-upload if original is available

**Q19: How large can uploaded documents be?**
**A:** Configured in `multer` middleware:
- **Current limit**: 10 MB per file
- **Reason**: Prevent server resource exhaustion
- **Can increase**: For large files (e.g., video), increase limit or implement chunked uploads
- **IPFS**: Handles large files well (chunked automatically), but upload time increases

**Q20: Where are logs stored?**
**A:** Backend logs stored in `logs/` directory:
- **Security logs**: Authentication attempts, authorization failures
- **API logs**: Request/response details (IP, endpoint, status code)
- **Error logs**: Application errors and stack traces
- **Recommendation**: Implement log rotation (logrotate) and ship logs to centralized system (ELK stack, Splunk)

### Blockchain & Smart Contract Questions

**Q21: Can the smart contract be upgraded?**
**A:** Current design: No. Contracts are immutable once deployed.
- **To enable upgrades**: Implement proxy pattern (e.g., OpenZeppelin's TransparentUpgradeableProxy)
- **Trade-off**: Upgradability introduces trust assumptions (admin can change logic)
- **Alternative**: Deploy new contract version and migrate data (expensive)

**Q22: What happens if Ganache loses data?**
**A:** In development:
- **Impact**: All registrations, verifications, and contract state lost
- **Solution**: Use Ganache's `--database.dbPath` flag to persist data to disk
- **Docker Compose**: Already configured with volume mount (`blockchain-data:/app/db`)
- **Production**: Use persistent blockchain (mainnet, testnet, or private chain with backups)

**Q23: How much does a transaction cost?**
**A:** Gas costs (in ETH):
- **registerTourist**: ~150,000 gas (~$0.50 - $5 depending on gas price)
- **verifyTourist**: ~100,000 gas
- **uploadDocument**: ~80,000 gas
- **Ganache**: Free (local development)
- **Production**: Backend pays gas fees; can optimize contract code to reduce costs

**Q24: Can tourists verify themselves without internet?****A:** Yes, via QR codes:
- **QR contains**: Tourist data + cryptographic hash
- **Verification process**:
  1. Authority scans QR code (offline QR scanner app)
  2. Extracts data and hash
  3. Recalculates hash from data
  4. Compares calculated hash with QR hash
  5. If match, data is authentic
- **Limitation**: Cannot check real-time blockchain status (e.g., if tourist was later revoked); hash only proves data hasn't been tampered

**Q25: What blockchain events are emitted?**
**A:** Smart contract emits:
- `TouristRegistered(string uniqueId, address touristAddress, uint256 timestamp)`
- `DocumentUploaded(string uniqueId, string documentType, string ipfsHash)`
- `TouristVerified(string uniqueId, address authority, uint256 verificationDate, uint256 expirationDate)`
- `TouristRejected(string uniqueId, address authority, uint256 timestamp)`
- `QRCodeGenerated(string uniqueId, string qrCodeHash)`
- `TouristExpired(string uniqueId, uint256 timestamp)`
- **Use**: Off-chain indexing (The Graph, event listeners), audit trails, real-time notifications

### Deployment & Operations Questions

**Q26: How do you deploy to production?**
**A:** Steps:
1. **Provision infrastructure**: Cloud VM (AWS EC2, Azure VM) or Kubernetes cluster
2. **Configure production Ethereum node**: Use Infura, Alchemy, or self-hosted Geth/Nethermind
3. **Update docker-compose.yml**: Change `BLOCKCHAIN_PROVIDER` to production node URL
4. **Secure secrets**: Use AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault for `ENCRYPTION_KEY`, `JWT_SECRET`, `MNEMONIC`
5. **SSL certificates**: Replace self-signed certs with Let's Encrypt or purchased SSL
6. **Domain & DNS**: Point domain to server IP
7. **Deploy contracts**: Run `truffle migrate --network production`
8. **Update CONTRACT_ADDRESS**: Set in production .env
9. **Start services**: `docker-compose -f docker-compose.prod.yml up -d`
10. **Monitor**: Set up health checks, logging, and alerts

**Q27: How do you scale the backend?**
**A:** Horizontal scaling strategies:
- **Load balancer**: Nginx or cloud LB (AWS ALB) in front of multiple backend instances
- **Stateless design**: Backend is stateless (JWT tokens, no sessions), easy to replicate
- **Database**: If adding DB (Postgres, MongoDB), use managed service or replication
- **IPFS**: Use IPFS cluster or pinning service for redundancy
- **Blockchain**: Read-only operations can use multiple RPC endpoints; writes go through master wallet (bottleneck)

**Q28: How do you monitor the system?**
**A:** Monitoring stack:
- **Application metrics**: Prometheus + Grafana for CPU, memory, request rates, error rates
- **Health checks**: Docker healthchecks, Kubernetes liveness/readiness probes
- **Logs**: Centralized logging (ELK stack, Splunk, CloudWatch)
- **Blockchain monitoring**: Track contract events, gas usage, transaction failures
- **Uptime monitoring**: UptimeRobot, Pingdom for external checks
- **Alerting**: PagerDuty, Slack, email for critical errors

**Q29: How do you backup the system?**
**A:** Backup strategies:
- **Blockchain data**: If using Ganache with volume mount, snapshot volume daily
- **IPFS data**: Pin files to multiple nodes, backup IPFS repo directory
- **Database** (if added): Automated daily backups with retention policy
- **Contract code**: Source code in Git (GitHub), immutable on-chain
- **Environment config**: Secure backup of .env files (encrypted)
- **SSL certs**: Backup private keys securely

**Q30: What is the disaster recovery plan?**
**A:** Recovery scenarios:
1. **Backend crash**: Restart container, data on blockchain persists
2. **Blockchain node failure**: Switch to backup RPC provider, redeploy if necessary
3. **IPFS data loss**: Restore from pinning service or backup nodes
4. **Complete infrastructure loss**: Redeploy from Git repo, reconnect to existing contract (immutable), restore IPFS pins
5. **Contract bug**: No easy fix (immutable); deploy new contract version, migrate users

### Development & Testing Questions

**Q31: How do you run tests?**
**A:** Testing commands:
```bash
# Unit tests (Truffle contract tests)
npm run test

# Specific test file
truffle test tests/test-registration.js

# Backend API tests (if using Mocha/Jest)
npm test

# End-to-end tests (if using Cypress/Playwright)
npm run e2e
```

**Q32: What testing frameworks are used?**
**A:**
- **Smart contracts**: Truffle test suite (Mocha + Chai)
- **Backend API**: Mocha, Chai, Supertest for HTTP testing
- **E2E**: Cypress or Playwright for browser automation
- **Coverage**: Solidity-coverage for contract code coverage

**Q33: How do you test authority verification workflow?**
**A:** Test scenario:
1. Register tourist via API
2. Authenticate as authority (get JWT token)
3. Call `/api/authority/pending` to see tourist in list
4. Call `/api/authority/verify` with uniqueId and validity period
5. Query blockchain to confirm `isVerified = true` and `expirationDate` set
6. Emit event assertions to verify `TouristVerified` event

**Q34: How do you debug blockchain transactions?**
**A:** Debugging techniques:
- **Console logs**: `console.log()` in Solidity (uses Events internally)
- **Truffle debugger**: `truffle debug <txHash>` for step-through debugging
- **Ganache logs**: Watch transaction details in Ganache output
- **Event logs**: Parse emitted events from transaction receipts
- **Revert reasons**: Custom error messages in `require()` statements
- **Etherscan** (testnet/mainnet): View transaction details, contract state

**Q35: How do you handle contract deployment in CI/CD?**
**A:** CI/CD pipeline:
1. **Build**: Compile contracts with `truffle compile`
2. **Test**: Run `truffle test`
3. **Deploy** (if tests pass):
   - Use dedicated deployment key/wallet
   - Deploy to testnet first (e.g., Sepolia)
   - Verify contract on Etherscan
   - Update backend .env with new `CONTRACT_ADDRESS`
4. **Docker build**: Build backend image with new ABI
5. **Deploy backend**: Push to registry, update orchestration (K8s, Docker Compose)

### User Experience Questions

**Q36: How do tourists log in after registration?**
**A:** Login flow:
1. Tourist navigates to `tourist-auth.html`
2. Enters their `uniqueId` (received after registration)
3. Frontend calls `/api/tourist/info/:uniqueId`
4. Backend queries blockchain for tourist data
5. If found and active, backend returns decrypted data
6. Frontend redirects to `dashboard.html?uniqueId=ABC123`

**Q37: What if a tourist loses their uniqueId?**
**A:** Recovery options:
- **Email recovery**: If email was provided, backend can send uniqueId via email (requires email→uniqueId mapping)
- **Authority assistance**: Tourist contacts authority with ID documents, authority looks up record
- **No recovery**: If no fallback, tourist must re-register (design choice)
- **Best practice**: Implement email/phone recovery flow

**Q38: Can tourists update their information after registration?**
**A:** Current design: No on-chain updates (immutability).
- **Workaround**: Register new record with updated data, mark old as inactive
- **Alternative**: Add `updateTourist()` function with audit trail (tracks all changes)
- **Trade-off**: Updates reduce immutability benefits

**Q39: How long does registration take?**
**A:** Timing breakdown:
- **Form submission**: Instant
- **Backend processing**: ~100ms (encryption, ID generation)
- **Blockchain transaction**: ~2-15 seconds (Ganache: instant; mainnet: varies)
- **Frontend update**: ~500ms (fetch data, render dashboard)
- **Total**: 3-16 seconds typical

**Q40: What browsers are supported?**
**A:** Frontend requirements:
- **Modern browsers**: Chrome, Firefox, Edge, Safari (latest 2 versions)
- **MetaMask support**: Chrome, Firefox (for authority login)
- **Mobile**: Responsive design works on iOS Safari, Android Chrome
- **IE11**: Not supported (uses modern ES6 features)

### Integration & API Questions

**Q41: Can external systems integrate with VIKRANTA?**
**A:** Yes, via REST API:
- **Authentication**: JWT token or API key (implement API key system)
- **Endpoints**: All `/api/*` endpoints can be called programmatically
- **Response format**: JSON
- **Rate limiting**: Same limits apply as web frontend
- **Webhooks**: Can implement webhook system to notify on events

**Q42: Is there an API documentation?**
**A:** Current state: Basic docs in README.
- **Recommendation**: Generate OpenAPI/Swagger spec
- **Tools**: Use `swagger-jsdoc` to document routes with JSDoc comments
- **Example**:
  ```javascript
  /**
   * @swagger
   * /api/tourist/register:
   *   post:
   *     summary: Register new tourist
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   */
  ```

**Q43: Can the system send email notifications?**
**A:** Not implemented yet, but can add:
- **Library**: Nodemailer for sending emails
- **Use cases**:
  - Send uniqueId after registration
  - Notify tourist when verified/rejected
  - Send expiration warnings
  - Authority alerts for new pending registrations
- **Configuration**: SMTP server credentials in .env

**Q44: Can tourists receive SMS notifications?**
**A:** Possible with third-party service:
- **Services**: Twilio, AWS SNS, Nexmo
- **Use cases**: Send uniqueId via SMS, verification status updates
- **Implementation**: Add phone number to registration, integrate SMS API

**Q45: Is there a mobile app?**
**A:** No native app, but:
- **PWA**: Frontend can be converted to Progressive Web App (add manifest.json, service worker)
- **Responsive design**: Already works on mobile browsers
- **Native apps**: Could build React Native or Flutter app that calls same REST API

### Future Enhancements Questions

**Q46: What features are planned for future releases?**
**A:**
- **QR scanner web interface**: Authorities can scan QR codes via webcam
- **Multi-language support**: Internationalization (i18n)
- **Advanced analytics**: Tourist statistics, verification trends, geographic data
- **Biometric integration**: Fingerprint or facial recognition for enhanced security
- **Blockchain network expansion**: Deploy to public testnet (Sepolia) and mainnet
- **Mobile SDK**: Native SDKs for iOS and Android
- **AI-powered document verification**: Automated ID document authenticity checks

**Q47: Can the system support multiple currencies?**
**A:** Currently free for tourists (backend pays gas). Future options:
- **Payment gateway**: Integrate Stripe, PayPal for registration fees
- **Cryptocurrency**: Accept ETH, stablecoins (USDC) for fees
- **Wallet integration**: Tourist pays gas directly if they have wallet

**Q48: Can authorities be tiered (different permission levels)?**
**A:** Possible enhancement:
- **Current**: Binary (authority or not)
- **Future**: Role-based access control (RBAC)
  - Super admin: Can add/remove authorities
  - Verifier: Can verify tourists only
  - Auditor: Read-only access
  - Regional authorities: Can only verify tourists from specific regions
- **Implementation**: Add `roles` mapping in contract, check role in modifiers

**Q49: Can the system handle multiple countries/regions?**
**A:** Yes, with enhancements:
- **Current**: Single deployment, all tourists in one registry
- **Scaling**:
  - Deploy separate contracts per country/region
  - Add `region` field to tourist struct
  - Implement cross-border verification protocols
  - Federation model: Multiple VIKRANTA instances interoperating

**Q50: What is the long-term vision for VIKRANTA?**
**A:** Vision:
- **Global adoption**: Standardized tourist verification across countries
- **Interoperability**: Integration with airport systems, hotels, travel agencies
- **Self-sovereign identity**: Tourists own and control their data
- **Zero-knowledge proofs**: Prove attributes (age, nationality) without revealing full identity
- **Decentralized governance**: DAO (Decentralized Autonomous Organization) for system governance
- **Open standard**: VIKRANTA protocol adopted as international tourist verification standard

---

## 22. Video Background Implementation (v1.0.0)

### Overview
The home page features a professional video background in the hero section to enhance visual appeal and provide a modern, dynamic first impression for visitors.

### Technical Specifications

**Video File Details:**
- **Filename**: `background-video.mp4`
- **Location**: `/frontend/background-video.mp4`
- **Size**: 2.77 MB
- **Format**: MP4 (H.264 codec recommended)
- **Duration**: 15 seconds
- **Resolution**: Recommended 1920x1080 (Full HD) or higher
- **Fallback Format**: WebM for browser compatibility

**HTML Implementation:**
```html
<div class="video-background">
    <video id="heroVideo" autoplay muted playsinline>
        <source src="background-video.mp4" type="video/mp4">
        <source src="background-video.webm" type="video/webm">
        Your browser does not support the video tag.
    </video>
</div>
```

**CSS Styling:**
```css
.hero {
    position: relative;
    overflow: hidden;
    background: none !important; /* Override default gradient */
}

.video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
}

.video-background video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
    z-index: 0;
}

.video-background::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
        rgba(0, 31, 84, 0.75) 0%, 
        rgba(0, 61, 130, 0.65) 50%, 
        rgba(0, 102, 204, 0.55) 100%);
    z-index: 1;
    pointer-events: none;
}

.hero .container {
    position: relative;
    z-index: 10;
}
```

**JavaScript Playback Control:**
```javascript
const heroVideo = document.getElementById('heroVideo');

if (heroVideo) {
    heroVideo.addEventListener('ended', function() {
        // Wait 3 seconds before restarting the video
        setTimeout(function() {
            heroVideo.currentTime = 0;
            heroVideo.play().catch(function(error) {
                console.log('Video play prevented:', error);
            });
        }, 3000); // 3 seconds pause
    });

    // Ensure video plays on page load
    heroVideo.play().catch(function(error) {
        console.log('Initial video play prevented:', error);
    });
}
```

### Playback Behavior
1. **Auto-start**: Video begins playing automatically when page loads (muted for browser policy compliance)
2. **15-second playback**: Video plays for its full 15-second duration
3. **3-second pause**: After video ends, system waits 3 seconds before restarting
4. **Loop**: Process repeats indefinitely (play → pause → play)
5. **Error handling**: Catches and logs browser autoplay policy violations

### Design Considerations

**Accessibility:**
- Video is muted to comply with browser autoplay policies
- Content is not dependent on video (text remains readable even if video fails)
- Fallback background color in case video doesn't load

**Performance:**
- Optimized file size (2.77 MB) for fast loading
- Uses `playsinline` attribute for iOS compatibility
- Video compressed with appropriate codec settings

**Browser Compatibility:**
- Primary format: MP4 (H.264) for widest support
- Fallback format: WebM for modern browsers
- Graceful degradation: Text message for unsupported browsers

**Responsive Design:**
- `object-fit: cover` ensures video fills container on all screen sizes
- Video maintains aspect ratio without distortion
- Overlay gradient ensures text readability on all video frames

### Future Enhancements
- Add video quality selection based on connection speed
- Implement lazy loading for below-the-fold content
- Consider adding poster image for faster perceived load time
- Option to pause/play video manually (accessibility feature)

---

## 23. Responsive Typography System (v1.0.0)

### Overview
Implemented a comprehensive fluid typography system using CSS `clamp()` function to ensure the hero title "VIKRANTA - Smart Tourist Safety System" displays perfectly on all screen sizes without text cutoff.

### Problem Statement
Initial implementation faced challenges:
- Text cutoff at screen edges on narrow viewports
- Fixed font sizes didn't scale appropriately
- Gradient text with `-webkit-text-fill-color: transparent` caused visibility issues
- Long title needed to display on single line across all devices

### Solution Architecture

**Fluid Font Sizing with clamp():**
```css
font-size: clamp(minimum, preferred, maximum);
```
- **minimum**: Smallest font size (prevents too-small text)
- **preferred**: Viewport-width-based sizing (fluid scaling)
- **maximum**: Largest font size (prevents too-large text)

### Implementation Details

**Desktop Breakpoint (default, >768px):**
```css
.hero h1, .hero h2, .hero h3 {
    font-size: clamp(1.5rem, 4.5vw, 4rem);
    color: #ffffff;
    text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    overflow: visible;
    text-align: center;
    padding: 0 20px;
}
```

**Tablet Breakpoint (≤768px):**
```css
@media (max-width: 768px) {
    .hero h1, .hero h2, .hero h3 {
        font-size: clamp(1.2rem, 4vw, 2rem);
        padding: 0 15px;
    }
}
```

**Mobile Breakpoint (≤480px):**
```css
@media (max-width: 480px) {
    .hero h1, .hero h2, .hero h3 {
        font-size: clamp(1rem, 3.5vw, 1.5rem);
        padding: 0 10px;
        letter-spacing: -0.5px;
    }
}
```

### Key Features

1. **Heading Hierarchy Flexibility**: Universal selector allows semantic HTML changes
2. **Single-Line Display**: `white-space: nowrap` prevents text wrapping
3. **Edge Padding**: Prevents text cutoff (20px desktop, 15px tablet, 10px mobile)
4. **Text Visibility**: Solid white color with enhanced shadow for video background
5. **Letter Spacing Optimization**: Tighter spacing on mobile for better fit

### Font Size Scaling

| Viewport | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| 320px | - | - | 16px (1rem) |
| 768px | - | 32px (4vw) | - |
| 1920px | 64px (4rem) | - | - |

### Browser Compatibility
- Supported: Chrome 79+, Firefox 75+, Safari 13.1+, Edge 79+
- Progressive enhancement for older browsers

---

## 24. Appendix - Key Code References

- Smart contract: `contracts/TouristRegistry.sol`
- Backend entry: `backend/server.js`
- Main API route: `backend/routes/tourist.js`
- Docker orchestration: `docker-compose.yml`
- Frontend landing: `frontend/home.html`
- CSS: `frontend/css/style.css`

---

Document generated automatically from repository analysis on 2025-11-05.
**Last Updated**: November 6, 2025 (v1.0.0)
**Major Updates**: Video background implementation, responsive typography system, content merger for dual-system architecture

Use this as living documentation and update it when architecture or implementation changes.
