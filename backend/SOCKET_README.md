# 📡 Panduan Socket.IO - Real-Time Communication

## 🤔 Apa itu Socket.IO?

Socket.IO adalah library JavaScript yang memungkinkan **komunikasi real-time, dua arah (bidirectional)** antara server dan client.

### 🆚 Perbedaan HTTP vs Socket.IO

#### HTTP (Request-Response)
```
Client ────[Request]────> Server
Client <───[Response]──── Server
       (Koneksi Tertutup)

❌ Client harus selalu inisiasi request
❌ Server tidak bisa push data tanpa diminta
❌ Harus polling (request berulang) untuk update
```

#### Socket.IO (Persistent Connection)
```
Client ←────────────────→ Server
       (Koneksi Terus Terbuka)

✅ Server bisa push data kapan saja
✅ Client bisa send data kapan saja
✅ Real-time tanpa polling
✅ Lebih efisien untuk data yang sering berubah
```

---

## 🏗️ Arsitektur Socket.IO di Project Ini

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
├─────────────────────────────────────────────────────────┤
│  1. User A buka Poll Detail (ID: 123)                   │
│     socket.emit('join_poll', '123')                     │
│                                                          │
│  2. User B buka Poll Detail (ID: 123)                   │
│     socket.emit('join_poll', '123')                     │
│                                                          │
│  3. User A vote Option 0                                │
│     POST /api/poll/123/vote { optionIndex: 0 }          │
│                                                          │
│  4. User A & B listen event 'vote_update'               │
│     socket.on('vote_update', (data) => { ... })         │
└─────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                    │
├─────────────────────────────────────────────────────────┤
│  Socket.IO Server                                        │
│  ├─ Room: "123" (Poll ID)                               │
│  │   ├─ User A (socket.id: abc)                         │
│  │   └─ User B (socket.id: xyz)                         │
│  │                                                       │
│  ├─ Room: "456" (Poll ID lain)                          │
│  │   └─ User C (socket.id: def)                         │
│                                                          │
│  Vote Controller:                                        │
│  1. Update database                                      │
│  2. io.to('123').emit('vote_update', data)              │
│     → Broadcast ke User A & B saja                      │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Konsep Penting

### 1️⃣ **Event-Driven Programming**

Socket.IO bekerja dengan sistem **event** (kejadian):

```javascript
// EMIT = Mengirim event
socket.emit('nama_event', data);

// ON = Mendengarkan event
socket.on('nama_event', (data) => {
  // Lakukan sesuatu dengan data
});
```

**Analogi:**
- `emit` = Teriak memanggil seseorang
- `on` = Pasang telinga untuk mendengarkan panggilan

### 2️⃣ **Room (Ruangan)**

Room adalah cara mengelompokkan socket connections:

```javascript
// User join room
socket.join('poll-123');

// Broadcast ke semua di room itu
io.to('poll-123').emit('update', data);
```

**Analogi:**
- Room = Ruang kelas
- `join` = Masuk ke ruang kelas
- `io.to(room)` = Guru bicara, semua murid di kelas itu dengar
- User di kelas lain tidak dengar

### 3️⃣ **Broadcast vs Emit**

```javascript
// 1. socket.emit() - Kirim ke 1 socket tertentu
socket.emit('message', 'Halo kamu');

// 2. io.emit() - Kirim ke SEMUA client
io.emit('announcement', 'Server maintenance!');

// 3. io.to(room).emit() - Kirim ke semua di room tertentu
io.to('poll-123').emit('vote_update', data);

// 4. socket.broadcast.emit() - Kirim ke semua KECUALI pengirim
socket.broadcast.emit('user_joined', user);
```

---

## 🔍 Code Walkthrough - Backend

### File: `backend/index.js`

