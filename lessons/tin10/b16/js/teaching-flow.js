/* ════════════════════════════════════════════════════════════
   TEACHING FLOW – Lộ trình Giảng Dạy Bài 16
   Ngôn ngữ lập trình bậc cao và Python
   Kết nối: Slide ↔ Câu hỏi ↔ Chọn người ↔ Code Playground
   TIẾT 1: Ôn tập → Khởi động → Mục 1 (NNLT) → Mục 2 (Môi trường)
   TIẾT 2: Mục 3 (print) → Thực hành → Luyện tập → Vận dụng → Tổng kết
════════════════════════════════════════════════════════════ */
TEACHING_STEPS = [

  /* ╔══════════════════════════════════════════════════════════╗
     ║         TIẾT 1  ·  ~45 PHÚT                            ║
     ╚══════════════════════════════════════════════════════════╝ */

  { phase:'ÔN TẬP', color:'#3a86ff',
    title:'Câu hỏi ôn tập bài trước',
    time:3, action:'cq', cqTab:0, slide:0, preset:null,
    script:'[Hộp câu hỏi – tab "Ôn tập bài trước"]\nBấm 📽 Trình chiếu → câu hỏi hiện toàn màn hình.\nNói: "Trước khi vào bài mới, thầy/cô kiểm tra nhanh kiến thức bài trước. Máy tính chỉ hiểu loại ngôn ngữ nào?"\n→ HS suy nghĩ 30 giây → Bấm Tiếp theo → quay chọn người.' },

  { phase:'ÔN TẬP', color:'#3a86ff',
    title:'Quay chọn người – Ôn tập bài cũ',
    time:2, action:'chon', cqTab:null, slide:0, preset:null,
    script:'[Spinner – Không trùng lặp]\nBấm ▶ Chọn tiếp → HS được chọn trả lời → GV nhận xét và chốt đáp án.\nNói: "Rất tốt! Hôm nay chúng ta học Bài 16 – Ngôn ngữ lập trình bậc cao và Python."\n→ Bấm Tiếp theo → khởi động.' },

  /* ─── KHỞI ĐỘNG ─── */
  { phase:'KHỞI ĐỘNG', color:'#ff9f1c',
    title:'So sánh ngôn ngữ máy, Assembly, Python',
    time:3, action:'slide', cqTab:null, slide:1, preset:null,
    script:'[Slide khởi động]\nHiển thị ba đoạn code cùng làm một việc (in "a"):\n  • Ngôn ngữ máy: 10110000 01100001...\n  • Assembly: MOV AL, 61h\n  • Python: print("a")\nNói: "Nhìn vào ba cách viết này, em thấy gì khác biệt?"\nHS thảo luận ngắn → GV kết nối: "Đây chính là lý do ra đời NNLT bậc cao!"\n→ Bấm Tiếp theo → câu hỏi.' },

  { phase:'KHỞI ĐỘNG', color:'#ff9f1c',
    title:'Câu hỏi thảo luận – Khởi động',
    time:2, action:'cq', cqTab:1, slide:1, preset:null,
    script:'[Hộp câu hỏi – tab "Khởi động"]\nBấm 📽 Trình chiếu → câu hỏi so sánh ngôn ngữ.\nNói: "Thảo luận cặp đôi 30 giây: Tại sao lập trình viên không dùng ngôn ngữ máy?"\n→ 1-2 HS trả lời → GV kết nối vào Mục 1.\n→ Bấm Tiếp theo.' },

  /* ─── MỤC 1: NNLT BẬC CAO ─── */
  { phase:'HÌNH THÀNH KIẾN THỨC', color:'#2ec4b6',
    title:'Mục 1 – NNLT bậc cao là gì?',
    time:4, action:'slide', cqTab:null, slide:2, preset:null,
    script:'[Slide "NNLT bậc cao"]\nDạy định nghĩa: NNLT bậc cao có câu lệnh gần với ngôn ngữ tự nhiên, dễ đọc, độc lập phần cứng.\nGiới thiệu Python:\n  • Tác giả: Guido van Rossum (Hà Lan), ra mắt năm 1991\n  • Đặc điểm: đơn giản, đa nền tảng, mã nguồn mở\n  • Ứng dụng: AI, khoa học dữ liệu, giáo dục\n→ Bấm Tiếp theo → chương trình dịch.' },

  { phase:'HÌNH THÀNH KIẾN THỨC', color:'#2ec4b6',
    title:'Chương trình dịch: Compiler vs Interpreter',
    time:3, action:'slide', cqTab:null, slide:2, preset:null,
    script:'[Slide "Chương trình dịch"]\nDạy hai loại:\n  • Compiler: dịch toàn bộ → file .exe → chạy. VD: C, C++\n  • Interpreter: dịch và chạy từng dòng. Python dùng cách này!\nNhấn mạnh: Python → dễ debug, thử nghiệm nhanh.\nHỏi: "Khi chạy Python, ai dịch code của chúng ta?"\n→ Bấm Tiếp theo → câu hỏi kiểm tra.' },

  { phase:'HÌNH THÀNH KIẾN THỨC', color:'#2ec4b6',
    title:'Câu hỏi kiểm tra – NNLT bậc cao',
    time:2, action:'cq', cqTab:2, slide:2, preset:null,
    script:'[Hộp câu hỏi – tab "NNLT bậc cao"]\nBấm 📽 Trình chiếu → câu hỏi về đặc điểm NNLT, lịch sử Python.\nHS suy nghĩ 20 giây → 1-2 bạn trả lời → Bấm Tiếp theo → quay chọn người.' },

  { phase:'HÌNH THÀNH KIẾN THỨC', color:'#2ec4b6',
    title:'Quay chọn người – NNLT bậc cao',
    time:1, action:'chon', cqTab:null, slide:2, preset:null,
    script:'[Spinner]\nHS giải thích sự khác biệt Compiler vs Interpreter.\nGV chốt: "Python là ngôn ngữ thông dịch – viết xong chạy ngay!"\n→ Bấm Tiếp theo → Mục 2.' },

  /* ─── MỤC 2: MÔI TRƯỜNG PYTHON ─── */
  { phase:'HÌNH THÀNH KIẾN THỨC', color:'#e71d36',
    title:'Mục 2 – Màn hình Python, dấu nhắc >>>',
    time:4, action:'slide', cqTab:null, slide:3, preset:null,
    script:'[Slide "Môi trường Python"]\nGiới thiệu IDLE:\n  • Cửa sổ Python Shell: dấu nhắc >>>\n  • Gõ lệnh trực tiếp → Enter → kết quả hiện ngay\nDemo: gõ 2+3, print("hello")\nNhấn mạnh: >>> nghĩa là Python đang chờ lệnh.\n→ Bấm Tiếp theo → chế độ soạn thảo.' },

  { phase:'HÌNH THÀNH KIẾN THỨC', color:'#e71d36',
    title:'Chế độ soạn thảo – File/New và F5',
    time:3, action:'slide', cqTab:null, slide:3, preset:null,
    script:'[Slide "Chế độ soạn thảo"]\nHướng dẫn:\n  1. File → New File (Ctrl+N)\n  2. Viết code nhiều dòng\n  3. Lưu: Ctrl+S → đặt tên .py\n  4. Chạy: F5\nDemo: tạo Hello.py → print("Hello!") → lưu → F5.\n→ Bấm Tiếp theo → câu hỏi.' },

  { phase:'HÌNH THÀNH KIẾN THỨC', color:'#e71d36',
    title:'Câu hỏi kiểm tra – Môi trường Python',
    time:2, action:'cq', cqTab:3, slide:3, preset:null,
    script:'[Hộp câu hỏi – tab "Môi trường Python"]\nBấm 📽 Trình chiếu → câu hỏi về >>>, F5, hai chế độ IDLE.\nHS suy nghĩ 20 giây → trả lời miệng.\n→ Bấm Tiếp theo → nghỉ giữa tiết.' },

  /* ─── NGHỈ GIỮA TIẾT ─── */
  { phase:'NGHỈ GIỮA TIẾT', color:'#718096',
    title:'Nghỉ giữa hai tiết (~5 phút)',
    time:5, action:'break', cqTab:null, slide:null, preset:null,
    script:'TIẾT 1 ĐÃ HOÀN THÀNH ✓\n━━━━━━━━━━━━━━━━━━━━━━━━━\nĐã dạy:\n  ✓ Ôn tập bài cũ (~5p)\n  ✓ Khởi động: so sánh 3 ngôn ngữ (~5p)\n  ✓ Mục 1: NNLT bậc cao, Python, chương trình dịch (~15p)\n  ✓ Mục 2: Môi trường IDLE, 2 chế độ (~15p)\n━━━━━━━━━━━━━━━━━━━━━━━━━\n⏸ NGHỈ GIỮA TIẾT ~5 PHÚT\n━━━━━━━━━━━━━━━━━━━━━━━━━\nTIẾT 2 SẮP BẮT ĐẦU →\n  Mục 3: Lệnh print()\n  Thực hành Bai1.py\n  Luyện tập · Vận dụng · Tổng kết' },

  /* ╔══════════════════════════════════════════════════════════╗
     ║         TIẾT 2  ·  ~45 PHÚT                            ║
     ╚══════════════════════════════════════════════════════════╝ */

  { phase:'ÔN ĐẦU TIẾT 2', color:'#4fc3f7',
    title:'Nhắc lại kiến thức Tiết 1',
    time:3, action:'slide', cqTab:null, slide:3, preset:null,
    script:'[Slide Mục 2]\nHỏi miệng nhanh:\n  • NNLT bậc cao là gì?\n  • Python do ai tạo, năm nào?\n  • >>> có nghĩa là gì?\n  • Phím nào chạy chương trình trong IDLE?\nHS trả lời → GV chốt nhanh.\n→ Bấm Tiếp theo → Mục 3.' },

  /* ─── MỤC 3: LỆNH PRINT() ─── */
  { phase:'HÌNH THÀNH KIẾN THỨC', color:'#9b5de5',
    title:'Mục 3 – Lệnh print(): cú pháp và ví dụ',
    time:5, action:'slide', cqTab:null, slide:4, preset:null,
    script:'[Slide "Lệnh print()"]\nDạy cú pháp: print(v1, v2, ..., vn)\n  • In chuỗi: print("Xin chào!")\n  • In số: print(42)\n  • In kết quả phép tính: print(3 + 7)\n  • In nhiều giá trị: print("Tổng:", 3+7)\nNhấn mạnh: chuỗi cần dấu nháy, số không cần.\n→ Demo trực tiếp → Bấm Tiếp theo → câu hỏi.' },

  { phase:'HÌNH THÀNH KIẾN THỨC', color:'#9b5de5',
    title:'Câu hỏi kiểm tra – Lệnh print()',
    time:2, action:'cq', cqTab:4, slide:4, preset:null,
    script:'[Hộp câu hỏi – tab "Lệnh print()"]\nBấm 📽 Trình chiếu → câu hỏi về kết quả lệnh print().\nHS tính nhẩm 20 giây → trả lời.\n→ Bấm Tiếp theo → quay chọn người.' },

  { phase:'HÌNH THÀNH KIẾN THỨC', color:'#9b5de5',
    title:'Quay chọn người – Lệnh print()',
    time:1, action:'chon', cqTab:null, slide:4, preset:null,
    script:'[Spinner]\nHS giải thích lệnh print() và cho ví dụ thực tế.\nGV chốt: "print() là cửa ngõ để chương trình giao tiếp với người dùng!"\n→ Bấm Tiếp theo → thực hành.' },

  /* ─── THỰC HÀNH: Bai1.py ─── */
  { phase:'THỰC HÀNH', color:'#06d6a0',
    title:'Hướng dẫn thực hành – Tạo Bai1.py',
    time:3, action:'slide', cqTab:null, slide:5, preset:null,
    script:'[Slide "Thực hành Bai1.py"]\nHướng dẫn 6 bước:\n  1. Mở IDLE → File → New File\n  2. Gõ: # Chuong trinh dau tien\n  3. Gõ: print("Xin chao!")\n  4. Lưu Ctrl+S → đặt tên Bai1.py\n  5. Nhấn F5 → xem kết quả trong Shell\nNhắc: dấu # là chú thích, Python bỏ qua.\n→ HS tự thực hành trên máy → Bấm Tiếp theo → demo playground.' },

  { phase:'THỰC HÀNH', color:'#06d6a0',
    title:'Demo Playground – Bai1.py và mở rộng',
    time:8, action:'code', cqTab:null, slide:5, preset:'demo_thuchanh',
    script:'[Playground mở – preset: demo_thuchanh]\nChạy mẫu Bai1.py từng bước:\n  # Chuong trinh dau tien\n  print("Xin chao!")\n  print("Toi la hoc sinh lop 10")\n  print("Chao mung den voi Python!")\nHS tự mở rộng: thêm dòng in thông tin cá nhân.\nGV khuyến khích thử thêm: print("Python " * 3)\n→ Bấm Tiếp theo → câu hỏi thực hành.' },

  { phase:'THỰC HÀNH', color:'#06d6a0',
    title:'Câu hỏi kiểm tra – Thực hành',
    time:2, action:'cq', cqTab:5, slide:5, preset:null,
    script:'[Hộp câu hỏi – tab "Thực hành"]\nBấm 📽 Trình chiếu → câu hỏi về comment #, kết quả in, lưu file .py.\nHS suy nghĩ 20 giây → trả lời → Bấm Tiếp theo → chọn người chữa bài.' },

  { phase:'THỰC HÀNH', color:'#06d6a0',
    title:'Quay chọn người – Chữa bài thực hành',
    time:2, action:'chon', cqTab:null, slide:5, preset:null,
    script:'[Spinner]\nHS đọc code của mình và giải thích từng dòng.\nGV nhận xét, chỉnh sửa lỗi thường gặp:\n  • Quên dấu nháy: print(Xin chao!) → lỗi\n  • Sai tên hàm: Print() hoặc PRINT() → lỗi\n→ Bấm Tiếp theo → luyện tập.' },

  /* ─── LUYỆN TẬP ─── */
  { phase:'LUYỆN TẬP', color:'#06d6a0',
    title:'Luyện tập – Bài tập SGK tr.89',
    time:5, action:'slide', cqTab:null, slide:6, preset:null,
    script:'[Slide "Luyện tập"]\nBài 1: Tính biểu thức (10+13, 20-7, 3*10-16, 12/5+13/6)\nBài 2: Phát hiện lỗi cú pháp (toán tử liền, dấu nháy lồng nhau)\nBài 3: Viết lệnh print() (bảng nhân, thông tin cá nhân)\nHS làm vào vở 3 phút → GV chốt đáp án.\n→ Bấm Tiếp theo → vận dụng.' },

  /* ─── VẬN DỤNG ─── */
  { phase:'VẬN DỤNG', color:'#f72585',
    title:'Vận dụng – Triple quotes và vòng lặp for',
    time:4, action:'slide', cqTab:null, slide:7, preset:null,
    script:'[Slide "Vận dụng"]\nTriple quotes:\n  print("""Khong co viec gi kho\nChi so long khong ben""")\nVòng lặp for:\n  for i in range(1, 11):\n      print("5 x", i, "=", 5*i)\n→ Demo → HS quan sát và thử tự làm.\n→ Bấm Tiếp theo → câu hỏi.' },

  { phase:'VẬN DỤNG', color:'#f72585',
    title:'Câu hỏi – Vận dụng',
    time:2, action:'cq', cqTab:6, slide:7, preset:null,
    script:'[Hộp câu hỏi – tab "Vận dụng"]\nBấm 📽 Trình chiếu → câu hỏi về triple quotes và range(n).\nHS tính nhẩm 20 giây → trả lời.\n→ Bấm Tiếp theo → tổng kết.' },

  /* ─── TỔNG KẾT ─── */
  { phase:'TỔNG KẾT', color:'#4cc9f0',
    title:'Tổng kết bài học Bài 16',
    time:3, action:'slide', cqTab:null, slide:8, preset:null,
    script:'[Slide tổng kết]\nXem lại 4 thẻ tổng kết:\n  🔤 NNLT bậc cao – gần ngôn ngữ tự nhiên, cần chương trình dịch\n  🐍 Python – Guido van Rossum, 1991, thông dịch\n  ⌨️ IDLE – dấu >>>, gõ trực tiếp, soạn thảo + F5\n  🖨️ print() – cú pháp print(v1,...,vn)\nGV đọc nhanh từng thẻ, HS đọc theo.\n→ Bấm Tiếp theo → câu hỏi củng cố cuối bài.' },

  { phase:'TỔNG KẾT', color:'#4cc9f0',
    title:'Quay chọn người – Tổng kết',
    time:2, action:'chon', cqTab:null, slide:8, preset:null,
    script:'[Spinner]\nHS trả lời câu hỏi tổng hợp về bài 16.\nGV nhận xét và đánh giá mức độ hiểu bài.\n→ Bấm Tiếp theo → dặn dò.' },

  { phase:'TỔNG KẾT', color:'#4cc9f0',
    title:'Dặn dò & Bài tập về nhà',
    time:2, action:'slide', cqTab:null, slide:8, preset:null,
    script:'BTVN: SGK Bài 16 – Luyện tập và Vận dụng.\n\nDặn dò:\n  ✎ Đọc lại toàn bộ Bài 16 SGK\n  💻 Thực hành: tạo file ThongTin.py in họ tên, lớp, trường\n  💻 Thực hành: tạo vòng lặp in câu yêu thích 10 lần\n  📖 Đọc trước Bài 17: Biến và Lệnh gán\n\nTiết sau: Bài 17 – Biến và Lệnh gán trong Python.' },

];
