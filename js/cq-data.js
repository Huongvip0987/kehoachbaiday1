// ══════════════════════════════════════════════════════════════
// CÂU HỎI – DỮ LIỆU & HÀM LÕI
// ══════════════════════════════════════════════════════════════

const CQ_CATS = [
  { id: 'ontap_truoc',   label: '📖 Ôn tập bài trước', color: '#3a86ff' },
  { id: 'khoi_dong',     label: '⚡ Khởi động',         color: '#ff9f1c' },
  { id: 'bien_lenh_gan', label: '📦 Biến & Lệnh gán',   color: '#2ec4b6' },
  { id: 'phep_toan',     label: '➕ Phép Toán',          color: '#e71d36' },
  { id: 'tu_khoa',       label: '🔑 Từ Khóa',           color: '#9b5de5' },
  { id: 'thuc_hanh',     label: '🛠 Thực Hành',          color: '#06d6a0' },
  { id: 'van_dung',      label: '🚀 Vận Dụng',           color: '#f72585' },
  { id: 'tong_ket',      label: '📋 Tổng Kết',           color: '#4cc9f0' },
];

const CQ_DEFAULT_QUESTIONS = [
  // ── Ôn tập bài trước ──
  { id:'10-17-ontap-01', cat:'ontap_truoc',
    q:'Hàm nào dùng để nhận dữ liệu từ bàn phím trong Python?',
    opts:['print()','input()','scan()','read()'], ans:1,
    explain:'input() trả về chuỗi (str) từ bàn phím người dùng nhập.' },
  { id:'10-17-ontap-02', cat:'ontap_truoc',
    q:'Kết quả của lệnh  print(3 + 4)  là gì?',
    opts:['"3 + 4"','34','7','Lỗi cú pháp'], ans:2,
    explain:'Python tính biểu thức 3 + 4 = 7 rồi in ra.' },
  { id:'10-17-ontap-03', cat:'ontap_truoc',
    q:'type("123")  trả về kết quả gì?',
    opts:["<class 'int'>","<class 'float'>","<class 'str'>","<class 'bool'>"], ans:2,
    explain:'Chuỗi "123" có dấu nháy → kiểu str, không phải int.' },
  // ── Khởi động ──
  { id:'10-17-khoi-01', cat:'khoi_dong',
    q:'Trong toán học, nếu  x = 5,  thì  y = x + 3  bằng bao nhiêu?',
    opts:['3','5','8','53'], ans:2,
    explain:'y = 5 + 3 = 8. Biến x giữ giá trị 5 và có thể dùng trong biểu thức.' },
  { id:'10-17-khoi-02', cat:'khoi_dong',
    q:'Ký hiệu nào được dùng để gán giá trị cho biến trong Python?',
    opts:['==',':=','←','='], ans:3,
    explain:'Trong Python, dấu = là toán tử gán. Còn == dùng để so sánh bằng.' },
  { id:'10-17-khoi-03', cat:'khoi_dong',
    q:'Lập trình viên dùng biến để làm gì?',
    opts:['Trang trí code cho đẹp','Lưu trữ và xử lý dữ liệu trong chương trình','Thay thế cho hàm print()','Chỉ dùng để lưu số nguyên'], ans:1,
    explain:'Biến là vùng nhớ có tên, giúp lưu trữ dữ liệu và sử dụng lại nhiều lần trong chương trình.' },
  // ── Biến & Lệnh gán ──
  { id:'10-17-bien-01', cat:'bien_lenh_gan',
    q:'Biến trong lập trình là gì?',
    opts:['Một từ khóa cố định của Python','Vùng nhớ có tên dùng để lưu trữ dữ liệu','Kết quả của một phép tính','Một kiểu dữ liệu đặc biệt'], ans:1,
    explain:'Biến là vùng nhớ có tên. Giá trị có thể thay đổi bất kỳ lúc nào trong quá trình chạy chương trình.' },
  { id:'10-17-bien-02', cat:'bien_lenh_gan',
    q:'Sau khi chạy hai dòng sau, x bằng bao nhiêu?\n  x = 10\n  x = x + 5',
    opts:['10','5','15','105'], ans:2,
    explain:'Dòng 2: x = 10 + 5 = 15. Lệnh gán mới ghi đè giá trị cũ của biến x.' },
  { id:'10-17-bien-03', cat:'bien_lenh_gan',
    q:'Sau lệnh   a, b = b, a   thì điều gì xảy ra?',
    opts:['Lỗi vì không dùng biến tạm','Giá trị a và b được hoán đổi cho nhau','a và b cùng bằng 0','a bằng b, b không đổi'], ans:1,
    explain:'Python đọc vế phải trước (b, a), rồi gán đồng thời → a nhận giá trị b cũ, b nhận giá trị a cũ.' },
  { id:'10-17-bien-04', cat:'bien_lenh_gan',
    q:'Tên biến nào HỢP LỆ trong Python?',
    opts:['2so','so-dem','_dem_so','for'], ans:2,
    explain:'_dem_so hợp lệ: bắt đầu bằng _ và chỉ chứa chữ/số/_.\n• 2so: bắt đầu bằng số ✗\n• so-dem: có dấu gạch ngang ✗\n• for: từ khóa Python ✗' },
  { id:'10-17-bien-05', cat:'bien_lenh_gan',
    q:'Sau lệnh   a, b, c = 1, 2, 3   thì a + c bằng bao nhiêu?',
    opts:['3','4','5','6'], ans:1,
    explain:'a = 1, b = 2, c = 3 → a + c = 1 + 3 = 4. Gán đồng thời theo đúng thứ tự từ trái sang phải.' },
  // ── Phép Toán ──
  { id:'10-17-phep-01', cat:'phep_toan',
    q:'Kết quả của   10 // 3   trong Python là gì?',
    opts:['3.33','1','3','33'], ans:2,
    explain:'// là phép chia lấy phần nguyên: 10 ÷ 3 = 3 dư 1 → kết quả là 3.' },
  { id:'10-17-phep-02', cat:'phep_toan',
    q:'Kết quả của   10 % 3   trong Python là gì?',
    opts:['3','1','0.33','3.33'], ans:1,
    explain:'% là phép lấy phần dư: 10 = 3×3 + 1 → phần dư là 1.' },
  { id:'10-17-phep-03', cat:'phep_toan',
    q:'Toán tử ** trong Python có nghĩa là gì? Tính 2 ** 3.',
    opts:['Nhân đôi – kết quả 6','Lũy thừa – kết quả 8','Chia đôi – kết quả 1','Phép XOR – kết quả 1'], ans:1,
    explain:'** là lũy thừa (mũ). 2 ** 3 = 2³ = 2 × 2 × 2 = 8.' },
  { id:'10-17-phep-04', cat:'phep_toan',
    q:'"Ha" * 3  cho kết quả là gì?',
    opts:['"Ha3"','"HaHaHa"','Lỗi TypeError','6'], ans:1,
    explain:'Toán tử * với chuỗi = lặp chuỗi. "Ha" * 3 = "HaHaHa".' },
  { id:'10-17-phep-05', cat:'phep_toan',
    q:'"Hello" + "World"  cho kết quả là gì?',
    opts:['"Hello World"','"HelloWorld"','Lỗi','hello+world'], ans:1,
    explain:'+ với chuỗi = nối chuỗi. Không có khoảng trắng tự động → "HelloWorld".' },
  // ── Từ Khóa ──
  { id:'10-17-tukh-01', cat:'tu_khoa',
    q:'Từ nào KHÔNG phải từ khóa (keyword) của Python?',
    opts:['if','for','bien','True'], ans:2,
    explain:'"bien" là tên do lập trình viên đặt, không phải từ khóa.\nCác từ khóa: if, for, True, False, None, while, def, return, ...' },
  { id:'10-17-tukh-02', cat:'tu_khoa',
    q:'Tại sao không được đặt tên biến trùng với từ khóa Python?',
    opts:['Vì Python phân biệt hoa/thường','Vì Python đã dành riêng chúng cho cú pháp','Vì tên biến phải ngắn hơn 10 ký tự','Vì từ khóa không lưu được số'], ans:1,
    explain:'Từ khóa có ý nghĩa đặc biệt trong cú pháp Python. Dùng làm tên biến sẽ gây lỗi SyntaxError.' },
  { id:'10-17-tukh-03', cat:'tu_khoa',
    q:'True và False trong Python thuộc kiểu dữ liệu nào?',
    opts:['str','int','bool','None'], ans:2,
    explain:'True và False là hai hằng giá trị của kiểu bool (boolean – logic đúng/sai).' },
  // ── Thực Hành ──
  { id:'10-17-thuc-01', cat:'thuc_hanh',
    q:'Để nhận số nguyên từ bàn phím, lệnh nào ĐÚNG?',
    opts:['x = input()','x = int(input())','x = int()','x = number(input())'], ans:1,
    explain:'input() trả về str → cần int() để chuyển sang số nguyên.\nCú pháp đúng: x = int(input("..."))' },
  { id:'10-17-thuc-02', cat:'thuc_hanh',
    q:'Đoạn code nào in ra chuỗi  "55"  (không phải số 10)?',
    opts:['print(5 + 5)','print("5" + "5")','print(5 * 2)','print(int("5") + int("5"))'], ans:1,
    explain:'"5" + "5" là nối chuỗi → "55".\nCòn 5 + 5 và 5 * 2 đều cho số 10.' },
  { id:'10-17-thuc-03', cat:'thuc_hanh',
    q:'Lỗi trong đoạn code sau là gì?\n  x = input("Nhập số: ")\n  print(x + 1)',
    opts:['Thiếu dấu nháy ở input','input() trả về str, không cộng được với int','print() không nhận biểu thức','Biến x chưa được khai báo'], ans:1,
    explain:'input() luôn trả về str. Phép + giữa str và int gây TypeError.\nSửa: x = int(input("Nhập số: "))' },
  // ── Vận Dụng ──
  { id:'10-17-vand-01', cat:'van_dung',
    q:'Để tính số giờ từ tổng số giây  giay,  biểu thức nào đúng?',
    opts:['giay / 3600','giay % 3600','giay // 3600','giay * 3600'], ans:2,
    explain:'// lấy phần nguyên của phép chia. 1 giờ = 3600 giây → số giờ = giay // 3600.' },
  { id:'10-17-vand-02', cat:'van_dung',
    q:'Hoán đổi x và y KHÔNG dùng biến tạm, cú pháp Python nào đúng?',
    opts:['x = y; y = x','swap(x, y)','x, y = y, x','x ↔ y'], ans:2,
    explain:'Python hỗ trợ gán đồng thời: vế phải được tính trước, rồi mới gán.\nx, y = y, x hoán đổi hoàn toàn mà không cần biến tạm.' },
  // ── Tổng Kết ──
  { id:'10-17-tong-01', cat:'tong_ket',
    q:'Sự khác biệt giữa  =  và  ==  trong Python?',
    opts:['Giống nhau, dùng tuỳ ý','= so sánh, == gán','= gán giá trị, == so sánh bằng','== chỉ dùng trong vòng lặp'], ans:2,
    explain:'x = 5   → gán giá trị 5 cho biến x.\nx == 5  → so sánh: x có bằng 5 không? Trả về True/False.' },
  { id:'10-17-tong-02', cat:'tong_ket',
    q:'Toán tử nào trả về PHẦN DƯ của phép chia?',
    opts:['//','%','**','/'], ans:1,
    explain:'% (modulo) trả về phần dư. Ví dụ: 10 % 3 = 1.' },
  { id:'10-17-tong-03', cat:'tong_ket',
    q:'Biến trong Python có thể thay đổi kiểu dữ liệu không?',
    opts:['Không, phải khai báo kiểu trước','Có, Python là ngôn ngữ kiểu động','Chỉ đổi được giữa int và float','Không, kiểu cố định khi tạo biến'], ans:1,
    explain:'Python là dynamically typed: biến không có kiểu cố định.\nx = 5 (int) → x = "hello" (str) hoàn toàn hợp lệ.' },

  // ── TỰ LUẬN ──
  { id:'10-17-ontap-04', cat:'ontap_truoc', type:'tl',
    q:'Hàm  input()  trả về kiểu dữ liệu gì? Tại sao cần dùng  int()  hoặc  float()  khi nhận số từ bàn phím?',
    explain:'input() luôn trả về kiểu str (chuỗi ký tự).\n\nVí dụ:\n  x = input("Nhập số: ")  # x là str, VD: "5"\n  print(type(x))          # <class \'str\'>\n\nNếu cần tính toán → phải chuyển kiểu:\n  x = int(input("Nhập số nguyên: "))    # → int\n  y = float(input("Nhập số thực: "))   # → float\n\nNếu không chuyển mà cộng với số → TypeError!' },
  { id:'10-17-khoi-04', cat:'khoi_dong', type:'tl', slide:'2-1',
    q:'Biến trong toán học và biến trong lập trình Python khác nhau như thế nào? Hãy nêu ít nhất 2 điểm khác biệt.',
    explain:'1. Kiểu giá trị:\n   • Toán học: thường là số (thực/phức)\n   • Python: lưu được mọi kiểu dữ liệu (số, chuỗi, list…)\n\n2. Thay đổi giá trị:\n   • Toán học: thường cố định trong một bài toán\n   • Python: có thể thay đổi bất kỳ lúc nào khi chạy chương trình\n\n3. Khai báo:\n   • Toán học: dùng ký hiệu (a, b, x, y…)\n   • Python: đặt tên tùy ý theo quy tắc, không cần khai báo kiểu trước' },
  { id:'10-17-bien-06', cat:'bien_lenh_gan', type:'tl', slide:'2-2',
    q:'Giải thích sự khác nhau giữa  =  và  ==  trong Python. Viết 2 ví dụ minh họa cho mỗi toán tử.',
    explain:'• = là toán tử GÁN:\n  x = 5          # gán giá trị 5 cho biến x\n  ten = "An"     # gán chuỗi "An" cho biến ten\n\n• == là toán tử SO SÁNH, trả về True/False:\n  print(x == 5)   # in ra True (5 có bằng 5 không?)\n  print(x == 10)  # in ra False (5 có bằng 10 không?)\n\nNhớ: = làm thay đổi biến, == chỉ kiểm tra rồi trả kết quả.' },
  { id:'10-17-bien-07', cat:'bien_lenh_gan', type:'tl',
    q:'Viết đoạn code Python để: (1) nhận 2 số nguyên từ bàn phím, (2) tính tổng và tích, (3) in kết quả ra màn hình.',
    explain:'a = int(input("Nhập số a: "))\nb = int(input("Nhập số b: "))\ntong = a + b\ntich = a * b\nprint("Tổng:", tong)\nprint("Tích:", tich)\n\n# Ví dụ chạy: a=4, b=6 → Tổng: 10 · Tích: 24' },
  { id:'10-17-phep-06', cat:'phep_toan', type:'tl', slide:'3-1',
    q:'Giải thích ý nghĩa của 3 toán tử: // (chia nguyên), % (chia dư), ** (lũy thừa). Mỗi loại cho 1 ví dụ tính cụ thể.',
    explain:'• // phép chia lấy phần nguyên:\n  17 // 5 = 3   (vì 17 = 5×3 + 2, lấy phần 3)\n\n• % phép chia lấy phần dư:\n  17 % 5 = 2    (vì 17 ÷ 5 = 3 dư 2)\n\n• ** phép lũy thừa:\n  2 ** 10 = 1024  (2 mũ 10)\n  3 ** 3 = 27     (3 mũ 3 = 27)' },
  { id:'10-17-tukh-04', cat:'tu_khoa', type:'tl',
    q:'Tại sao không được đặt tên biến trùng với từ khóa của Python? Hãy cho ví dụ về điều gì sẽ xảy ra nếu cố tình làm vậy.',
    explain:'Từ khóa Python (if, for, while, True, False, def, return…) đã được trình thông dịch dành riêng cho cú pháp ngôn ngữ.\n\nNếu dùng làm tên biến → SyntaxError:\n  for = 5       # ❌ SyntaxError\n  True = "yes"  # ❌ SyntaxError\n  if = 10       # ❌ SyntaxError\n\nCách kiểm tra:\n  import keyword\n  print(keyword.kwlist)  # in ra danh sách 35 từ khóa' },
  { id:'10-17-thuc-04', cat:'thuc_hanh', type:'tl',
    q:'Viết chương trình Python: nhận vào tổng số giây (số nguyên), sau đó hiển thị ra số giờ, số phút còn lại, và số giây còn lại.',
    explain:'giay_nhap = int(input("Nhập tổng số giây: "))\ngios = giay_nhap // 3600\nphuts = (giay_nhap % 3600) // 60\ngiays = giay_nhap % 60\nprint(f"Kết quả: {gios} giờ {phuts} phút {giays} giây")\n\n# Ví dụ: nhập 3725\n# → 1 giờ 2 phút 5 giây' },
  { id:'10-17-vand-03', cat:'van_dung', type:'tl',
    q:'Giải thích cơ chế hoán đổi  x, y = y, x  trong Python mà không cần biến tạm. Tại sao cách này hoạt động được?',
    explain:'Python xử lý vế phải TRƯỚC KHI gán:\n1. Tạo tuple tạm: (y, x) = (giá trị cũ của y, giá trị cũ của x)\n2. Sau đó gán đồng thời: x ← giá trị cũ y, y ← giá trị cũ x\n\nVí dụ:\n  x, y = 3, 7\n  x, y = y, x   # Python tạo (7, 3) rồi gán x=7, y=3\n  print(x, y)   # 7 3\n\n→ Không cần biến tạm vì tuple tạm được tạo ra TRƯỚC khi bất kỳ biến nào bị thay đổi.' },
  { id:'10-17-tong-04', cat:'tong_ket', type:'tl',
    q:'Tóm tắt 5 điều quan trọng nhất về biến và lệnh gán trong Python mà em đã học trong Bài 17.',
    explain:'1. Biến = vùng nhớ có tên, lưu & xử lý dữ liệu trong chương trình.\n\n2. Lệnh gán: tên_biến = giá_trị\n   • Vế phải tính trước → rồi mới gán cho tên biến bên trái.\n\n3. Quy tắc đặt tên hợp lệ:\n   • Dùng chữ cái, số, dấu gạch dưới (_)\n   • Không bắt đầu bằng số\n   • Không trùng từ khóa Python\n\n4. Gán đồng thời: a, b, c = 1, 2, 3\n   • Gán nhiều biến cùng lúc, theo thứ tự trái sang phải.\n\n5. Toán tử gán vs so sánh:\n   • = gán giá trị (x = 5)\n   • == so sánh bằng (x == 5 → True/False)' },

  // ── ĐIỀN CHỖ TRỐNG ──
  { id:'10-17-bien-08', cat:'bien_lenh_gan', type:'fill',
    q:'Biến là ___ có tên dùng để ___ trong máy tính.',
    blanks:['vùng nhớ','lưu trữ dữ liệu'],
    explain:'Biến là VÙNG NHỚ có tên dùng để LƯU TRỮ DỮ LIỆU. Giá trị có thể thay đổi khi chương trình chạy.' },
  { id:'10-17-bien-09', cat:'bien_lenh_gan', type:'fill',
    q:'Dấu ___ là lệnh gán trong Python, còn dấu ___ là phép so sánh bằng.',
    blanks:['=','=='],
    explain:'= là lệnh GÁN (thay đổi giá trị biến), == là so sánh (trả về True/False). Đây là lỗi hay gặp nhất với người mới học Python.' },
  { id:'10-17-phep-07', cat:'phep_toan', type:'fill',
    q:'10 ___ 3 cho kết quả 3 (phần nguyên), còn 10 ___ 3 cho kết quả 1 (phần dư).',
    blanks:['//','%'],
    explain:'// là phép chia lấy phần nguyên, % (modulo) là lấy số dư.' },
  { id:'10-17-phep-08', cat:'phep_toan', type:'fill',
    q:'Trong Python, 2 ___ 8 = 256. Đây là phép ___.',
    blanks:['**','lũy thừa'],
    explain:'** là toán tử lũy thừa. 2**8 = 2⁸ = 256.' },
  { id:'10-17-tukh-05', cat:'tu_khoa', type:'fill',
    q:'Python có ___ từ khóa. Nếu đặt tên biến trùng từ khóa sẽ gây lỗi ___.',
    blanks:['35','SyntaxError'],
    explain:'Python có 35 từ khóa. Dùng chúng làm tên biến → lỗi SyntaxError ngay khi chạy.' },
  { id:'10-17-tong-05', cat:'tong_ket', type:'fill',
    q:'Lệnh gán đồng thời ___ giúp hoán đổi hai biến a và b mà không cần ___.',
    blanks:['a, b = b, a','biến trung gian'],
    explain:'Python tính toàn bộ vế phải trước, sau đó mới gán. Đây là tính năng đặc trưng của Python.' },

  // ── NỐI TỪ ──
  { id:'10-17-bien-10', cat:'bien_lenh_gan', type:'match',
    q:'Nối ký hiệu Python với ý nghĩa tương ứng:',
    pairs:[
      {a:'=',            b:'Lệnh gán giá trị'},
      {a:'==',           b:'So sánh bằng'},
      {a:'+=',           b:'Cộng rồi gán (x += 1)'},
      {a:'a, b = b, a',  b:'Hoán đổi hai biến'}
    ],
    explain:'Chú ý: = và == là hai ký hiệu khác nhau hoàn toàn trong Python!' },
  { id:'10-17-phep-09', cat:'phep_toan', type:'match',
    q:'Nối toán tử với tên gọi và ví dụ minh họa:',
    pairs:[
      {a:'//',  b:'Chia lấy phần nguyên · 10//3 = 3'},
      {a:'%',   b:'Lấy số dư (modulo) · 10%3 = 1'},
      {a:'**',  b:'Lũy thừa · 2**3 = 8'},
      {a:'+"a"',b:'Nối xâu · "Hi"+"!" = "Hi!"'}
    ],
    explain:'Ba toán tử //, %, ** là đặc trưng của Python, không có trong nhiều ngôn ngữ khác.' },
  { id:'10-17-tukh-06', cat:'tu_khoa', type:'match',
    q:'Nối từ khóa Python với mục đích sử dụng:',
    pairs:[
      {a:'if',     b:'Câu lệnh điều kiện'},
      {a:'for',    b:'Vòng lặp duyệt phần tử'},
      {a:'def',    b:'Định nghĩa hàm'},
      {a:'True',   b:'Giá trị boolean đúng'}
    ],
    explain:'Không được dùng các từ khóa này làm tên biến. VS Code tô màu xanh để nhận biết.' },
  { id:'10-17-tong-06', cat:'tong_ket', type:'match',
    q:'Nối khái niệm với định nghĩa chính xác nhất:',
    pairs:[
      {a:'Biến',       b:'Vùng nhớ có tên, lưu & thay đổi dữ liệu'},
      {a:'Lệnh gán',   b:'Cú pháp: biến = biểu thức'},
      {a:'Từ khóa',    b:'35 từ dành riêng, không đặt tên biến trùng'},
      {a:'Kiểu động',  b:'Python tự xác định kiểu theo giá trị gán'}
    ],
    explain:'Bốn khái niệm trọng tâm Bài 17 – Biến và Lệnh Gán.' },
];

