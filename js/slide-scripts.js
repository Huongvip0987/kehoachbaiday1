// ══════════════════════════════════
// SLIDE SCRIPTS – lời thoại mẫu cho từng slide (key = "h-v")
// ══════════════════════════════════
var SLIDE_SCRIPTS = {
  '0-0': 'Chào mừng các em đến với Bài 17: Biến và Lệnh Gán! Trong bài học hôm nay, chúng ta sẽ tìm hiểu biến là gì, cách dùng lệnh gán, các phép toán trên số và xâu ký tự, và từ khóa trong Python. Đây là nền tảng quan trọng để viết chương trình. Chuẩn bị sẵn sàng nhé, các em!',

  '1-0': 'Phần Khởi Động. Chúng ta sẽ ôn lại khái niệm biến mà các em đã biết từ môn Toán, rồi kết nối với biến trong lập trình Python.',

  '1-1': 'Trong Đại số, các em đã học hằng đẳng thức: a cộng b, bình phương, bằng a bình phương, cộng hai a b, cộng b bình phương. Ở đây a và b là ký hiệu đại diện cho bất kỳ số nào.',

  '1-2': 'Rất tốt! Chúng ta so sánh biến trong Toán học và trong Lập trình. Trong Toán học, biến là ký hiệu đại diện cho giá trị chưa xác định, giúp viết công thức tổng quát áp dụng cho mọi bộ số. Trong Lập trình Python, biến là tên của một ô nhớ trong máy tính, dùng để lưu trữ và xử lý dữ liệu. Điểm giống nhau: cả hai đều là ký hiệu thay thế cho giá trị. Điểm khác: biến trong lập trình có thể thay đổi giá trị trong khi chương trình đang chạy.',

  '2-0': 'Phần 1, Biến và Lệnh Gán. Đây là nội dung trọng tâm của bài. Chúng ta sẽ học: biến là gì, cú pháp lệnh gán đơn, lệnh gán đồng thời, và quy tắc đặt tên biến trong Python.',

  '2-1': 'Biến là tên của một vùng nhớ trong máy tính, dùng để lưu trữ giá trị, và giá trị đó có thể thay đổi khi chương trình chạy. Ví dụ: biến n bằng 5, lưu số nguyên 5. Biến ten bằng chữ An, lưu xâu ký tự. Biến diem bằng 8.5, lưu số thực. Đặc điểm nổi bật của Python: không cần khai báo kiểu dữ liệu trước. Python tự động xác định kiểu theo giá trị được gán. Điều này khác với Pascal hay C phải khai báo kiểu tường minh.',

  '2-2': 'Câu hỏi kiểm tra nhanh về khái niệm biến. Các em suy nghĩ: trong lập trình, biến dùng để làm gì, và vì sao giá trị của biến có thể thay đổi khi chương trình chạy?',

  '2-3': 'Lệnh gán có cú pháp: tên biến bằng biểu thức. Ví dụ: x bằng 5, gán số nguyên 5 cho biến x. y bằng Tin học, gán xâu ký tự. Lưu ý quan trọng: dấu bằng trong Python là lệnh GÁN, không phải so sánh bằng nhau! Ví dụ lệnh x bằng x cộng 1: Python tính vế phải trước, được kết quả 6, rồi mới gán lại cho x. Sau lệnh này, x tăng từ 5 lên 6.',

  '2-4': 'Đặc trưng tuyệt vời của Python là lệnh gán đồng thời. Cú pháp: x phẩy y phẩy z bằng 10 phẩy 5 phẩy 1. Gán ba biến chỉ trong một dòng lệnh! Ứng dụng thực tế rất hay: hoán đổi hai biến mà không cần biến trung gian. Ví dụ: a phẩy b bằng b phẩy a. Python tính toàn bộ vế phải trước, rồi mới gán đồng loạt vào các biến bên trái.',

  '2-5': 'Câu hỏi kiểm tra nhanh về lệnh gán và hoán đổi. Các em tính nhẩm: nếu x và y đang có giá trị, sau lệnh x phẩy y bằng y phẩy x thì hai biến thay đổi như thế nào?',

  '2-6': 'Quy tắc đặt tên biến trong Python. Thứ nhất, chỉ được dùng chữ cái tiếng Anh, chữ số và dấu gạch dưới. Thứ hai, không được bắt đầu bằng chữ số. Thứ ba, Python phân biệt chữ hoa và chữ thường: SoLuong và soluong là hai biến khác nhau. Thứ tư, không được trùng với từ khóa Python. Ví dụ hợp lệ: gạch dưới name, xyzABC, so gạch dưới luong. Ví dụ không hợp lệ: 12abc vì bắt đầu bằng số; My country vì có dấu cách.',

  '2-7': 'Bây giờ chúng ta xem minh họa code chạy từng bước. Nhấn nút Mở Code Playground để xem từng biến được tạo ra trong bộ nhớ máy tính. Các em quan sát: mỗi khi thực hiện lệnh gán, một ô nhớ mới được tạo ra với tên và giá trị tương ứng. Nhấn Bước tiếp hoặc Tự chạy để xem từng dòng.',

  '3-0': 'Phần 2, Phép Toán trên Kiểu Dữ Liệu. Chúng ta tìm hiểu các phép toán trên số nguyên, số thực và xâu ký tự trong Python.',

  '3-1': 'Python cung cấp đầy đủ các phép toán số học: cộng, trừ, nhân, chia. Ngoài ra còn ba phép đặc biệt: gạch chéo đôi là chia lấy thương nguyên, chỉ lấy phần nguyên của kết quả. Phần trăm là phép lấy số dư. Hai dấu sao là lũy thừa. Thứ tự ưu tiên: lũy thừa cao nhất, sau đó nhân chia, cuối cùng cộng trừ. Dùng ngoặc tròn để thay đổi thứ tự tính toán.',

  '3-2': 'Phép toán trên xâu ký tự: dấu cộng nối hai xâu lại với nhau. Ví dụ: Tin học cộng 10 cho kết quả Tin học 10. Dấu sao lặp xâu n lần. Ví dụ: Ha! nhân 3 cho kết quả Ha! Ha! Ha! Lưu ý quan trọng: không thể cộng số với xâu, Python sẽ báo lỗi TypeError. Muốn ghép số vào chuỗi, cần dùng hàm str để chuyển đổi kiểu trước.',

  '3-3': 'Câu hỏi kiểm tra nhanh về phép toán số và xâu ký tự. Các em chú ý sự khác nhau giữa chia thường, chia lấy phần nguyên, lấy dư, và phép nối xâu.',

  '3-4': 'Nhấn Mở Code Playground để thực hành các phép toán. Các em quan sát từng phép tính được thực hiện và kết quả in ra màn hình.',

  '4-0': 'Phần 3, Từ Khóa trong Python. Chúng ta tìm hiểu các từ khóa đặc biệt của Python, và lý do tại sao không được dùng làm tên biến.',

  '4-1': 'Từ khóa là các từ đặc biệt của Python, dùng vào mục đích riêng của ngôn ngữ. Tuyệt đối không được đặt tên biến trùng với từ khóa! Ví dụ: nếu viết if bằng 12, Python báo lỗi SyntaxError, vì if là từ khóa rẽ nhánh. Tương tự, while, for, def, class, return đều là từ khóa. Chú ý: Python phân biệt hoa thường. True với T hoa là từ khóa, nhưng true với t thường thì không phải từ khóa, và có thể dùng làm tên biến.',

  '5-0': 'Phần 4, Thực Hành. Áp dụng kiến thức vào các bài tập trong sách giáo khoa trang 95 và 96.',

  '5-1': 'Bài tập thực hành gồm bốn nhiệm vụ. Nhiệm vụ 1a: tính tổng từ 1 đến 10, rồi lập phương. Nhiệm vụ 1b: tính một phần hai cộng một phần ba cộng một phần tư cộng một phần năm. Nhiệm vụ 1c: gán x bằng 2, y bằng 5, tính giá trị biểu thức x cộng y, nhân với x bình phương cộng y bình phương trừ 1. Nhiệm vụ 2: tính chu vi và diện tích hình tròn với bán kính R bằng 4 phẩy 5. Hãy mở Code Playground để thực hành.',

  '6-0': 'Phần 5, Vận Dụng. Chúng ta giải bài toán thực tế: đổi số giây sang đơn vị ngày, giờ, phút, giây.',

  '6-1': 'Bài toán: Cho biến ss bằng 684500 giây. Viết chương trình đổi ra ngày giờ phút giây. Thuật toán: số ngày bằng ss chia nguyên 86400. Số giờ bằng phần dư của ss chia 86400, rồi chia nguyên 3600. Số phút bằng phần dư chia 3600, chia nguyên 60. Số giây là phần dư chia 60. Kết quả: 684500 giây bằng 7 ngày 22 giờ 8 phút 20 giây. Câu hỏi thêm: lệnh x phẩy y bằng y phẩy x, với x bằng 10 và y bằng 7, cho kết quả gì?',

  '7-0': 'Phần 6, Tổng Kết bài học. Cùng ôn lại những điểm quan trọng nhất của Bài 17.',

  '7-1': 'Tổng kết Bài 17. Điểm thứ nhất: biến là tên vùng nhớ lưu giá trị, Python tự xác định kiểu dữ liệu. Điểm thứ hai: lệnh gán có cú pháp biến bằng biểu thức; có thể gán đồng thời nhiều biến và hoán đổi không cần biến tạm. Điểm thứ ba: phép toán số gồm cộng trừ nhân chia và lũy thừa; phép toán xâu gồm nối và lặp. Điểm thứ tư: từ khóa là từ đặc biệt, không được dùng làm tên biến. Bài tiếp theo là Bài 18, các lệnh vào ra đơn giản với hàm input và print.',

  '7-2': 'Câu hỏi củng cố cuối bài. Các em hệ thống lại toàn bộ kiến thức: biến, lệnh gán, phép toán, từ khóa và cách đặt tên biến hợp lệ.',

  '7-3': 'Để củng cố bài học, chúng ta chơi trò Ai Thông Minh Hơn! Trò chơi có 12 câu hỏi về biến, lệnh gán, phép toán và từ khóa Python. Chúc các em chơi vui và đạt điểm cao!',

  // ── Slide mới thêm ──
  '1-3': 'Câu hỏi thảo luận khởi động. Các em suy nghĩ theo cặp: biến trong toán học và biến trong lập trình Python giống và khác nhau ở điểm nào?',

  '1-4': 'Biến xuất hiện khắp nơi trong cuộc sống thực. Trong game, biến lưu điểm số, số mạng, cấp độ. Trong Excel, ô A1 hay B2 cũng đóng vai trò như biến. Trong cuộc sống, nhiệt độ cơ thể, giá xăng, tốc độ xe đều có thể lưu vào biến Python. Kết luận: lập trình chỉ là cách nói chuyện với máy tính bằng ngôn ngữ chính xác hơn mà thôi!',

  '2-8': 'Python có bốn kiểu dữ liệu cơ bản. Một là int, số nguyên như tuổi 16. Hai là float, số thực có phần thập phân như điểm 8.5. Ba là str, xâu ký tự đặt trong dấu nháy. Bốn là bool, kiểu lôgic chỉ có True hoặc False. Lưu ý quan trọng: không thể thực hiện phép toán giữa các biến khác kiểu. Hàm type() cho biết kiểu dữ liệu của biến.',

  '2-9': 'Có hai cách gán nhiều biến cùng lúc. Cách một, gán cùng một giá trị: x bằng y bằng 1, cả hai đều nhận giá trị 1. Cách hai, gán đồng thời nhiều giá trị khác nhau: x phẩy y phẩy z bằng 10 phẩy 5 phẩy 1. Phân tích lệnh x bằng x cộng 1: Python tính vế phải trước, rồi gán lại cho x. Python cũng hỗ trợ toán tử kết hợp như x cộng bằng 1, nghĩa là x bằng x cộng 1.',

  '2-10': 'Làm bài tập Hoạt động 1 trang 92 và 93. Câu a: tên hợp lệ là gạch dưới name và xyzABC. Không hợp lệ: 12abc bắt đầu số, My country có dấu cách, m123 và b có ký tự đặc biệt. Câu b: x bằng 10, y bằng 99, x bằng 104 chấm 0. Chú ý x là số thực vì có phép chia. Câu c: sau gán đồng thời, a bằng 5 và b bằng âm 1.',

  '3-5': 'Câu hỏi ôn nhanh đầu tiết 2. Các em nhắc lại phép chia lấy phần nguyên, phép lấy dư, lũy thừa, và cách áp dụng chúng trong biểu thức Python.',

  '3-6': 'Hai phép toán đặc biệt rất hay dùng. Gạch chéo đôi là chia lấy thương nguyên, bỏ phần lẻ. Phần trăm là lấy số dư. Ứng dụng: kiểm tra số chẵn lẻ bằng n phần trăm 2. Đổi tổng giây sang phút và giây: số phút bằng tổng giây chia nguyên 60, số giây còn lại bằng tổng giây lấy dư 60.',

  '3-7': 'Thứ tự ưu tiên phép toán: ngoặc tròn cao nhất, tiếp theo lũy thừa, rồi nhân chia, cuối cùng cộng trừ. Đặc biệt: lũy thừa tính từ phải sang trái. Ví dụ: 4 mũ 2 mũ 3 bằng 4 mũ 8, không phải 16 mũ 3. Giải ví dụ SGK: 3 phần 2 cộng 4 nhân 2 mũ 4 trừ 5 chia nguyên 2 mũ 2. Tính lần lượt từng bước theo thứ tự ưu tiên.',

  '3-8': 'Kiểm tra nhanh trang 94. Câu 1a: 12 trừ 10 chia nguyên 2, bình phương, trừ 1. Giải: 10 chia nguyên 2 bằng 5, 12 trừ 5 bằng 7, 7 bình phương bằng 49, trừ 1 được 48. Câu 1b: 30 chia nguyên 12 bằng 2, 5 chia 2 bằng 2.5, kết quả âm 0.5. Câu 2a: xâu rỗng nhân 20 vẫn rỗng, nối "010" được "010". Câu 2b: "10" nối "00000" được "1000000".',

  '4-2': 'Câu hỏi kiểm tra nhanh về từ khóa Python. Các em quan sát danh sách từ khóa và xác định từ nào không được dùng làm tên biến.',

  '4-3': 'Khi dùng từ khóa làm tên biến, Python báo lỗi SyntaxError ngay lập tức. Ví dụ: if bằng 12 gây lỗi vì if là từ khóa rẽ nhánh. Cách khắc phục: thêm dấu gạch dưới, hoặc đặt tên theo nghĩa. VS Code sẽ tô màu xanh dương cho từ khóa, giúp nhận ra ngay trước khi chạy chương trình.',

  '4-4': 'Bài tập Hoạt động 3 trang 95. Gạch dưới if hợp lệ. global không hợp lệ vì là từ khóa. nolocal hợp lệ vì từ khóa đúng là nonlocal, khác chính tả. return không hợp lệ vì là từ khóa. true với t thường hợp lệ vì từ khóa là True với T hoa, hai từ khác nhau.',

  '5-2': 'Thực hành mở rộng. Bài 1d: gán a bằng 2, b bằng 3, c bằng 4, tính a cộng b cộng c nhân a cộng b trừ c, kết quả 9 nhân 1 bằng 9. Bài luyện tập: in chuỗi đồ rê mi lặp 3 lần nối pha son la si đô lặp 2 lần. Bài phát hiện lỗi: 123a bắt đầu bằng số, sửa thành a123.',

  '6-2': 'Python không cần biến tạm để hoán đổi nhờ lệnh gán đồng thời. Cách cũ trong Pascal hay C cần ba bước: lưu vào biến tạm, rồi gán lần lượt. Python chỉ một dòng: x phẩy y bằng y phẩy x. Bí mật: Python tính toàn bộ vế phải trước, tạo ra bộ giá trị, rồi gán đồng thời. Câu hỏi SGK: trước lệnh x bằng 10, y bằng 7. Sau lệnh x bằng 7, y bằng 10.'
};

