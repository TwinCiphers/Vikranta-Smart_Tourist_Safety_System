# PVC Card Implementation Guide

## 📋 Overview
The VIKRANTA system uses a **professional PDF-based PVC card generator** located in the backend. This generates credit-card-sized (CR80) PDF documents with security features.

---

## 🎯 Implementation Locations

### 1. **Backend Generator** (Main Implementation)
**File:** `backend/utils/pvcCardGenerator.js`
- **Format:** PDF document (243x153mm - CR80 standard)
- **Technology:** PDFKit library
- **Features:**
  - Government-style design with navy blue gradient
  - Gold security accents and borders
  - Embedded QR code with blockchain verification
  - Professional typography (Helvetica fonts)
  - Security features: hologram effects, microprint, checksums
  - Complete tourist information with dates
  - Scannable QR code with verification URL

**QR Code Data Structure:**
```json
{
  "version": "1.0",
  "standard": "BLOCKCHAIN-TOURIST-ID",
  "touristId": "unique-id",
  "qrCodeHash": "hash",
  "fullName": "Name",
  "nationality": "Country",
  "issueDate": "ISO-8601",
  "expirationDate": "ISO-8601",
  "issuingAuthority": "VIKRANTA Tourism Department",
  "countryCode": "IND",
  "verificationUrl": "http://localhost:3000/api/verify/hash",
  "generatedAt": "ISO-8601",
  "checksum": "16-char-hash"
}
```

---

### 2. **Backend API Endpoints**

#### For Tourists:
```
GET /api/tourist/pvc-card/:uniqueId
```
- **Purpose:** Download PVC card for verified tourists
- **Authentication:** None (public endpoint)
- **Returns:** PDF file (`application/pdf`)
- **Filename:** `tourist-card-{uniqueId}.pdf`
- **Requirement:** Tourist must be verified

**Implementation:** `backend/routes/tourist.js` (line 261-313)

#### For Authorities:
```
POST /api/authority/generate-pvc-card
```
- **Purpose:** Generate PVC card for tourists by authority
- **Authentication:** JWT token + Authority role required
- **Body:** `{ "uniqueId": "tourist-id" }`
- **Returns:** PDF file (`application/pdf`)
- **Filename:** `tourist-card-{uniqueId}.pdf`

**Implementation:** `backend/routes/authority.js` (line 404-442)

---

### 3. **Frontend Implementation**

#### Tourist Dashboard
**File:** `frontend/dashboard.html`

**Visual Display:**
- Shows PVC card preview in browser with:
  - Navy blue gradient background
  - Tourist information (Name, Nationality, ID, Status)
  - QR code embedded in card design
  - Gold accents matching government theme

**Download Function:**
```javascript
async function downloadPVCCard() {
    // Calls backend API
    const response = await fetch(`${API_URL}/api/tourist/pvc-card/${uniqueId}`);
    const blob = await response.blob();
    // Downloads as PDF
    link.download = `VIKRANTA-PVC-${uniqueId}.pdf`;
}
```

**Button:**
```html
<button class="btn btn-primary" onclick="downloadPVCCard()">
    💳 Download PVC Card
</button>
```

#### Authority Panel
**File:** `frontend/authority-panel.html`

**Button:**
```html
<button id="downloadPvcBtn" class="btn btn-primary">
    📄 Download PVC Card
</button>
```

**Implementation:** `frontend/js/authority.js` (line 358-418)
```javascript
async function downloadPVCCard() {
    // Uses JWT authentication
    const response = await fetch('/api/authority/generate-pvc-card', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uniqueId: currentTouristId })
    });
    // Downloads PDF
}
```

---

## 🔐 Security Features

### PDF Document Security:
1. **Blockchain Verification:** Every card links to blockchain data
2. **QR Checksum:** SHA256 hash of tourist data
3. **Hologram Indicators:** Visual security markers
4. **Microprint:** "VIKRANTA" text as security feature
5. **Gold Borders:** Tamper-evident design elements
6. **Issue/Expiry Dates:** Time-bound verification
7. **Verification URL:** Direct link to blockchain verification

### API Security:
- Tourist endpoint: Public but checks verification status
- Authority endpoint: JWT + Role-based access control
- Session management: 2-hour token expiration

---

## 🎨 Design Specifications

### Card Dimensions:
- **Size:** CR80 (243mm × 153mm) - Standard credit card size
- **Format:** PDF (vector-based, scalable)