const CQ_LS_KEY = 'cq_data_b17_v2';

// ── Bài 16 ──
const CQ_B16_CATS = [
  { id: 'ontap_truoc',  label: '📖 Ôn tập bài trước', color: '#3a86ff' },
  { id: 'khoi_dong',    label: '⚡ Khởi động',          color: '#ff9f1c' },
  { id: 'nnlt_bac_cao', label: '🌐 NNLT bậc cao',       color: '#2ec4b6' },
  { id: 'moi_truong',   label: '🖥 Môi trường Python',  color: '#e71d36' },
  { id: 'lenh_python',  label: '🐍 Lệnh print()',        color: '#9b5de5' },
  { id: 'thuc_hanh',    label: '🛠 Thực hành',           color: '#06d6a0' },
  { id: 'van_dung',     label: '🚀 Vận dụng',            color: '#f72585' },
];
const CQ_B16_LS_KEY = 'cq_data_b16_v2';
const CQ_B16_DEFAULT_QUESTIONS = [
  { id:'10-16-ontap-01', cat:'ontap_truoc',
    q:'Máy tính chỉ hiểu và thực hiện trực tiếp loại ngôn ngữ nào?',
    opts:['Ngôn ngữ tự nhiên (tiếng Việt)','Ngôn ngữ máy (dãy bit 0 và 1)','Ngôn ngữ Python','Ngôn ngữ C++'],
    ans:1, explain:'Máy tính chỉ hiểu ngôn ngữ máy – biểu diễn bằng các bit 0 và 1. Mọi ngôn ngữ khác đều phải được dịch sang ngôn ngữ máy trước khi thực thi.' },
  { id:'10-16-ontap-02', cat:'ontap_truoc',
    q:'Chương trình máy tính được tạo ra để làm gì?',
    opts:['Chỉ để hiển thị văn bản trên màn hình','Giải quyết bài toán theo từng bước bằng các lệnh','Thay thế phần cứng của máy tính','Kết nối máy tính với Internet'],
    ans:1, explain:'Chương trình máy tính là dãy các lệnh được sắp xếp để giải quyết bài toán cụ thể theo một trình tự xác định.' },
  { id:'10-16-ontap-03', cat:'ontap_truoc',
    q:'Ngôn ngữ assembly khác ngôn ngữ máy ở điểm nào?',
    opts:['Assembly dùng các từ gợi nhớ (ADD, MOV...) thay cho mã nhị phân','Assembly không cần dịch sang ngôn ngữ máy','Assembly chạy nhanh hơn ngôn ngữ máy','Assembly là ngôn ngữ bậc cao'],
    ans:0, explain:'Assembly dùng các từ gợi nhớ (mnemonic) như ADD, MOV, JMP thay cho chuỗi bit khó nhớ. Tuy nhiên vẫn phụ thuộc kiến trúc phần cứng và cần chương trình hợp dịch (assembler) để dịch sang ngôn ngữ máy.' },
  { id:'10-16-ontap-04', cat:'ontap_truoc', type:'tl',
    q:'Em hãy phân biệt ba tầng ngôn ngữ lập trình: ngôn ngữ máy, assembly, và ngôn ngữ bậc cao. Mỗi loại cho một đặc điểm nổi bật.',
    explain:'1. Ngôn ngữ máy: biểu diễn bằng dãy bit 0/1, máy tính hiểu trực tiếp, rất khó đọc với con người.\n\n2. Assembly: dùng từ gợi nhớ (ADD, MOV...), dễ đọc hơn ngôn ngữ máy, cần chương trình hợp dịch (assembler), vẫn phụ thuộc phần cứng.\n\n3. NNLT bậc cao (Python, C, Java...): gần ngôn ngữ tự nhiên, dễ học, độc lập phần cứng, cần trình biên dịch hoặc thông dịch.' },
  { id:'10-16-khoi-01', cat:'khoi_dong',
    q:'Tại sao lập trình viên ít dùng ngôn ngữ máy để viết chương trình?',
    opts:['Vì máy tính không hiểu ngôn ngữ máy','Vì ngôn ngữ máy chạy chậm hơn Python','Vì ngôn ngữ máy rất khó đọc, khó viết và phụ thuộc phần cứng','Vì ngôn ngữ máy không có lệnh in ra màn hình'],
    ans:2, explain:'Ngôn ngữ máy chỉ có 0 và 1, cực kỳ khó đọc và viết, dễ mắc lỗi, lại phụ thuộc kiến trúc từng loại CPU → lập trình viên chuyển sang dùng NNLT bậc cao cho hiệu quả hơn.' },
  { id:'10-16-khoi-02', cat:'khoi_dong',
    q:'Assembly được gọi là "ngôn ngữ bậc thấp" vì lý do nào sau đây?',
    opts:['Vì chất lượng chương trình viết bằng assembly thấp hơn','Vì assembly gần với phần cứng, phụ thuộc kiến trúc máy tính','Vì assembly ít phổ biến hơn Python','Vì assembly không thể tính toán số học'],
    ans:1, explain:'"Bậc thấp" không có nghĩa là kém hơn, mà chỉ mức độ trừu tượng thấp – assembly gần với phần cứng, mỗi lệnh thường tương ứng với một lệnh máy, và chương trình viết cho loại CPU này thường không chạy được trên loại CPU khác.' },
  { id:'10-16-khoi-03', cat:'khoi_dong', type:'tl',
    q:'Nếu em phải chọn viết một trò chơi máy tính, em sẽ chọn ngôn ngữ nào: ngôn ngữ máy, assembly hay Python? Giải thích lý do.',
    explain:'Nên chọn ngôn ngữ bậc cao như Python (hoặc C, Java...).\n\nLý do:\n• Dễ đọc, dễ viết và dễ sửa lỗi\n• Có nhiều thư viện hỗ trợ làm game (pygame...)\n• Không cần biết chi tiết phần cứng\n• Chương trình ngắn gọn hơn nhiều so với viết bằng assembly hay ngôn ngữ máy\n• Cộng đồng lớn, nhiều tài liệu hướng dẫn\n\nNgôn ngữ máy và assembly chỉ phù hợp khi cần tối ưu hiệu năng rất cao hoặc lập trình nhúng trực tiếp với phần cứng.' },
  { id:'10-16-nnlt-01', cat:'nnlt_bac_cao',
    q:'Đặc điểm nào sau đây là của NNLT bậc cao?',
    opts:['Chỉ dùng các số 0 và 1','Gần ngôn ngữ tự nhiên, dễ đọc và dễ học','Phụ thuộc hoàn toàn vào kiến trúc CPU','Không cần dịch sang ngôn ngữ máy'],
    ans:1, explain:'NNLT bậc cao (Python, Java, C...) sử dụng từ ngữ gần với tiếng Anh tự nhiên, có cấu trúc rõ ràng, giúp lập trình viên tập trung vào giải thuật thay vì chi tiết phần cứng. Tuy nhiên vẫn cần chương trình dịch để chuyển sang ngôn ngữ máy.' },
  { id:'10-16-nnlt-02', cat:'nnlt_bac_cao',
    q:'Python được tạo ra bởi ai, vào năm nào và ở quốc gia nào?',
    opts:['Bill Gates – Mỹ – 1985','Guido van Rossum – Hà Lan – 1991','Linus Torvalds – Phần Lan – 1991','Dennis Ritchie – Mỹ – 1972'],
    ans:1, explain:'Python do Guido van Rossum (người Hà Lan) tạo ra năm 1991. Tên Python lấy cảm hứng từ chương trình hài "Monty Python\'s Flying Circus" – không phải con rắn python.' },
  { id:'10-16-nnlt-03', cat:'nnlt_bac_cao',
    q:'Chương trình dịch có vai trò gì trong ngôn ngữ lập trình bậc cao?',
    opts:['Kiểm tra chính tả tiếng Anh trong code','Chuyển mã nguồn bậc cao thành dạng máy tính thực thi được','Tự động viết code thay cho lập trình viên','Kết nối máy tính với Internet'],
    ans:1, explain:'Chương trình dịch nhận mã nguồn (source code) viết bằng NNLT bậc cao và chuyển thành ngôn ngữ máy hoặc mã trung gian để máy tính thực thi. Có hai loại chính: trình biên dịch (compiler) và trình thông dịch (interpreter).' },
  { id:'10-16-nnlt-04', cat:'nnlt_bac_cao',
    q:'Python sử dụng loại chương trình dịch nào?',
    opts:['Trình biên dịch (compiler) – dịch toàn bộ rồi mới chạy','Trình hợp dịch (assembler)','Trình thông dịch (interpreter) – dịch và chạy từng dòng','Không cần dịch vì Python là ngôn ngữ máy'],
    ans:2, explain:'Python là ngôn ngữ thông dịch (interpreted): trình thông dịch đọc và thực thi từng dòng lệnh theo thứ tự. Điều này giúp dễ thử nghiệm và debug, nhưng thường chậm hơn ngôn ngữ biên dịch như C.' },
  { id:'10-16-nnlt-05', cat:'nnlt_bac_cao', type:'tl',
    q:'Hãy giải thích sự khác biệt giữa trình biên dịch (compiler) và trình thông dịch (interpreter). Python thuộc loại nào?',
    explain:'Trình biên dịch (Compiler):\n• Đọc toàn bộ chương trình nguồn và dịch HOÀN TOÀN sang ngôn ngữ máy TRƯỚC khi chạy\n• Tạo ra file thực thi (.exe)\n• Ví dụ: C, C++, Pascal\n• Ưu điểm: chạy nhanh\n\nTrình thông dịch (Interpreter):\n• Đọc và thực thi từng dòng lệnh theo thứ tự\n• Không tạo file thực thi độc lập\n• Ví dụ: Python, JavaScript\n• Ưu điểm: dễ debug, thử nghiệm nhanh\n\n→ Python dùng trình THÔNG DỊCH.' },
  { id:'10-16-nnlt-06', cat:'nnlt_bac_cao', type:'fill',
    q:'Python được tạo bởi ___ vào năm ___, là ngôn ngữ lập trình ___.',
    blanks:['Guido van Rossum','1991','bậc cao'],
    explain:'Ba thông tin quan trọng về lịch sử Python: tác giả Guido van Rossum (Hà Lan), năm 1991, và đây là NNLT bậc cao – gần ngôn ngữ tự nhiên, dễ học.' },
  { id:'10-16-motr-01', cat:'moi_truong',
    q:'Dấu nhắc ">>>" trong cửa sổ Python Shell cho biết điều gì?',
    opts:['Python đang bị lỗi','Python đang sẵn sàng nhận lệnh từ người dùng','Python đang chạy chương trình','Python đang kết nối Internet'],
    ans:1, explain:'Dấu nhắc >>> (dấu lớn hơn gõ 3 lần) là dấu hiệu Python Shell đang ở chế độ chờ, sẵn sàng nhận và thực hiện lệnh. Đây là chế độ tương tác (interactive mode).' },
  { id:'10-16-motr-02', cat:'moi_truong',
    q:'Trong môi trường IDLE của Python, có mấy chế độ làm việc chính?',
    opts:['1 chế độ: chỉ gõ lệnh trực tiếp','2 chế độ: gõ lệnh trực tiếp và soạn thảo chương trình','3 chế độ: view, edit, và run','4 chế độ tương ứng 4 loại file'],
    ans:1, explain:'IDLE có 2 chế độ chính:\n1. Chế độ tương tác (Interactive): gõ lệnh tại dấu >>> và Enter để chạy ngay\n2. Chế độ soạn thảo (Script editor): mở File → New File, viết nhiều lệnh, lưu .py, chạy bằng F5' },
  { id:'10-16-motr-03', cat:'moi_truong',
    q:'Để chạy chương trình Python đã lưu trong IDLE, ta nhấn phím nào?',
    opts:['Enter','Ctrl+S','F5','F1'],
    ans:2, explain:'F5 (Run Module) là phím tắt để chạy toàn bộ chương trình trong IDLE. Ctrl+S dùng để lưu file. Enter chỉ chạy từng dòng ở chế độ tương tác.' },
  { id:'10-16-motr-04', cat:'moi_truong', type:'tl',
    q:'Mô tả các bước để tạo và chạy chương trình Python đầu tiên trong IDLE.',
    explain:'Các bước tạo và chạy chương trình:\n\n1. Mở IDLE (Python Shell)\n2. Vào menu File → New File (hoặc Ctrl+N)\n   → Cửa sổ soạn thảo mở ra\n3. Gõ code chương trình vào cửa sổ soạn thảo\n   Ví dụ: print("Xin chào!")\n4. Lưu file: Ctrl+S\n   → Đặt tên file (VD: Bai1.py)\n   → Chọn thư mục lưu\n5. Chạy chương trình: nhấn F5\n   → Kết quả hiện trong cửa sổ Python Shell\n\nLưu ý: file Python có đuôi .py' },
  { id:'10-16-motr-05', cat:'moi_truong', type:'fill',
    q:'Trong IDLE, dấu ___ cho biết Python đang chờ lệnh. Nhấn ___ để chạy chương trình đã lưu.',
    blanks:['>>>','F5'],
    explain:'Dấu nhắc >>> là ký hiệu Python Shell đang ở chế độ tương tác. F5 là phím tắt "Run Module" để thực thi chương trình (.py) trong cửa sổ soạn thảo.' },
  { id:'10-16-lenh-01', cat:'lenh_python',
    q:'Lệnh print("Xin chào Python!") sẽ in ra màn hình gì?',
    opts:['Xin chào Python! (không có dấu nháy)','"Xin chào Python!" (có dấu nháy)','print','Lỗi cú pháp'],
    ans:0, explain:'Hàm print() in giá trị ra màn hình và tự thêm xuống dòng. Khi in chuỗi, dấu nháy chỉ để xác định ranh giới chuỗi trong code – không được in ra.' },
  { id:'10-16-lenh-02', cat:'lenh_python',
    q:'Kết quả của lệnh print(3 + 5 * 2) là gì?',
    opts:['16','13','3 + 5 * 2','Lỗi cú pháp'],
    ans:1, explain:'Python áp dụng thứ tự ưu tiên toán tử: nhân trước, cộng sau.\n5 * 2 = 10, sau đó 3 + 10 = 13.\nprint() sẽ in ra 13.' },
  { id:'10-16-lenh-03', cat:'lenh_python',
    q:'Lệnh print(10, 20, 30) sẽ in ra gì?',
    opts:['102030','10 20 30','10, 20, 30','(10, 20, 30)'],
    ans:1, explain:'Khi truyền nhiều giá trị cho print(), Python mặc định ngăn cách chúng bằng dấu cách.\nprint(10, 20, 30) → in ra: 10 20 30' },
  { id:'10-16-lenh-04', cat:'lenh_python',
    q:'Lệnh nào sau đây in ra số thực đúng cú pháp Python?',
    opts:['print(3,14)','print(3.14)','PRINT(3.14)','Print(3,14)'],
    ans:1, explain:'Số thực trong Python dùng dấu chấm thập phân (3.14), không phải dấu phẩy.\nprint() viết thường. Python phân biệt hoa/thường nên PRINT() hay Print() đều gây lỗi.' },
  { id:'10-16-lenh-05', cat:'lenh_python', type:'tl',
    q:'Viết lệnh print() để in ra: "Bài 16: NNLT bậc cao và Python". Giải thích cú pháp.',
    explain:'Cú pháp:\n  print("Bài 16: NNLT bậc cao và Python")\n\nGiải thích:\n• print là tên hàm\n• () là cặp ngoặc tròn bắt buộc\n• Nội dung chuỗi đặt trong dấu nháy kép " " hoặc nháy đơn \' \'\n• Chuỗi văn bản phải có dấu nháy bao quanh, số thì không cần' },
  { id:'10-16-lenh-06', cat:'lenh_python', type:'fill',
    q:'Cú pháp hàm in ra màn hình là ___. Nhiều giá trị được ngăn cách bởi ___.',
    blanks:['print(v1, v2, ..., vn)', 'dấu phẩy ,'],
    explain:'Cú pháp đầy đủ: print(v1, v2, ..., vn)\nKhi có nhiều tham số, dùng dấu phẩy ngăn cách trong lệnh.\nKhi in ra màn hình, Python mặc định dùng dấu cách để ngăn cách các giá trị.' },
  { id:'10-16-lenh-07', cat:'lenh_python', type:'match',
    q:'Nối lệnh Python với kết quả in ra màn hình:',
    pairs:[
      { a:'print("Hello")',    b:'Hello' },
      { a:'print(5 + 3)',      b:'8' },
      { a:'print(2 * 3.0)',    b:'6.0' },
      { a:'print("A", "B")',   b:'A B' },
    ],
    explain:'• Chuỗi in ra không có dấu nháy\n• print(5+3): Python tính 5+3=8 rồi in\n• print(2*3.0): kết quả float → 6.0 (không phải 6)\n• print("A","B"): dấu phẩy → cách nhau bằng dấu cách' },
  { id:'10-16-thuc-01', cat:'thuc_hanh',
    q:'Trong Python, dòng bắt đầu bằng dấu # có ý nghĩa gì?',
    opts:['Đây là lỗi cú pháp','Đây là chú thích (comment), Python bỏ qua khi chạy','Đây là lệnh đặc biệt của hệ điều hành','Đây là tiêu đề của chương trình'],
    ans:1, explain:'Dấu # bắt đầu chú thích (comment). Python bỏ qua toàn bộ nội dung từ # đến cuối dòng khi chạy.\nChú thích giúp lập trình viên ghi chú giải thích code cho dễ đọc, hiểu.' },
  { id:'10-16-thuc-02', cat:'thuc_hanh',
    q:'Chương trình Bai1.py có lệnh: print("Xin chao!"). Khi chạy F5, kết quả là?',
    opts:['Xin chao!','"Xin chao!"','print(Xin chao!)','Không có kết quả gì'],
    ans:0, explain:'print("Xin chao!") in ra: Xin chao!\nKết quả xuất hiện trong cửa sổ Python Shell.\nDấu nháy chỉ là ký hiệu bao chuỗi trong code, không được in ra.' },
  { id:'10-16-thuc-03', cat:'thuc_hanh',
    q:'Khi lưu chương trình Python, tên file cần có đuôi gì?',
    opts:['.txt','.doc','.py','.python'],
    ans:2, explain:'File chương trình Python có đuôi .py (viết tắt của Python). Đây là quy ước chuẩn để IDLE và các công cụ khác nhận biết đây là file Python.' },
  { id:'10-16-thuc-04', cat:'thuc_hanh', type:'tl',
    q:'Hãy viết chương trình Python gồm ít nhất 3 lệnh print() để in ra thông tin cá nhân (họ tên, lớp, trường). Có chú thích giải thích.',
    explain:'Ví dụ chương trình:\n\n# Chương trình in thông tin cá nhân\nprint("Họ và tên: Nguyễn Văn A")\nprint("Lớp: 10A1")\nprint("Trường: THPT Nguyễn Du")\n\nLưu ý: lưu file với tên gợi nhớ như ThongTin.py' },
  { id:'10-16-thuc-05', cat:'thuc_hanh', type:'fill',
    q:'Trong Python, dòng bắt đầu bằng ___ là chú thích. Phím ___ dùng để chạy chương trình trong IDLE.',
    blanks:['#','F5'],
    explain:'# (dấu thăng/hash) bắt đầu dòng chú thích – Python bỏ qua khi thực thi.\nF5 là phím Run Module trong IDLE.' },
  { id:'10-16-vand-01', cat:'van_dung',
    q:'Cú pháp triple quotes (dấu nháy ba lần) trong Python dùng để làm gì?',
    opts:['In ra 3 dòng trống','Tạo chuỗi nhiều dòng (multi-line string)','Nhân chuỗi lên 3 lần','Tạo bình luận đặc biệt không thể xóa'],
    ans:1, explain:'Triple quotes (""" hoặc \'\'\') cho phép tạo chuỗi nhiều dòng.\nVí dụ:\n  msg = """Dòng 1\nDòng 2\nDòng 3"""\n  print(msg)\nRất hữu ích khi cần in đoạn văn bản dài có xuống dòng.' },
  { id:'10-16-vand-02', cat:'van_dung',
    q:'Vòng lặp  for i in range(5):  sẽ lặp bao nhiêu lần và i nhận những giá trị nào?',
    opts:['5 lần, i = 1, 2, 3, 4, 5','5 lần, i = 0, 1, 2, 3, 4','4 lần, i = 1, 2, 3, 4','Vô hạn lần'],
    ans:1, explain:'range(5) tạo dãy số từ 0 đến 4 (không bao gồm 5): 0, 1, 2, 3, 4.\nVòng lặp chạy 5 lần với i lần lượt nhận giá trị 0, 1, 2, 3, 4.\nĐây là quy ước "bắt đầu từ 0" của Python.' },
  { id:'10-16-vand-03', cat:'van_dung', type:'tl',
    q:'Viết chương trình Python dùng vòng lặp for để in ra dòng "Python thật thú vị!" 5 lần. Giải thích từng dòng code.',
    explain:'Chương trình:\n\n# In 5 lần câu "Python thật thú vị!"\nfor i in range(5):\n    print("Python thật thú vị!")\n\nGiải thích:\n• for i in range(5):  → bắt đầu vòng lặp 5 lần (i = 0,1,2,3,4)\n• Dòng bên trong PHẢI thụt lề (4 dấu cách hoặc Tab)\n• print(...) chạy 5 lần, mỗi lần in 1 dòng' },
  { id:'10-16-vand-04', cat:'van_dung', type:'fill',
    q:'Vòng lặp  for i in range(3):  chạy ___ lần với i lần lượt là ___.',
    blanks:['3','0, 1, 2'],
    explain:'range(n) tạo dãy từ 0 đến n-1. range(3) → 0, 1, 2 (3 phần tử).\nVòng lặp chạy 3 lần, không phải 4 hay 2.' },
  { id:'10-16-vand-05', cat:'van_dung', type:'match',
    q:'Nối khái niệm với mô tả đúng:',
    pairs:[
      { a:'NNLT bậc cao',     b:'Gần ngôn ngữ tự nhiên, dễ đọc, độc lập phần cứng' },
      { a:'Trình thông dịch', b:'Dịch và thực thi từng dòng lệnh (Python dùng loại này)' },
      { a:'Triple quotes',    b:'Tạo chuỗi nhiều dòng trong Python (""" hoặc \'\'\')' },
      { a:'range(n)',         b:'Tạo dãy số nguyên từ 0 đến n-1' },
    ],
    explain:'Bốn khái niệm quan trọng của Bài 16.\nNhớ: Python = NNLT bậc cao + thông dịch. Triple quotes và range() là đặc trưng cú pháp Python.' },
];

