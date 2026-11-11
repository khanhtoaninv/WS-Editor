#!/usr/bin/env python3
"""Ghép các file trong nguon/ thành 3 lệnh dán cho AI (11, 12, 13).

Chạy: python3 ghep_lenh.py   (trong thư mục BO_AI_STARTERS)
Bố cục mẫu: Q10, Q3, Q4, Q1, Q2 cho B1–B5, mức Vừa, kiểu nghĩa.
"""
import os
import re

GOC = os.path.dirname(os.path.abspath(__file__))
NGUON = os.path.join(GOC, 'nguon')

BO_CUC = [('B1', 'Q10'), ('B2', 'Q3'), ('B3', 'Q4'), ('B4', 'Q1'), ('B5', 'Q2')]
MUC = 'Vừa'
DANG_DUNG = sorted({q for _, q in BO_CUC}, key=lambda q: int(q[1:]))


def doc(ten):
    with open(os.path.join(NGUON, ten), encoding='utf-8') as f:
        return f.read().strip('\n')


def bo_dau(s):
    """Bỏ dòng tiêu đề '# …' và các dòng đầu file (Tên:, Phiên bản:…) trước mục ## đầu tiên."""
    i = s.find('\n## ')
    return s[i + 1:] if i >= 0 else s


def ha_cap(s, n=1):
    return re.sub(r'^(#+) ', lambda m: '#' * (len(m.group(1)) + n) + ' ', s, flags=re.M)


def tach_muc(s, cap):
    """Tách văn bản thành [(tiêu đề, nội dung)] theo tiêu đề cấp `cap` (số dấu #)."""
    mau = re.compile(r'^' + '#' * cap + r' (.*)$', re.M)
    vt = [(m.start(), m.group(1)) for m in mau.finditer(s)]
    ra = []
    for k, (b, td) in enumerate(vt):
        e = vt[k + 1][0] if k + 1 < len(vt) else len(s)
        ra.append((td, s[b:e].rstrip('\n')))
    dau = s[:vt[0][0]].rstrip('\n') if vt else s
    return dau, ra


def loc_muc_do(dong):
    """'- Mức độ: Dễ: …. Vừa: …. Khó: ….' → '- Mức độ Vừa: ….'"""
    m = re.match(r'- Mức độ(?: \([^)]*\))?: (.*)$', dong)
    if not m or 'Vừa:' not in m.group(1):
        return dong
    phan = re.split(r'(?:^|\s)(Dễ|Vừa|Khó): ', ' ' + m.group(1))
    d = {phan[i]: phan[i + 1].strip() for i in range(1, len(phan) - 1, 2)}
    return '- Mức độ ' + MUC + ': ' + d[MUC]


# ---------- Trình tự đã lọc ----------
def trinh_tu_loc():
    s = bo_dau(doc('2_TRINH_TU_GRAMMAR.md'))
    dau, muc = tach_muc(s, 2)
    giu_b = {b: q for b, q in BO_CUC}
    ra = []
    for td, nd in muc:
        if td == 'Kiểu hình thức':
            continue
        if td == 'Mức độ':
            nd = ('## Mức độ\nMọi Task của phiếu này ở mức ' + MUC + '. Độ dài bài đọc và phần đề theo Cấp độ. '
                  'Số câu xác định bằng nghĩa tối thiểu và số câu hỏi lộ đáp án tối đa của từng Task ghi ở Bố cục.')
        if td in ('Tiêu chí quan trọng nhất', 'Định nghĩa'):
            nd = '\n'.join(l for l in nd.split('\n') if 'iểu hình thức' not in l)
            nd = nd.replace('- Kiểu nghĩa: học sinh', '- Học sinh').replace(' (kiểu nghĩa)', '')
        if td == 'Quy tắc toàn phiếu':
            nd = '\n'.join(l for l in nd.split('\n') if not l.startswith('2b.'))
            nd = nd.replace(' (kiểu nghĩa)', '')
        m = re.match(r'(B\d):', td)
        if m:
            b = m.group(1)
            if b not in giu_b:
                continue
            dau_b, dang = tach_muc(nd, 3)
            con = [dau_b]
            for tdq, ndq in dang:
                if tdq.startswith('Dạng ' + giu_b[b] + ' '):
                    ndq = '\n'.join(loc_muc_do(l) for l in ndq.split('\n'))
                    con.append(ndq)
            nd = '\n\n'.join(con)
        nd = nd.replace(' (hoặc 2b)', '')
        ra.append(nd)
    return '\n\n'.join(ra)


