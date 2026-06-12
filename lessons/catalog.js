// ══════════════════════════════════
// LESSON CATALOG – Tin học THPT
// Bộ sách: Kết nối tri thức với cuộc sống
// Nguồn: danhsachbaiTHPT.docx
// ══════════════════════════════════
// status: 'available' | 'soon' (mặc định)
// path:   đường dẫn từ gốc app (chỉ khi available)
// tiets:  số tiết (ước tính theo phân phối chương trình)

const LESSON_CATALOG = {
  series: 'Kết nối tri thức với cuộc sống',
  grades: [

    // ══════════════════════════════════
    //  LỚP 10  –  34 bài · 6 chủ đề
    // ══════════════════════════════════
    {
      grade: 10,
      label: 'Lớp 10',
      topics: [
        {
          id: 'c1_10', icon: '🖥️', color: '#5c8df6',
          title: 'Chủ đề 1 · Máy tính và xã hội tri thức',
          lessons: [
            { no: 1,  title: 'Thông tin và xử lí thông tin',                           tiets: 2 },
            { no: 2,  title: 'Vai trò của thiết bị thông minh và tin học đối với xã hội', tiets: 2 },
            { no: 3,  title: 'Một số kiểu dữ liệu và dữ liệu văn bản',                 tiets: 2 },
            { no: 4,  title: 'Hệ nhị phân và dữ liệu số nguyên',                       tiets: 2 },
            { no: 5,  title: 'Dữ liệu lôgic',                                          tiets: 1 },
            { no: 6,  title: 'Dữ liệu âm thanh và hình ảnh',                           tiets: 1 },
            { no: 7,  title: 'Thực hành sử dụng thiết bị số thông dụng',               tiets: 2 },
          ]
        },
        {
          id: 'c2_10', icon: '🌐', color: '#4caf50',
          title: 'Chủ đề 2 · Mạng máy tính và Internet',
          lessons: [
            { no: 8,  title: 'Mạng máy tính trong cuộc sống hiện đại',                 tiets: 2 },
            { no: 9,  title: 'An toàn trong không gian mạng',                          tiets: 2 },
            { no: 10, title: 'Thực hành khai thác tài nguyên trên Internet',           tiets: 2 },
          ]
        },
        {
          id: 'c3_10', icon: '⚖️', color: '#9c27b0',
          title: 'Chủ đề 3 · Đạo đức, pháp luật và văn hoá trong môi trường số',
          lessons: [
            { no: 11, title: 'Ứng dụng trên môi trường số. Nghĩa vụ tôn trọng bản quyền', tiets: 2 },
          ]
        },
        {
          id: 'c4_10', icon: '🎨', color: '#e91e63',
          title: 'Chủ đề 4 · Ứng dụng tin học',
          lessons: [
            { no: 12, title: 'Phần mềm thiết kế đồ hoạ',                              tiets: 2 },
            { no: 13, title: 'Bổ sung các đối tượng đồ hoạ',                          tiets: 2 },
            { no: 14, title: 'Làm việc với đối tượng đường và văn bản',               tiets: 2 },
            { no: 15, title: 'Hoàn thiện hình ảnh đồ hoạ',                            tiets: 2 },
          ]
        },
        {
          id: 'c5_10', icon: '🐍', color: '#ffd43b',
          title: 'Chủ đề 5 · Giải quyết vấn đề với sự trợ giúp của máy tính',
          lessons: [
            { no: 16, title: 'Ngôn ngữ lập trình bậc cao và Python', tiets: 2, status: 'available', path: 'lesson:tin10/b16' },
            { no: 17, title: 'Biến và lệnh gán',  tiets: 2, status: 'available', path: 'lesson:tin10/b17' },
            { no: 18, title: 'Các lệnh vào ra đơn giản',                              tiets: 2 },
            { no: 19, title: 'Câu lệnh điều kiện If',                                 tiets: 2 },
            { no: 20, title: 'Câu lệnh lặp For',                                      tiets: 2 },
            { no: 21, title: 'Câu lệnh lặp While',                                    tiets: 2 },
            { no: 22, title: 'Kiểu dữ liệu danh sách',                               tiets: 2 },
            { no: 23, title: 'Một số lệnh làm việc với dữ liệu danh sách',           tiets: 2 },
            { no: 24, title: 'Xâu kí tự',                                             tiets: 2 },
            { no: 25, title: 'Một số lệnh làm việc với xâu kí tự',                   tiets: 2 },
            { no: 26, title: 'Hàm trong Python',                                      tiets: 2 },
            { no: 27, title: 'Tham số của hàm',                                       tiets: 2 },
            { no: 28, title: 'Phạm vi của biến',                                      tiets: 1 },
            { no: 29, title: 'Nhận biết lỗi chương trình',                            tiets: 1 },
            { no: 30, title: 'Kiểm thử và gỡ lỗi chương trình',                      tiets: 2 },
            { no: 31, title: 'Thực hành viết chương trình đơn giản',                 tiets: 2 },
            { no: 32, title: 'Ôn tập lập trình Python',                               tiets: 1 },
          ]
        },
        {
          id: 'c6_10', icon: '💼', color: '#78909c',
          title: 'Chủ đề 6 · Hướng nghiệp với Tin học',
          lessons: [
            { no: 33, title: 'Nghề thiết kế đồ hoạ máy tính',                        tiets: 1 },
            { no: 34, title: 'Nghề phát triển phần mềm',                              tiets: 1 },
          ]
        },
      ]
    },

    // ══════════════════════════════════
    //  LỚP 11  –  16 bài · 5 chủ đề
    // ══════════════════════════════════
    {
      grade: 11,
      label: 'Lớp 11',
      topics: [
        {
          id: 'c1_11', icon: '🖥️', color: '#5c8df6',
          title: 'Chủ đề 1 · Máy tính và xã hội tri thức',
          lessons: [
            { no: 1,  title: 'Hệ điều hành',                                          tiets: 2 },
            { no: 2,  title: 'Thực hành sử dụng hệ điều hành',                       tiets: 2 },
            { no: 3,  title: 'Phần mềm nguồn mở và phần mềm chạy trên Internet',    tiets: 1 },
            { no: 4,  title: 'Bên trong máy tính',                                    tiets: 2 },
            { no: 5,  title: 'Kết nối máy tính với các thiết bị số',                 tiets: 2 },
          ]
        },
        {
          id: 'c2_11', icon: '📁', color: '#ff9800',
          title: 'Chủ đề 2 · Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin',
          lessons: [
            { no: 6,  title: 'Lưu trữ và chia sẻ tệp tin trên Internet',             tiets: 2 },
            { no: 7,  title: 'Thực hành tìm kiếm thông tin trên Internet',           tiets: 2 },
            { no: 8,  title: 'Thực hành nâng cao sử dụng thư điện tử và mạng xã hội', tiets: 2 },
          ]
        },
        {
          id: 'c3_11', icon: '⚖️', color: '#9c27b0',
          title: 'Chủ đề 3 · Đạo đức, pháp luật và văn hóa trong môi trường số',
          lessons: [
            { no: 9,  title: 'Giao tiếp an toàn trên Internet',                      tiets: 2 },
          ]
        },
        {
          id: 'c4_11', icon: '🗄️', color: '#26a69a',
          title: 'Chủ đề 4 · Giới thiệu các hệ cơ sở dữ liệu',
          lessons: [
            { no: 10, title: 'Lưu trữ dữ liệu và khai thác thông tin phục vụ quản lí', tiets: 2 },
            { no: 11, title: 'Cơ sở dữ liệu',                                        tiets: 2 },
            { no: 12, title: 'Hệ quản trị cơ sở dữ liệu và hệ cơ sở dữ liệu',      tiets: 2 },
            { no: 13, title: 'Cơ sở dữ liệu quan hệ',                                tiets: 2 },
            { no: 14, title: 'SQL – Ngôn ngữ truy vấn có cấu trúc',                  tiets: 3 },
            { no: 15, title: 'Bảo mật và an toàn hệ cơ sở dữ liệu',                 tiets: 2 },
          ]
        },
        {
          id: 'c5_11', icon: '💼', color: '#78909c',
          title: 'Chủ đề 5 · Hướng nghiệp với Tin học',
          lessons: [
            { no: 16, title: 'Công việc quản trị cơ sở dữ liệu',                    tiets: 1 },
          ]
        },
      ]
    },

    // ══════════════════════════════════
    //  LỚP 12  –  30 bài · 7 chủ đề
    //  (Bài 22–30: Định hướng Khoa học máy tính)
    // ══════════════════════════════════
    {
      grade: 12,
      label: 'Lớp 12',
      topics: [
        {
          id: 'c1_12', icon: '🤖', color: '#ffd43b',
          title: 'Chủ đề 1 · Máy tính và xã hội tri thức',
          lessons: [
            { no: 1,  title: 'Làm quen với Trí tuệ nhân tạo',                        tiets: 2 },
            { no: 2,  title: 'Trí tuệ nhân tạo trong khoa học và đời sống',          tiets: 2 },
          ]
        },
        {
          id: 'c2_12', icon: '🌐', color: '#4caf50',
          title: 'Chủ đề 2 · Mạng máy tính và Internet',
          lessons: [
            { no: 3,  title: 'Một số thiết bị mạng thông dụng',                      tiets: 2 },
            { no: 4,  title: 'Giao thức mạng',                                        tiets: 2 },
            { no: 5,  title: 'Thực hành chia sẻ tài nguyên trên mạng',               tiets: 2 },
          ]
        },
        {
          id: 'c3_12', icon: '⚖️', color: '#9c27b0',
          title: 'Chủ đề 3 · Đạo đức, pháp luật và văn hóa trong môi trường số',
          lessons: [
            { no: 6,  title: 'Giao tiếp và ứng xử trong không gian mạng',            tiets: 1 },
          ]
        },
        {
          id: 'c4_12', icon: '🌍', color: '#4fc3f7',
          title: 'Chủ đề 4 · Giải quyết vấn đề với sự trợ giúp của máy tính (HTML & CSS)',
          lessons: [
            { no: 7,  title: 'HTML và cấu trúc trang web',                            tiets: 2 },
            { no: 8,  title: 'Định dạng văn bản (HTML)',                              tiets: 2 },
            { no: 9,  title: 'Tạo danh sách, bảng',                                  tiets: 2 },
            { no: 10, title: 'Tạo liên kết',                                          tiets: 2 },
            { no: 11, title: 'Chèn tệp tin đa phương tiện và khung nội tuyến',       tiets: 2 },
            { no: 12, title: 'Tạo biểu mẫu',                                          tiets: 2 },
            { no: 13, title: 'Khái niệm, vai trò của CSS',                            tiets: 2 },
            { no: 14, title: 'Định dạng văn bản bằng CSS',                           tiets: 2 },
            { no: 15, title: 'Tạo màu cho chữ và nền',                               tiets: 2 },
            { no: 16, title: 'Định dạng khung',                                       tiets: 2 },
            { no: 17, title: 'Các mức ưu tiên của bộ chọn',                          tiets: 2 },
            { no: 18, title: 'Thực hành tổng hợp thiết kế trang web',                tiets: 2 },
          ]
        },
        {
          id: 'c5_12', icon: '💼', color: '#78909c',
          title: 'Chủ đề 5 · Hướng nghiệp với Tin học',
          lessons: [
            { no: 19, title: 'Dịch vụ sửa chữa và bảo trì máy tính',                tiets: 1 },
            { no: 20, title: 'Nhóm nghề quản trị thuộc ngành Công nghệ thông tin',  tiets: 1 },
            { no: 21, title: 'Hội thảo hướng nghiệp Tin học 12',                    tiets: 2 },
          ]
        },
        {
          id: 'c6_12', icon: '🔗', color: '#2e7d32',
          title: '⭐ Định hướng KHMT – Chủ đề 6 · Mạng máy tính và Internet (nâng cao)',
          lessons: [
            { no: 22, title: 'Tìm hiểu thiết bị mạng',                               tiets: 2 },
            { no: 23, title: 'Đường truyền mạng và ứng dụng',                        tiets: 2 },
            { no: 24, title: 'Sơ bộ về thiết kế mạng',                               tiets: 2 },
          ]
        },
        {
          id: 'c7_12', icon: '📊', color: '#ef6c00',
          title: '⭐ Định hướng KHMT – Chủ đề 7 · Học máy và Khoa học dữ liệu',
          lessons: [
            { no: 25, title: 'Làm quen với Học máy',                                 tiets: 2 },
            { no: 26, title: 'Làm quen với Khoa học dữ liệu',                        tiets: 2 },
            { no: 27, title: 'Máy tính và Khoa học dữ liệu',                         tiets: 2 },
            { no: 28, title: 'Thực hành trải nghiệm trích rút thông tin và tri thức', tiets: 2 },
            { no: 29, title: 'Mô phỏng trong giải quyết vấn đề',                     tiets: 2 },
            { no: 30, title: 'Ứng dụng mô phỏng trong giáo dục',                     tiets: 2 },
          ]
        },
      ]
    }

  ] // grades
}; // LESSON_CATALOG