// ── State & core functions ──
let _cqData   = null;
let _cqLesson = (typeof LESSON_ID !== 'undefined' && LESSON_ID === 'b16') ? 'b16' : 'b17';
const CQ_LABELS = ['A', 'B', 'C', 'D'];

// ── Bản đồ Lớp → danh sách bài học ──
const CQ_GRADE_MAP = {
  '10': [
    { id: 'b16', label: 'Bài 16', subtitle: 'NNLT bậc cao & Python' },
    { id: 'b17', label: 'Bài 17', subtitle: 'Biến và Lệnh Gán' },
  ],
  '11': [],
  '12': [],
};

// ── Config từng bài (mở rộng thêm bài mới ở đây) ──
const _CQ_LESSON_CFGS = {
  b16: { cats: CQ_B16_CATS, lsKey: CQ_B16_LS_KEY, defaults: CQ_B16_DEFAULT_QUESTIONS, label: 'Bài 16' },
  b17: { cats: CQ_CATS,     lsKey: CQ_LS_KEY,      defaults: CQ_DEFAULT_QUESTIONS,     label: 'Bài 17' },
};

function _cqLessonCfg() {
  return _CQ_LESSON_CFGS[_cqLesson] || _CQ_LESSON_CFGS.b17;
}

function cq_loadData() {
  const cfg = _cqLessonCfg();
  try { const raw = localStorage.getItem(cfg.lsKey); if (raw) return JSON.parse(raw); } catch(e) {}
  return { questions: JSON.parse(JSON.stringify(cfg.defaults)) };
}

