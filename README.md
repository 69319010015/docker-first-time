# simple-backend — แบบฝึกหัดเขียน Dockerfile

โปรเจกต์ตัวอย่าง Backend API (Node.js + Express) ที่เชื่อมต่อ PostgreSQL
สำหรับให้นักเรียนฝึกเขียน `Dockerfile` ด้วยตนเอง

## โครงสร้างโปรเจกต์

```
simple-backend/
├── src/
│   ├── package.json      # Dependencies
│   └── app.js            # โค้ด Backend Express API
├── Dockerfile            # เฉลย (เขียนเองในห้องเรียน)
├── docker-compose.yml    # รันคู่กับ PostgreSQL
├── render.yaml           # ตั้งค่า Deploy บน Render
├── .dockerignore
├── .gitignore
└── README.md
```

## แบบที่ A: บิลด์และรันเฉพาะ Backend (Local Test)

```bash
# 1. Build Docker Image
docker build -t my-backend .

# 2. Run Container (เปิด Port 5000)
docker run -d -p 5000:5000 --name backend-test my-backend

# 3. เช็กสถานะ Container
docker ps

# 4. ทดสอบเข้าดูผ่าน Browser หรือ Curl
curl http://localhost:5000/api/students
```

> หมายเหตุ: `/api/students` ทำงานได้โดยไม่ต้องมี Database
> แต่ `/api/health` จะตอบ `error` ถ้ายังไม่ได้เชื่อมต่อ PostgreSQL

## แบบที่ B: รันคู่กับ PostgreSQL (Docker Compose)

```bash
docker compose up -d --build
```

ทดสอบ Health Check: เปิดเบราว์เซอร์ไปที่ <http://localhost:5000/api/health>
หากตอบกลับ `{"status":"ok","db_connection":"success"}` แสดงว่าผ่าน 100%

ปิดและลบทุก Container:

```bash
docker compose down
```

## Deploy ขึ้น Render (Backend + PostgreSQL)

โปรเจกต์นี้พร้อม deploy เป็น Render **Docker Web Service**
(Render จะ build จาก `Dockerfile` ให้อัตโนมัติ — ไม่ต้องติดตั้ง Docker ในเครื่อง)

### 1. สร้าง Git repo และ push ขึ้น GitHub

```bash
git init
git add -A
git commit -m "Initial commit: simple-backend Dockerfile lesson"

# เครื่องนี้ล็อกอิน GitHub ผ่าน SSH แล้ว
git remote add origin git@github.com:69319010015/docker-first-time.git
git branch -M main
git push -u origin main
```

### 2. Deploy บน Render

1. เข้า <https://render.com> แล้ว Login ด้วย GitHub
2. กด **New → Blueprint**
3. เลือก repo `docker-first-time` → Render อ่าน `render.yaml` แล้วสร้าง Service + Database (PostgreSQL) ให้อัตโนมัติ
4. รอ build เสร็จ แล้วเปิด URL ที่ Render ให้มา

> ⚠️ ถ้าเคย deploy Blueprint นี้ไปก่อนหน้าแล้ว: เข้าหน้า Blueprint → กด **Apply** (หรือ Sync) เพื่อให้ Render สร้าง Database ใหม่ตาม `render.yaml`

> ทางเลือก (ไม่ใช้ Blueprint): **New → Web Service → Docker** → เลือก repo → ตั้ง Health Check Path เป็น `/api/students`

### 3. ทดสอบ

```bash
curl https://<ชื่อ-app>.onrender.com/api/students
```

> หมายเหตุ: Free tier จะ sleep เมื่อไม่มีคนใช้งาน ~15 นาที และปลุกใช้เวลา ~30–60 วินาทีใน request แรก
> ตอนนี้มี Database (PostgreSQL) แล้ว — `/api/health` จะตอบ `{"status":"ok","db_connection":"success"}`
> Free PostgreSQL ของ Render จะหมดอายุภายใน ~30 วัน (พอเพียงสำหรับการเรียน/เดโม)

## Endpoints

| Method | Path           | คำอธิบาย                                 |
| ------ | -------------- | ---------------------------------------- |
| GET    | `/`            | หน้าแรก แสดงข้อความต้อนรับ + รายการ API |
| GET    | `/api/health`   | เช็กการเชื่อมต่อ Database                |
| GET    | `/api/students` | คืนค่าข้อมูลตัวอย่างเป็น JSON            |

## Environment Variables

| ตัวแปร         | ค่าเริ่มต้น (ในเครื่อง)              |
| -------------- | ------------------------------------ |
| `DATABASE_URL` | (ไม่ตั้ง = ใช้ค่า default ของ pg)   |
| `DB_SSL`       | `false` (บน Render ตั้งเป็น `true`)  |
| `PORT`         | `5000`                               |

> บน Render: `DATABASE_URL` และ `DB_SSL=true` ถูกตั้งให้อัตโนมัติจาก `render.yaml` (ส่วน `databases`) — ไม่ต้องกรอกเอง
