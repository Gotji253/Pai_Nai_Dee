# Pai Nai Dee

Pai Nai Dee เป็นโปรเจกต์แอปพลิเคชันสำหรับค้นหาและแนะนำสถานที่ท่องเที่ยว ประกอบด้วย Backend ที่พัฒนาด้วย Python และ Frontend ที่พัฒนาด้วย React (TypeScript)

## โครงสร้างโปรเจกต์

โปรเจกต์นี้แบ่งออกเป็นสองส่วนหลัก:

1.  **`wanderlust_guide/`**: Backend ของระบบ สร้างด้วย Python
2.  **`tourist-app/`**: Frontend ของระบบ สร้างด้วย React และ TypeScript

นอกจากนี้ยังมีโค้ดส่วน Frontend ที่เก่ากว่าอยู่ใน `src/` ของ root directory ซึ่งอาจเป็นเวอร์ชันที่ไม่สมบูรณ์หรือกำลังพัฒนาแยกต่างหาก สำหรับการพัฒนาปัจจุบัน โปรดเน้นไปที่ `tourist-app/`

## Backend (`wanderlust_guide/`)

ส่วน Backend พัฒนาด้วย Python โดยไม่มีการใช้เฟรมเวิร์คเฉพาะทาง

### ภาษาและเทคโนโลยี

*   Python 3

### ฟีเจอร์หลัก (จำลองการทำงาน)

*   ค้นหาสถานที่ด้วยเสียง
*   ค้นหาสถานที่ด้วยข้อความ
*   กรองสถานที่ตามคุณสมบัติต่างๆ (เช่น เหมาะสำหรับเด็ก, มีที่จอดรถ, นำสัตว์เลี้ยงเข้าได้)
*   ค้นหากิจกรรมภายในสถานที่
*   ฟังก์ชันเกี่ยวกับแผนที่:
    *   ค้นหาสถานที่ในบริเวณแผนที่ที่กำหนด
    *   จัดกลุ่มสถานที่ (Clustering) ตามระดับการซูม
    *   ดึงพิกัดของสถานที่

### ฐานข้อมูล

*   ปัจจุบัน Backend **ไม่ได้เชื่อมต่อกับฐานข้อมูลจริง** แต่ใช้ข้อมูลจำลอง (mock data) ที่เป็น Python list of dictionaries ซึ่งอยู่ในไฟล์ `wanderlust_guide/app/main.py` (ตัวแปร `sample_places`)

### สคริปต์ Seed หรือ Migration

*   ไม่มี เนื่องจากยังไม่ได้ใช้ฐานข้อมูลจริง

### การติดตั้งและรัน Backend

1.  เข้าไปยังไดเรกทอรี `wanderlust_guide`:
    ```bash
    cd wanderlust_guide
    ```
2.  รันแอปพลิเคชัน (โปรแกรมจะจำลองการทำงานต่างๆ และแสดงผลทาง console):
    ```bash
    python -m app.main
    ```

### การรันเทส Backend

1.  เข้าไปยังไดเรกทอรี `wanderlust_guide`:
    ```bash
    cd wanderlust_guide
    ```
2.  รันชุดทดสอบ:
    ```bash
    python -m unittest discover tests
    ```

## Frontend (`tourist-app/`)

ส่วน Frontend พัฒนาด้วย React และ TypeScript โดยใช้ Create React App เป็นพื้นฐาน

### ภาษาและเทคโนโลยี

*   React (TypeScript/JavaScript)
*   Material-UI (MUI)
*   Axios (สำหรับ HTTP requests)
*   React Router (สำหรับ Navigation)

### ฟีเจอร์หลัก (อนุมานจากโครงสร้างโค้d)

*   การแสดงผลหน้าต่างๆ: Home, Search, Favorites, Place Details, Profile
*   ระบบ Authentication (Login, Register, Protected Routes)
*   การจัดการข้อมูลสถานที่ (Places Context)
*   การวางแผนการเดินทาง (Trip Planner)
*   การจัดการรายการโปรด (Favorites Manager)
*   การเชื่อมต่อกับ API (ผ่าน `src/api.ts`)