function cq_saveData(data) { localStorage.setItem(_cqLessonCfg().lsKey, JSON.stringify(data)); }
function cq_genId() { return 'cq' + Math.random().toString(36).slice(2, 9); }
function cq_getData() { if (!_cqData) _cqData = cq_loadData(); return _cqData; }
function cq_escHtml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function cq_parseBlanks(txt) {
  return (txt||'').split('\n').map(l=>l.trim()).filter(Boolean);
}

function cq_parsePairs(txt) {
  return (txt||'').split('\n').filter(l=>l.includes('|')).map(l=>{
    const [a,b] = l.split('|').map(s=>s.trim());
    return {a:a||'', b:b||''};
  }).filter(p=>p.a||p.b);
}

function cq_pairsToText(pairs) {
  return (pairs||[]).map(p=>`${p.a} | ${p.b}`).join('\n');
}

function cq_renderFillHtml(q, blankCls, ansCls, ansId) {
  blankCls = blankCls || 'cq-blank';
  ansCls   = ansCls   || 'cq-fill-answers';
  ansId    = ansId    || ('cq-opts-' + q.id);

  const blankedQ = cq_escHtml(q.q).replace(/___/g,
    `<span class="${blankCls}">___</span>`);
  let html = `<div class="cq-fill-q">${blankedQ}</div>`;

  if (q.blanks && q.blanks.length) {
    html += `<div class="${ansCls}" id="${ansId}">`;
    q.blanks.forEach((b, i) => {
      html += `<div class="cq-fill-ans-item">
        <span class="cq-fill-ans-num">${i+1}</span>
        <span class="cq-fill-ans-val">${cq_escHtml(b)}</span>
      </div>`;
    });
    html += '</div>';
  }
  return html;
}