// ══ Kịch bản giảng dạy cho từng demo Playground ══
var PLAYGROUND_SCRIPTS = {
  'demo_bien':
    'Bây giờ chúng ta xem từng dòng code chạy từng bước. Quan sát bảng Variables bên phải. Mỗi lệnh gán sẽ tạo ra một ô nhớ mới với tên và giá trị của biến.',
  'demo_bien_outro':
    'Hoàn thành! Chúng ta vừa xem Python tạo biến, gán giá trị đơn, gán đồng thời và hoán đổi biến không cần biến tạm. Rất tiện lợi phải không nào?',

  'demo_pheptoan':
    'Tiếp theo là các phép toán số học trong Python. Quan sát từng phép tính được thực hiện và kết quả xuất hiện trong Terminal phía dưới.',
  'demo_pheptoan_outro':
    'Tuyệt vời! Các em đã thấy đầy đủ bảy phép toán số, thứ tự ưu tiên, và phép toán trên xâu ký tự trong Python.',

  'demo_thuchanh':
    'Cùng giải các bài tập SGK trang 95 và 96 từng bước. Quan sát Python tính toán biểu thức, lũy thừa và chu vi diện tích hình tròn.',
  'demo_thuchanh_outro':
    'Hoàn thành bài thực hành! Tổng từ 1 đến 10 lập phương là 166375. Chu vi và diện tích hình tròn với bán kính 4 phẩy 5 đã được tính xong.',

  'demo_vandung':
    'Giải bài toán vận dụng: đổi 684500 giây sang ngày giờ phút giây bằng cách áp dụng phép chia nguyên và lấy dư liên tiếp.',
  'demo_vandung_outro':
    'Xuất sắc! 684500 giây bằng 7 ngày 22 giờ 8 phút 20 giây. Đây là ứng dụng thực tế rất hay của phép chia nguyên và lấy dư.'
};

