# Database Seeders

Seeders untuk populate database dengan sample data untuk development dan testing.

## 📋 Available Seeders

### 1. User Seeder (`userSeeder.js`)

Mengambil users dari Firebase Authentication dan sync ke MongoDB.

**Features:**

- ✅ Fetch semua users dari Firebase
- ✅ Create user baru di MongoDB
- ✅ Update existing users
- ✅ Sync email, name, photoURL
- ✅ Set default role sebagai "user"

### 2. Poll Seeder (`pollSeeder.js`)

Membuat sample polls dengan berbagai kategori.

**Features:**

- ✅ 10 sample polls dengan kategori berbeda
- ✅ Realistic vote counts
- ✅ Random creators dari database
- ✅ Random creation dates (last 30 days)
- ✅ Mix of active dan time-limited polls

### 3. Master Seeder (`index.js`)

Menjalankan semua seeders dalam urutan yang benar.

---

## 🚀 Usage

### Run All Seeders

```bash
npm run seed:all
```

### Run Individual Seeders

**Seed Users Only:**

```bash
npm run seed:users
```

**Seed Polls Only:**

```bash
npm run seed:polls
```

**Clear & Seed Polls:**

```bash
npm run seed:clear
```

---

## 📊 Sample Data

### Poll Categories:

- 🖥️ Technology
- 🎬 Entertainment
- 🌟 Lifestyle
- 💼 Work
- 📚 Education
- ⚽ Sports
- 🍕 Food & Drink

### Sample Polls Include:

1. "What's your favorite programming language?" (Technology)
2. "Best time for team meetings?" (Work)
3. "Favorite streaming platform?" (Entertainment)
4. "Remote work vs Office?" (Work)
5. "Best pizza topping?" (Food)
6. "Preferred learning method?" (Education)
7. "Morning person or night owl?" (Lifestyle)
8. "Favorite sport to watch?" (Sports)
9. "Coffee or Tea?" (Food)
10. "AI will replace developers?" (Technology)

---

## ⚙️ Configuration

### Environment Variables Required:

```env
MONGO_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

---

## 🔄 Seeding Process

### 1. User Seeder Flow:

```
1. Connect to MongoDB
2. Fetch users from Firebase Auth
3. For each Firebase user:
   - Check if exists in MongoDB
   - If exists → Update data
   - If not exists → Create new user
4. Show statistics
5. Close connection
```

### 2. Poll Seeder Flow:

```
1. Connect to MongoDB
2. Get all users from database
3. For each sample poll:
   - Assign random creator
   - Generate unique room code
   - Set random creation date
   - Create poll in database
4. Show statistics
5. Close connection
```

---

## 📝 Output Example

```
🔄 Starting user seeder from Firebase...
✅ Connected to MongoDB
📊 Found 5 users in Firebase
✅ Created: user1@example.com
✏️  Updated: user2@example.com
✅ Created: user3@example.com

📊 Seeding Summary:
   ✅ Created: 3 users
   ✏️  Updated: 2 users
   ❌ Skipped: 0 users
   📊 Total: 5 users processed

✅ User seeding completed!
```

---

## ⚠️ Important Notes

1. **Run User Seeder First**

   - Poll seeder requires users in database
   - Users are assigned as poll creators

2. **Firebase Connection Required**

   - User seeder needs Firebase Admin SDK
   - Ensure Firebase credentials are configured

3. **Database Connection**

   - Seeders will connect and disconnect automatically
   - No need to have server running

4. **Idempotent**

   - User seeder can be run multiple times
   - Existing users will be updated, not duplicated

5. **Clear Option**
   - `--clear` flag will delete all existing polls
   - Use with caution in production!

---

## 🛠️ Development Tips

### Add More Sample Polls:

Edit `pollSeeder.js` and add to `samplePolls` array:

```javascript
{
  title: "Your poll title",
  description: "Your poll description",
  category: "technology", // or other category
  isPublic: true,
  hasTimeLimit: false,
  options: [
    { optionText: "Option 1", votes: 10 },
    { optionText: "Option 2", votes: 20 },
  ],
}
```

### Modify Vote Counts:

Adjust `votes` values in sample polls for different scenarios.

### Change Time Limits:

Modify `endTime` calculation for different expiry dates.

---

## 🐛 Troubleshooting

**Error: "No users found in database"**

- Run user seeder first: `npm run seed:users`

**Error: "Firebase connection failed"**

- Check Firebase credentials in `.env`
- Verify Firebase Admin SDK setup

**Error: "MongoDB connection failed"**

- Check `MONGO_URI` in `.env`
- Ensure MongoDB is running

---

## 📚 Related Files

- `backend/models/User.js` - User schema
- `backend/models/Poll.js` - Poll schema
- `backend/config/firebase.js` - Firebase configuration

---

Happy Seeding! 🌱
