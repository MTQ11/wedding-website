# Wedding Website - Mai Thế Quyền & Vũ Thị Ngọc Hà

## 🎉 Wedding RSVP & Guest Management System

A beautiful wedding website with integrated Google Sheets backend for guest management, wishes collection, and RSVP tracking.

### ✨ Features

- **💌 Guest Wishes**: Collect wedding wishes and greetings
- **📝 RSVP Management**: Track guest attendance and companion details  
- **📊 Google Sheets Integration**: Automatic data collection and management
- **🎨 Responsive Design**: Beautiful wedding-themed UI
- **❄️ Interactive Elements**: Snowfall animations and smooth transitions
- **📱 Mobile Friendly**: Optimized for all devices

### 🏗️ Business Logic

- **Send Wishes**: Guests send congratulations (marked as "not attending")
- **RSVP Confirmation**: Guests confirm attendance with companion details
- **Unified Data**: Single Google Sheet with combined guest information

### 📋 Data Structure

| Thời gian | Tên | SĐT | Có đi không | Lời chúc | Đi cùng ai | Số người |
|-----------|-----|-----|-------------|----------|------------|----------|
| Timestamp | Name | Phone | Attendance | Message | Companions | Count |

### 🚀 Setup Instructions

1. **Google Apps Script Setup**:
   - Copy code from `google-apps-script.js`
   - Deploy as Web App with "Anyone" access
   - Update webhook URL in `assets/js/google-sheets.js`

2. **Testing**:
   - Use `debug-tool.html` for comprehensive testing
   - Follow `SETUP_GUIDE.md` for detailed instructions

3. **Deploy**:
   - Host files on web server
   - Configure Google Apps Script permissions
   - Test end-to-end functionality
Wedding/
├── index.html                 # File HTML chính
├── assets/
│   ├── css/                  # Tất cả file CSS
│   │   ├── bootstrap.min.css
│   │   ├── style.css
│   │   ├── main.css
│   │   └── ...
│   ├── js/                   # Tất cả file JavaScript
│   │   ├── jquery.min.js
│   │   ├── frontend.js
│   │   ├── scripts.js
│   │   └── ...
│   ├── images/              # Tất cả hình ảnh
│   │   ├── Fc4sNr0V1a.webp
│   │   ├── logo.webp
│   │   └── ...
│   └── fonts/               # Font files
│       ├── css2
│       └── ...
└── README.md               # File tài liệu này
```

## Những thay đổi đã thực hiện

1. **Tổ chức lại cấu trúc file:**
   - Gom nhóm tất cả CSS vào `assets/css/`
   - Gom nhóm tất cả JavaScript vào `assets/js/`
   - Gom nhóm tất cả hình ảnh vào `assets/images/`
   - Gom nhóm font files vào `assets/fonts/`

2. **Loại bỏ dependencies external:**
   - Xóa Google Analytics tracking
   - Xóa Cloudflare tracking
   - Xóa các tham chiếu đến thiepcuoionline.huythanhjewelry.vn
   - Thay thế tất cả đường dẫn external bằng local files

3. **Cập nhật đường dẫn:**
   - Tất cả đường dẫn CSS/JS/images đã được cập nhật để trỏ đến cấu trúc mới
   - Đổi tên các file .download thành .js

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt web
2. Website sẽ hoạt động hoàn toàn offline, không cần internet

## Chỉnh sửa

- **Thay đổi nội dung:** Chỉnh sửa trực tiếp trong `index.html`
- **Thay đổi styles:** Chỉnh sửa trong các file CSS trong `assets/css/`
- **Thay đổi hành vi:** Chỉnh sửa trong các file JS trong `assets/js/`
- **Thay đổi hình ảnh:** Thay thế file trong `assets/images/` và cập nhật đường dẫn trong HTML

## Lưu ý

- Tất cả file đã được gói gọn trong dự án, không còn phụ thuộc external
- Website đã được tối ưu hóa để chạy offline
- Có thể host trên bất kỳ web server nào hoặc mở trực tiếp từ file system