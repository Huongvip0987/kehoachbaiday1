/* ════════════════════════════════════════════════════════════
   KỊCH BẢN – BÀI 16: NGÔN NGỮ LẬP TRÌNH BẬC CAO VÀ PYTHON
   Tin học 10 – KNTT | 2 tiết × 45 phút

   Tiết 1: Ôn tập → Khởi động → Mục 1 (NNLT bậc cao) → Mục 2 (Môi trường) → Nghỉ giữa tiết
   Tiết 2: Mục 3 (print) → Thực hành → Luyện tập → Vận dụng → Tổng kết & BTVN

   Luồng mỗi kiến thức: Slide dạy → Câu hỏi kiểm tra → Chọn người → Chốt
════════════════════════════════════════════════════════════ */

window.TEACHING_STEPS = [

  /* ╔══════════════════════════════════════════════════════════╗
     ║         TIẾT 1  ·  ~45 PHÚT                            ║
     ║  Ôn tập (5p) · Khởi động (5p) · Mục 1 (15p) · Mục 2 (15p) · Nghỉ (5p) ║
     ╚══════════════════════════════════════════════════════════╝ */

  /* ─── GIAI ĐOẠN 1 · ỔN ĐỊNH & ÔN TẬP BÀI CŨ · ~5 phút ─── */
  {
    phase: 'ÔN TẬP', color: '#3a86ff',
    title: 'Câu hỏi ôn tập bài trước',
    time: 3, action: 'cq', cqTab: 0, slide: 0, preset: null,
    script: '[Hộp câu hỏi – tab "Ôn tập bài trước"]\nBấm 📽 Trình chiếu → câu hỏi hiện toàn màn hình.\nNói: "Trước khi vào bài mới, thầy/cô kiểm tra nhanh kiến thức bài trước. Các em có 30 giây suy nghĩ."\nCâu hỏi gợi ý: "Máy tính chỉ hiểu loại ngôn ngữ nào? Assembly và ngôn ngữ máy khác nhau thế nào?"\n→ Bấm Tiếp theo → quay chọn người.'
  },

  {
    phase: 'ÔN TẬP', color: '#3a86ff',
    title: 'Quay chọn người – Ôn tập bài cũ',
    time: 2, action: 'chon', cqTab: null, slide: 0, preset: null,
    script: '[Spinner – Không trùng lặp]\nBấm ▶ Chọn tiếp → HS được chọn trả lời → GV nhận xét và chốt đáp án.\nNói: "Rất tốt! Hôm nay chúng ta học Bài 16 – giới thiệu về NNLT bậc cao và Python."\n→ Bấm Tiếp theo → khởi động.'
  },

  /* ─── GIAI ĐOẠN 2 · KHỞI ĐỘNG · ~5 phút ─── */
  {
    phase: 'KHỞI ĐỘNG', color: '#ff9f1c',
    title: 'So sánh ngôn ngữ máy, Assembly, Python (Slide 1)',
    time: 3, action: 'slide', cqTab: null, slide: 1, preset: null,
    script: '[Slide khởi động – so sánh 3 ngôn ngữ]\nHiển thị ví dụ cùng một bài toán viết bằng:\n  • Ngôn ngữ máy: 10110000 01100001...\n  • Assembly: MOV AL, 61h\n  • Python: print("a")\nNói: "Nhìn vào ba cách viết này, em thấy gì khác biệt?"\nHS thảo luận ngắn → GV kết nối: "Đây chính là lý do ra đời NNLT bậc cao."\n→ Bấm Tiếp theo → câu hỏi thảo luận.'
  },

  {
    phase: 'KHỞI ĐỘNG', color: '#ff9f1c',
    title: 'Câu hỏi thảo luận – Khởi động',
    time: 2, action: 'cq', cqTab: 1, slide: 1, preset: null,
    script: '[Hộp câu hỏi – tab "Khởi động"]\nBấm 📽 Trình chiếu → câu hỏi so sánh ngôn ngữ.\nNói: "Thảo luận cặp đôi 30 giây: Tại sao lập trình viên không dùng ngôn ngữ máy?"\n→ 1-2 HS trả lời → GV kết nối vào Mục 1.\n→ Bấm Tiếp theo → hình thành kiến thức Mục 1.'
  },

  /* ─── GIAI ĐOẠN 3 · MỤC 1: NNLT BẬC CAO · ~15 phút ─── */
  {
    phase: 'HÌNH THÀNH KIẾN THỨC', color: '#2ec4b6',
    title: 'Mục 1 – NNLT bậc cao là gì? (Slide 2)',
    time: 4, action: 'slide', cqTab: null, slide: 2, preset: null,
    script: '[Slide "NNLT bậc cao"]\nDạy định nghĩa: NNLT bậc cao là ngôn ngữ gần với ngôn ngữ tự nhiên, dễ học, dễ đọc, độc lập phần cứng.\nGiới thiệu Python:\n  • Tác giả: Guido van Rossum (Hà Lan)\n  • Ra đời: 1991\n  • Đặc điểm: đơn giản, đa năng, cộng đồng lớn\nNhắc các NNLT bậc cao khác: C, Java, JavaScript...\n→ Bấm Tiếp theo → chương trình dịch.'
  },

  {
    phase: 'HÌNH THÀNH KIẾN THỨC', color: '#2ec4b6',
    title: 'Chương trình dịch: Compiler vs Interpreter (Slide 2)',
    time: 3, action: 'slide', cqTab: null, slide: 2, preset: null,
    script: '[Slide "Chương trình dịch"]\nDạy hai loại chương trình dịch:\n  • Trình biên dịch (Compiler): dịch toàn bộ → file thực thi → chạy. VD: C, C++\n  • Trình thông dịch (Interpreter): dịch và chạy từng dòng. VD: Python\nNhấn mạnh: Python dùng THÔNG DỊCH → dễ debug, thử nghiệm nhanh.\nHỏi: "Khi chạy Python, ai dịch code của chúng ta?"\n→ Bấm Tiếp theo → câu hỏi kiểm tra.'
  },

  {
    phase: 'HÌNH THÀNH KIẾN THỨC', color: '#2ec4b6',
    title: 'Câu hỏi kiểm tra – NNLT bậc cao',
    time: 2, action: 'cq', cqTab: 2, slide: 2, preset: null,
    script: '[Hộp câu hỏi – tab "NNLT bậc cao"]\nBấm 📽 Trình chiếu → câu hỏi về đặc điểm NNLT bậc cao, lịch sử Python, chương trình dịch.\nHS suy nghĩ 20 giây → 1-2 bạn trả lời.\n→ Bấm Tiếp theo → quay chọn người.'
  },

  {
    phase: 'HÌNH THÀNH KIẾN THỨC', color: '#2ec4b6',
    title: 'Quay chọn người – NNLT bậc cao',
    time: 1, action: 'chon', cqTab: null, slide: 2, preset: null,
    script: '[Spinner – Không trùng lặp]\nBấm ▶ Chọn tiếp → HS được chọn giải thích sự khác biệt trình biên dịch vs thông dịch.\nGV chốt: "Python là ngôn ngữ thông dịch – viết xong chạy ngay, rất tiện để học!"\n→ Bấm Tiếp theo → Mục 2.'
  },

  /* ─── GIAI ĐOẠN 4 · MỤC 2: MÔI TRƯỜNG PYTHON · ~15 phút ─── */
  {
    phase: 'HÌNH THÀNH KIẾN THỨC', color: '#e71d36',
    title: 'Mục 2 – Môi trường Python IDLE (Slide 3)',
    time: 4, action: 'slide', cqTab: null, slide: 3, preset: null,
    script: '[Slide "Môi trường Python"]\nGiới thiệu IDLE (Integrated Development and Learning Environment):\n  • Cửa sổ Python Shell: dấu nhắc >>>\n  • Gõ lệnh trực tiếp → Enter → kết quả hiện ngay\nDemo tương tác: gõ 2+3, rồi gõ print("hello")\nNhấn mạnh: >>> nghĩa là Python đang chờ lệnh.\n→ Bấm Tiếp theo → chế độ soạn thảo.'
  },

  {
    phase: 'HÌNH THÀNH KIẾN THỨC', color: '#e71d36',
    title: 'Chế độ soạn thảo – File/New và F5 (Slide 3)',
    time: 3, action: 'slide', cqTab: null, slide: 3, preset: null,
    script: '[Slide "Chế độ soạn thảo"]\nDạy cách tạo chương trình:\n  1. File → New File (Ctrl+N)\n  2. Viết code trong cửa sổ soạn thảo\n  3. Lưu: Ctrl+S → đặt tên .py\n  4. Chạy: F5 (Run Module)\n  → Kết quả hiện trong Python Shell\nDemo minh họa: tạo Hello.py, viết print("Hello!"), lưu, F5.\n→ Bấm Tiếp theo → câu hỏi kiểm tra.'
  },

  {
    phase: 'HÌNH THÀNH KIẾN THỨC', color: '#e71d36',
    title: 'Câu hỏi kiểm tra – Môi trường Python',
    time: 2, action: 'cq', cqTab: 3, slide: 3, preset: null,
    script: '[Hộp câu hỏi – tab "Môi trường Python"]\nBấm 📽 Trình chiếu → câu hỏi về dấu >>>, F5, hai chế độ IDLE.\nHS suy nghĩ 20 giây → trả lời miệng.\n→ Bấm Tiếp theo → nghỉ giữa tiết.'
  },

  /* ╔══════════════════════════════════════════════════════════╗
     ║  ── NGHỈ GIỮA TIẾT ── KẾT THÚC TIẾT 1 / TIẾT 2 ──     ║
     ╚══════════════════════════════════════════════════════════╝ */
  {
    phase: 'NGHỈ GIỮA TIẾT', color: '#718096',
    title: 'Nghỉ giữa hai tiết (~5 phút)',
    time: 5, action: 'break', cqTab: null, slide: null, preset: null,
    script: 'TIẾT 1 ĐÃ HOÀN THÀNH ✓\n━━━━━━━━━━━━━━━━━━━━━━━━━\nĐã dạy:\n  ✓ Ôn tập bài cũ (~5p)\n  ✓ Khởi động: so sánh 3 ngôn ngữ (~5p)\n  ✓ Mục 1: NNLT bậc cao, Python, chương trình dịch (~15p)\n  ✓ Mục 2: Môi trường IDLE, 2 chế độ (~15p)\n━━━━━━━━━━━━━━━━━━━━━━━━━\n⏸ NGHỈ GIỮA TIẾT ~5 PHÚT\n━━━━━━━━━━━━━━━━━━━━━━━━━\nTIẾT 2 SẮP BẮT ĐẦU →\n  Mục 3: Lệnh print()\n  Thực hành Bai1.py\n  Luyện tập · Vận dụng · Tổng kết'
  },

  /* ╔══════════════════════════════════════════════════════════╗
     ║         TIẾT 2  ·  ~45 PHÚT                            ║
     ║  Ôn đầu tiết (5p) · Mục 3 (10p) · Thực hành (15p)     ║
     ║  Luyện tập (5p) · Vận dụng (5p) · Tổng kết (5p)       ║
     ╚══════════════════════════════════════════════════════════╝ */

  /* ─── GIAI ĐOẠN 5 · ÔN ĐẦU TIẾT 2 · ~5 phút ─── */
  {
    phase: 'ÔN ĐẦU TIẾT 2', color: '#4fc3f7',
    title: 'Nhắc lại kiến thức Tiết 1',
    time: 2, action: 'slide', cqTab: null, slide: 3, preset: null,
    script: '[Quay về Slide 3 – tóm tắt Mục 1 & 2]\nNói: "Tiết 2 bắt đầu! Nhắc nhanh tiết 1:"\nHỏi miệng:\n  • NNLT bậc cao là gì?\n  • Python do ai tạo, năm nào?\n  • >>> có nghĩa là gì?\n  • Phím nào chạy chương trình trong IDLE?\nHS trả lời → GV chốt nhanh.\n→ Bấm Tiếp theo → câu hỏi ôn đầu tiết.'
  },

  {
    phase: 'ÔN ĐẦU TIẾT 2', color: '#4fc3f7',
    title: 'Câu hỏi ôn nhanh đầu Tiết 2',
    time: 3, action: 'cq', cqTab: 3, slide: 3, preset: null,
    script: '[Hộp câu hỏi – tab "Môi trường Python"]\nBấm 📽 Trình chiếu → câu hỏi ôn tập Mục 1 và Mục 2.\nHS suy nghĩ 30 giây → không cần spinner, mời tự nguyện trả lời.\n→ Bấm Tiếp theo → Mục 3.'
  },

  /* ─── GIAI ĐOẠN 6 · MỤC 3: LỆNH PRINT() · ~10 phút ─── */
  {
    phase: 'HÌNH THÀNH KIẾN THỨC', color: '#9b5de5',
    title: 'Mục 3 – Hàm print(): cú pháp cơ bản (Slide 4)',
    time: 4, action: 'slide', cqTab: null, slide: 4, preset: null,
    script: '[Slide "Hàm print()"]\nDạy cú pháp: print(v1, v2, ..., vn)\n  • In chuỗi: print("Xin chào!")\n  • In số: print(42) hoặc print(3.14)\n  • In kết quả phép tính: print(3 + 5)\n  • In nhiều giá trị: print("Tổng:", 3+5)\nNhấn mạnh: dấu nháy cho chuỗi, không có dấu nháy cho số.\nDemo trực tiếp trong Python Shell.\n→ Bấm Tiếp theo → câu hỏi kiểm tra.'
  },

  {
    phase: 'HÌNH THÀNH KIẾN THỨC', color: '#9b5de5',
    title: 'Câu hỏi kiểm tra – Hàm print()',
    time: 2, action: 'cq', cqTab: 4, slide: 4, preset: null,
    script: '[Hộp câu hỏi – tab "Lệnh print()"]\nBấm 📽 Trình chiếu → câu hỏi về kết quả lệnh print(), cú pháp đúng.\nHS tính nhẩm 20 giây → trả lời.\n→ Bấm Tiếp theo → quay chọn người.'
  },

  {
    phase: 'HÌNH THÀNH KIẾN THỨC', color: '#9b5de5',
    title: 'Quay chọn người – Lệnh print()',
    time: 1, action: 'chon', cqTab: null, slide: 4, preset: null,
    script: '[Spinner – Không trùng lặp]\nBấm ▶ Chọn tiếp → HS giải thích lệnh print() và cho ví dụ.\nGV chốt: "print() là cửa ngõ để chương trình giao tiếp với người dùng!"\n→ Bấm Tiếp theo → thực hành.'
  },

  /* ─── GIAI ĐOẠN 7 · THỰC HÀNH: Bai1.py · ~15 phút ─── */
  {
    phase: 'THỰC HÀNH', color: '#06d6a0',
    title: 'Hướng dẫn thực hành – Tạo Bai1.py (Slide 5)',
    time: 3, action: 'slide', cqTab: null, slide: 5, preset: null,
    script: '[Slide "Thực hành Bai1.py"]\nHướng dẫn từng bước:\n  1. Mở IDLE → File → New File\n  2. Gõ: # Chuong trinh dau tien\n  3. Gõ: print("Xin chao!")\n  4. Lưu Ctrl+S → đặt tên Bai1.py\n  5. Nhấn F5 → xem kết quả\nNhắc: dấu # là chú thích, Python bỏ qua khi chạy.\n→ HS tự thực hành trên máy → GV đi hỗ trợ.\n→ Bấm Tiếp theo → demo playground.'
  },

  {
    phase: 'THỰC HÀNH', color: '#06d6a0',
    title: 'Demo Playground – Bai1.py và mở rộng',
    time: 8, action: 'code', cqTab: null, slide: 5, preset: 'demo_b16_bai1',
    script: '[Playground mở]\nChạy mẫu Bai1.py:\n  # Chuong trinh dau tien\n  print("Xin chao!")\n  print("Em hoc Python!")\n  print("2 + 3 =", 2 + 3)\nHS tự mở rộng: thêm dòng in thông tin cá nhân (họ tên, lớp).\nGV khuyến khích thử: print("Python" * 3) → xem kết quả bất ngờ!\n→ Bấm Tiếp theo → câu hỏi thực hành.'
  },

  {
    phase: 'THỰC HÀNH', color: '#06d6a0',
    title: 'Câu hỏi kiểm tra – Thực hành',
    time: 2, action: 'cq', cqTab: 5, slide: 5, preset: null,
    script: '[Hộp câu hỏi – tab "Thực hành"]\nBấm 📽 Trình chiếu → câu hỏi về comment, kết quả in, lưu file.\nHS suy nghĩ 20 giây → trả lời.\n→ Bấm Tiếp theo → chọn người chữa bài.'
  },

  {
    phase: 'THỰC HÀNH', color: '#06d6a0',
    title: 'Quay chọn người – Chữa bài thực hành',
    time: 2, action: 'chon', cqTab: null, slide: 5, preset: null,
    script: '[Spinner – Không trùng lặp]\nQuay 1-2 lần. HS được chọn đọc code của mình và giải thích.\nGV nhận xét, chỉnh sửa lỗi thường gặp:\n  • Quên dấu nháy: print(Xin chao!) → lỗi\n  • Sai tên hàm: Print() hoặc PRINT() → lỗi\n→ Bấm Tiếp theo → luyện tập.'
  },

  /* ─── GIAI ĐOẠN 8 · LUYỆN TẬP · ~5 phút ─── */
  {
    phase: 'LUYỆN TẬP', color: '#06d6a0',
    title: 'Luyện tập – Tính biểu thức và phát hiện lỗi (Slide 6)',
    time: 5, action: 'slide', cqTab: null, slide: 6, preset: null,
    script: '[Slide "Luyện tập"]\nBài tập 1: Tính kết quả của các lệnh print():\n  • print(10 - 3 * 2)  → ?\n  • print(7 // 2)       → ?\n  • print(7 % 2)        → ?\nBài tập 2: Phát hiện lỗi cú pháp:\n  • print("hello)      ← lỗi ở đâu?\n  • PRINT("hello")     ← lỗi ở đâu?\n  • print(hello)       ← lỗi ở đâu?\nHS làm vào vở 3 phút → GV chốt đáp án.\n→ Bấm Tiếp theo → vận dụng.'
  },

  /* ─── GIAI ĐOẠN 9 · VẬN DỤNG · ~5 phút ─── */
  {
    phase: 'VẬN DỤNG', color: '#f72585',
    title: 'Vận dụng – Triple quotes và for loop (Slide 7)',
    time: 4, action: 'slide', cqTab: null, slide: 7, preset: null,
    script: '[Slide "Vận dụng"]\nMở rộng 1 – Triple quotes:\n  msg = """Xin chào!\nChào mừng đến với Python.\nHẹn gặp lại!"""\n  print(msg)\nMở rộng 2 – Vòng lặp for:\n  for i in range(5):\n      print("Python thật hay!")\n→ Demo trực tiếp → HS quan sát và thử tự làm.\n→ Bấm Tiếp theo → câu hỏi vận dụng.'
  },

  {
    phase: 'VẬN DỤNG', color: '#f72585',
    title: 'Câu hỏi – Vận dụng',
    time: 2, action: 'cq', cqTab: 6, slide: 7, preset: null,
    script: '[Hộp câu hỏi – tab "Vận dụng"]\nBấm 📽 Trình chiếu → câu hỏi về triple quotes và range(n).\nHS tính nhẩm 20 giây → trả lời.\n→ Bấm Tiếp theo → tổng kết.'
  },

  /* ─── GIAI ĐOẠN 10 · TỔNG KẾT & DẶN DÒ · ~5 phút ─── */
  {
    phase: 'TỔNG KẾT', color: '#4cc9f0',
    title: 'Tổng kết bài học Bài 16 (Slide 8)',
    time: 3, action: 'slide', cqTab: null, slide: 8, preset: null,
    script: '[Slide tổng kết]\nXem lại 4 thẻ tổng kết:\n  🌐 NNLT bậc cao – gần ngôn ngữ tự nhiên, cần chương trình dịch\n  🐍 Python – Guido van Rossum, 1991, thông dịch\n  🖥 IDLE – dấu >>>, gõ trực tiếp, soạn thảo + F5\n  📺 print() – cú pháp print(v1,...,vn), in nhiều kiểu dữ liệu\nGV đọc nhanh từng thẻ, HS đọc theo.\n→ Bấm Tiếp theo → câu hỏi củng cố cuối bài.'
  },

  {
    phase: 'TỔNG KẾT', color: '#4cc9f0',
    title: 'Câu hỏi củng cố cuối bài',
    time: 2, action: 'cq', cqTab: 2, slide: 8, preset: null,
    script: '[Hộp câu hỏi – tab "NNLT bậc cao"]\nBấm 📽 Trình chiếu → câu hỏi tổng hợp về nội dung bài 16.\nHS suy nghĩ 30 giây → trả lời miệng.\n→ Bấm Tiếp theo → quay chọn người.'
  },

  {
    phase: 'TỔNG KẾT', color: '#4cc9f0',
    title: 'Quay chọn người – Tổng kết',
    time: 2, action: 'chon', cqTab: null, slide: 8, preset: null,
    script: '[Spinner – Không trùng lặp]\nBấm ▶ Chọn tiếp → HS trả lời câu hỏi tổng hợp.\nGV nhận xét và đánh giá mức độ hiểu bài.\n→ Bấm Tiếp theo → dặn dò.'
  },

  {
    phase: 'TỔNG KẾT', color: '#4cc9f0',
    title: 'Dặn dò & Bài tập về nhà',
    time: 2, action: 'slide', cqTab: null, slide: 8, preset: null,
    script: 'BTVN: SGK Bài 16 – Luyện tập và Vận dụng.\n\nDặn dò:\n  ✎ Đọc lại toàn bộ Bài 16 SGK\n  💻 Thực hành: tạo file ThongTin.py in họ tên, lớp, trường\n  💻 Thực hành: tạo vòng lặp in câu yêu thích 10 lần\n  📖 Đọc trước Bài 17: Biến và Lệnh gán\n\nTiết sau: Bài 17 – Biến và Lệnh gán trong Python.\nKhuyến khích: cài Python + IDLE tại nhà, thử gõ thêm lệnh!'
  },

];
