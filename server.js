const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Sử dụng body-parser để xử lý dữ liệu form
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình để phục vụ các file HTML tĩnh từ thư mục gốc
app.use(express.static(__dirname));

// Hàm để đọc người dùng từ tệp JSON
const readUsersFromFile = () => {
  const data = fs.readFileSync('users.json');
  return JSON.parse(data);
};

// Hàm để ghi người dùng vào tệp JSON
const writeUsersToFile = (users) => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Đọc người dùng từ tệp khi khởi động
let users = readUsersFromFile();

// Xử lý yêu cầu đăng nhập
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);

  if (user && user.password === password) {
    res.redirect('/home.html');
  } else {
    res.redirect('/login.html?error=true');
  }
});

// Xử lý yêu cầu đăng ký
app.post('/register', (req, res) => {
  const { username, password, fullname } = req.body;

  const existingUser = users.find(user => user.username === username);
  
  if (existingUser) {
    return res.redirect('/register.html?error=exists');
  }

  // Thêm người dùng mới vào danh sách và ghi vào tệp
  users.push({ username, password, fullname });
  writeUsersToFile(users);

  res.redirect('/login.html?success=true');
});

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
