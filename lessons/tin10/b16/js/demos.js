
// ══════════════════════════════════
// DEMOS – code + steps (pure JS, no Python needed)
// ══════════════════════════════════
const _s = (value, type) => ({ value, type });
const _i = v => _s(String(v), 'int');
const _f = v => _s(String(v), 'float');
const _str = v => _s('"' + v + '"', 'str');

const DEMOS = {
  demo_print: {
    title: 'Lệnh print()',
    code:
`# Ví dụ 3: Lệnh print()
print(12)
print(10, 3.4 + 4.1, "hoa binh")
print("Day ba so chan:", 2, 4, 6)
print("3 + 7 =", 3 + 7)
print("13 + 10*3/2 - 3*2 =", 13 + 10*3/2 - 3*2)`,
    steps: [
      { line:0, expl:'Dòng ghi chú — Python bỏ qua, không thực thi', vars:{}, out:null },
      { line:1, expl:'🖥️ <b>print()</b> in số nguyên ra màn hình', vars:{}, out:'12' },
      { line:2, expl:'🖥️ <b>print()</b> in nhiều giá trị cùng lúc, cách nhau dấu cách', vars:{}, out:'10 7.5 hoa binh' },
      { line:3, expl:'🖥️ Kết hợp xâu ký tự và số trong print()', vars:{}, out:'Day ba so chan: 2 4 6' },
      { line:4, expl:'🧮 Python tính biểu thức <code>3+7=10</code> trước rồi mới in', vars:{}, out:'3 + 7 = 10' },
      { line:5, expl:'🧮 Thứ tự ưu tiên: * / trước → + - sau → kết quả float', vars:{}, out:'13 + 10*3/2 - 3*2 = 22.0' },
    ]
  },

  demo_thuchanh: {
    title: 'Thực Hành – Bai1.py',
    code:
`# Chuong trinh dau tien - Bai1.py
print("Xin chao!")
print("Toi la hoc sinh lop 10")
print("Chao mung den voi Python!")`,
    steps: [
      { line:0, expl:'Dòng ghi chú — ghi tên file chương trình', vars:{}, out:null },
      { line:1, expl:'🖥️ Dòng lệnh đầu tiên — in xâu ký tự ra màn hình', vars:{}, out:'Xin chao!' },
      { line:2, expl:'🖥️ Mỗi lệnh print() in một dòng riêng biệt', vars:{}, out:'Toi la hoc sinh lop 10' },
      { line:3, expl:'✅ Chương trình hoàn chỉnh! 3 lệnh → 3 dòng output', vars:{}, out:'Chao mung den voi Python!' },
    ]
  },

  demo_vandung: {
    title: 'Vận Dụng – Triple Quotes & Bảng Nhân',
    code:
`# Triple quotes – viết xâu nhiều dòng
print("""Khong co viec gi kho
Chi so long khong ben
Dao nui va lap bien
Quyet chi at lam nen""")

# Bang nhan 5
for i in range(1, 6):
    print("5 x", i, "=", 5 * i)`,
    steps: [
      { line:0, expl:'Dòng ghi chú — giới thiệu nội dung phần 1', vars:{}, out:null },
      { line:1, expl:'🔤 <b>Triple quotes</b> <code>"""..."""</code> — xâu ký tự nhiều dòng, nhấn Enter giữa xâu', vars:{}, out:'Khong co viec gi kho\nChi so long khong ben\nDao nui va lap bien\nQuyet chi at lam nen' },
      { line:6, expl:'Dòng ghi chú — giới thiệu nội dung phần 2', vars:{}, out:null },
      { line:7, expl:'🔄 <b>for i in range(1,6)</b> — i chạy từ 1 đến 5', vars:{ i:_i(1) }, out:'5 x 1 = 5' },
      { line:8, expl:'🔄 Vòng lặp tiếp: i = 2', vars:{ i:_i(2) }, out:'5 x 2 = 10' },
      { line:8, expl:'🔄 Vòng lặp tiếp: i = 3', vars:{ i:_i(3) }, out:'5 x 3 = 15' },
      { line:8, expl:'🔄 Vòng lặp tiếp: i = 4', vars:{ i:_i(4) }, out:'5 x 4 = 20' },
      { line:8, expl:'🔄 Vòng lặp kết thúc: i = 5', vars:{ i:_i(5) }, out:'5 x 5 = 25' },
    ]
  }
};
