/**
 * ===================================================================
 * NAITIK WAITLIST — GOOGLE APPS SCRIPT BACKEND
 * ===================================================================
 * 
 * HOW TO SET THIS UP:
 * 
 * 1. Go to Google Sheets → Create a new blank spreadsheet
 * 2. Name it "Naitik Waitlist" (or anything you like)
 * 3. In Row 1, add these headers:
 *    A1: Timestamp | B1: Name | C1: Email | D1: Order
 * 
 * 4. Go to Extensions → Apps Script
 * 5. Delete any existing code, paste this ENTIRE file
 * 6. Click "Deploy" → "New deployment"
 * 7. Choose Type: "Web app"
 * 8. Set "Execute as": Me
 * 9. Set "Who has access": Anyone
 * 10. Click "Deploy" → Authorize when prompted
 * 11. Copy the Web App URL (looks like: https://script.google.com/macros/s/AKfyc.../exec)
 * 12. Paste that URL into your script.js file where it says GOOGLE_SCRIPT_URL
 * 
 * That's it! Every waitlist signup now goes straight to your Google Sheet.
 * ===================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var name = (data.name || '').trim();
    var email = (data.email || '').trim().toLowerCase();

    // Validate
    if (!name || !email) {
      return jsonResponse({ success: false, error: 'Name and email are required.' });
    }

    // Check for duplicate email
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var emails = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (emails[i][0].toString().toLowerCase() === email) {
          return jsonResponse({ success: false, error: 'duplicate' });
        }
      }
    }

    // Add new entry
    var orderNumber = lastRow; // Row 1 is header, so lastRow = order number
    sheet.appendRow([
      new Date().toISOString(),
      name,
      email,
      orderNumber
    ]);

    return jsonResponse({
      success: true,
      orderNumber: orderNumber,
      message: 'Added to waitlist!'
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();

    if (lastRow <= 1) {
      return jsonResponse({ success: true, count: 0, subscribers: [] });
    }

    var data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    var subscribers = [];

    for (var i = 0; i < data.length; i++) {
      subscribers.push({
        timestamp: data[i][0],
        name: data[i][1],
        email: data[i][2],
        orderNumber: data[i][3]
      });
    }

    return jsonResponse({
      success: true,
      count: subscribers.length,
      subscribers: subscribers
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
