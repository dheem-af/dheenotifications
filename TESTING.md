# 🧪 Testing Guide

This guide provides comprehensive testing instructions for the DheeNotifications platform.

## 🎯 Testing Overview

The application includes several key features that should be tested:
- User authentication and registration
- Single notification sending (Email/SMS)
- Bulk notification upload via CSV
- Real-time analytics dashboard
- Notification logs and filtering

## 📋 Test Preparation

### Test Accounts and Data

**Primary Test User:**
- Email: `dheemanthmadaiah@gmail.com`
- Phone: `+919686490654`
- Password: Use a secure password during registration

**Additional Test Recipients:**
- `test@example.com`
- `user@demo.com`
- `demo@test.com`

### Test CSV Files

Create these CSV files for bulk testing:

**Email Test CSV (`test_emails.csv`):**
```csv
email
dheemanthmadaiah@gmail.com
test@example.com
user@demo.com
```

**Phone Test CSV (`test_phones.csv`):**
```csv
phone
+919686490654
+1234567890
+9876543210
```

**Mixed Test CSV (`test_mixed.csv`):**
```csv
recipient
dheemanthmadaiah@gmail.com
+919686490654
test@example.com
```

## 🔐 Authentication Testing

### Test Case 1: User Registration

1. **Navigate to Signup**
   - Go to `/signup`
   - Verify form loads correctly

2. **Test Registration**
   - Enter valid details:
     - Name: "Test User"
     - Email: "your-test-email@gmail.com"
     - Password: "SecurePassword123!"
   - Click "Sign Up"
   - Verify success message
   - Verify redirect to dashboard

3. **Test Validation**
   - Try invalid email format
   - Try weak password
   - Try existing email
   - Verify error messages

### Test Case 2: User Login

1. **Navigate to Login**
   - Go to `/login`
   - Verify form loads correctly

2. **Test Login**
   - Enter registered credentials
   - Click "Sign In"
   - Verify redirect to dashboard
   - Verify user name in navigation

3. **Test Invalid Login**
   - Try wrong password
   - Try non-existent email
   - Verify error messages

### Test Case 3: Authentication Flow

1. **Test Protected Routes**
   - Try accessing `/dashboard` without login
   - Verify redirect to login page

2. **Test Logout**
   - Click user menu in navigation
   - Click logout
   - Verify redirect to login page

## 📧 Single Notification Testing

### Test Case 4: Email Notification

1. **Navigate to Send Notification**
   - Go to `/notify`
   - Verify form loads correctly

2. **Send Email Test**
   - Select "Email" channel
   - Enter recipient: `dheemanthmadaiah@gmail.com`
   - Enter message: "Test email from DheeNotifications"
   - Click "Send Notification"
   - Verify success message

3. **Check Delivery**
   - Go to `/logs`
   - Verify notification appears with "success" status
   - Check email inbox for delivery

### Test Case 5: SMS Notification

1. **Send SMS Test**
   - Select "SMS" channel
   - Enter recipient: `+919686490654`
   - Enter message: "Test SMS from DheeNotifications"
   - Click "Send Notification"
   - Verify success message

2. **Check Delivery**
   - Go to `/logs`
   - Verify SMS appears with status
   - Check phone for SMS delivery

### Test Case 6: Scheduled Notification

1. **Schedule Future Notification**
   - Select channel and recipient
   - Set "Send At" to future time (5 minutes ahead)
   - Enter message
   - Click "Send Notification"
   - Verify scheduling confirmation

2. **Verify Scheduling**
   - Check logs for "scheduled" status
   - Wait for scheduled time
   - Verify delivery occurs

## 📁 Bulk Upload Testing

### Test Case 7: CSV Upload - Email

1. **Navigate to Bulk Send**
   - Go to `/bulk-send`
   - Verify upload interface loads

2. **Upload Email CSV**
   - Select "Email" channel
   - Upload `test_emails.csv`
   - Enter message: "Bulk email test from DheeNotifications"
   - Click "Send Bulk Notifications"

3. **Verify Processing**
   - Check success message with count
   - Note bulk upload ID
   - Go to logs and verify all emails processed

### Test Case 8: CSV Upload - SMS

1. **Upload SMS CSV**
   - Select "SMS" channel
   - Upload `test_phones.csv`
   - Enter message: "Bulk SMS test"
   - Click "Send Bulk Notifications"

2. **Verify Processing**
   - Check success message
   - Verify SMS notifications in logs

### Test Case 9: CSV Validation

1. **Test Invalid Files**
   - Try uploading non-CSV file
   - Try uploading empty CSV
   - Try uploading oversized file (>5MB)
   - Verify error messages

2. **Test Invalid Data**
   - Upload CSV with invalid email formats
   - Upload CSV with invalid phone numbers
   - Verify validation errors

## 📊 Analytics Testing

### Test Case 10: Dashboard Analytics

1. **Navigate to Dashboard**
   - Go to `/dashboard`
   - Verify charts load correctly