// Mapping slide (h-v) → demo key cần tự động mở khi dạy
var SLIDE_PLAYGROUND_MAP = {
  '2-7': 'demo_bien',
  '3-4': 'demo_pheptoan',
  '5-1': 'demo_thuchanh',
  '6-1': 'demo_vandung'
};

// Mapping slide (h-v) → question ID để hỏi học sinh trong chế độ tự dạy
// Câu hỏi xuất hiện SAU KHI đọc xong lời thoại của slide đó
var SLIDE_QUESTION_MAP = {
  // '1-1' đã chuyển sang kịch bản: slide → chọn người → câu hỏi (tab cq)
  '2-1': '10-17-bien-01',   // Biến là gì → biến là vùng nhớ có tên
  '2-3': '10-17-bien-02',   // Lệnh gán đơn → x = 10; x = x + 5
  '2-4': '10-17-bien-03',   // Lệnh gán đồng thời → hoán đổi a, b
  '2-6': '10-17-bien-04',   // Quy tắc đặt tên → tên biến hợp lệ
  '3-1': '10-17-phep-01',   // Phép toán số → 10 // 3
  '3-2': '10-17-phep-04',   // Phép toán xâu → "Ha" * 3
  '4-1': '10-17-tukh-01',   // Từ khóa → từ không phải từ khóa
  '6-1': '10-17-vand-01',   // Vận dụng đổi giây → giây // 3600
};

