import sys, json
from playwright.sync_api import sync_playwright
S = {
 'colour':'Listen and colour.\nColour the picture.',
 'colour_img':'Look and draw.\n[ảnh: a park]',
 'abc':'Choose the correct answer.\n1. She ___ a teacher. A. am B. is C. are\n2. They ___ happy. A. is B. are C. am',
 'abc_lines':'Circle the answer.\n1. What is it?\nA. cat\nB. dog\nC. pig\n2. Where is it?\nA. here\nB. there\nC. up',
 'inline':'Read and underline.\n1. It is (big / small).\n2. I {am|is} happy.',
 'gap':'Complete the sentences.\nWords: kitchen, garden\n1. We cook in the ___.\n2. Flowers grow in the ___.',
 'tf':'True or False?\n1. The cat is black.\n2. The dog is big.',
 'tf2':'Read and write T or F.\n1. Tom is nine. T / F\n2. Ann likes cats. T / F',
 'trace':'Trace the words.\n1. cat\n2. hat\n3. map',
 'answer':'Answer the questions.\n1. What is your name?\n2. How old are you?',
 'answer2':'Answer about you.\n1. Your name\n2. Your age',
 'dialogue':'Complete the conversation.\nMai is talking to Ben.\nMai: Hi, Ben.\nBen: ___\nMai: Great!\nBen: ___',
 'match':'Match.\n1. cat - meow\n2. dog - woof\n3. cow - moo',
 'tick':'Listen and tick.\n1. What is Tom eating? A. pizza B. rice C. cake\n2. Where is the cat? A. bed B. table C. box',
 'look':'Look and write.\n1. cat\n2. dog\n3. fish',
 'passage':'Read and answer.\nMy name is Lucy. I am nine years old. I live in a small house with my mum, my dad and my brother Ben. We have a dog. His name is Max. Max is brown and white.\n1. How old is Lucy?\n2. What is the dog\'s name?',
 'table':'Listen and complete the table.\nName | Age | Food\nTom | 9 | pizza\nLily |  | ',
 'tabletick':'Tick the box.\n | Farm | Zoo\ncow | [ ] | [ ]\ntiger | [ ] | [ ]',
 'imgitems':'Look and write.\n1. [ảnh: cat] \n2. [ảnh: dog] ',
 'plain':'Some text here.\nAnother line\nThird line',
}
JS = """(s)=>{const r=parseTask(s,null);const t=r.t;return {ck:ck(t),L:layoutOf(t),kind:t.answer.kind,att:t.answer.attach,A:t.answer.layout,n:its(t).length,list:t.content.list,img:t.image?t.image.size:null,bank:t.wordBank?t.wordBank.placement:null,conf:r.conf,variant:t.content.variant||null,title:t.title,desc:typeof descOf==='function'?descOf(t):''}}"""
with sync_playwright() as p:
    b=p.chromium.launch(); out={}
    for name,path in [('old',sys.argv[2]),('new',sys.argv[1])]:
        pg=b.new_page(); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('file://'+path); pg.wait_for_timeout(1000)
        out[name]={k:pg.evaluate(JS,v) for k,v in S.items()}; print(name,'errs',errs)
    keys=['ck','L','kind','att','A','n','list','img','bank','variant']
    for k in S:
        o,n=out['old'][k],out['new'][k]
        d=[f"{x}: {o[x]} -> {n[x]}" for x in keys if o[x]!=n[x]]
        print(('SAME ' if not d else 'DIFF ')+k, '|', n['desc'], '|', n['conf'], '|', d)
