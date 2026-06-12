// B17 kịch bản dạy học – ghi đè TEACHING_STEPS từ shared js/teaching-flow.js
TEACHING_STEPS = [

  { phase:"MỞ ĐẦU", color:"#3a86ff", title:"BÀI 17",
    time:2, action:'slide', cqTab:null, cqId:null, slide:0, preset:null, hv:[0,0],
    script:"Chào mừng các em đến với Bài 17: Biến và Lệnh Gán! Trong bài học hôm nay, chúng ta sẽ tìm hiểu biến là gì, cách dùng lệnh gán, các phép toán trên số và xâu ký tự, và từ khóa trong Python. Đây là nền tảng quan trọng để viết chương trình. Chuẩn bị sẵn sàng nhé, các em!" },

  { phase:"KHỞI ĐỘNG", color:"#ff9f1c", title:"Khởi Động",
    time:1, action:'slide', cqTab:null, cqId:null, slide:1, preset:null, hv:[1,0],
    script:"Phần Khởi Động. Chúng ta sẽ ôn lại khái niệm biến mà các em đã biết từ môn Toán, rồi kết nối với biến trong lập trình Python." },

  { phase:"KHỞI ĐỘNG", color:"#ff9f1c", title:"Biến trong toán học… và trong lập trình",
    time:2, action:'slide', cqTab:null, cqId:null, slide:1, preset:null, hv:[1,1],
    script:"Trong Đại số, các em đã học hằng đẳng thức: a cộng b, bình phương, bằng a bình phương, cộng hai a b, cộng b bình phương. Ở đây a và b là ký hiệu đại diện cho bất kỳ số nào." },

  { phase:"KHỞI ĐỘNG", color:"#ff9f1c", title:"Biến trong toán học và lập trình là gì?",
    time:2, action:'slide', cqTab:null, cqId:null, slide:1, preset:null, hv:[1,2],
    script:"Rất tốt! Chúng ta so sánh biến trong Toán học và trong Lập trình. Trong Toán học, biến là ký hiệu đại diện cho giá trị chưa xác định, giúp viết công thức tổng quát áp dụng cho mọi bộ số. Trong Lập trình Python, biến là tên của một ô nhớ trong máy tính, dùng để lưu trữ và xử lý dữ liệu. Điểm giống nhau: cả hai đều là ký hiệu thay thế cho giá trị. Điểm khác: biến trong lập trình có thể thay đổi giá trị trong khi chương trình đang chạy." },

  { phase:"KHỞI ĐỘNG", color:"#ff9f1c", title:"Câu hỏi thảo luận – Khởi động",
    time:2, action:'slide', cqTab:null, cqId:null, slide:1, preset:null, hv:[1,3],
    script:"Câu hỏi thảo luận khởi động. Các em suy nghĩ theo cặp: biến trong toán học và biến trong lập trình Python giống và khác nhau ở điểm nào?" },

  { phase:"KHỞI ĐỘNG", color:"#ff9f1c", title:"Biến xuất hiện khắp nơi trong cuộc sống!",
    time:2, action:'slide', cqTab:null, cqId:null, slide:1, preset:null, hv:[1,4],
    script:"Biến xuất hiện khắp nơi trong cuộc sống thực. Trong game, biến lưu điểm số, số mạng, cấp độ. Trong Excel, ô A1 hay B2 cũng đóng vai trò như biến. Trong cuộc sống, nhiệt độ cơ thể, giá xăng, tốc độ xe đều có thể lưu vào biến Python. Kết luận: lập trình chỉ là cách nói chuyện với máy tính bằng ngôn ngữ chính xác hơn mà thôi!" },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Biến và Lệnh Gán",
    time:1, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,0],
    script:"Phần 1, Biến và Lệnh Gán. Đây là nội dung trọng tâm của bài. Chúng ta sẽ học: biến là gì, cú pháp lệnh gán đơn, lệnh gán đồng thời, và quy tắc đặt tên biến trong Python." },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Biến là gì?",
    time:2, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,1],
    script:"Biến là tên của một vùng nhớ trong máy tính, dùng để lưu trữ giá trị, và giá trị đó có thể thay đổi khi chương trình chạy. Ví dụ: biến n bằng 5, lưu số nguyên 5. Biến ten bằng chữ An, lưu xâu ký tự. Biến diem bằng 8.5, lưu số thực. Đặc điểm nổi bật của Python: không cần khai báo kiểu dữ liệu trước. Python tự động xác định kiểu theo giá trị được gán. Điều này khác với Pascal hay C phải khai báo kiểu tường minh." },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Câu hỏi kiểm tra – Biến là gì?",
    time:2, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,2],
    script:"Câu hỏi kiểm tra nhanh về khái niệm biến. Các em suy nghĩ: trong lập trình, biến dùng để làm gì, và vì sao giá trị của biến có thể thay đổi khi chương trình chạy?" },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Lệnh gán đơn",
    time:2, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,3],
    script:"Lệnh gán có cú pháp: tên biến bằng biểu thức. Ví dụ: x bằng 5, gán số nguyên 5 cho biến x. y bằng Tin học, gán xâu ký tự. Lưu ý quan trọng: dấu bằng trong Python là lệnh GÁN, không phải so sánh bằng nhau! Ví dụ lệnh x bằng x cộng 1: Python tính vế phải trước, được kết quả 6, rồi mới gán lại cho x. Sau lệnh này, x tăng từ 5 lên 6." },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Lệnh gán đồng thời",
    time:2, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,4],
    script:"Đặc trưng tuyệt vời của Python là lệnh gán đồng thời. Cú pháp: x phẩy y phẩy z bằng 10 phẩy 5 phẩy 1. Gán ba biến chỉ trong một dòng lệnh! Ứng dụng thực tế rất hay: hoán đổi hai biến mà không cần biến trung gian. Ví dụ: a phẩy b bằng b phẩy a. Python tính toàn bộ vế phải trước, rồi mới gán đồng loạt vào các biến bên trái." },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Câu hỏi – Lệnh gán & Hoán đổi",
    time:2, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,5],
    script:"Câu hỏi kiểm tra nhanh về lệnh gán và hoán đổi. Các em tính nhẩm: nếu x và y đang có giá trị, sau lệnh x phẩy y bằng y phẩy x thì hai biến thay đổi như thế nào?" },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Quy tắc đặt tên biến",
    time:2, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,6],
    script:"Quy tắc đặt tên biến trong Python. Thứ nhất, chỉ được dùng chữ cái tiếng Anh, chữ số và dấu gạch dưới. Thứ hai, không được bắt đầu bằng chữ số. Thứ ba, Python phân biệt chữ hoa và chữ thường: SoLuong và soluong là hai biến khác nhau. Thứ tư, không được trùng với từ khóa Python. Ví dụ hợp lệ: gạch dưới name, xyzABC, so gạch dưới luong. Ví dụ không hợp lệ: 12abc vì bắt đầu bằng số; My country vì có dấu cách." },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Demo: Biến & Lệnh gán",
    time:2, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,7],
    script:"Bây giờ chúng ta xem minh họa code chạy từng bước. Nhấn nút Mở Code Playground để xem từng biến được tạo ra trong bộ nhớ máy tính. Các em quan sát: mỗi khi thực hiện lệnh gán, một ô nhớ mới được tạo ra với tên và giá trị tương ứng. Nhấn Bước tiếp hoặc Tự chạy để xem từng dòng." },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Kiểu dữ liệu của biến trong Python",
    time:2, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,8],
    script:"Python có bốn kiểu dữ liệu cơ bản. Một là int, số nguyên như tuổi 16. Hai là float, số thực có phần thập phân như điểm 8.5. Ba là str, xâu ký tự đặt trong dấu nháy. Bốn là bool, kiểu lôgic chỉ có True hoặc False. Lưu ý quan trọng: không thể thực hiện phép toán giữa các biến khác kiểu. Hàm type() cho biết kiểu dữ liệu của biến." },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Gán nhiều biến = một giá trị · Toán tử kết hợp",
    time:2, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,9],
    script:"Có hai cách gán nhiều biến cùng lúc. Cách một, gán cùng một giá trị: x bằng y bằng 1, cả hai đều nhận giá trị 1. Cách hai, gán đồng thời nhiều giá trị khác nhau: x phẩy y phẩy z bằng 10 phẩy 5 phẩy 1. Phân tích lệnh x bằng x cộng 1: Python tính vế phải trước, rồi gán lại cho x. Python cũng hỗ trợ toán tử kết hợp như x cộng bằng 1, nghĩa là x bằng x cộng 1." },

  { phase:"BIẾN & LỆNH GÁN", color:"#2ec4b6", title:"Bài tập – Hoạt động 1 (SGK tr.92–93)",
    time:2, action:'slide', cqTab:null, cqId:null, slide:2, preset:null, hv:[2,10],
    script:"Làm bài tập Hoạt động 1 trang 92 và 93. Câu a: tên hợp lệ là gạch dưới name và xyzABC. Không hợp lệ: 12abc bắt đầu số, My country có dấu cách, m123 và b có ký tự đặc biệt. Câu b: x bằng 10, y bằng 99, x bằng 104 chấm 0. Chú ý x là số thực vì có phép chia. Câu c: sau gán đồng thời, a bằng 5 và b bằng âm 1." },

  { phase:"PHÉP TOÁN", color:"#e71d36", title:"Phép Toán trên Kiểu Dữ Liệu",
    time:1, action:'slide', cqTab:null, cqId:null, slide:3, preset:null, hv:[3,0],
    script:"Phần 2, Phép Toán trên Kiểu Dữ Liệu. Chúng ta tìm hiểu các phép toán trên số nguyên, số thực và xâu ký tự trong Python." },

  { phase:"PHÉP TOÁN", color:"#e71d36", title:"Phép toán trên kiểu số",
    time:2, action:'slide', cqTab:null, cqId:null, slide:3, preset:null, hv:[3,1],
    script:"Python cung cấp đầy đủ các phép toán số học: cộng, trừ, nhân, chia. Ngoài ra còn ba phép đặc biệt: gạch chéo đôi là chia lấy thương nguyên, chỉ lấy phần nguyên của kết quả. Phần trăm là phép lấy số dư. Hai dấu sao là lũy thừa. Thứ tự ưu tiên: lũy thừa cao nhất, sau đó nhân chia, cuối cùng cộng trừ. Dùng ngoặc tròn để thay đổi thứ tự tính toán." },

  { phase:"PHÉP TOÁN", color:"#e71d36", title:"Phép toán trên xâu ký tự",
    time:2, action:'slide', cqTab:null, cqId:null, slide:3, preset:null, hv:[3,2],
    script:"Phép toán trên xâu ký tự: dấu cộng nối hai xâu lại với nhau. Ví dụ: Tin học cộng 10 cho kết quả Tin học 10. Dấu sao lặp xâu n lần. Ví dụ: Ha! nhân 3 cho kết quả Ha! Ha! Ha! Lưu ý quan trọng: không thể cộng số với xâu, Python sẽ báo lỗi TypeError. Muốn ghép số vào chuỗi, cần dùng hàm str để chuyển đổi kiểu trước." },

  { phase:"PHÉP TOÁN", color:"#e71d36", title:"Câu hỏi – Phép toán số & xâu",
    time:2, action:'slide', cqTab:null, cqId:null, slide:3, preset:null, hv:[3,3],
    script:"Câu hỏi kiểm tra nhanh về phép toán số và xâu ký tự. Các em chú ý sự khác nhau giữa chia thường, chia lấy phần nguyên, lấy dư, và phép nối xâu." },

  { phase:"PHÉP TOÁN", color:"#e71d36", title:"Demo: Phép toán",
    time:2, action:'slide', cqTab:null, cqId:null, slide:3, preset:null, hv:[3,4],
    script:"Nhấn Mở Code Playground để thực hành các phép toán. Các em quan sát từng phép tính được thực hiện và kết quả in ra màn hình." },

  /* ── NGHỈ GIỮA TIẾT – ranh giới Tiết 1 / Tiết 2 ── */
  { phase:'NGHỈ GIỮA TIẾT', color:'#718096', title:'Nghỉ giữa hai tiết (~5 phút)',
    time:5, action:'break', cqTab:null, cqId:null, slide:null, preset:null, hv:null,
    script:"Kết thúc Tiết 1. Nghỉ giữa tiết ~5 phút rồi tiếp tục Tiết 2." },

  { phase:"PHÉP TOÁN", color:"#e71d36", title:"Câu hỏi ôn nhanh đầu Tiết 2",
    time:2, action:'slide', cqTab:null, cqId:null, slide:3, preset:null, hv:[3,5],
    script:"Câu hỏi ôn nhanh đầu tiết 2. Các em nhắc lại phép chia lấy phần nguyên, phép lấy dư, lũy thừa, và cách áp dụng chúng trong biểu thức Python." },

  { phase:"PHÉP TOÁN", color:"#e71d36", title:"Chia nguyên // và Lấy dư %",
    time:2, action:'slide', cqTab:null, cqId:null, slide:3, preset:null, hv:[3,6],
    script:"Hai phép toán đặc biệt rất hay dùng. Gạch chéo đôi là chia lấy thương nguyên, bỏ phần lẻ. Phần trăm là lấy số dư. Ứng dụng: kiểm tra số chẵn lẻ bằng n phần trăm 2. Đổi tổng giây sang phút và giây: số phút bằng tổng giây chia nguyên 60, số giây còn lại bằng tổng giây lấy dư 60." },

  { phase:"PHÉP TOÁN", color:"#e71d36", title:"Thứ tự ưu tiên phép toán – Giải từng bước",
    time:2, action:'slide', cqTab:null, cqId:null, slide:3, preset:null, hv:[3,7],
    script:"Thứ tự ưu tiên phép toán: ngoặc tròn cao nhất, tiếp theo lũy thừa, rồi nhân chia, cuối cùng cộng trừ. Đặc biệt: lũy thừa tính từ phải sang trái. Ví dụ: 4 mũ 2 mũ 3 bằng 4 mũ 8, không phải 16 mũ 3. Giải ví dụ SGK: 3 phần 2 cộng 4 nhân 2 mũ 4 trừ 5 chia nguyên 2 mũ 2. Tính lần lượt từng bước theo thứ tự ưu tiên." },

  { phase:"PHÉP TOÁN", color:"#e71d36", title:"Kiểm tra nhanh – SGK trang 94",
    time:2, action:'slide', cqTab:null, cqId:null, slide:3, preset:null, hv:[3,8],
    script:"Kiểm tra nhanh trang 94. Câu 1a: 12 trừ 10 chia nguyên 2, bình phương, trừ 1. Giải: 10 chia nguyên 2 bằng 5, 12 trừ 5 bằng 7, 7 bình phương bằng 49, trừ 1 được 48. Câu 1b: 30 chia nguyên 12 bằng 2, 5 chia 2 bằng 2.5, kết quả âm 0.5. Câu 2a: xâu rỗng nhân 20 vẫn rỗng, nối \"010\" được \"010\". Câu 2b: \"10\" nối \"00000\" được \"1000000\"." },

  { phase:"TỪ KHÓA", color:"#9b5de5", title:"Từ Khoá (Keywords)",
    time:1, action:'slide', cqTab:null, cqId:null, slide:4, preset:null, hv:[4,0],
    script:"Phần 3, Từ Khóa trong Python. Chúng ta tìm hiểu các từ khóa đặc biệt của Python, và lý do tại sao không được dùng làm tên biến." },

  { phase:"TỪ KHÓA", color:"#9b5de5", title:"Từ khóa (Keywords)",
    time:2, action:'slide', cqTab:null, cqId:null, slide:4, preset:null, hv:[4,1],
    script:"Từ khóa là các từ đặc biệt của Python, dùng vào mục đích riêng của ngôn ngữ. Tuyệt đối không được đặt tên biến trùng với từ khóa! Ví dụ: nếu viết if bằng 12, Python báo lỗi SyntaxError, vì if là từ khóa rẽ nhánh. Tương tự, while, for, def, class, return đều là từ khóa. Chú ý: Python phân biệt hoa thường. True với T hoa là từ khóa, nhưng true với t thường thì không phải từ khóa, và có thể dùng làm tên biến." },

  { phase:"TỪ KHÓA", color:"#9b5de5", title:"Câu hỏi – Từ khóa Python",
    time:2, action:'slide', cqTab:null, cqId:null, slide:4, preset:null, hv:[4,2],
    script:"Câu hỏi kiểm tra nhanh về từ khóa Python. Các em quan sát danh sách từ khóa và xác định từ nào không được dùng làm tên biến." },

  { phase:"TỪ KHÓA", color:"#9b5de5", title:"SyntaxError – Lỗi khi dùng từ khóa làm tên biến",
    time:2, action:'slide', cqTab:null, cqId:null, slide:4, preset:null, hv:[4,3],
    script:"Khi dùng từ khóa làm tên biến, Python báo lỗi SyntaxError ngay lập tức. Ví dụ: if bằng 12 gây lỗi vì if là từ khóa rẽ nhánh. Cách khắc phục: thêm dấu gạch dưới, hoặc đặt tên theo nghĩa. VS Code sẽ tô màu xanh dương cho từ khóa, giúp nhận ra ngay trước khi chạy chương trình." },

  { phase:"TỪ KHÓA", color:"#9b5de5", title:"Bài tập – Hoạt động 3 (SGK tr.95)",
    time:2, action:'slide', cqTab:null, cqId:null, slide:4, preset:null, hv:[4,4],
    script:"Bài tập Hoạt động 3 trang 95. Gạch dưới if hợp lệ. global không hợp lệ vì là từ khóa. nolocal hợp lệ vì từ khóa đúng là nonlocal, khác chính tả. return không hợp lệ vì là từ khóa. true với t thường hợp lệ vì từ khóa là True với T hoa, hai từ khác nhau." },

  { phase:"THỰC HÀNH", color:"#06d6a0", title:"Thực Hành",
    time:1, action:'slide', cqTab:null, cqId:null, slide:5, preset:null, hv:[5,0],
    script:"Phần 4, Thực Hành. Áp dụng kiến thức vào các bài tập trong sách giáo khoa trang 95 và 96." },

  { phase:"THỰC HÀNH", color:"#06d6a0", title:"Bài tập thực hành (SGK tr.95–96)",
    time:2, action:'slide', cqTab:null, cqId:null, slide:5, preset:null, hv:[5,1],
    script:"Bài tập thực hành gồm bốn nhiệm vụ. Nhiệm vụ 1a: tính tổng từ 1 đến 10, rồi lập phương. Nhiệm vụ 1b: tính một phần hai cộng một phần ba cộng một phần tư cộng một phần năm. Nhiệm vụ 1c: gán x bằng 2, y bằng 5, tính giá trị biểu thức x cộng y, nhân với x bình phương cộng y bình phương trừ 1. Nhiệm vụ 2: tính chu vi và diện tích hình tròn với bán kính R bằng 4 phẩy 5. Hãy mở Code Playground để thực hành." },

  { phase:"THỰC HÀNH", color:"#06d6a0", title:"Bài tập 1d · Luyện tập · Phát hiện lỗi",
    time:2, action:'slide', cqTab:null, cqId:null, slide:5, preset:null, hv:[5,2],
    script:"Thực hành mở rộng. Bài 1d: gán a bằng 2, b bằng 3, c bằng 4, tính a cộng b cộng c nhân a cộng b trừ c, kết quả 9 nhân 1 bằng 9. Bài luyện tập: in chuỗi đồ rê mi lặp 3 lần nối pha son la si đô lặp 2 lần. Bài phát hiện lỗi: 123a bắt đầu bằng số, sửa thành a123." },

  { phase:"VẬN DỤNG", color:"#f72585", title:"Vận Dụng",
    time:1, action:'slide', cqTab:null, cqId:null, slide:6, preset:null, hv:[6,0],
    script:"Phần 5, Vận Dụng. Chúng ta giải bài toán thực tế: đổi số giây sang đơn vị ngày, giờ, phút, giây." },

  { phase:"VẬN DỤNG", color:"#f72585", title:"Đổi giây ra ngày / giờ / phút / giây",
    time:2, action:'slide', cqTab:null, cqId:null, slide:6, preset:null, hv:[6,1],
    script:"Bài toán: Cho biến ss bằng 684500 giây. Viết chương trình đổi ra ngày giờ phút giây. Thuật toán: số ngày bằng ss chia nguyên 86400. Số giờ bằng phần dư của ss chia 86400, rồi chia nguyên 3600. Số phút bằng phần dư chia 3600, chia nguyên 60. Số giây là phần dư chia 60. Kết quả: 684500 giây bằng 7 ngày 22 giờ 8 phút 20 giây. Câu hỏi thêm: lệnh x phẩy y bằng y phẩy x, với x bằng 10 và y bằng 7, cho kết quả gì?" },

  { phase:"VẬN DỤNG", color:"#f72585", title:"Tại sao Python không cần biến tạm để hoán đổi?",
    time:2, action:'slide', cqTab:null, cqId:null, slide:6, preset:null, hv:[6,2],
    script:"Python không cần biến tạm để hoán đổi nhờ lệnh gán đồng thời. Cách cũ trong Pascal hay C cần ba bước: lưu vào biến tạm, rồi gán lần lượt. Python chỉ một dòng: x phẩy y bằng y phẩy x. Bí mật: Python tính toàn bộ vế phải trước, tạo ra bộ giá trị, rồi gán đồng thời. Câu hỏi SGK: trước lệnh x bằng 10, y bằng 7. Sau lệnh x bằng 7, y bằng 10." },

  { phase:"TỔNG KẾT", color:"#4cc9f0", title:"Tổng Kết",
    time:1, action:'slide', cqTab:null, cqId:null, slide:7, preset:null, hv:[7,0],
    script:"Phần 6, Tổng Kết bài học. Cùng ôn lại những điểm quan trọng nhất của Bài 17." },

  { phase:"TỔNG KẾT", color:"#4cc9f0", title:"Những gì đã học",
    time:2, action:'slide', cqTab:null, cqId:null, slide:7, preset:null, hv:[7,1],
    script:"Tổng kết Bài 17. Điểm thứ nhất: biến là tên vùng nhớ lưu giá trị, Python tự xác định kiểu dữ liệu. Điểm thứ hai: lệnh gán có cú pháp biến bằng biểu thức; có thể gán đồng thời nhiều biến và hoán đổi không cần biến tạm. Điểm thứ ba: phép toán số gồm cộng trừ nhân chia và lũy thừa; phép toán xâu gồm nối và lặp. Điểm thứ tư: từ khóa là từ đặc biệt, không được dùng làm tên biến. Bài tiếp theo là Bài 18, các lệnh vào ra đơn giản với hàm input và print." },

  { phase:"TỔNG KẾT", color:"#4cc9f0", title:"Câu hỏi củng cố cuối bài",
    time:2, action:'slide', cqTab:null, cqId:null, slide:7, preset:null, hv:[7,2],
    script:"Câu hỏi củng cố cuối bài. Các em hệ thống lại toàn bộ kiến thức: biến, lệnh gán, phép toán, từ khóa và cách đặt tên biến hợp lệ." },

  { phase:"TỔNG KẾT", color:"#4cc9f0", title:"Trò Chơi: Ai Thông Minh Hơn? 🎮",
    time:2, action:'slide', cqTab:null, cqId:null, slide:7, preset:null, hv:[7,3],
    script:"Để củng cố bài học, chúng ta chơi trò Ai Thông Minh Hơn! Trò chơi có 12 câu hỏi về biến, lệnh gán, phép toán và từ khóa Python. Chúc các em chơi vui và đạt điểm cao!" },
];
