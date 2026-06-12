
// ══════════════════════════════════
// DEMOS – code + steps (pure JS, no Python needed)
// ══════════════════════════════════
// Helper shorthand
const _s = (value, type) => ({ value, type });
const _i = v => _s(String(v), 'int');
const _f = v => _s(String(v), 'float');
const _str = v => _s('"' + v + '"', 'str');

const DEMOS = {
  demo_bien: {
    id: '10-17-bien-pg01',
    title: 'Biến và Lệnh Gán',
    code:
`ten = "Nguyễn Văn An"
tuoi = 16
diem = 8.5

print("Tên:", ten)
print("Tuổi:", tuoi)
print("Điểm:", diem)

x, y, z = 10, 5, 1
print("x =", x, "| y =", y, "| z =", z)

a, b = 3, 7
print("Trước:", a, b)
a, b = b, a
print("Sau hoán đổi:", a, b)`,
    steps: [
      { line:0,  expl:'📦 Tạo biến <b>ten</b> — Python tự nhận kiểu <b>str</b> (xâu ký tự)',
        vars:{ ten:_str('Nguyễn Văn An') }, out:null },
      { line:1,  expl:'📦 Tạo biến <b>tuoi = 16</b> — kiểu <b>int</b> (số nguyên)',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16) }, out:null },
      { line:2,  expl:'📦 Tạo biến <b>diem = 8.5</b> — kiểu <b>float</b> (số thực, có phần thập phân)',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16), diem:_f(8.5) }, out:null },
      { line:4,  expl:'🖥 <b>print()</b> xuất giá trị biến <b>ten</b> ra màn hình',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16), diem:_f(8.5) }, out:'Tên: Nguyễn Văn An' },
      { line:5,  expl:'🖥 <b>print()</b> xuất giá trị biến <b>tuoi</b>',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16), diem:_f(8.5) }, out:'Tuổi: 16' },
      { line:6,  expl:'🖥 <b>print()</b> xuất giá trị biến <b>diem</b>',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16), diem:_f(8.5) }, out:'Điểm: 8.5' },
      { line:8,  expl:'⚡ <b>Lệnh gán đồng thời</b> — tạo 3 biến x, y, z trong <b>một dòng duy nhất</b>',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16), diem:_f(8.5), x:_i(10), y:_i(5), z:_i(1) }, out:null },
      { line:9,  expl:'🖥 In đồng thời giá trị ba biến x, y, z',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16), diem:_f(8.5), x:_i(10), y:_i(5), z:_i(1) }, out:'x = 10 | y = 5 | z = 1' },
      { line:11, expl:'📦 Gán <b>a = 3</b> và <b>b = 7</b> cùng lúc',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16), diem:_f(8.5), x:_i(10), y:_i(5), z:_i(1), a:_i(3), b:_i(7) }, out:null },
      { line:12, expl:'🖥 In giá trị <b>trước</b> khi hoán đổi',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16), diem:_f(8.5), x:_i(10), y:_i(5), z:_i(1), a:_i(3), b:_i(7) }, out:'Trước: 3 7' },
      { line:13, expl:'🔄 <b>Hoán đổi!</b> Python tính vế phải <code>(b, a) = (7, 3)</code> trước, rồi mới gán — không cần biến tạm',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16), diem:_f(8.5), x:_i(10), y:_i(5), z:_i(1), a:_i(7), b:_i(3) }, out:null },
      { line:14, expl:'🖥 Xác nhận: a = 7, b = 3 — đã hoán đổi thành công!',
        vars:{ ten:_str('Nguyễn Văn An'), tuoi:_i(16), diem:_f(8.5), x:_i(10), y:_i(5), z:_i(1), a:_i(7), b:_i(3) }, out:'Sau hoán đổi: 7 3' },
    ]
  },

  demo_pheptoan: {
    id: '10-17-phep-pg01',
    title: 'Phép Toán',
    code:
`a = 10
b = 3

print("a + b =", a + b)
print("a - b =", a - b)
print("a * b =", a * b)
print("a / b =", a / b)
print("a // b =", a // b)
print("a % b =", a % b)
print("a ** b =", a ** b)

r1 = (12 - 10 // 2) ** 2
r2 = 30 // 12 - 5 / 2
print("(12 - 10//2)**2 =", r1)
print("30//12 - 5/2 =", r2)

print("=" * 20 + "010")
print("10" + "0" * 5)`,
    steps: [
      { line:0,  expl:'📦 Gán biến <b>a = 10</b>', vars:{ a:_i(10) }, out:null },
      { line:1,  expl:'📦 Gán biến <b>b = 3</b>', vars:{ a:_i(10), b:_i(3) }, out:null },
      { line:3,  expl:'➕ Phép <b>cộng</b>: 10 + 3 = <b>13</b>', vars:{ a:_i(10), b:_i(3) }, out:'a + b = 13' },
      { line:4,  expl:'➖ Phép <b>trừ</b>: 10 − 3 = <b>7</b>', vars:{ a:_i(10), b:_i(3) }, out:'a - b = 7' },
      { line:5,  expl:'✖ Phép <b>nhân</b>: 10 × 3 = <b>30</b>', vars:{ a:_i(10), b:_i(3) }, out:'a * b = 30' },
      { line:6,  expl:'➗ Phép <b>chia thực</b> <code>/</code> — kết quả luôn là <b>float</b>: 10 / 3 ≈ 3.333', vars:{ a:_i(10), b:_i(3) }, out:'a / b = 3.3333333333333335' },
      { line:7,  expl:'🔢 Phép <b>chia nguyên</b> <code>//</code> — chỉ lấy phần nguyên: 10 // 3 = <b>3</b>', vars:{ a:_i(10), b:_i(3) }, out:'a // b = 3' },
      { line:8,  expl:'〰 Phép <b>chia lấy dư</b> <code>%</code> (modulo): 10 % 3 = <b>1</b>', vars:{ a:_i(10), b:_i(3) }, out:'a % b = 1' },
      { line:9,  expl:'⬆ Phép <b>lũy thừa</b> <code>**</code>: 10³ = <b>1000</b>', vars:{ a:_i(10), b:_i(3) }, out:'a ** b = 1000' },
      { line:11, expl:'🧮 <b>Thứ tự ưu tiên:</b> tính <code>10//2=5</code> trước → <code>12-5=7</code> → <code>7²=49</code>',
        vars:{ a:_i(10), b:_i(3), r1:_i(49) }, out:null },
      { line:12, expl:'🧮 <code>30//12=2</code>, <code>5/2=2.5</code> → <code>2−2.5=−0.5</code> (float)',
        vars:{ a:_i(10), b:_i(3), r1:_i(49), r2:_f(-0.5) }, out:null },
      { line:13, expl:'🖥 In kết quả bài củng cố 1a (SGK tr.94)', vars:{ a:_i(10), b:_i(3), r1:_i(49), r2:_f(-0.5) }, out:'(12 - 10//2)**2 = 49' },
      { line:14, expl:'🖥 In kết quả bài củng cố 1b', vars:{ a:_i(10), b:_i(3), r1:_i(49), r2:_f(-0.5) }, out:'30//12 - 5/2 = -0.5' },
      { line:16, expl:'🔗 Phép <b>nhân xâu</b> <code>*</code> (lặp "=" 20 lần) rồi <b>nối xâu</b> <code>+</code> với "010"',
        vars:{ a:_i(10), b:_i(3), r1:_i(49), r2:_f(-0.5) }, out:'====================010' },
      { line:17, expl:'🔗 Nối xâu "10" với "00000" ("0" lặp 5 lần)',
        vars:{ a:_i(10), b:_i(3), r1:_i(49), r2:_f(-0.5) }, out:'1000000' },
    ]
  },

  demo_thuchanh: {
    id: '10-17-thuc-pg01',
    title: 'Thực Hành',
    code:
`# Bài 1a: Tổng 1→10, rồi lập phương
tong = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10
ket_qua_a = tong ** 3
print("(a) (1+2+…+10)³ =", ket_qua_a)

# Bài 1b: 1/2 + 1/3 + 1/4 + 1/5
ket_qua_b = 1/2 + 1/3 + 1/4 + 1/5
print("(b) 1/2+1/3+1/4+1/5 =", round(ket_qua_b, 4))

# Bài 1c: x=2, y=5
x = 2
y = 5
ket_qua_c = (x + y) * (x**2 + y**2 - 1)
print("(c) (x+y)(x²+y²-1) =", ket_qua_c)

# Bài 2: Hình tròn R=4.5
R = 4.5
pi = 3.14159
chu_vi = 2 * pi * R
dien_tich = pi * R * R
print("Chu vi =", round(chu_vi, 2))
print("Diện tích =", round(dien_tich, 2))`,
    steps: [
      { line:1,  expl:'🧮 Tính tổng 1+2+…+10 = <b>55</b> bằng cách liệt kê từng số',
        vars:{ tong:_i(55) }, out:null },
      { line:2,  expl:'⬆ Lũy thừa bậc 3: <b>55³ = 166 375</b>',
        vars:{ tong:_i(55), ket_qua_a:_i(166375) }, out:null },
      { line:3,  expl:'🖥 In kết quả bài 1a (SGK tr.95)',
        vars:{ tong:_i(55), ket_qua_a:_i(166375) }, out:'(a) (1+2+…+10)³ = 166375' },
      { line:6,  expl:'➕ Cộng phân số — Python tự đổi sang <b>float</b>: 0.5 + 0.333 + 0.25 + 0.2 ≈ 1.2833',
        vars:{ tong:_i(55), ket_qua_a:_i(166375), ket_qua_b:_f(1.2833) }, out:null },
      { line:7,  expl:'🖥 <b>round(x, 4)</b> làm tròn 4 chữ số thập phân',
        vars:{ tong:_i(55), ket_qua_a:_i(166375), ket_qua_b:_f(1.2833) }, out:'(b) 1/2+1/3+1/4+1/5 = 1.2833' },
      { line:10, expl:'📦 Gán <b>x = 2</b> (bài 1c)',
        vars:{ tong:_i(55), ket_qua_a:_i(166375), ket_qua_b:_f(1.2833), x:_i(2) }, out:null },
      { line:11, expl:'📦 Gán <b>y = 5</b>',
        vars:{ tong:_i(55), ket_qua_a:_i(166375), ket_qua_b:_f(1.2833), x:_i(2), y:_i(5) }, out:null },
      { line:12, expl:'🧮 <code>(x+y)(x²+y²−1)</code> = <code>(2+5)(4+25−1)</code> = <code>7×28</code> = <b>196</b>',
        vars:{ tong:_i(55), ket_qua_a:_i(166375), ket_qua_b:_f(1.2833), x:_i(2), y:_i(5), ket_qua_c:_i(196) }, out:null },
      { line:13, expl:'🖥 In kết quả bài 1c',
        vars:{ tong:_i(55), ket_qua_a:_i(166375), ket_qua_b:_f(1.2833), x:_i(2), y:_i(5), ket_qua_c:_i(196) }, out:'(c) (x+y)(x²+y²-1) = 196' },
      { line:16, expl:'📦 Bán kính <b>R = 4.5</b>',
        vars:{ x:_i(2), y:_i(5), ket_qua_c:_i(196), R:_f(4.5) }, out:null },
      { line:17, expl:'📦 Hằng số <b>π ≈ 3.14159</b>',
        vars:{ x:_i(2), y:_i(5), ket_qua_c:_i(196), R:_f(4.5), pi:_f(3.14159) }, out:null },
      { line:18, expl:'🔵 Chu vi = <b>2πR</b> = 2 × 3.14159 × 4.5 ≈ 28.27',
        vars:{ x:_i(2), y:_i(5), ket_qua_c:_i(196), R:_f(4.5), pi:_f(3.14159), chu_vi:_f(28.27) }, out:null },
      { line:19, expl:'🔵 Diện tích = <b>πR²</b> = 3.14159 × 4.5² ≈ 63.62',
        vars:{ x:_i(2), y:_i(5), ket_qua_c:_i(196), R:_f(4.5), pi:_f(3.14159), chu_vi:_f(28.27), dien_tich:_f(63.62) }, out:null },
      { line:20, expl:'🖥 In chu vi làm tròn 2 chữ số thập phân',
        vars:{ R:_f(4.5), pi:_f(3.14159), chu_vi:_f(28.27), dien_tich:_f(63.62) }, out:'Chu vi = 28.27' },
      { line:21, expl:'🖥 In diện tích làm tròn 2 chữ số thập phân',
        vars:{ R:_f(4.5), pi:_f(3.14159), chu_vi:_f(28.27), dien_tich:_f(63.62) }, out:'Diện tích = 63.62' },
    ]
  },

  demo_vandung: {
    id: '10-17-vand-pg01',
    title: 'Vận Dụng',
    code:
`ss = 684500

ngay = ss // 86400
gio = (ss % 86400) // 3600
phut = (ss % 3600) // 60
giay = ss % 60

print(ss, "giây =", ngay, "ngày", gio, "giờ", phut, "phút", giay, "giây")

print("Đệ rê mi " * 3 + "pha son la si đó " * 2)

x = 10
y = 7
print("Trước: x =", x, ", y =", y)
x, y = y, x
print("Sau:   x =", x, ", y =", y)`,
    steps: [
      { line:0,  expl:'📦 Gán <b>ss = 684 500</b> giây — số giây cần đổi sang ngày/giờ/phút/giây',
        vars:{ ss:_i(684500) }, out:null },
      { line:2,  expl:'📅 1 ngày = 86 400 giây → chia nguyên: 684500 // 86400 = <b>7 ngày</b>',
        vars:{ ss:_i(684500), ngay:_i(7) }, out:null },
      { line:3,  expl:'🕐 Phần dư sau khi bỏ ngày: <code>684500 % 86400 = 8900</code> → 8900 // 3600 = <b>2 giờ</b>',
        vars:{ ss:_i(684500), ngay:_i(7), gio:_i(2) }, out:null },
      { line:4,  expl:'⏱ Phần dư sau giờ: <code>8900 % 3600 = 1700</code> → 1700 // 60 = <b>28 phút</b>',
        vars:{ ss:_i(684500), ngay:_i(7), gio:_i(2), phut:_i(28) }, out:null },
      { line:5,  expl:'⏲ Phần dư cuối: <code>1700 % 60 = 20</code> → <b>20 giây</b> còn lại',
        vars:{ ss:_i(684500), ngay:_i(7), gio:_i(2), phut:_i(28), giay:_i(20) }, out:null },
      { line:7,  expl:'🖥 In kết quả: 684 500 giây = <b>7 ngày 2 giờ 28 phút 20 giây</b>',
        vars:{ ss:_i(684500), ngay:_i(7), gio:_i(2), phut:_i(28), giay:_i(20) }, out:'684500 giây = 7 ngày 2 giờ 28 phút 20 giây' },
      { line:9,  expl:'🎵 <b>Nhân xâu</b> <code>*</code>: lặp chuỗi ký tự, rồi <b>nối xâu</b> <code>+</code>',
        vars:{ ss:_i(684500), ngay:_i(7), gio:_i(2), phut:_i(28), giay:_i(20) }, out:'Đệ rê mi Đệ rê mi Đệ rê mi pha son la si đó pha son la si đó ' },
      { line:11, expl:'📦 Gán <b>x = 10</b>',
        vars:{ ss:_i(684500), ngay:_i(7), gio:_i(2), phut:_i(28), giay:_i(20), x:_i(10) }, out:null },
      { line:12, expl:'📦 Gán <b>y = 7</b>',
        vars:{ ss:_i(684500), ngay:_i(7), gio:_i(2), phut:_i(28), giay:_i(20), x:_i(10), y:_i(7) }, out:null },
      { line:13, expl:'🖥 In giá trị trước hoán đổi',
        vars:{ ss:_i(684500), ngay:_i(7), gio:_i(2), phut:_i(28), giay:_i(20), x:_i(10), y:_i(7) }, out:'Trước: x = 10 , y = 7' },
      { line:14, expl:'🔄 <b>Hoán đổi x và y</b> bằng lệnh gán đồng thời — không cần biến tạm!',
        vars:{ ss:_i(684500), ngay:_i(7), gio:_i(2), phut:_i(28), giay:_i(20), x:_i(7), y:_i(10) }, out:null },
      { line:15, expl:'🖥 Xác nhận x = 7, y = 10 — đã hoán đổi thành công',
        vars:{ ss:_i(684500), ngay:_i(7), gio:_i(2), phut:_i(28), giay:_i(20), x:_i(7), y:_i(10) }, out:'Sau:   x = 7 , y = 10' },
    ]
  }
};

