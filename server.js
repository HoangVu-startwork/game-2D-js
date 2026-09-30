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

// speed/
// └── gameSpeed.js
//     → quản lý tốc độ game

// player/
// └── player.js
//     → hình vuông
//     → đi theo vị trí chuột

// bullet/
// └── bullet.js
//     → tia hình chữ nhật
//     → tự động tìm mục tiêu
//     → tự động bắn

// enemy/
// └── enemy.js
//     → hình tròn
//     → tự động sinh ra
//     → di chuyển về phía hình vuông
//     → quản lý level / HP

// game.js
//     → file chính
//     → kết nối tất cả module lại