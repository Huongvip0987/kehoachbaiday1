// ══════════════════════════════════
// SLIDE SCRIPTS – lời thoại mẫu cho từng slide (key = tên ngữ nghĩa)
// ══════════════════════════════════
window.SLIDE_SCRIPTS = {

  title: {
    vi: 'Chào mừng các em đến với Bài 16: Ngôn ngữ lập trình bậc cao và Python! Hôm nay chúng ta tìm hiểu lịch sử ngôn ngữ lập trình, làm quen với môi trường Python và thực hành các lệnh đầu tiên. Đây là bước khởi đầu quan trọng trong hành trình lập trình của các em!',
    en: 'Welcome to Lesson 16: High-level Programming Languages and Python! Today we explore the history of programming languages, get familiar with the Python environment, and practice our first commands.'
  },

  khoi_dong: {
    vi: 'Phần Khởi Động. Các em đã từng nghe đến các ngôn ngữ lập trình chưa? Python, C++, Java, Scratch — đó đều là ngôn ngữ lập trình. Máy tính chỉ hiểu ngôn ngữ nhị phân, vậy làm sao con người ra lệnh cho máy tính? Đó chính là câu hỏi chúng ta sẽ giải đáp hôm nay.',
    en: 'Warm-up section. Have you heard of programming languages? Python, C++, Java, Scratch are all programming languages. Computers only understand binary — so how do humans give instructions to a computer? That is exactly what we will answer today.'
  },

  nnlt_bac_cao: {
    vi: 'Phần 1: Ngôn ngữ lập trình bậc cao. Có ba mức ngôn ngữ lập trình. Ngôn ngữ máy là dãy số 0 và 1, máy hiểu ngay nhưng người rất khó đọc. Hợp ngữ Assembly dùng ký hiệu gợi nhớ như MOV, ADD — dễ hơn một chút. Ngôn ngữ bậc cao như Python, C, Java gần với ngôn ngữ tự nhiên, con người dễ đọc và viết, nhưng cần chương trình dịch để chuyển sang mã máy.',
    en: 'Section 1: High-level Programming Languages. There are three levels. Machine language uses 0s and 1s. Assembly uses mnemonics like MOV, ADD. High-level languages like Python, C, Java are close to natural language but need a compiler or interpreter.'
  },

  python_gioi_thieu: {
    vi: 'Giới thiệu về Python. Python do Guido van Rossum — một lập trình viên người Hà Lan — tạo ra và công bố năm 1991. Tên Python không lấy từ con trăn mà từ chương trình hài kịch Monty Python mà ông yêu thích! Python nổi tiếng vì cú pháp đơn giản, dễ học, được dùng rộng rãi trong khoa học dữ liệu, trí tuệ nhân tạo, web và tự động hóa.',
    en: 'Introduction to Python. Python was created by Guido van Rossum, a Dutch programmer, and released in 1991. The name comes from the comedy show Monty Python, not the snake! Python is famous for its simple syntax and is widely used in data science, AI, web development, and automation.'
  },

  moi_truong: {
    vi: 'Phần 2: Môi trường lập trình Python. Chúng ta sử dụng IDLE — môi trường lập trình đi kèm khi cài Python. Khi mở Python Shell, các em thấy dấu nhắc lệnh ba mũi tên: >>>. Đó là Python đang chờ lệnh từ các em! Có hai chế độ làm việc: gõ lệnh trực tiếp và soạn thảo chương trình.',
    en: 'Section 2: Python Programming Environment. We use IDLE, which comes with Python installation. When you open the Python Shell, you see the prompt >>> — Python is waiting for your commands! There are two modes: interactive mode and script mode.'
  },

  che_do_gap_lenh: {
    vi: 'Chế độ gõ lệnh trực tiếp — Interactive Mode. Khi thấy dấu >>>, các em gõ lệnh và nhấn Enter — Python thực hiện ngay lập tức và hiện kết quả. Ví dụ: gõ 2 + 3, nhấn Enter, Python trả về 5. Chế độ này rất tiện để thử nghiệm nhanh và tính toán nhỏ.',
    en: 'Interactive Mode. When you see >>>, type a command and press Enter — Python executes immediately and shows the result. For example, type 2 + 3, press Enter, Python returns 5. This mode is great for quick experiments.'
  },

  che_do_soan_thao: {
    vi: 'Chế độ soạn thảo — Script Mode. Vào File → New File để mở cửa sổ soạn thảo. Các em viết toàn bộ chương trình, lưu với đuôi .py, rồi nhấn F5 để chạy. Đây là cách viết chương trình thực sự — chương trình Bai1.py của chúng ta sẽ được tạo theo cách này.',
    en: 'Script Mode. Go to File → New File to open the editor. Write the full program, save with .py extension, then press F5 to run. This is how real programs are written — our Bai1.py will be created this way.'
  },

  lenh_dau_tien: {
    vi: 'Phần 3: Một số lệnh Python đầu tiên. Python tự nhận biết kiểu dữ liệu: số nguyên int, số thực float, xâu ký tự str. Các phép toán cơ bản: cộng +, trừ -, nhân *, chia /. Chia / luôn cho kết quả float. Thứ tự ưu tiên: nhân chia trước, cộng trừ sau — giống toán học.',
    en: 'Section 3: First Python Commands. Python automatically recognizes data types: integer int, float, string str. Basic operators: +, -, *, /. Division / always returns float. Order of operations: multiplication and division first, then addition and subtraction.'
  },

  print_cuphap: {
    vi: 'Lệnh print() — in dữ liệu ra màn hình. Cú pháp: print(giá trị 1, giá trị 2, ...). Có thể in nhiều giá trị cùng lúc, Python tự thêm dấu cách giữa các giá trị. Có thể in số, xâu ký tự, kết quả biểu thức kết hợp trong cùng một lệnh. Đây là lệnh các em sẽ dùng nhiều nhất khi bắt đầu học Python.',
    en: 'The print() function — outputs data to the screen. Syntax: print(value1, value2, ...). Multiple values can be printed at once; Python automatically adds spaces between them. You can print numbers, strings, and expression results together.'
  },

  thuc_hanh: {
    vi: 'Phần Thực Hành. Nhiệm vụ 1: Tạo file Bai1.py trong IDLE. Nhiệm vụ 2: Viết lệnh print("Xin chao!") và chạy chương trình bằng F5. Quan sát kết quả xuất hiện trong cửa sổ Shell. Chương trình đầu tiên của các em đã chạy thành công! Hãy thử thêm các lệnh print() khác để in tên, lớp của mình.',
    en: 'Practical Section. Task 1: Create Bai1.py in IDLE. Task 2: Write print("Xin chao!") and run with F5. Observe the output in the Shell window. Your first program runs successfully! Try adding more print() commands to display your name and class.'
  },

  luyen_tap: {
    vi: 'Luyện Tập. Triple quotes — dấu ba nháy kép """...""" — cho phép viết xâu ký tự trải dài nhiều dòng mà không cần ký tự đặc biệt. Rất tiện khi cần in đoạn văn dài. Trong phần luyện tập, các em thử viết chương trình in một đoạn thơ hoặc bài hát yêu thích bằng triple quotes.',
    en: 'Practice Section. Triple quotes """...""" allow writing strings that span multiple lines without special characters. Very useful for printing long paragraphs. Practice writing a program that prints a poem or song lyrics using triple quotes.'
  },

  van_dung: {
    vi: 'Vận Dụng. Chúng ta viết chương trình in bảng nhân 5 bằng vòng lặp for. Lệnh for i in range(1, 6) cho i chạy từ 1 đến 5 — mỗi lần lặp thực hiện lệnh bên trong. Đây là lần đầu tiên các em gặp vòng lặp — một công cụ cực kỳ mạnh trong lập trình. Bài 18 sẽ học kỹ hơn về vòng lặp.',
    en: 'Application Section. We write a program to print the multiplication table for 5 using a for loop. The command for i in range(1, 6) makes i run from 1 to 5 — each iteration executes the inner command. This is your first encounter with loops — an extremely powerful programming tool.'
  },

  tong_ket: {
    vi: 'Tổng Kết Bài 16. Điểm thứ nhất: ngôn ngữ lập trình bậc cao gần với ngôn ngữ tự nhiên, cần chương trình dịch để chuyển sang mã máy. Điểm thứ hai: Python do Guido van Rossum tạo năm 1991, ngôn ngữ đơn giản và phổ biến. Điểm thứ ba: môi trường IDLE có hai chế độ — gõ lệnh trực tiếp và soạn thảo chương trình. Điểm thứ tư: lệnh print() in dữ liệu ra màn hình — lệnh cơ bản nhất trong Python. Bài tiếp theo là Bài 17: Biến và Lệnh Gán.',
    en: 'Lesson 16 Summary. First: high-level programming languages are close to natural language and need a translator to convert to machine code. Second: Python was created by Guido van Rossum in 1991. Third: IDLE has two modes — interactive and script. Fourth: print() outputs data to the screen. Next lesson: Lesson 17, Variables and Assignment.'
  }

};
