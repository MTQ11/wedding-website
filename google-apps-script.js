/**
 * Google Apps Script Web App Code - IMPROVED VERSION
 * Deploy this as a Web App in Google Apps Script
 * 
 * Instructions:
 * 1. Create a new Google Apps Script project
 * 2. Replace the default code with this code
 * 3. Deploy as Web App with execute permissions for "Anyone"
 * 4. Copy the Web App URL and update WEBHOOK_URL in google-sheets.js
 */

function doPost(e) {
  try {
    // Add CORS headers for all responses
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    // Log the raw request for debugging
    console.log('=== NEW REQUEST ===');
    console.log('Raw request:', e);
    console.log('Post data:', e.postData);
    console.log('Post data contents:', e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', JSON.stringify(data, null, 2));
    
    let result;
    if (data.action === 'addWish') {
      result = handleWishSubmission(data);
    } else if (data.action === 'addRSVP') {
      result = handleRSVPSubmission(data);
    } else {
      throw new Error('Invalid action: ' + data.action);
    }
    
    return result.setHeaders(headers);
    
  } catch (error) {
    console.error('=== ERROR IN DOPOST ===');
    console.error('Error details:', error.toString());
    console.error('Stack trace:', error.stack);
    
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

function handleWishSubmission(data) {
  try {
    console.log('=== PROCESSING WISH SUBMISSION ===');
    console.log('Data received:', JSON.stringify(data, null, 2));
    
    // Get or create the spreadsheet
    const spreadsheet = getOrCreateSpreadsheet();
    console.log('Got spreadsheet:', spreadsheet.getName(), 'ID:', spreadsheet.getId());
    
    // Get or create the main sheet (combined wishes and RSVP)
    let sheet = spreadsheet.getSheetByName('Wedding Data');
    if (!sheet) {
      console.log('Creating new Wedding Data sheet');
      sheet = spreadsheet.insertSheet('Wedding Data');
      // Add headers for combined data
      sheet.getRange(1, 1, 1, 7).setValues([[
        'Thời gian', 'Tên', 'Số điện thoại', 'Có đi không', 'Lời chúc', 'Đi cùng ai', 'Số người'
      ]]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      console.log('Headers added to Wedding Data sheet');
    } else {
      console.log('Using existing Wedding Data sheet');
    }
    
    // Add the wish data (người gửi lời chúc = không đi)
    const rowData = [
      data.data.timestamp || new Date().toISOString(),
      data.data.name || 'Unknown',
      data.data.phone || '',
      '', // Cột "có đi không" để trống vì chỉ gửi lời chúc
      data.data.wish || '',
      '', // Đi cùng ai để trống vì không đi
      '' // Số người để trống vì không đi
    ];
    
    console.log('Adding wish row data:', rowData);
    sheet.appendRow(rowData);
    console.log('Wish row added successfully to row:', sheet.getLastRow());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Lời chúc đã được gửi thành công!',
        timestamp: new Date().toISOString(),
        spreadsheetUrl: spreadsheet.getUrl(),
        rowAdded: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('=== ERROR IN WISH SUBMISSION ===');
    console.error('Error:', error.toString());
    console.error('Stack:', error.stack);
    throw error;
  }
}

function handleRSVPSubmission(data) {
  try {
    console.log('=== PROCESSING RSVP SUBMISSION ===');
    console.log('Data received:', JSON.stringify(data, null, 2));
    
    // Get or create the spreadsheet
    const spreadsheet = getOrCreateSpreadsheet();
    console.log('Got spreadsheet for RSVP:', spreadsheet.getName());
    
    // Get or create the main sheet (same sheet as wishes)
    let sheet = spreadsheet.getSheetByName('Wedding Data');
    if (!sheet) {
      console.log('Creating new Wedding Data sheet');
      sheet = spreadsheet.insertSheet('Wedding Data');
      // Add headers for combined data
      sheet.getRange(1, 1, 1, 7).setValues([[
        'Thời gian', 'Tên', 'Số điện thoại', 'Có đi không', 'Lời chúc', 'Đi cùng ai', 'Số người'
      ]]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      console.log('Headers added to Wedding Data sheet');
    } else {
      console.log('Using existing Wedding Data sheet');
    }
    
    // Calculate số người based on companions info
    let soNguoi = 1; // Bản thân + số người đi cùng
    if (data.data.guestCount && data.data.guestCount > 0) {
      soNguoi += parseInt(data.data.guestCount);
    }
    
    // Add the RSVP data (người xác nhận tham gia = có đi)
    const rowData = [
      data.data.timestamp || new Date().toISOString(),
      data.data.name || 'Unknown',
      data.data.phone || '',
      'Có', // Cột "có đi không" ghi "Có" vì xác nhận tham gia
      data.data.notes || 'Xác nhận tham gia', // Lời chúc/ghi chú
      data.data.companions || '',
      soNguoi // Tổng số người (bao gồm cả bản thân)
    ];
    
    console.log('Adding RSVP row data:', rowData);
    sheet.appendRow(rowData);
    console.log('RSVP row added successfully to row:', sheet.getLastRow());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Xác nhận tham dự đã được gửi thành công!',
        timestamp: new Date().toISOString(),
        spreadsheetUrl: spreadsheet.getUrl(),
        rowAdded: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('=== ERROR IN RSVP SUBMISSION ===');
    console.error('Error:', error.toString());
    console.error('Stack:', error.stack);
    throw error;
  }
}

function getOrCreateSpreadsheet() {
  const fileName = 'Wedding Guest Data'; // Đổi tên để phù hợp với nghiệp vụ mới
  
  try {
    console.log('=== SPREADSHEET ACCESS ===');
    console.log('Looking for spreadsheet:', fileName);
    
    // Try to get existing spreadsheet by name
    const files = DriveApp.getFilesByName(fileName);
    
    if (files.hasNext()) {
      const file = files.next();
      console.log('Found existing spreadsheet:', file.getId());
      console.log('Spreadsheet URL:', file.getUrl());
      return SpreadsheetApp.openById(file.getId());
    } else {
      // Create new spreadsheet
      console.log('Creating new spreadsheet:', fileName);
      const spreadsheet = SpreadsheetApp.create(fileName);
      console.log('Created new spreadsheet:', spreadsheet.getId());
      console.log('New spreadsheet URL:', spreadsheet.getUrl());
      
      // Optionally rename the default sheet
      const sheets = spreadsheet.getSheets();
      if (sheets.length > 0 && sheets[0].getName() === 'Sheet1') {
        try {
          sheets[0].setName('Wedding Data');
          console.log('Renamed default sheet to Wedding Data');
        } catch (e) {
          console.log('Could not rename default sheet:', e.toString());
        }
      }
      
      return spreadsheet;
    }
  } catch (error) {
    console.error('=== SPREADSHEET ERROR ===');
    console.error('Error accessing spreadsheet:', error.toString());
    console.error('Stack:', error.stack);
    throw new Error('Failed to access spreadsheet: ' + error.toString());
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Wedding RSVP API is running! Time: ' + new Date().toISOString())
    .setMimeType(ContentService.MimeType.TEXT);
}

// Test function for manual execution
function testFunction() {
  console.log('=== MANUAL TEST FUNCTION ===');
  
  const testData = {
    action: 'addWish',
    data: {
      name: 'Manual Test User',
      phone: '0123456789',
      wish: 'This is a manual test wish',
      attending: 'unknown',
      companions: ''
    }
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  try {
    const result = doPost(mockEvent);
    console.log('Test result:', result.getContent());
    return 'Test completed successfully - check logs and spreadsheet';
  } catch (error) {
    console.error('Test failed:', error);
    return 'Test failed: ' + error.toString();
  }
}