def mo_ta_loc():
    s = bo_dau(doc('6_MO_TA_DANG_Q.md'))
    _, muc = tach_muc(s, 2)
    return '\n\n'.join(nd for td, nd in muc if td.split()[0] in DANG_DUNG)


def cau_mau_loc():
    s = doc('5_CAU_MAU_GRAMMAR.md')
    dau, muc = tach_muc(s, 2)
    dau = '\n'.join(l for l in dau.split('\n')[1:] if not re.match(r'(Trình tự|Cấp độ|Phiên bản):', l)).strip()
    giu = []
    for td, nd in muc:
        if td == 'Kiến thức minh họa':
            giu.append(nd)
            continue
        m = re.match(r'(B\d) · (Q\d+) ', td)
        if m and (m.group(1), m.group(2)) in BO_CUC:
            giu.append(nd)
    return dau + '\n\n' + '\n\n'.join(giu)


def cach_thuc():
    s = doc('8_CACH_THUC_DAT_CAU_HOI.md')
    s = '\n'.join(s.split('\n')[1:])  # bỏ '# Cách thức…'
    s = re.sub(r'^Phiên bản:.*\n', '', s, flags=re.M)
    return s.strip()


def quy_tac_md():
    s = bo_dau(doc('7_QUY_TAC_MD.md'))
    dong = []
    for l in s.split('\n'):
        m = re.match(r'- \*\*(Q\d+)\*\*', l)
        if m and m.group(1) not in DANG_DUNG:
            continue
        dong.append(l)
    return '\n'.join(dong)


def cap_do():
    return bo_dau(doc('3_CAP_DO_STARTERS.md'))


def bo_cuc():
    return bo_dau(doc('10_BO_CUC_MAU.md'))


def kien_thuc():
    return doc('1_KIEN_THUC_can.md')


def tu_vung():
    return doc('4_TU_VUNG_NEN_STARTERS.md')


LENH_SINH = '''## 9. Lệnh
Viết đúng 5 Task theo Bố cục (mục 8), theo thứ tự, rồi `## Đáp án`, rồi `## Báo cáo`, đúng khung ở mục 3.
- Mỗi Task: đúng dạng, đúng số câu, mức Vừa. Câu xác định bằng nghĩa đặt đúng vị trí bắt buộc.
- Nội dung ngôn ngữ chỉ lấy từ Kiến thức (mục 10). Từ vựng theo mục 2 và mục 11.
- Trước khi trả về, soát từng câu với Tiêu chí kiểm định của B, các quy tắc ở mục 6 và các câu mẫu Không đạt ở mục 7. Câu nào vi phạm thì sửa xong mới trả về.

`## Báo cáo` ghi cho từng Task các nhãn sau (nhãn nào không áp dụng cho Task thì bỏ):
- Mục tiêu: các mã M.
- Đáp án theo K: `1 K1; 2 K2; …` (Task 1–5).
- Câu xác định bằng nghĩa: số thứ tự (Task 2, 3, 4).
- Câu hỏi lộ đáp án: số thứ tự, hoặc "không có" (Task 2).
- Lựa chọn: mỗi câu một mục, ví dụ `1 a: B đúng / A sai nghĩa / C sai hình thức` (Task 2); với chọn trong câu ghi theo thứ tự vế, ví dụ `1 a: vế 2 đúng / vế 1 sai nghĩa / vế 3 sai hình thức` (Task 3).
- Dạng câu đã phủ: loại câu và chủ ngữ đã dùng (Task 3, 4).'''


