// ══════════════════════════════════════════════════════════════
// CÂU HỎI ÔN TẬP – BÀI 16: NGÔN NGỮ LẬP TRÌNH BẬC CAO VÀ PYTHON
// ══════════════════════════════════════════════════════════════

window.CQ_DATA = {

  categories: [
    { id: 'ontap_truoc',  label: '📖 Ôn tập bài trước', color: '#3a86ff' },
    { id: 'khoi_dong',    label: '⚡ Khởi động',          color: '#ff9f1c' },
    { id: 'nnlt_bac_cao', label: '🌐 NNLT bậc cao',       color: '#2ec4b6' },
    { id: 'moi_truong',   label: '🖥 Môi trường Python',  color: '#e71d36' },
    { id: 'lenh_python',  label: '🐍 Lệnh print()',        color: '#9b5de5' },
    { id: 'thuc_hanh',    label: '🛠 Thực hành',           color: '#06d6a0' },
    { id: 'van_dung',     label: '🚀 Vận dụng',            color: '#f72585' },
  ],

  questions: [

    // ══════════════════════════════════════════════════════
    // ÔN TẬP BÀI TRƯỚC
    // ══════════════════════════════════════════════════════
    { id:'q001', cat:'ontap_truoc',
      q:'Máy tính chỉ hiểu và thực hiện trực tiếp loại ngôn ngữ nào?',
      opts:['Ngôn ngữ tự nhiên (tiếng Việt)','Ngôn ngữ máy (dãy bit 0 và 1)','Ngôn ngữ Python','Ngôn ngữ C++'],
      ans:1,
      explain:'Máy tính chỉ hiểu ngôn ngữ máy – biểu diễn bằng các bit 0 và 1. Mọi ngôn ngữ khác đều phải được dịch sang ngôn ngữ máy trước khi thực thi.' },

    { id:'q002', cat:'ontap_truoc',
      q:'Chương trình máy tính được tạo ra để làm gì?',
      opts:['Chỉ để hiển thị văn bản trên màn hình','Giải quyết bài toán theo từng bước bằng các lệnh','Thay thế phần cứng của máy tính','Kết nối máy tính với Internet'],
      ans:1,
      explain:'Chương trình máy tính là dãy các lệnh được sắp xếp để giải quyết bài toán cụ thể theo một trình tự xác định.' },

    { id:'q003', cat:'ontap_truoc',
      q:'Ngôn ngữ assembly khác ngôn ngữ máy ở điểm nào?',
      opts:['Assembly dùng các từ gợi nhớ (ADD, MOV...) thay cho mã nhị phân','Assembly không cần dịch sang ngôn ngữ máy','Assembly chạy nhanh hơn ngôn ngữ máy','Assembly là ngôn ngữ bậc cao'],
      ans:0,
      explain:'Assembly dùng các từ gợi nhớ (mnemonic) như ADD, MOV, JMP thay cho chuỗi bit khó nhớ. Tuy nhiên vẫn phụ thuộc kiến trúc phần cứng và cần chương trình hợp dịch (assembler) để dịch sang ngôn ngữ máy.' },

    // ── TỰ LUẬN: Ôn tập bài trước ──
    { id:'q100', cat:'ontap_truoc', type:'tl',
      q:'Em hãy phân biệt ba tầng ngôn ngữ lập trình: ngôn ngữ máy, assembly, và ngôn ngữ bậc cao. Mỗi loại cho một đặc điểm nổi bật.',
      explain:'1. Ngôn ngữ máy: biểu diễn bằng dãy bit 0/1, máy tính hiểu trực tiếp, rất khó đọc với con người.\n\n2. Assembly: dùng từ gợi nhớ (ADD, MOV...), dễ đọc hơn ngôn ngữ máy, cần chương trình hợp dịch (assembler), vẫn phụ thuộc phần cứng.\n\n3. NNLT bậc cao (Python, C, Java...): gần ngôn ngữ tự nhiên, dễ học, độc lập phần cứng, cần trình biên dịch hoặc thông dịch.' },

    // ══════════════════════════════════════════════════════
    // KHỞI ĐỘNG
    // ══════════════════════════════════════════════════════
    { id:'q004', cat:'khoi_dong',
      q:'Tại sao lập trình viên ít dùng ngôn ngữ máy để viết chương trình?',
      opts:['Vì máy tính không hiểu ngôn ngữ máy','Vì ngôn ngữ máy chạy chậm hơn Python','Vì ngôn ngữ máy rất khó đọc, khó viết và phụ thuộc phần cứng','Vì ngôn ngữ máy không có lệnh in ra màn hình'],
      ans:2,
      explain:'Ngôn ngữ máy chỉ có 0 và 1, cực kỳ khó đọc và viết, dễ mắc lỗi, lại phụ thuộc kiến trúc từng loại CPU → lập trình viên chuyển sang dùng NNLT bậc cao cho hiệu quả hơn.' },

    { id:'q005', cat:'khoi_dong',
      q:'Assembly được gọi là "ngôn ngữ bậc thấp" vì lý do nào sau đây?',
      opts:['Vì chất lượng chương trình viết bằng assembly thấp hơn','Vì assembly gần với phần cứng, phụ thuộc kiến trúc máy tính','Vì assembly ít phổ biến hơn Python','Vì assembly không thể tính toán số học'],
      ans:1,
      explain:'"Bậc thấp" không có nghĩa là kém hơn, mà chỉ mức độ trừu tượng thấp – assembly gần với phần cứng, mỗi lệnh thường tương ứng với một lệnh máy, và chương trình viết cho loại CPU này thường không chạy được trên loại CPU khác.' },

    // ── TỰ LUẬN: Khởi động ──
    { id:'q101', cat:'khoi_dong', type:'tl',
      q:'Nếu em phải chọn viết một trò chơi máy tính, em sẽ chọn ngôn ngữ nào: ngôn ngữ máy, assembly hay Python? Giải thích lý do.',
      explain:'Nên chọn ngôn ngữ bậc cao như Python (hoặc C, Java...).\n\nLý do:\n• Dễ đọc, dễ viết và dễ sửa lỗi\n• Có nhiều thư viện hỗ trợ làm game (pygame...)\n• Không cần biết chi tiết phần cứng\n• Chương trình ngắn gọn hơn nhiều so với viết bằng assembly hay ngôn ngữ máy\n• Cộng đồng lớn, nhiều tài liệu hướng dẫn\n\nNgôn ngữ máy và assembly chỉ phù hợp khi cần tối ưu hiệu năng rất cao hoặc lập trình nhúng trực tiếp với phần cứng.' },

    // ══════════════════════════════════════════════════════
    // NNLT BẬC CAO
    // ══════════════════════════════════════════════════════
    { id:'q006', cat:'nnlt_bac_cao',
      q:'Đặc điểm nào sau đây là của NNLT bậc cao?',
      opts:['Chỉ dùng các số 0 và 1','Gần ngôn ngữ tự nhiên, dễ đọc và dễ học','Phụ thuộc hoàn toàn vào kiến trúc CPU','Không cần dịch sang ngôn ngữ máy'],
      ans:1,
      explain:'NNLT bậc cao (Python, Java, C...) sử dụng từ ngữ gần với tiếng Anh tự nhiên, có cấu trúc rõ ràng, giúp lập trình viên tập trung vào giải thuật thay vì chi tiết phần cứng. Tuy nhiên vẫn cần chương trình dịch để chuyển sang ngôn ngữ máy.' },

    { id:'q007', cat:'nnlt_bac_cao',
      q:'Python được tạo ra bởi ai, vào năm nào và ở quốc gia nào?',
      opts:['Bill Gates – Mỹ – 1985','Guido van Rossum – Hà Lan – 1991','Linus Torvalds – Phần Lan – 1991','Dennis Ritchie – Mỹ – 1972'],
      ans:1,
      explain:'Python do Guido van Rossum (người Hà Lan) tạo ra năm 1991. Tên Python lấy cảm hứng từ chương trình hài "Monty Python\'s Flying Circus" – không phải con rắn python.' },

    { id:'q008', cat:'nnlt_bac_cao',
      q:'Chương trình dịch có vai trò gì trong ngôn ngữ lập trình bậc cao?',
      opts:['Kiểm tra chính tả tiếng Anh trong code','Chuyển mã nguồn bậc cao thành dạng máy tính thực thi được','Tự động viết code thay cho lập trình viên','Kết nối máy tính với Internet'],
      ans:1,
      explain:'Chương trình dịch nhận mã nguồn (source code) viết bằng NNLT bậc cao và chuyển thành ngôn ngữ máy hoặc mã trung gian để máy tính thực thi. Có hai loại chính: trình biên dịch (compiler) và trình thông dịch (interpreter).' },

    { id:'q009', cat:'nnlt_bac_cao',
      q:'Python sử dụng loại chương trình dịch nào?',
      opts:['Trình biên dịch (compiler) – dịch toàn bộ rồi mới chạy','Trình hợp dịch (assembler)','Trình thông dịch (interpreter) – dịch và chạy từng dòng','Không cần dịch vì Python là ngôn ngữ máy'],
      ans:2,
      explain:'Python là ngôn ngữ thông dịch (interpreted): trình thông dịch đọc và thực thi từng dòng lệnh theo thứ tự. Điều này giúp dễ thử nghiệm và debug, nhưng thường chậm hơn ngôn ngữ biên dịch như C.' },

    // ── TỰ LUẬN: NNLT bậc cao ──
    { id:'q102', cat:'nnlt_bac_cao', type:'tl',
      q:'Hãy giải thích sự khác biệt giữa trình biên dịch (compiler) và trình thông dịch (interpreter). Python thuộc loại nào?',
      explain:'Trình biên dịch (Compiler):\n• Đọc toàn bộ chương trình nguồn và dịch HOÀN TOÀN sang ngôn ngữ máy TRƯỚC khi chạy\n• Tạo ra file thực thi (.exe)\n• Ví dụ: C, C++, Pascal\n• Ưu điểm: chạy nhanh\n\nTrình thông dịch (Interpreter):\n• Đọc và thực thi từng dòng lệnh theo thứ tự\n• Không tạo file thực thi độc lập\n• Ví dụ: Python, JavaScript\n• Ưu điểm: dễ debug, thử nghiệm nhanh\n\n→ Python dùng trình THÔNG DỊCH.' },

    // ── ĐIỀN CHỖ TRỐNG: NNLT bậc cao ──
    { id:'qf001', cat:'nnlt_bac_cao', type:'fill',
      q:'Python được tạo bởi ___ vào năm ___, là ngôn ngữ lập trình ___.',
      blanks:['Guido van Rossum','1991','bậc cao'],
      explain:'Ba thông tin quan trọng về lịch sử Python: tác giả Guido van Rossum (Hà Lan), năm 1991, và đây là NNLT bậc cao – gần ngôn ngữ tự nhiên, dễ học.' },

    // ══════════════════════════════════════════════════════
    // MÔI TRƯỜNG PYTHON
    // ══════════════════════════════════════════════════════
    { id:'q010', cat:'moi_truong',
      q:'Dấu nhắc ">>>" trong cửa sổ Python Shell cho biết điều gì?',
      opts:['Python đang bị lỗi','Python đang sẵn sàng nhận lệnh từ người dùng','Python đang chạy chương trình','Python đang kết nối Internet'],
      ans:1,
      explain:'Dấu nhắc >>> (dấu lớn hơn gõ 3 lần) là dấu hiệu Python Shell đang ở chế độ chờ, sẵn sàng nhận và thực hiện lệnh. Đây là chế độ tương tác (interactive mode).' },

    { id:'q011', cat:'moi_truong',
      q:'Trong môi trường IDLE của Python, có mấy chế độ làm việc chính?',
      opts:['1 chế độ: chỉ gõ lệnh trực tiếp','2 chế độ: gõ lệnh trực tiếp và soạn thảo chương trình','3 chế độ: view, edit, và run','4 chế độ tương ứng 4 loại file'],
      ans:1,
      explain:'IDLE có 2 chế độ chính:\n1. Chế độ tương tác (Interactive): gõ lệnh tại dấu >>> và Enter để chạy ngay\n2. Chế độ soạn thảo (Script editor): mở File → New File, viết nhiều lệnh, lưu .py, chạy bằng F5' },

    { id:'q012', cat:'moi_truong',
      q:'Để chạy chương trình Python đã lưu trong IDLE, ta nhấn phím nào?',
      opts:['Enter','Ctrl+S','F5','F1'],
      ans:2,
      explain:'F5 (Run Module) là phím tắt để chạy toàn bộ chương trình trong IDLE. Ctrl+S dùng để lưu file. Enter chỉ chạy từng dòng ở chế độ tương tác.' },

    // ── TỰ LUẬN: Môi trường ──
    { id:'q103', cat:'moi_truong', type:'tl',
      q:'Mô tả các bước để tạo và chạy chương trình Python đầu tiên trong IDLE.',
      explain:'Các bước tạo và chạy chương trình:\n\n1. Mở IDLE (Python Shell)\n2. Vào menu File → New File (hoặc Ctrl+N)\n   → Cửa sổ soạn thảo mở ra\n3. Gõ code chương trình vào cửa sổ soạn thảo\n   Ví dụ: print("Xin chào!")\n4. Lưu file: Ctrl+S\n   → Đặt tên file (VD: Bai1.py)\n   → Chọn thư mục lưu\n5. Chạy chương trình: nhấn F5\n   → Kết quả hiện trong cửa sổ Python Shell\n\nLưu ý: file Python có đuôi .py' },

    // ── ĐIỀN CHỖ TRỐNG: Môi trường ──
    { id:'qf002', cat:'moi_truong', type:'fill',
      q:'Trong IDLE, dấu ___ cho biết Python đang chờ lệnh. Nhấn ___ để chạy chương trình đã lưu.',
      blanks:['>>>','F5'],
      explain:'Dấu nhắc >>> là ký hiệu Python Shell đang ở chế độ tương tác. F5 là phím tắt "Run Module" để thực thi chương trình (.py) trong cửa sổ soạn thảo.' },

    // ══════════════════════════════════════════════════════
    // LỆNH PYTHON (print)
    // ══════════════════════════════════════════════════════
    { id:'q013', cat:'lenh_python',
      q:'Lệnh print("Xin chào Python!") sẽ in ra màn hình gì?',
      opts:['Xin chào Python! (không có dấu nháy)','\"Xin chào Python!\" (có dấu nháy)','print','Lỗi cú pháp'],
      ans:0,
      explain:'Hàm print() in giá trị ra màn hình và tự thêm xuống dòng. Khi in chuỗi, dấu nháy chỉ để xác định ranh giới chuỗi trong code – không được in ra.' },

    { id:'q014', cat:'lenh_python',
      q:'Kết quả của lệnh print(3 + 5 * 2) là gì?',
      opts:['16','13','3 + 5 * 2','Lỗi cú pháp'],
      ans:1,
      explain:'Python áp dụng thứ tự ưu tiên toán tử: nhân trước, cộng sau.\n5 * 2 = 10, sau đó 3 + 10 = 13.\nprint() sẽ in ra 13.' },

    { id:'q015', cat:'lenh_python',
      q:'Lệnh print(10, 20, 30) sẽ in ra gì?',
      opts:['102030','10 20 30','10, 20, 30','(10, 20, 30)'],
      ans:1,
      explain:'Khi truyền nhiều giá trị cho print(), Python mặc định ngăn cách chúng bằng dấu cách.\nprint(10, 20, 30) → in ra: 10 20 30' },

    { id:'q016', cat:'lenh_python',
      q:'Lệnh nào sau đây in ra số thực đúng cú pháp Python?',
      opts:['print(3,14)','print(3.14)','PRINT(3.14)','Print(3,14)'],
      ans:1,
      explain:'Số thực trong Python dùng dấu chấm thập phân (3.14), không phải dấu phẩy.\nprint() viết thường. Python phân biệt hoa/thường nên PRINT() hay Print() đều gây lỗi.' },

    // ── TỰ LUẬN: Lệnh Python ──
    { id:'q104', cat:'lenh_python', type:'tl',
      q:'Viết lệnh print() để in ra: "Bài 16: NNLT bậc cao và Python". Giải thích cú pháp.',
      explain:'Cú pháp:\n  print("Bài 16: NNLT bậc cao và Python")\n\nGiải thích:\n• print là tên hàm\n• () là cặp ngoặc tròn bắt buộc\n• Nội dung chuỗi đặt trong dấu nháy kép " " hoặc nháy đơn \' \'\n• Chuỗi văn bản phải có dấu nháy bao quanh, số thì không cần\n\nVí dụ mở rộng – in nhiều dòng:\n  print("Họ tên: Nguyễn Văn A")\n  print("Lớp: 10A1")\n  print("Điểm:", 9.5)' },

    // ── ĐIỀN CHỖ TRỐNG: Lệnh Python ──
    { id:'qf003', cat:'lenh_python', type:'fill',
      q:'Cú pháp hàm in ra màn hình là ___. Nhiều giá trị được ngăn cách bởi ___.',
      blanks:['print(v1, v2, ..., vn)', 'dấu phẩy ,'],
      explain:'Cú pháp đầy đủ: print(v1, v2, ..., vn)\nKhi có nhiều tham số, dùng dấu phẩy ngăn cách trong lệnh.\nKhi in ra màn hình, Python mặc định dùng dấu cách để ngăn cách các giá trị.' },

    // ── NỐI TỪ: Lệnh Python ──
    { id:'qm001', cat:'lenh_python', type:'match',
      q:'Nối lệnh Python với kết quả in ra màn hình:',
      pairs:[
        { a:'print("Hello")',    b:'Hello' },
        { a:'print(5 + 3)',      b:'8' },
        { a:'print(2 * 3.0)',    b:'6.0' },
        { a:'print("A", "B")',   b:'A B' },
      ],
      explain:'• Chuỗi in ra không có dấu nháy\n• print(5+3): Python tính 5+3=8 rồi in\n• print(2*3.0): kết quả float → 6.0 (không phải 6)\n• print("A","B"): dấu phẩy → cách nhau bằng dấu cách' },

    // ══════════════════════════════════════════════════════
    // THỰC HÀNH
    // ══════════════════════════════════════════════════════
    { id:'q017', cat:'thuc_hanh',
      q:'Trong Python, dòng bắt đầu bằng dấu # có ý nghĩa gì?',
      opts:['Đây là lỗi cú pháp','Đây là chú thích (comment), Python bỏ qua khi chạy','Đây là lệnh đặc biệt của hệ điều hành','Đây là tiêu đề của chương trình'],
      ans:1,
      explain:'Dấu # bắt đầu chú thích (comment). Python bỏ qua toàn bộ nội dung từ # đến cuối dòng khi chạy.\nChú thích giúp lập trình viên ghi chú giải thích code cho dễ đọc, hiểu.\nVí dụ: # Đây là chương trình đầu tiên' },

    { id:'q018', cat:'thuc_hanh',
      q:'Chương trình Bai1.py có lệnh: print("Xin chao!"). Khi chạy F5, kết quả là?',
      opts:['Xin chao!','\"Xin chao!\"','print(Xin chao!)','Không có kết quả gì'],
      ans:0,
      explain:'print("Xin chao!") in ra: Xin chao!\nKết quả xuất hiện trong cửa sổ Python Shell.\nDấu nháy chỉ là ký hiệu bao chuỗi trong code, không được in ra.' },

    { id:'q019', cat:'thuc_hanh',
      q:'Khi lưu chương trình Python, tên file cần có đuôi gì?',
      opts:['.txt','.doc','.py','.python'],
      ans:2,
      explain:'File chương trình Python có đuôi .py (viết tắt của Python). Đây là quy ước chuẩn để IDLE và các công cụ khác nhận biết đây là file Python.' },

    // ── TỰ LUẬN: Thực hành ──
    { id:'q105', cat:'thuc_hanh', type:'tl',
      q:'Hãy viết chương trình Python gồm ít nhất 3 lệnh print() để in ra thông tin cá nhân (họ tên, lớp, trường). Có chú thích giải thích.',
      explain:'Ví dụ chương trình:\n\n# Chương trình in thông tin cá nhân\n# Tác giả: Nguyễn Văn A\nprint("Họ và tên: Nguyễn Văn A")\nprint("Lớp: 10A1")\nprint("Trường: THPT Nguyễn Du")\nprint("Năm học: 2024-2025")\n\nKết quả khi chạy F5:\nHọ và tên: Nguyễn Văn A\nLớp: 10A1\nTrường: THPT Nguyễn Du\nNăm học: 2024-2025\n\nLưu ý: lưu file với tên gợi nhớ như ThongTin.py' },

    // ── ĐIỀN CHỖ TRỐNG: Thực hành ──
    { id:'qf004', cat:'thuc_hanh', type:'fill',
      q:'Trong Python, dòng bắt đầu bằng ___ là chú thích. Phím ___ dùng để chạy chương trình trong IDLE.',
      blanks:['#','F5'],
      explain:'# (dấu thăng/hash) bắt đầu dòng chú thích – Python bỏ qua khi thực thi.\nF5 là phím Run Module trong IDLE.' },

    // ══════════════════════════════════════════════════════
    // VẬN DỤNG
    // ══════════════════════════════════════════════════════
    { id:'q020', cat:'van_dung',
      q:'Cú pháp triple quotes (dấu nháy ba lần) trong Python dùng để làm gì?',
      opts:['In ra 3 dòng trống','Tạo chuỗi nhiều dòng (multi-line string)','Nhân chuỗi lên 3 lần','Tạo bình luận đặc biệt không thể xóa'],
      ans:1,
      explain:'Triple quotes (""" hoặc \'\'\') cho phép tạo chuỗi nhiều dòng.\nVí dụ:\n  msg = """Dòng 1\nDòng 2\nDòng 3"""\n  print(msg)\nRất hữu ích khi cần in đoạn văn bản dài có xuống dòng.' },

    { id:'q021', cat:'van_dung',
      q:'Vòng lặp  for i in range(5):  sẽ lặp bao nhiêu lần và i nhận những giá trị nào?',
      opts:['5 lần, i = 1, 2, 3, 4, 5','5 lần, i = 0, 1, 2, 3, 4','4 lần, i = 1, 2, 3, 4','Vô hạn lần'],
      ans:1,
      explain:'range(5) tạo dãy số từ 0 đến 4 (không bao gồm 5): 0, 1, 2, 3, 4.\nVòng lặp chạy 5 lần với i lần lượt nhận giá trị 0, 1, 2, 3, 4.\nĐây là quy ước "bắt đầu từ 0" của Python.' },

    // ── TỰ LUẬN: Vận dụng ──
    { id:'q106', cat:'van_dung', type:'tl',
      q:'Viết chương trình Python dùng vòng lặp for để in ra dòng "Python thật thú vị!" 5 lần. Giải thích từng dòng code.',
      explain:'Chương trình:\n\n# In 5 lần câu "Python thật thú vị!"\nfor i in range(5):\n    print("Python thật thú vị!")\n\nKết quả:\nPython thật thú vị!\nPython thật thú vị!\nPython thật thú vị!\nPython thật thú vị!\nPython thật thú vị!\n\nGiải thích:\n• for i in range(5):  → bắt đầu vòng lặp 5 lần (i = 0,1,2,3,4)\n• Dòng bên trong PHẢI thụt lề (4 dấu cách hoặc Tab)\n• print(...) chạy 5 lần, mỗi lần in 1 dòng\n• range(5) → 5 bước: 0,1,2,3,4 (tổng cộng 5 lần)' },

    // ── ĐIỀN CHỖ TRỐNG: Vận dụng ──
    { id:'qf005', cat:'van_dung', type:'fill',
      q:'Vòng lặp  for i in range(3):  chạy ___ lần với i lần lượt là ___.',
      blanks:['3','0, 1, 2'],
      explain:'range(n) tạo dãy từ 0 đến n-1. range(3) → 0, 1, 2 (3 phần tử).\nVòng lặp chạy 3 lần, không phải 4 hay 2.' },

    // ── NỐI TỪ: Tổng hợp ──
    { id:'qm002', cat:'van_dung', type:'match',
      q:'Nối khái niệm với mô tả đúng:',
      pairs:[
        { a:'NNLT bậc cao',    b:'Gần ngôn ngữ tự nhiên, dễ đọc, độc lập phần cứng' },
        { a:'Trình thông dịch',b:'Dịch và thực thi từng dòng lệnh (Python dùng loại này)' },
        { a:'Triple quotes',   b:'Tạo chuỗi nhiều dòng trong Python (""" hoặc \'\'\')' },
        { a:'range(n)',        b:'Tạo dãy số nguyên từ 0 đến n-1' },
      ],
      explain:'Bốn khái niệm quan trọng của Bài 16.\nNhớ: Python = NNLT bậc cao + thông dịch. Triple quotes và range() là đặc trưng cú pháp Python.' },

  ]
};