```javascript
// 1. Import Socket.IO
const { Server } = require("socket.io");

// 2. Buat HTTP Server (penting!)
const httpServer = createServer(app);

// 3. Attach Socket.IO ke HTTP Server
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// 4. Event: Saat ada client connect
io.on("connection", (socket) => {
  console.log("User connected:", socket.id); // socket.id = ID unik per koneksi
  
  // 5. Event: Client join room poll tertentu
  socket.on("join_poll", (pollId) => {
    socket.join(pollId); // Masuk ke room dengan ID poll
    console.log(`User ${socket.id} joined poll: ${pollId}`);
  });
  
  // 6. Event: Saat client disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 7. PENTING! Share 'io' ke controller
app.set("socketio", io);

// 8. PENTING! Listen dengan httpServer, bukan app
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

**Penjelasan Step by Step:**

1. **`io.on("connection")`** - Triggered setiap kali ada client baru connect
2. **`socket.id`** - ID unik untuk setiap koneksi (seperti nomor antrian)
3. **`socket.join(pollId)`** - User masuk ke "ruangan" poll tertentu
4. **`app.set("socketio", io)`** - Simpan instance io agar bisa dipakai di controller

### File: `backend/controllers/pollController.js`

```javascript
const votePoll = async (req, res) => {
  const { id } = req.params; // Poll ID
  const { optionIndex } = req.body; // Index option yang dipilih

  // 1. Update database
  const updatedPoll = await Poll.findByIdAndUpdate(
    id,
    { $inc: { [`options.${optionIndex}.votes`]: 1 } },
    { new: true }
  );

  // 2. Ambil instance Socket.IO
  const io = req.app.get("socketio");

  // 3. BROADCAST ke semua user di room ini
  io.to(id).emit("vote_update", {
    pollId: id,
    options: updatedPoll.options,
    totalVotes: updatedPoll.totalVotes,
  });

  // 4. Return response HTTP
  return res.status(200).json(updatedPoll);
};
```

**Yang Terjadi:**
```
User A vote → Controller update DB → io.to(pollId).emit()
                                            │
                ┌───────────────────────────┴───────────────────────┐
                ↓                                                   ↓
          User A (di room)                                    User B (di room)
          Terima event                                        Terima event
          'vote_update'                                       'vote_update'
          Update UI                                           Update UI
```

---

## 🔍 Code Walkthrough - Frontend

### File: `frontend/src/config/socket.js`

```javascript
import { io } from 'socket.io-client';

// 1. Buat koneksi ke server
export const socket = io('http://localhost:3000', {
  autoConnect: false, // Jangan auto-connect, kita control manual
  withCredentials: true,
});

// 2. Helper function untuk connect
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// 3. Helper function untuk disconnect
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
```

### File: `frontend/src/pages/user/PollDetailPage.jsx`

```javascript
import { socket, connectSocket, disconnectSocket } from '../../config/socket';

const PollDetailPage = () => {
  const { id } = useParams(); // Poll ID dari URL
  const [poll, setPoll] = useState(null);

  // 1. Setup: Connect & Join Room
  useEffect(() => {
    // Fetch poll data
    fetchPoll();
    
    // Connect ke Socket.IO server
    connectSocket();
    
    // JOIN ROOM poll ini
    socket.emit('join_poll', id);
    console.log(`Joined room: ${id}`);
    
    // Cleanup saat component unmount (user leave page)
    return () => {
      socket.off('vote_update'); // Remove listener
      disconnectSocket();
    };
  }, [id]);

  // 2. Listen Event 'vote_update'
  useEffect(() => {
    const handleVoteUpdate = (data) => {
      console.log('Real-time update received:', data);
      
      // Update state dengan data baru
      setPoll(prevPoll => ({
        ...prevPoll,
        options: data.options,
        totalVotes: data.totalVotes,
      }));
    };

    // REGISTER LISTENER
    socket.on('vote_update', handleVoteUpdate);

    // Cleanup listener
    return () => {
      socket.off('vote_update', handleVoteUpdate);
    };
  }, []);

  // 3. Handle Vote (via HTTP POST)
  const handleVote = async (optionIndex) => {
    try {
      // Kirim vote via HTTP
      const updatedPoll = await pollService.votePoll(id, optionIndex);
      
      // Update local state
      setPoll(updatedPoll);
      
      // Socket.IO akan broadcast ke user lain otomatis
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div>
      {poll?.options.map((option, index) => (
        <button key={index} onClick={() => handleVote(index)}>
          {option.optionText} - {option.votes} votes
        </button>
      ))}
    </div>
  );
};
```

---

## 🎬 Alur Lengkap - Step by Step

### Skenario: User A dan User B melihat poll yang sama

```
STEP 1: Persiapan
─────────────────────────────────────────────────────────
User A buka Poll ID 123:
  → Frontend connect Socket.IO
  → socket.emit('join_poll', '123')
  → Backend: socket.join('123')
  
User B buka Poll ID 123:
  → Frontend connect Socket.IO
  → socket.emit('join_poll', '123')
  → Backend: socket.join('123')

Sekarang User A & B ada di ROOM yang sama: "123"


STEP 2: User A Vote Option 0
─────────────────────────────────────────────────────────
User A klik vote Option 0:
  
  [1] Frontend A:
      POST /api/poll/123/vote
      Body: { optionIndex: 0 }
  
  [2] Backend Controller:
      ├─ Update database (votes + 1)
      ├─ Get updated data
      └─ io.to('123').emit('vote_update', {
          options: [...],
          totalVotes: 42
        })
  
  [3] Frontend A:
      ├─ Terima HTTP response
      └─ Update state dengan data baru
  
  [4] Frontend B (REAL-TIME!):
      ├─ Socket listener terima event 'vote_update'
      ├─ handleVoteUpdate() dipanggil
      ├─ setPoll() update state
      └─ UI re-render dengan data baru
      
User B LANGSUNG lihat vote bertambah tanpa refresh! ✨


STEP 3: User C di Poll lain (ID 456)
─────────────────────────────────────────────────────────
User C buka Poll ID 456:
  → socket.emit('join_poll', '456')
  → Masuk ke ROOM "456" (berbeda dari A & B)
  
Saat User A vote di Poll 123:
  → io.to('123').emit('vote_update', ...)
  → User C TIDAK terima update karena di room berbeda ✅
```

---

## 🧪 Testing & Debugging

### 1. **Cek Koneksi Socket.IO**

Di browser console (Frontend):
```javascript
// Cek status koneksi
socket.connected // true = connected, false = disconnected

// Cek socket ID
socket.id // "abc123xyz..."

// Manual emit event untuk testing
socket.emit('join_poll', '123');

// Manual listen event
socket.on('vote_update', (data) => console.log('Update:', data));
```

### 2. **Backend Logs**

Tambahkan log di backend untuk debugging:
```javascript
io.on("connection", (socket) => {
  console.log("✅ Connected:", socket.id);
  
  socket.on("join_poll", (pollId) => {
    console.log(`📍 ${socket.id} joined room: ${pollId}`);
    socket.join(pollId);
  });
  
  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});
```

### 3. **Testing dengan 2 Browser**

1. Buka Chrome → Buka Poll Detail
2. Buka Chrome Incognito → Buka Poll Detail yang sama
3. Vote di salah satu browser
4. Cek apakah browser lain update real-time

---

## 🚨 Common Issues & Solutions

### ❌ "Socket not connecting"
**Penyebab:** CORS issue
**Solusi:**
```javascript
// Backend
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"], // Harus sesuai frontend
    credentials: true,
  },
});