2. **Verify Metrics**
   - Check "Total Sent" count
   - Check "Successful" count
   - Check "Failed" count
   - Check "Success Rate" percentage

3. **Test Chart Interactions**
   - Hover over chart elements
   - Verify tooltips display
   - Test time range selector

### Test Case 11: Real-time Updates

1. **Send Test Notification**
   - Send a single notification
   - Immediately check dashboard
   - Verify metrics update in real-time

2. **Test Multiple Channels**
   - Send both email and SMS
   - Verify channel usage chart updates
   - Check daily trends chart

## 🧾 Logs Testing

### Test Case 12: Logs Display

1. **Navigate to Logs**
   - Go to `/logs`
   - Verify logs table loads

2. **Verify Log Data**
   - Check all columns display correctly:
     - Recipient
     - Channel
     - Message
     - Status
     - Attempt
     - Created At

### Test Case 13: Filtering

1. **Test Status Filter**
   - Filter by "Success"
   - Filter by "Failed"
   - Filter by "Retrying"
   - Verify results update

2. **Test Channel Filter**
   - Filter by "Email"
   - Filter by "SMS"
   - Verify results update

3. **Test Clear Filters**
   - Apply filters
   - Click "Clear Filters"
   - Verify all logs display

### Test Case 14: Pagination

1. **Test Pagination**
   - Send enough notifications to trigger pagination
   - Navigate between pages
   - Verify page numbers work correctly

## 🔄 Error Handling Testing

### Test Case 15: Network Errors

1. **Test Offline Behavior**
   - Disconnect internet
   - Try sending notification
   - Verify error handling

2. **Test Server Errors**
   - Stop backend server
   - Try using application
   - Verify error messages

### Test Case 16: Validation Errors

1. **Test Form Validation**
   - Submit empty forms
   - Enter invalid data
   - Verify client-side validation

2. **Test Server Validation**
   - Send malformed requests
   - Verify server-side validation

## 📱 Responsive Testing

### Test Case 17: Mobile Compatibility

1. **Test Mobile Layout**
   - Open application on mobile device
   - Test all pages for responsiveness
   - Verify navigation works on mobile

2. **Test Tablet Layout**
   - Test on tablet-sized screens
   - Verify charts display correctly
   - Test touch interactions

## 🔒 Security Testing

### Test Case 18: Authentication Security

1. **Test JWT Expiration**
   - Wait for token to expire
   - Try accessing protected routes
   - Verify redirect to login

2. **Test CSRF Protection**
   - Try cross-origin requests
   - Verify CORS headers

### Test Case 19: Input Sanitization

1. **Test XSS Prevention**
   - Enter script tags in forms
   - Verify content is sanitized

2. **Test SQL Injection**
   - Enter SQL commands in forms
   - Verify database protection

## 📈 Performance Testing

### Test Case 20: Load Testing

1. **Test Bulk Operations**
   - Upload large CSV files (within limits)
   - Verify processing performance

2. **Test Concurrent Users**
   - Open multiple browser sessions
   - Test simultaneous operations

## ✅ Test Checklist

Use this checklist to ensure comprehensive testing:

### Authentication
- [ ] User registration works
- [ ] User login works
- [ ] Password validation works
- [ ] Protected routes redirect correctly
- [ ] Logout works properly

### Notifications
- [ ] Email notifications send successfully
- [ ] SMS notifications send successfully
- [ ] Scheduled notifications work
- [ ] Error handling for failed notifications

### Bulk Upload
- [ ] CSV upload works for emails
- [ ] CSV upload works for SMS
- [ ] File validation works
- [ ] Bulk processing completes successfully

### Analytics
- [ ] Dashboard loads correctly
- [ ] Charts display data accurately
- [ ] Real-time updates work
- [ ] Time range filtering works

### Logs
- [ ] Logs display correctly
- [ ] Filtering works
- [ ] Pagination works
- [ ] Status updates in real-time

### UI/UX
- [ ] Responsive design works
- [ ] Navigation is intuitive
- [ ] Error messages are clear
- [ ] Success feedback is provided

### Security
- [ ] Authentication is secure
- [ ] Input validation works
- [ ] CORS is properly configured
- [ ] Rate limiting works

## 🐛 Bug Reporting

When you find issues during testing:

1. **Document the Bug**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Browser/device information

2. **Check Logs**
   - Browser console errors
   - Network tab for API errors
   - Backend server logs

3. **Create Issue**
   - Use GitHub issues
   - Include screenshots if helpful
   - Tag with appropriate labels

## 🎯 Testing Best Practices

1. **Test Early and Often**
   - Test each feature as you develop
   - Run full test suite before deployment

2. **Use Real Data**
   - Test with actual email addresses
   - Use real phone numbers for SMS testing

3. **Test Edge Cases**
   - Empty inputs
   - Maximum length inputs
   - Special characters

4. **Cross-Browser Testing**
   - Test on Chrome, Firefox, Safari
   - Test on different operating systems

5. **Performance Monitoring**
   - Monitor response times
   - Check for memory leaks
   - Verify database performance

---

**Happy Testing! 🧪**