# Hướng dẫn thiết lập Google Sheets cho Website Cưới

## Bước 1: Tạo Google Apps Script

1. Truy cập https://script.google.com/
2. Đăng nhập bằng tài khoản Google
3. Nhấn "Dự án mới" (New Project)
4. Xóa code mặc định và copy toàn bộ nội dung từ file `google-apps-script.js`
5. Dán vào Google Apps Script Editor
6. Lưu dự án (Ctrl+S) và đặt tên (ví dụ: "Wedding Website Form Handler")

## Bước 2: Deploy Web App

1. Trong Google Apps Script Editor, nhấn "Deploy" → "New Deployment"
2. Chọn type: "Web app"
3. Cấu hình:
   - Execute as: "Me (your email)"
   - Who has access: "Anyone"
4. Nhấn "Deploy"
5. **Copy URL được tạo** (dạng: https://script.google.com/macros/s/SCRIPT_ID/exec)

## Bước 3: Cập nhật Website

1. Mở file `assets/js/google-sheets.js`
2. Tìm dòng:
   ```javascript
   WEBHOOK_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec',
   ```
3. Thay thế `YOUR_SCRIPT_ID_HERE` bằng URL từ bước 2

## Bước 4: Test chức năng

1. Mở website
2. Thử gửi lời chúc từ form "Sổ Lưu Bút"
3. Thử xác nhận tham dự từ RSVP
4. Kiểm tra Google Sheets tự động được tạo trong Google Drive

## Cấu trúc dữ liệu

### Sheet "Wishes" (Lời chúc):
- Timestamp: Thời gian gửi
- Tên: Tên người gửi
- Số điện thoại: SĐT (tùy chọn)
- Lời chúc: Nội dung lời chúc
- Có tham gia: Trạng thái tham dự
- Đi cùng ai: Thông tin người đi cùng

### Sheet "RSVP" (Xác nhận tham dự):
- Timestamp: Thời gian xác nhận
- Tên: Họ tên đầy đủ
- Số điện thoại: SĐT liên hệ
- Có tham gia: "yes"
- Đi cùng ai: Chi tiết người đi cùng
- Số người: Tổng số người tham dự

## Lưu ý

- Google Sheets sẽ tự động được tạo tên "Wedding Website Data"
- Nếu sheet đã tồn tại, dữ liệu sẽ được thêm vào
- Mỗi submission sẽ có timestamp để theo dõi
- Website hoạt động offline, form chỉ hoạt động khi có internet

## Bảo mật

- Google Apps Script chạy với quyền của tài khoản tạo
- Chỉ có thể submit data, không đọc được dữ liệu từ client
- URL deploy có thể được chia sẻ công khai an toàn

## Troubleshooting

Nếu gặp lỗi:
1. Kiểm tra URL Google Apps Script đã đúng chưa
2. Xem Console (F12) để kiểm tra lỗi JavaScript
3. Kiểm tra quyền truy cập Google Apps Script
4. Thử deploy lại nếu cần

## Liên hệ hỗ trợ

Nếu cần hỗ trợ thêm, vui lòng liên hệ người phát triển website.