// Frontend
const socket = io('http://localhost:3000', {
  withCredentials: true,
});
```

### ❌ "Vote tidak update real-time"
**Penyebab:** Lupa join room atau salah room ID
**Solusi:** Pastikan:
```javascript
// Frontend emit join_poll dengan ID yang benar
socket.emit('join_poll', pollId);

// Backend broadcast ke room yang sama
io.to(pollId).emit('vote_update', data);
```

### ❌ "Socket.io not working, tapi HTTP works"
**Penyebab:** Menggunakan `app.listen()` bukan `httpServer.listen()`
**Solusi:**
```javascript
// ❌ SALAH
app.listen(3000);

// ✅ BENAR
const httpServer = createServer(app);
const io = new Server(httpServer);
httpServer.listen(3000);
```

### ❌ "Memory leak / multiple listeners"
**Penyebab:** Tidak cleanup listener di useEffect
**Solusi:**
```javascript
useEffect(() => {
  socket.on('vote_update', handleUpdate);
  
  // PENTING! Cleanup
  return () => {
    socket.off('vote_update', handleUpdate);
  };
}, []);
```

---

## 📚 Konsep Lanjutan

### 1. **Namespaces** (Optional)
Pisahkan logic Socket.IO berdasarkan fitur:
```javascript
const pollNamespace = io.of('/polls');
const chatNamespace = io.of('/chat');

pollNamespace.on('connection', (socket) => {
  // Logic khusus polling
});

chatNamespace.on('connection', (socket) => {
  // Logic khusus chat
});
```

### 2. **Middleware** (Optional)
Authentikasi sebelum connect:
```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (isValidToken(token)) {
    next();
  } else {
    next(new Error('Authentication error'));
  }
});
```

### 3. **Acknowledgments** (Optional)
Konfirmasi bahwa event diterima:
```javascript
// Server
socket.on('vote', (data, callback) => {
  // Process vote
  callback({ success: true });
});

// Client
socket.emit('vote', data, (response) => {
  console.log('Server response:', response);
});
```

---

## 🎯 Kesimpulan

**Socket.IO = WhatsApp untuk aplikasi web**
- HTTP = Kirim surat (request-response)
- Socket.IO = Video call (persistent connection)

**Kunci Sukses:**
1. ✅ Gunakan `httpServer.listen()`, bukan `app.listen()`
2. ✅ Client harus `join_poll` sebelum terima update
3. ✅ Backend `io.to(room).emit()` untuk broadcast
4. ✅ Frontend `socket.on()` untuk listen event
5. ✅ Cleanup listener di useEffect return

**Use Cases Lain:**
- 💬 Chat real-time
- 🎮 Multiplayer games
- 📊 Live dashboard
- 🔔 Notifications
- 📍 Live tracking (Grab, Gojek)

---

## 🔗 Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [Socket.IO Server API](https://socket.io/docs/v4/server-api/)

---

**Happy Coding! 🚀**
