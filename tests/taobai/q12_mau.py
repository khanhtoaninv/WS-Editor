# Mẫu MD cho 12 dạng Q, viết đúng như AI sẽ viết theo docs/TAO_BAI/1_DANG_Q.md (file chung 2) và CHUNG_1_QUY_TAC_MD.md.
# Mỗi mẫu: (tên, MD một Task, dòng đáp án hoặc None, Q mong đợi, số câu thật mong đợi, số câu có đáp án mong đợi)
MAU = [
 ('Q1 điền từ + khung từ + câu 0', """## Task: Complete the sentences.
Hướng dẫn: Use was or were.
Dạng: điền từ
Khung từ: was, were
0. She ___ at home yesterday.
1. They ___ happy.
2. Tom ___ at the park.
3. My friends ___ at school.""", "0. was\n1. were\n2. was\n3. were", 'Q1', 3, 3),
 ('Q1 Dạng: Q1 (mã)', """## Task: Complete.
Dạng: Q1
1. I ___ tired yesterday.
2. We ___ at the zoo.""", "1. was\n2. were", 'Q1', 2, 2),
 ('Q1 nhiều chỗ trống một câu', """## Task: Complete the sentences.
Dạng: điền từ
1. I ___ at home and my sister ___ at school.
2. They ___ hungry.""", "1. was | was\n2. were", 'Q1', 2, 2),
 ('Q2 viết câu', """## Task: Put the words in order.
Dạng: viết câu
Dòng viết: 1
1. you / did / go / where / yesterday / ?
2. was / at / I / home""", "1. Where did you go yesterday?\n2. I was at home.", 'Q2', 2, 2),
 ('Q2 Dạng: Q2', """## Task: Answer the questions.
Dạng: Q2
1. Where were you last Sunday?
2. Was it sunny?""", "1. I was at the park.\n2. Yes, it was.", 'Q2', 2, 2),
 ('Q3 lựa chọn dòng thụt dưới câu', """## Task: Choose the correct answer.
Dạng: chọn A/B/C
1. I ___ to the zoo last Sunday.
   A. go  B. went  C. goes
2. They ___ happy.
   A. was  B. is  C. were""", "1. B\n2. C", 'Q3', 2, 2),
 ('Q3 mỗi lựa chọn một dòng', """## Task: Choose.
Dạng: chọn A/B/C (khoanh)
1. Where ___ you yesterday?
   A. was
   B. were
   C. is""", "1. B", 'Q3', 1, 1),
 ('Q4 chọn trong câu có *', """## Task: Circle the correct word.
Dạng: chọn trong câu
1. There {*was|were} a cat in the garden.
2. The children {was|*were} at the park.""", None, 'Q4', 2, 2),
 ('Q4 tìm lỗi sai (nhãn A-D)', """## Task: Find the mistake.
Dạng: chọn trong câu (nhãn A-D)
1. She <u>were</u> at <u>school</u> every <u>day</u> last <u>week</u>.""", None, 'Q4', 1, 0),
 ('Q5 đúng/sai cùng hàng', """## Task: Read and circle T or F.
Bài đọc:
Last Sunday, Mai was at the beach. The weather was hot and sunny.
Dạng: đúng/sai (cùng hàng)
1. Mai was at the zoo.
2. It was hot.""", "1. F\n2. T", 'Q5', 2, 2),
 ('Q5 Dạng: Q5 (Yes/No, cùng hàng)', """## Task: Look and answer Yes or No.
Ảnh: a family at the beach
Dạng: Q5 (Yes/No, cùng hàng)
1. They were at the beach.
2. It was rainy.""", "1. Yes\n2. No", 'Q5', 2, 2),
 ('Q6 nhìn ảnh viết', """## Task: Look and write.
Dạng: nhìn ảnh viết
1. [ảnh: a girl reading a book]
2. [ảnh: a boy playing football]""", "1. reading\n2. playing football", 'Q6', 2, 2),
 ('Q7 chọn ảnh (dòng thụt)', """## Task: Read and tick.
Dạng: chọn ảnh
1. What did Tom eat?
   A. [ảnh: pizza] B. [ảnh: noodles] C. [ảnh: rice]
2. Where was Mai?
   A. [ảnh: beach] B. [ảnh: zoo] C. [ảnh: park]""", "1. A\n2. C", 'Q7', 2, 2),
 ('Q8 nối + xáo', """## Task: Match the questions and answers.
Dạng: nối
Xáo vế phải: có
1. Where did you go? - I went to the park.
2. Who did you go with? - My sister.
3. Was it fun? - Yes, it was.""", None, 'Q8', 3, 3),
 ('Q9 tô chữ', """## Task: Trace the words.
Dạng: tô chữ
1. was
2. were""", None, 'Q9', 2, 0),
 ('Q10 bảng có =đáp án', """## Task: Read and complete the table.
Dạng: bảng
Name | Place | Activity
Tom | =the zoo | =saw lions
Mai | =the beach | =swam""", None, 'Q10', None, None),
 ('Q11 tìm từ', """## Task: Find the words.
Dạng: lưới
Khung từ: was, were, sad
Ô chữ:
WASX
ERES
SADQ
WERE""", None, 'Q11', None, None),
 ('Q12 viết tự do + Khối chữ trên', """## Task: Write about your last weekend (30–40 words).
Dạng: viết tự do
Dòng viết: 6
Khối chữ trên:
  Where did you go? Who did you go with? What did you do?""", None, 'Q12', 0, 0),
 ('Q12 viết tự do + Hướng dẫn', """## Task: Write about your last weekend.
Hướng dẫn: Write 30–40 words.
Dạng: viết tự do
Dòng viết: 6""", None, 'Q12', 0, 0),
 ('Q12 khung vẽ', """## Task: Draw your weekend.
Dạng: viết tự do (khung vẽ)""", None, 'Q12', 0, 0),
]

def build(items):
    md = '# Thử 12 dạng Q\nTuổi: 7-9\n\n' + '\n\n'.join(x[1] for x in items) + '\n\n## Đáp án\n'
    for i, x in enumerate(items, 1):
        if x[2]: md += f'### Task {i}\n{x[2]}\n'
    return md
