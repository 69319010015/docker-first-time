# 1. ใช้ Base Image ของ Node.js (แนะนำ version 18 บน alpine เพื่อความเบา)
FROM node:18-alpine

# 2. กำหนดโฟลเดอร์ทำงานภายใน Container
WORKDIR /app

# 3. ก๊อปปี้ไฟล์ package.json เพื่อติดตั้ง Library ก่อน (ช่วยเรื่อง Layer Cache)
COPY src/package*.json ./

# 4. สั่งติดตั้ง Dependencies
RUN npm install

# 5. ก๊อปปี้โค้ดทั้งหมดในโฟลเดอร์ src เข้า Container
COPY src/ .

# 6. แจ้ง Port ที่แอปพลิเคชันเปิดใช้งาน
EXPOSE 5000

# 7. คำสั่งสำหรับรันแอปพลิเคชัน
CMD ["npm", "start"]
