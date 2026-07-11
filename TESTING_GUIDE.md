# 🧪 Supabase Integration - Testing Guide

## ✅ Integration Complete!

Your website now uses **Supabase** instead of localStorage for production-grade security and data management.

---

## 🎯 What Changed?

### Before (localStorage):
- ❌ Password visible in code
- ❌ 5-10MB storage limit
- ❌ Single device only
- ❌ Easy to hack
- ❌ No backups

### After (Supabase):
- ✅ Real user authentication
- ✅ 500MB cloud database
- ✅ Works on all devices
- ✅ Row-level security
- ✅ Automatic backups

---

## 🧪 Testing Instructions

### Step 1: Test Locally First

1. **Open your website locally** (open `index.html` in browser)
2. **Check browser console** (F12) - You should see:
   ```
   ✅ Supabase initialized
   ```
3. If you see errors, check that Supabase scripts loaded correctly

### Step 2: Test Authentication

1. Scroll to **"Admin Login"** section
2. Enter credentials:
   - **Email:** globalmissionfci@gmail.com
   - **Password:** [the password you created in Supabase]
3. Click **"Login"**
4. You should see the **CMS Admin** section appear
5. Check that **"QR Generator"** link appears in navigation

### Step 3: Test Event Display

1. **Before logging in**, scroll to **"Events"** section
2. You should see your events (if you added any to database)
3. Events should load from Supabase database

### Step 4: Test Event Management (Admin Only)

After logging in:

1. **Create New Event:**
   - Click "+ Add New Event"
   - Fill in all fields
   - Upload an image (max 2MB)
   - Click "Save Event"
   - ✅ Should appear in database immediately

2. **Edit Event:**
   - Click ✏️ edit icon on any event
   - Modify some fields
   - Click "Save Event"
   - ✅ Changes should save to database

3. **Delete Event:**
   - Click 🗑️ delete icon
   - Confirm deletion
   - ✅ Should remove from database

4. **Reorder Events:**
   - Drag and drop events in CMS
   - ✅ Order should save automatically

5. **Export Data:**
   - Click "📤 Export Data"
   - ✅ Should download JSON file with all events

6. **Import Data:**
   - Click "📥 Import Data"
   - Select a valid JSON file
   - ✅ Should import events to database

### Step 5: Test Logout

1. Click **"Logout"** button
2. ✅ Should return to login screen
3. ✅ CMS should disappear
4. ✅ Admin links should disappear from navigation

### Step 6: Test on Mobile

1. Open website on your phone
2. Test login
3. Test viewing events
4. ✅ Should work perfectly

---

## 🔍 Troubleshooting

### Problem: "Supabase library not loaded"

**Solution:**
1. Check internet connection
2. Make sure you deployed the latest code
3. Clear browser cache (Ctrl+Shift+Del)

### Problem: "Invalid API key"

**Solution:**
1. Check `supabase-config.js`
2. Verify URL and anon key are correct
3. No extra spaces or quotes
4. Regenerate keys in Supabase if needed

### Problem: Can't login

**Solution:**
1. Check email and password are correct
2. Verify user exists in Supabase → Authentication → Users
3. Make sure "Auto Confirm User" was checked
4. Check browser console for errors

### Problem: Events not loading

**Solution:**
1. Check Supabase → Table Editor → events table
2. Verify Row Level Security policies are enabled
3. Check browser console for errors
4. Try refreshing the page

### Problem: Can't save events

**Solution:**
1. Make sure you're logged in
2. Check authentication token is valid
3. Verify user has permissions (should be automatic)
4. Check browser console for error messages

---

## 📊 Verify Everything Works

### Checklist:

- [ ] Website loads without errors
- [ ] Supabase initializes (check console)
- [ ] Events display on homepage
- [ ] Can login with email + password
- [ ] CMS admin section appears after login
- [ ] Can create new events
- [ ] Can edit existing events
- [ ] Can delete events
- [ ] Can reorder events (drag & drop)
- [ ] Can export data
- [ ] Can import data
- [ ] Can logout successfully
- [ ] QR Generator link appears for admin
- [ ] Works on mobile devices

---

## 🚀 Deploy to GitHub Pages

Once everything works locally:

1. Code is already pushed to GitHub ✅
2. GitHub Pages will auto-deploy (wait 2-3 minutes)
3. Visit your live site: https://globalmission-events.github.io/EVENTS-UPDATES/
4. Test everything again on live site

---

## 🎓 How to Use

### For Public Visitors:
- Can view all events
- Can scan QR codes
- No login required

### For Admin (You):
1. Login with your Supabase credentials
2. Manage events in CMS
3. Generate QR codes
4. Export/import data
5. Logout when done

---

## 💾 Your Login Credentials

**Email:** globalmissionfci@gmail.com  
**Password:** [The password you created in Supabase]

⚠️ **Keep these secure!** This is your only admin account.

---

## 🆘 Need Help?

If something doesn't work:

1. **Check browser console** (F12) for errors
2. **Check Supabase dashboard** for issues
3. **Verify your Supabase project** is active
4. **Clear browser cache** and try again

---

## 🎉 Success Criteria

You'll know everything works when:

✅ You can login with email/password  
✅ Events load from database  
✅ You can create/edit/delete events  
✅ Changes persist across devices  
✅ Everything works on live GitHub Pages site  

---

**Ready to test?** Follow the steps above and let me know if you encounter any issues!

---

**Last Updated:** 2026-02-07  
**Version:** 3.0 (Supabase Integration)
