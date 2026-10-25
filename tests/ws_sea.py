# Thử nhập phiếu "Wonders of the Sea" (Our World 4): ô chữ = bảng chữ cái + khung từ; gợi ý; hội thoại
import sys, json
from playwright.sync_api import sync_playwright
GRID = ["SUNLIGHTLODA","EORMIDOLPHIN","ASCECIGHTSSR","SENTURTLEIAE","PAOSOLEUAFPS","ONCQCPWARYPO","NSEUEYUHTTEU","GHFISHISHUAR","EMIDNIGHTLRC","SHARKSEZONEE"]
def grid(): return {'form':'table','corner':'','cols':['']*12,'rows':[{'head':'','cells':list(r)} for r in GRID]}
def mk(tid, title, ins, content, ans, bank=None, tbl=None):
    t={'id':tid,'typeId':'custom','typeName':'','title':title,'instruction':ins,'audio':None,'image':None,'wordBank':bank,
       'content':content,'answer':ans,'spacing':{'preset':None,'overrides':{}},
       'layout':{'task':'auto','split':None,'cols':None,'dir':None,'align':None,'valign':None,'width':None,'cw':None,'rowH':None,'whoW':None,'colGap':None,'break':None,'frame':{},'cells':None,'table':tbl}}
    if bank and bank.get('placement')=='right': t['layout']['task']='T6'
    return t
NONE={'kind':'none','attach':'item','layout':None,'params':{}}
def group(n, who, other, words, clue, first, q, a, ex):
    return [
     mk(f'ws{n}a', f'{who}: Work with a friend. Find and circle the words in the puzzle.', '', grid(), NONE,
        {'words':words,'placement':'top','style':'chips','label':'none'},
        {'head':False,'rowHead':False,'nm':'off','lines':'all','align':'center','minH':8}),
     mk(f'ws{n}b', 'Work with your friend. Prepare clues for the words you found in Activity 1.', f'Look at the pictures on pages 90 and 91 of your book if you need help. Example: {ex}',
        {'form':'list','items':[{'id':f'q{i}','text':f'Clue {i}:'} for i in (1,2,3)]},
        {'kind':'sentence','attach':'item','layout':'A1','params':{'lines':2}}),
     mk(f'ws{n}c', f'Join {other}. Give the clues to your friends. Take turns.', 'Listen to the clues and find the words in your puzzle.',
        {'form':'list','variant':'dialogue','items':[{'id':'l1','who':first[0],'text':q[0]},{'id':'l2','who':first[1],'text':q[1]},{'id':'l3','who':first[0],'text':q[2]}]}, NONE)]
tasks = group(1,'Students 1 and 2','students 3 and 4',['dolphin','sea sponges','squid','fish','creature','sunlight','disappear','layer'],None,
        ('Students 1 and 2','Students 3 and 4'),['Here’s our first clue. It’s smaller than a whale. It lives in the sunlight zone.','Is it a dolphin?','Yes, it is. Where is it in the puzzle?'],None,'It’s smaller than a whale. It lives in the sunlight zone. (dolphin)') \
      + group(2,'Students 3 and 4','students 1 and 2',['shark','turtle','octopus','whale','sea','zone','resource','midnight'],None,
        ('Students 3 and 4','Students 1 and 2'),['Here’s the clue. It’s got sharp teeth. It lives in the sunlight zone.','Is it a shark?','Yes. Where is it in the puzzle?'],None,'It can have sharp teeth. It lives in the sunlight zone. (shark)')
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    pg.evaluate("(ts)=>{commit(w=>{w.tasks=[];ts.forEach(t=>w.tasks.push(t))})}", tasks); pg.wait_for_timeout(800)
    print('pages', pg.inner_text('#pageBadge'), '|', pg.inner_text('#diagBadge'))
    print('n tasks', pg.evaluate("ws.tasks.length"), 'kinds', pg.evaluate("ws.tasks.map(t=>ck(t))"))
    # xuất ĐỦ trường cấp phiếu (schema, age, page, spacing, flow) để nạp được; gán tên Task
    names={'a':'Ô chữ','b':'Viết gợi ý','c':'Hỏi đáp theo cặp'}
    pg.evaluate("(n)=>{ws.tasks.forEach(t=>{t.typeName=n[t.id.slice(-1)]}); ws.title='Wonders of the Sea (Our World 4, WS 6.1)'}", names)
    open('/home/claude/ws/ws-sea-sample.json','w',encoding='utf-8').write(pg.evaluate('JSON.stringify(ws,null,1)'))
    print('ERRS', errs)
    pg.screenshot(path='/home/claude/ws/shots/sea.png')
    pg.locator('.page').first.screenshot(path='/home/claude/ws/shots/sea_p1.png')
    pg.locator('.page').nth(1).screenshot(path='/home/claude/ws/shots/sea_p2.png')
    pg.locator('.page').nth(2).screenshot(path='/home/claude/ws/shots/sea_p3.png')
    # tách xuất JSON để dùng lại
