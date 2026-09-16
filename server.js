const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3400;

app.listen(PORT, () => {
    console.log(`Game running at http://localhost:${PORT}`);
});

// Được. Mình sửa theo đúng ý bạn:
// ⬜ Hình vuông di chuyển theo vị trí chuột
// 🔴 Hình tròn tự động sinh ra ở các cạnh màn hình
// 🔴 Hình tròn từ từ tiến về hình vuông
// 🟨 Tia hình chữ nhật tự động bắn vào hình tròn gần nhất
// 🐢 Tốc độ chậm hơn nhiều để game dễ quan sát