// ══════════════════════════════════
// DEMOS_B16 – Bài 16: NNLT bậc cao & Python
// ══════════════════════════════════
const DEMOS_B16 = {
  b16_print: {
    id: '10-16-lenh-pg01',
    title: 'Lệnh print()',
    code:
`print("Chào các bạn!")
print("Python", 3.12)
print("Tổng:", 4 + 5)
print("Kết thúc.")`,
    steps: [
      { line:0, expl:'🖥 <b>print()</b> xuất chuỗi ký tự ra màn hình — mặc định thêm xuống dòng',
        vars:{}, out:'Chào các bạn!' },
      { line:1, expl:'🖥 <b>print()</b> có thể in nhiều giá trị, ngăn cách bằng dấu phẩy — Python tự thêm dấu cách',
        vars:{}, out:'Python 3.12' },
      { line:2, expl:'🧮 Biểu thức <b>4 + 5</b> được tính trước (= 9), rồi in ra',
        vars:{}, out:'Tổng: 9' },
      { line:3, expl:'🖥 Dòng cuối — chương trình kết thúc sau khi chạy hết',
        vars:{}, out:'Kết thúc.' },
    ]
  },

  b16_expr: {
    id: '10-16-lenh-pg02',
    title: 'Biểu thức & Tính toán',
    code:
`a = 12
b = 5
tong = a + b
hieu = a - b
tich = a * b
thuong = a / b

print("Tổng:", tong)
print("Hiệu:", hieu)
print("Tích:", tich)
print("Thương:", thuong)`,
    steps: [
      { line:0, expl:'📦 Gán <b>a = 12</b>',
        vars:{ a:_i(12) }, out:null },
      { line:1, expl:'📦 Gán <b>b = 5</b>',
        vars:{ a:_i(12), b:_i(5) }, out:null },
      { line:2, expl:'➕ Tính <b>tong = a + b</b> = 12 + 5 = <b>17</b>',
        vars:{ a:_i(12), b:_i(5), tong:_i(17) }, out:null },
      { line:3, expl:'➖ Tính <b>hieu = a − b</b> = 12 − 5 = <b>7</b>',
        vars:{ a:_i(12), b:_i(5), tong:_i(17), hieu:_i(7) }, out:null },
      { line:4, expl:'✖ Tính <b>tich = a × b</b> = 12 × 5 = <b>60</b>',
        vars:{ a:_i(12), b:_i(5), tong:_i(17), hieu:_i(7), tich:_i(60) }, out:null },
      { line:5, expl:'➗ Tính <b>thuong = a / b</b> = 12 / 5 = <b>2.4</b> — phép chia thực luôn trả về float',
        vars:{ a:_i(12), b:_i(5), tong:_i(17), hieu:_i(7), tich:_i(60), thuong:_f(2.4) }, out:null },
      { line:7, expl:'🖥 In tổng',
        vars:{ a:_i(12), b:_i(5), tong:_i(17), hieu:_i(7), tich:_i(60), thuong:_f(2.4) }, out:'Tổng: 17' },
      { line:8, expl:'🖥 In hiệu',
        vars:{ a:_i(12), b:_i(5), tong:_i(17), hieu:_i(7), tich:_i(60), thuong:_f(2.4) }, out:'Hiệu: 7' },
      { line:9, expl:'🖥 In tích',
        vars:{ a:_i(12), b:_i(5), tong:_i(17), hieu:_i(7), tich:_i(60), thuong:_f(2.4) }, out:'Tích: 60' },
      { line:10, expl:'🖥 In thương',
        vars:{ a:_i(12), b:_i(5), tong:_i(17), hieu:_i(7), tich:_i(60), thuong:_f(2.4) }, out:'Thương: 2.4' },
    ]
  },
};

// ══════════════════════════════════
// PG_GRADE_MAP & PG_LESSON_CFGS
// ══════════════════════════════════
const PG_GRADE_MAP = {
  '10': [
    { id: 'b16', label: 'Bài 16', subtitle: 'NNLT bậc cao & Python' },
    { id: 'b17', label: 'Bài 17', subtitle: 'Biến và Lệnh Gán' },
  ],
  '11': [],
  '12': [],
};

const PG_LESSON_CFGS = {
  b16: { demos: DEMOS_B16, label: 'Bài 16', firstKey: 'b16_print' },
  b17: { demos: DEMOS,     label: 'Bài 17', firstKey: 'demo_bien' },
};
