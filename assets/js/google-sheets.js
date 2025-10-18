/*
 * GOOGLE SHEETS INTEGRATION
 * Handles form submissions to Google Sheets
 */

// Google Apps Script Web App URLs
const GOOGLE_SHEETS_CONFIG = {
    // Replace this URL with your Google Apps Script Web App URL
    // After deploying the Google Apps Script, paste the URL here
    WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbyYuClM9ty5Z-uT2MtHSrqq0aAD85wDbcj25i5xpJgiwxDyfq0Ky_gWGLD3eszbrAxG_w/exec',
    
    // Sheet configuration - Now using single combined sheet
    SHEET_NAMES: {
        MAIN: 'Wedding Data', // Single sheet for both wishes and RSVP
        WISHES: 'Wedding Data', // Legacy compatibility
        RSVP: 'Wedding Data'   // Legacy compatibility
    }
};

/**
 * Submit wish/greeting to Google Sheets
 * @param {Object} data - Wish data
 */
async function submitWishToGoogleSheets(data) {
    try {
        const payload = {
            action: 'addWish',
            sheet: GOOGLE_SHEETS_CONFIG.SHEET_NAMES.MAIN,
            data: {
                timestamp: new Date().toISOString(),
                name: data.name,
                phone: data.phone || '',
                wish: data.wish,
                // For wishes: người gửi lời chúc = không đi (để trống)
                attending: '', // Để trống vì chỉ gửi lời chúc
                companions: '' // Để trống vì không đi
            }
        };

        console.log('Submitting wish to Google Sheets:', payload);

        // Use no-cors mode to avoid CORS issues with Google Apps Script
        const response = await fetch(GOOGLE_SHEETS_CONFIG.WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('Wish submission response:', response);
        
        // With no-cors mode, we can't read the response content, but if no error is thrown,
        // the request was likely successful
        if (response.type === 'opaque') {
            console.log('Request sent successfully (no-cors mode)');
            return { success: true, message: 'Wish submitted successfully' };
        }

        // Fallback for non-opaque responses
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Wish submission result:', result);
        
        return result;
    } catch (error) {
        console.error('Error submitting wish:', error);
        
        // If it's a CORS error, the request might still have succeeded
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
            console.log('CORS error - wish request may have succeeded');
            return { success: true, message: 'Wish submitted (CORS limitation)' };
        }
        
        throw error;
    }
}

/**
 * Submit RSVP to Google Sheets
 * @param {Object} data - RSVP data
 */
async function submitRSVPToGoogleSheets(data) {
    try {
        const payload = {
            action: 'addRSVP',
            sheet: GOOGLE_SHEETS_CONFIG.SHEET_NAMES.MAIN,
            data: {
                timestamp: new Date().toISOString(),
                name: data.name,
                phone: data.phone,
                // For RSVP: người xác nhận tham gia = có đi 
                attending: 'yes',
                attendanceType: data.attendanceType || '',
                guestCount: data.guestCount || 0,
                companions: data.companions || '',
                notes: data.notes || 'Xác nhận tham gia'
            }
        };

        console.log('Submitting RSVP to Google Sheets:', payload);

        // Use no-cors mode to avoid CORS issues with Google Apps Script
        const response = await fetch(GOOGLE_SHEETS_CONFIG.WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('RSVP submission response:', response);
        
        // With no-cors mode, we can't read the response content, but if no error is thrown,
        // the request was likely successful
        if (response.type === 'opaque') {
            console.log('RSVP request sent successfully (no-cors mode)');
            return { success: true, message: 'RSVP submitted successfully' };
        }
        
        // Fallback for non-opaque responses
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('RSVP submission result:', result);
        
        return result;
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        
        // If it's a CORS error, the request might still have succeeded
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
            console.log('CORS error - RSVP request may have succeeded');
            return { success: true, message: 'RSVP submitted (CORS limitation)' };
        }
        
        throw error;
    }
}/**
 * Show loading state
 */
function showLoadingState(buttonElement, originalText = 'Gửi') {
    if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 8px;">
                <div style="width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                Đang gửi...
            </span>
        `;
    }
}

/**
 * Hide loading state
 */
function hideLoadingState(buttonElement, originalText = 'Gửi') {
    if (buttonElement) {
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalText;
    }
}

/**
 * Show success message
 */
function showSuccessMessage(message, type = 'wish') {
    // Create a styled success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4ade80, #22c55e);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
        z-index: 10000;
        font-weight: 500;
        max-width: 400px;
        text-align: center;
        font-size: 14px;
        line-height: 1.4;
        animation: slideDown 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            <span>${message}</span>
        </div>
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-in reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    }, 5000);
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    // Create a styled error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        z-index: 10000;
        font-weight: 500;
        max-width: 400px;
        text-align: center;
        font-size: 14px;
        line-height: 1.4;
        animation: slideDown 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-in reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Export functions for global use
window.GoogleSheetsAPI = {
    submitWish: submitWishToGoogleSheets,
    submitRSVP: submitRSVPToGoogleSheets,
    showLoading: showLoadingState,
    hideLoading: hideLoadingState,
    showSuccess: showSuccessMessage,
    showError: showErrorMessage
};

// Also make functions available globally for direct calling
window.submitWishToGoogleSheets = submitWishToGoogleSheets;
window.submitRSVPToGoogleSheets = submitRSVPToGoogleSheets;