### ฐานข้อมูล

*   Frontend ไม่มีฐานข้อมูลโดยตรง แต่จะทำการเรียก API ไปยัง Backend เพื่อรับส่งข้อมูล
*   ตรวจสอบไฟล์ `.env.example` หรือ `.env` (ถ้ามี) ในไดเรกทอรี `tourist-app/` สำหรับการตั้งค่า API endpoint และ environment variables อื่นๆ ที่จำเป็น

### สคริปต์ Seed หรือ Migration

*   ไม่มี

### การติดตั้งและรัน Frontend

1.  เข้าไปยังไดเรกทอรี `tourist-app`:
    ```bash
    cd tourist-app
    ```
2.  ติดตั้ง Dependencies:
    ```bash
    npm install
    ```
3.  เริ่ม Development Server:
    ```bash
    npm start
    ```
    แอปพลิเคชันจะเปิดในเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### Mock Data / External API

*   **Backend:** ใช้ mock data ชื่อ `sample_places` ใน `wanderlust_guide/app/main.py`
*   **Frontend:**
    *   มีไฟล์ `tourist-app/src/api.ts` สำหรับการเรียก External API (จำเป็นต้องตรวจสอบและกำหนดค่า API endpoint จริง)
    *   โค้ดส่วน Frontend เก่าใน `src/data/` (เช่น `mockplaces.js`, `categories.js`) มีข้อมูล mock ซึ่งอาจนำมาปรับใช้หรืออ้างอิงได้

### การรันเทส Frontend

1.  เข้าไปยังไดเรกทอรี `tourist-app`:
    ```bash
    cd tourist-app
    ```
2.  รันชุดทดสอบ:
    ```bash
    npm test
    ```

## โค้ดส่วน Frontend เก่า (ใน `src/` ของ Root Directory)

ใน root directory ของโปรเจกต์ มีโฟลเดอร์ `src/` ที่มีโครงสร้างของแอปพลิเคชัน React อีกชุดหนึ่ง (เช่น `src/app.js`, `src/components/`, `src/pages/`) ส่วนนี้อาจเป็นเวอร์ชันเก่า หรือส่วนที่กำลังพัฒนาแยกต่างหาก และอาจมีข้อมูลที่เป็นประโยชน์ เช่น mock data ใน `src/data/`

*   **การรันเทส (ถ้ามี):** โปรเจกต์ root มี `package.json` ที่ตั้งค่า Jest และไฟล์ `run_tests.py` ซึ่งอาจใช้สำหรับรันเทสของส่วนนี้
    ```bash
    npm test # (ใน root directory, หากมีการตั้งค่า test script)
    # หรือ
    # python run_tests.py
    ```

## License

โปรเจกต์นี้ยังไม่มี License กำหนดไว้ หากต้องการใช้งานหรือเผยแพร่ กรุณาพิจารณาเพิ่มไฟล์ `LICENSE` (เช่น MIT License, Apache License 2.0)

## Contributing

หากคุณสนใจที่จะช่วยพัฒนาโปรเจกต์ Pai Nai Dee:

1.  Fork โปรเจกต์นี้
2.  สร้าง Branch ใหม่สำหรับฟีเจอร์หรือการแก้ไขของคุณ (`git checkout -b feature/your-feature-name`)
3.  ทำการเปลี่ยนแปลงและ Commit (`git commit -m 'Add some feature'`)
4.  Push ไปยัง Branch ของคุณ (`git push origin feature/your-feature-name`)
5.  เปิด Pull Request

## Contact

หากมีข้อสงสัยหรือต้องการติดต่อผู้พัฒนา สามารถติดต่อได้ที่:

*   [ชื่อผู้พัฒนา/องค์กร]
*   [อีเมล หรือ ช่องทางติดต่ออื่นๆ]

---

*เอกสารนี้สร้างขึ้นโดย AI เพื่อสรุปโครงสร้างโปรเจกต์และวิธีการใช้งานเบื้องต้น*