def lenh_sinh():
    phan = [
        '# LỆNH SINH PHIẾU',
        '''## 1. Vai trò
Bạn là giáo viên tiếng Anh giỏi, soạn phiếu bài tập ngữ pháp cho học sinh tiểu học Việt Nam ở cấp độ cuối Starters. Bạn viết các Task đúng theo Bố cục ở mục 8, dựa trên Kiến thức ở mục 10. Chỉ trả về Markdown theo mục 3.

Khi có mâu thuẫn, theo thứ tự ưu tiên:
1. Cú pháp: mục 3.
2. Phiếu gồm Task nào, mấy câu, mức nào, số liệu: mục 8.
3. Cách viết câu hỏi: mục 4 là luật cứng; mục 6 chỉ thêm hoặc làm chặt hơn, trừ dòng `Ngoại lệ:`.
4. Nội dung ngôn ngữ: chỉ mục 10 quyết định.
5. Mục 7 chỉ minh họa cách làm; không chép chữ của câu mẫu.''',
        '## 2. Cấp độ\n' + ha_cap(cap_do()),
        '## 3. Quy tắc định dạng MD\n' + ha_cap(quy_tac_md()),
        '## 4. Cách thức đặt câu hỏi\n' + ha_cap(cach_thuc()),
        '## 5. Mô tả các dạng dùng trong phiếu\n' + ha_cap(mo_ta_loc()),
        '## 6. Trình tự Grammar (đã lọc theo Bố cục)\n' + ha_cap(trinh_tu_loc()),
        '## 7. Câu mẫu\n' + ha_cap(cau_mau_loc()),
        '## 8. Bố cục phiếu\n' + ha_cap(bo_cuc()),
        LENH_SINH,
        '## 10. Kiến thức\n' + ha_cap(kien_thuc(), 1).replace('## Kiến thức\n', '', 1),
        '## 11. Từ vựng nền\n' + ha_cap(bo_dau(tu_vung())),
    ]
    return '\n\n'.join(phan) + '\n'


def lenh_ra_soat():
    rs = doc('9_RA_SOAT.md')
    rs = '\n'.join(l for l in rs.split('\n')[1:] if not l.startswith('Phiên bản:')).strip()
    phan = [
        '# LỆNH RÀ SOÁT PHIẾU',
        ha_cap(rs, 0),
        '## Tiêu chí\n### Trình tự (đã lọc theo Bố cục)\n' + ha_cap(trinh_tu_loc(), 2),
        '### Cách thức đặt câu hỏi\n' + ha_cap(cach_thuc(), 2),
        '### Ràng buộc của các dạng\n' + ha_cap(mo_ta_loc(), 2),
        '## Kiến thức\n' + ha_cap(kien_thuc(), 1).replace('## Kiến thức\n', '', 1),
        '## Bố cục\n' + ha_cap(bo_cuc()),
        '## Phiếu cần rà soát\n<<DÁN PHIẾU ĐÃ BỎ ĐÁP ÁN VÀO ĐÂY>>',
    ]
    return '\n\n'.join(phan) + '\n'


LENH_SUA = '''# LỆNH SỬA PHIẾU
Dưới đây là các lỗi tìm thấy ở phiếu bạn vừa viết trong cuộc trò chuyện này.

Hãy trả về **lại toàn bộ phiếu** (đủ mọi Task, `## Đáp án`, `## Báo cáo`), đúng khung ở mục 3 của lệnh sinh phiếu:
- sửa đúng các câu có lỗi;
- giữ nguyên từng chữ các câu và các Task không có lỗi;
- sau khi sửa, mỗi Task vẫn đúng số câu, đúng vị trí câu xác định bằng nghĩa và mọi quy tắc khác;
- cập nhật `## Báo cáo` cho khớp.

Không giải thích.

## Lỗi
<<DÁN DANH SÁCH LỖI VÀO ĐÂY: lỗi của trang kiểm tra máy và/hoặc phần ## Rà soát>>
'''


def kiem_tra_html():
    import json
    tv = tu_vung()
    tu = tv.split('## Từ\n', 1)[1].split('\n## ', 1)[0].strip()
    ten = tv.split('## Tên riêng\n', 1)[1].strip()
    ds_tu = [x.strip() for x in tu.split(',') if x.strip()]
    ds_ten = [x.strip() for x in ten.split(',') if x.strip()]
    with open(os.path.join(GOC, 'cong_cu', 'kiem_tra_khung.html'), encoding='utf-8') as f:
        h = f.read()
    h = h.replace('/*TU_VUNG*/[]', json.dumps(ds_tu, ensure_ascii=False))
    h = h.replace('/*TEN_RIENG*/[]', json.dumps(ds_ten, ensure_ascii=False))
    return h


def main():
    ra = {
        'KIEM_TRA_PHIEU.html': kiem_tra_html(),
        '11_LENH_SINH_PHIEU.md': lenh_sinh(),
        '12_LENH_RA_SOAT.md': lenh_ra_soat(),
        '13_LENH_SUA_PHIEU.md': LENH_SUA,
    }
    for ten, nd in ra.items():
        with open(os.path.join(GOC, ten), 'w', encoding='utf-8') as f:
            f.write(nd)
        print(ten, len(nd), 'ký tự')


if __name__ == '__main__':
    main()