function cq_renderMatchHtml(q, tableId, expId) {
  if (!q.pairs || !q.pairs.length) return '';
  tableId = tableId || ('cq-opts-' + q.id);
  expId   = expId   || ('cq-exp-' + q.id);

  const leftCol  = q.pairs.map((p,i) =>
    `<div class="cq-match-item"><span class="cq-match-lbl">${i+1}</span>${cq_escHtml(p.a)}</div>`).join('');
  const rightCol = q.pairs.map((p,i) =>
    `<div class="cq-match-item"><span class="cq-match-lbl">${String.fromCharCode(65+i)}</span>${cq_escHtml(p.b)}</div>`).join('');
  const ansTxt   = q.pairs.map((_,i)=>`${i+1}–${String.fromCharCode(65+i)}`).join(' · ');

  let html = `<div class="cq-match-table" id="${tableId}">
    <div class="cq-match-cols">
      <div><div class="cq-match-col-hdr">Cột A</div>${leftCol}</div>
      <div><div class="cq-match-col-hdr">Cột B</div>${rightCol}</div>
    </div>
    <div class="cq-match-ans-text">Đáp án: ${ansTxt}</div>
  </div>`;
  if (q.explain) html += `<div class="cq-explain" id="${expId}">${cq_escHtml(q.explain)}</div>`;
  return html;
}
