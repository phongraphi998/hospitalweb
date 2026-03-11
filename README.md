# HMS Hospital - Hospital Web Management System

HMS Hospital is a full-stack healthcare management system built with:

- **Frontend**: Angular 21 + Bootstrap 5
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 16 (via Docker Compose — ไม่ต้องติดตั้งบนเครื่อง)

## Project Structure

```
hospitalweb/                    ← root folder
├── API/                        ← Backend (Node.js + Express)
│   ├── config/db.js            ← PostgreSQL connection (reads from .env)
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── index.js                ← Entry point
│   ├── .env.example            ← Template สำหรับสร้าง .env
│   └── .env                   ← ต้องสร้างเอง (copy จาก .env.example)
│
├── hospitalweb/                ← Frontend (Angular)
│   └── src/app/
│
├── docker-compose.yml          ← PostgreSQL ผ่าน Docker
└── hospital_init.sql           ← SQL schema + seed data (auto-imported)
```

## Getting Started

### Prerequisites

| Tool           | Version |
| -------------- | ------- |
| Node.js        | v18+    |
| npm            | v9+     |
| Docker Desktop | latest  |

---

### Step 1 — Clone & Install Dependencies

```bash
git clone https://github.com/phongraphi998/hospitalweb.git
cd hospitalweb
```

```bash
# Backend
cd API
npm install
cd ..

# Frontend
cd hospitalweb
npm install
cd ..
```

---

### Step 2 — เริ่ม Database ด้วย Docker Compose

```bash
# รันจาก root folder (ที่มีไฟล์ docker-compose.yml)
docker compose up -d
```

> ✅ Docker จะดาวน์โหลด `postgres:16-alpine` และ import schema+data จาก `hospital_init.sql` อัตโนมัติ

```bash
# ตรวจสอบว่า DB พร้อมแล้ว
docker compose logs db
```

---

### Step 3 — รัน Backend + Frontend

**Terminal 1 — Backend:**

```bash
cd API
node index.js
```

✅ ควรเห็น: `Server running on http://localhost:3000`

**Terminal 2 — Frontend:**

```bash
cd hospitalweb
npm start
```

✅ เปิด http://localhost:4200

---

## 🗄️ Docker Commands

| คำสั่ง                      | ความหมาย                              |
| --------------------------- | ------------------------------------- |
| `docker compose up -d`      | เริ่ม DB container ใน background      |
| `docker compose down`       | หยุด DB container                     |
| `docker compose logs -f db` | ดู log แบบ real-time                  |
| `docker compose down -v`    | หยุดและลบ data ทิ้งทั้งหมด (reset DB) |

---

## 🔑 Test Accounts

| Email                 | Password    | Role   |
| --------------------- | ----------- | ------ |
| `admin@hospital.com`  | `admin123`  | ADMIN  |
| `doctor@hospital.com` | `doctor123` | DOCTOR |
| `nurse@hospital.com`  | `nurse123`  | NURSE  |

---

## ❓ ถ้าเจอปัญหา

| ปัญหา                  | วิธีแก้                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `CORS error`           | เช็ค `index.js` ว่า `origin: 'http://localhost:4200'` ถูกต้อง  |
| `DB connection failed` | เช็คว่า Docker Desktop รันอยู่ และ `docker compose up -d` แล้ว |
| `JWT invalid`          | เช็คว่า `JWT_SECRET` ใน `.env` ตรงกัน                          |
| `npm install error`    | ลอง `npm install --legacy-peer-deps`                           |
| Angular compile error  | รัน `npm install` ใหม่ใน folder `hospitalweb/`                 |

---

## Technologies Used

- **Angular**: v17.0.0
- **Bootstrap**: v5.3.3
- **TypeScript**: v5.2.2
- **RxJS**: v7.8.0
- **PostgreSQL**: v16 (Docker)
- **Node.js / Express**: Backend API

## Future Enhancements

- [ ] Patient portal with login
- [ ] Online prescription management
- [ ] Medical records access
- [ ] Video consultation integration
- [ ] Payment gateway integration
- [ ] SMS/Email notifications
- [ ] Multi-language support
- [ ] Admin dashboard

---

**Built with ❤️ by HMS Hospital Team**
