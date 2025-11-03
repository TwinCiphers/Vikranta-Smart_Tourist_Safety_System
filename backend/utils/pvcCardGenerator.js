const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

async function generatePVCCard(touristData) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: [243, 153], // CR80 card size (credit card size)
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                autoFirstPage: true,
                bufferPages: false
            });
            
            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            
            // ============ BACKGROUND & BASE DESIGN ============
            // Main background - Dark professional blue
            doc.rect(0, 0, 243, 153)
               .fill('#0a1628');
            
            // Futuristic gradient overlay (lighter blue gradient effect)
            doc.rect(0, 0, 243, 40)
               .fillOpacity(0.8)
               .fill('#1e3a8a');
            
            // Diagonal accent stripe (top right - futuristic element)
            doc.polygon([243, 0], [243, 40], [180, 40])
               .fillOpacity(0.3)
               .fill('#3b82f6');
            
            // Bottom gradient bar
            doc.rect(0, 140, 243, 13)
               .fillOpacity(0.9)
               .fill('#1e3a8a');
            
            // Gold accent lines (government style)
            doc.rect(0, 39, 243, 1).fillOpacity(1).fill('#fbbf24');
            doc.rect(0, 140, 243, 1).fillOpacity(1).fill('#fbbf24');
            
            // ============ LOGO ============
            // Try to add logo if it exists
            const logoPath = path.join(__dirname, '../../frontend/logo.png');
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 8, 6, { width: 28, height: 28 });
            } else {
                // Fallback: Circular badge with letter
                doc.circle(22, 20, 14)
                   .fillOpacity(1)
                   .fill('#fbbf24');
                doc.fillColor('#0a1628')
                   .fontSize(16)
                   .font('Helvetica-Bold')
                   .text('V', 17, 12);
            }
            
            // ============ HEADER SECTION ============
            doc.fillOpacity(1);
            doc.fillColor('#ffffff')
               .fontSize(11)
               .font('Helvetica-Bold')
               .text('VIKRANTA', 42, 8, { lineBreak: false });
            
            doc.fontSize(7)
               .font('Helvetica')
               .fillColor('#e5e7eb')
               .text('TOURISM OF INDIA', 42, 20, { lineBreak: false });
            
            doc.fontSize(6)
               .fillColor('#fbbf24')
               .text('TOURISM DEPARTMENT', 42, 29, { lineBreak: false });
            
            // Card type indicator (top right)
            doc.fontSize(6)
               .font('Helvetica-Bold')
               .fillColor('#fbbf24')
               .text('TOURIST ID', 185, 10, { lineBreak: false });
            
            doc.fontSize(5)
               .font('Helvetica')
               .fillColor('#e5e7eb')
               .text('BLOCKCHAIN VERIFIED', 180, 18, { lineBreak: false });
            
            // ============ MAIN CONTENT AREA ============
            // Content separator line
            doc.moveTo(10, 50)
               .lineTo(150, 50)
               .strokeOpacity(0.3)
               .strokeColor('#fbbf24')
               .lineWidth(0.5)
               .stroke();
            
            // Tourist Information - Left Side
            doc.strokeOpacity(1);
            
            // Full Name
            doc.fillColor('#fbbf24')
               .fontSize(6)
               .font('Helvetica-Bold')
               .text('FULL NAME', 10, 56, { lineBreak: false });
            
            doc.fillColor('#ffffff')
               .fontSize(8)
               .font('Helvetica-Bold')
               .text(touristData.name.toUpperCase(), 10, 64, { width: 135, lineGap: 0, lineBreak: false });
            
            // Nationality
            doc.fillColor('#fbbf24')
               .fontSize(6)
               .font('Helvetica-Bold')
               .text('NATIONALITY', 10, 78, { lineBreak: false });
            
            doc.fillColor('#ffffff')
               .fontSize(8)
               .font('Helvetica')
               .text(touristData.nationality.toUpperCase(), 10, 86, { lineBreak: false });
            
            // ID Number
            doc.fillColor('#fbbf24')
               .fontSize(6)
               .font('Helvetica-Bold')
               .text('UNIQUE ID', 10, 98, { lineBreak: false });
            
            doc.fillColor('#e5e7eb')
               .fontSize(6)
               .font('Courier')
               .text(touristData.uniqueId.substring(0, 18), 10, 106, { lineBreak: false });
            
            doc.text(touristData.uniqueId.substring(18), 10, 113, { lineBreak: false });
            
            // ============ DATE INFORMATION ============
            const verifiedDate = touristData.verificationDate ? 
                new Date(touristData.verificationDate * 1000).toLocaleDateString('en-GB', { 
                    day: '2-digit',
                    month: 'short', 
                    year: 'numeric'
                }).toUpperCase() : 
                new Date().toLocaleDateString('en-GB', { 
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }).toUpperCase();
            
            const expiryDate = touristData.expirationDate ? 
                new Date(touristData.expirationDate * 1000).toLocaleDateString('en-GB', { 
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }).toUpperCase() : 
                'NOT SET';
            
            // Issue Date
            doc.fillOpacity(1);
            doc.fillColor('#fbbf24')
               .fontSize(6)
               .font('Helvetica-Bold')
               .text('ISSUED:', 10, 122, { lineBreak: false });
            
            doc.fillColor('#ffffff')
               .fontSize(7)
               .font('Helvetica')
               .text(verifiedDate, 40, 122, { lineBreak: false });
            
            // Expiry Date
            doc.fillColor('#fbbf24')
               .fontSize(6)
               .font('Helvetica-Bold')
               .text('VALID UNTIL:', 10, 131, { lineBreak: false });
            
            doc.fillColor('#ffffff')
               .fontSize(7)
               .font('Helvetica')
               .text(expiryDate, 52, 131, { lineBreak: false });
            
            // ============ QR CODE SECTION ============
            // White background for QR code (for better visibility)
            doc.rect(162, 53, 68, 68)
               .fillOpacity(1)
               .fill('#ffffff');
            
            // QR Border - Multi-layered for depth
            doc.rect(160, 51, 72, 72)
               .strokeOpacity(1)
               .lineWidth(2)
               .strokeColor('#fbbf24')
               .stroke();
            
            // Generate QR code with professional structure
            const qrData = {
                version: '1.0',
                standard: 'BLOCKCHAIN-TOURIST-ID',
                touristId: touristData.uniqueId,
                qrCodeHash: touristData.qrCodeHash,
                fullName: touristData.name,
                nationality: touristData.nationality,
                issueDate: touristData.verificationDate 
                    ? new Date(touristData.verificationDate * 1000).toISOString()
                    : new Date().toISOString(),
                expirationDate: touristData.expirationDate 
                    ? new Date(touristData.expirationDate * 1000).toISOString()
                    : null,
                issuingAuthority: 'VIKRANTA Tourism Department',
                countryCode: 'IND',
                verificationUrl: `${process.env.APP_URL || 'http://localhost:3000'}/api/verify/${touristData.qrCodeHash}`,
                generatedAt: new Date().toISOString(),
                checksum: null
            };
            
            // Generate checksum
            const checksumData = `${qrData.touristId}:${qrData.issueDate}:${qrData.expirationDate}`;
            qrData.checksum = crypto.createHash('sha256').update(checksumData).digest('hex').substring(0, 16);
            
            const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData), { 
                errorCorrectionLevel: 'H',  // High error correction (30% damage recovery)
                width: 300,                  // High resolution for better scanning
                margin: 2,                   // Proper quiet zone for scanner detection
                color: {
                    dark: '#000000',         // Pure black for maximum contrast
                    light: '#ffffff'         // Pure white for maximum contrast
                }
            });
            
            // Add QR code (scaled to fit card)
            doc.image(qrBuffer, 164, 55, { width: 64, height: 64 });
            
            // QR Label
            doc.fillColor('#fbbf24')
               .fontSize(5)
               .font('Helvetica-Bold')
               .text('SCAN TO VERIFY', 157, 126, { align: 'center', width: 78, lineBreak: false });
            
            // ============ BOTTOM SECURITY BAR ============
            // Security text
            doc.fillColor('#fbbf24')
               .fontSize(6)
               .font('Helvetica-Bold')
               .text('BLOCKCHAIN SECURED', 5, 146, { lineBreak: false });
            
            // Corner security markers (hologram effect)
            doc.circle(238, 149, 2).fillOpacity(1).fill('#fbbf24');
            
            // Microprint simulation (security feature)
            doc.fontSize(5)
               .fillColor('#ffffff')
               .text('VIKRANTA', 200, 145, { lineBreak: false });
            
            doc.end();
            
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { generatePVCCard };