### Color Scheme:
- **Background:** `#0a1628` (Dark Navy)
- **Gradient:** `#1e3a8a` (Official Blue)
- **Accent:** `#fbbf24` (Government Gold)
- **Text:** `#ffffff` (White), `#e5e7eb` (Light Gray)

### Typography:
- **Headers:** Helvetica-Bold (11pt, 7pt, 6pt)
- **Body:** Helvetica (8pt, 7pt, 6pt)
- **ID Number:** Courier (6pt monospace)

### Layout:
```
+----------------------------------------+
| [Logo] VIKRANTA              TOURIST ID|
|        Tourism of India  BLOCKCHAIN    |
|        TOURISM DEPARTMENT   VERIFIED   |
+========================================+
| FULL NAME:                    +------+ |
| John Doe                      | QR   | |
|                               | CODE | |
| NATIONALITY:                  |      | |
| United States                 |      | |
|                               +------+ |
| UNIQUE ID:                             |
| fUQKkp6fZq...                         |
|                                        |
| ISSUED: 15 Jan 2025                   |
| VALID UNTIL: 15 Jan 2026              |
+========================================+
| BLOCKCHAIN SECURED        VIKRANTA  o |
+----------------------------------------+
```

---

## 📝 Usage Flow

### Tourist Journey:
1. **Register** → Upload documents
2. **Wait** → Authority reviews
3. **Verified** → Dashboard shows "Download PVC Card" button
4. **Click** → Backend generates professional PDF
5. **Download** → Save as `VIKRANTA-PVC-{uniqueId}.pdf`
6. **Print** → Use as official ID card

### Authority Journey:
1. **Login** → JWT authentication
2. **Review** → Check tourist documents
3. **Approve** → Select validity period
4. **Generate** → Click "Download PVC Card"
5. **Download** → PDF generated via backend
6. **Provide** → Share with tourist if needed

### Verification Journey:
1. **Scan QR** → Mobile app or scanner
2. **Parse JSON** → Extract verification data
3. **Check Dates** → Validate issue/expiry
4. **Verify URL** → Hit blockchain verification endpoint
5. **Confirm** → Display verification status

---

## 🔧 Technical Requirements

### Backend Dependencies:
```json
{
  "pdfkit": "^0.13.0",
  "qrcode": "^1.5.3"
}
```

### Frontend Dependencies:
```html
<!-- For QR display only -->
<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
```

### File System:
- Logo path: `frontend/logo.png` (optional, fallback to letter "V")
- Output: In-memory buffer (no file storage)

---

## ✅ Current Status

### Implemented & Working:
- ✅ Backend PDF generator with full security features
- ✅ Tourist download endpoint (GET)
- ✅ Authority download endpoint (POST with JWT)
- ✅ Frontend dashboard integration
- ✅ Frontend authority panel integration
- ✅ QR code with blockchain verification data
- ✅ Professional government-style design
- ✅ Expiration date tracking
- ✅ Error handling and loading states

### Features:
- ✅ Credit card size (CR80 standard)
- ✅ High-quality PDF output
- ✅ Embedded QR code with error correction
- ✅ Security elements (hologram, microprint)
- ✅ Government branding
- ✅ Date formatting
- ✅ Checksum validation
- ✅ Verification URL generation

---

## 🚀 Testing

### Test Tourist Download:
```bash
# Must be verified tourist
curl -O http://localhost:3000/api/tourist/pvc-card/fUQKkp6fZq
# Downloads: tourist-card-fUQKkp6fZq.pdf
```

### Test Authority Download:
```javascript
// In browser console (authority-panel.html)
downloadPVCCard(); // Triggers download for selected tourist
```

### Verify QR Code:
```bash
# Scan QR with mobile device
# Or extract from PDF and parse JSON
```

---

## 📚 Related Documentation

- **Main Features:** `docs/QR_AND_PVC_FEATURES.md`
- **API Endpoints:** `README.md` (API Reference section)
- **Security Audit:** `docs/SECURITY_AUDIT.md`
- **Connection Status:** `docs/CONNECTION_STATUS.md`

---

## 💡 Notes

1. **No Canvas Implementation:** All PVC generation is backend PDF-based
2. **No Image Downloads:** Dashboard preview is visual only; download uses backend
3. **Authority Access:** Both authorities and tourists can download PVC cards
4. **Verification Required:** Only verified tourists can generate PVC cards
5. **PDF Quality:** Vector-based for high-quality printing
6. **QR Resilience:** Error correction level H (30% damage recovery)

---

*Last Updated: November 3, 2025*