// Lời thoại ngữ cảnh cho từng chế độ (không phải slide cụ thể)
const CONTEXT_SCRIPTS = {
  'slides': '', // dùng spLoadCurrentSlideScript() thay thế
  'cq':
    'Bây giờ chúng ta ôn tập lại Bài 17 qua câu hỏi trắc nghiệm. ' +
    'Thầy cô sẽ chiếu từng câu hỏi lên màn hình. Các em có 30 giây để suy nghĩ, ' +
    'sau đó chọn đáp án. Ai chọn đúng sẽ được điểm thưởng. Bắt đầu thôi nào!',
  'code':
    'Chúng ta sẽ quan sát chương trình Python chạy từng bước một. ' +
    'Hãy nhìn vào bảng Variables bên phải để thấy giá trị của các biến ' +
    'thay đổi sau mỗi lệnh gán. Nhấn Bước tiếp để chạy từng dòng, ' +
    'hoặc nhấn Tự chạy để xem toàn bộ quá trình.',
  'kichban':
    'Chào mừng đến với Kịch Bản Bài Dạy. Tại đây giáo viên có thể lên kế hoạch ' +
    'trình tự hoạt động: hộp thoại, câu hỏi, giải thích và chọn người phát biểu.',
  'chon':
    'Bây giờ chúng ta sẽ chọn ngẫu nhiên một bạn để trả lời câu hỏi. ' +
    'Tất cả các em hãy chuẩn bị sẵn sàng, vì máy tính có thể gọi bất kỳ ai. ' +
    'Ai được chọn hãy tự tin trả lời nhé!',
  'game':
    'Bây giờ chúng ta sẽ chơi trò Ai Thông Minh Hơn để củng cố kiến thức Bài 17. ' +
    'Trò chơi có 12 câu hỏi về biến, lệnh gán, phép toán và từ khóa Python. ' +
    'Mỗi câu có 4 lựa chọn. Hãy nhanh tay và suy nghĩ kỹ trước khi chọn. Chúc các em vui!',
};

// Lưu chế độ hiện tại để spLoadContextScript biết phải tải script nào
let _currentAppMode = 'slides';

