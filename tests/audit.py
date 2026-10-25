import sys
from playwright.sync_api import sync_playwright
H=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+H); pg.wait_for_timeout(1200)
    info=pg.evaluate("""ws.tasks.map(t=>{const sl=slotsOf(t).map(s=>s.key);const raw=JSON.stringify(t.content);
      const nimg=(raw.match(/"img":/g)||[]).length+((t.content.items||[]).reduce((a,x)=>a+(x.imgs?x.imgs.length:0),0));
      return {id:t.id,kind:ck(t),layout:layoutOf(t),slots:sl,nimg,hasImg:!!t.image}})""")
    print('Task | kind | layout | slots | img-fields')
    for i in info: print(i['id'],i['kind'],i['layout'],len(i['slots']),i['nimg'],'G1' if i['hasImg'] else '', '<-- LỆCH' if i['nimg']!=len([k for k in i['slots'] if k!='G1']) else '')
    problems=[]
    for i in info:
        tid=i['id']
        for key in i['slots']:
            for f,name in [('tall.png','dọc'),('wide.png','ngang')]:
                pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(100)
                pg.evaluate(f"openGen('{tid}','{key}')"); pg.wait_for_timeout(80)
                pg.evaluate("document.getElementById('genUp').value=''"); pg.set_input_files('#genUp',f)
                try: pg.wait_for_function("!document.getElementById('genUse').disabled",timeout=5000)
                except Exception: problems.append((tid,key,f,'use disabled')); pg.keyboard.press('Escape'); continue
                for fit in ['width','height']:
                    pg.click(f'#genFit [data-fit={fit}]') if pg.locator('#genFit [data-fit]').count() else None
                    pg.click('#genUse'); pg.wait_for_timeout(500)
                    r=pg.evaluate(f"""(()=>{{const e=document.querySelector('.task[data-task={tid}] .pic[data-slot="{key}"]');if(!e)return null;const r=e.getBoundingClientRect(),im=e.querySelector('img'),ir=im.getBoundingClientRect();
                      return {{ar:+(r.width/r.height).toFixed(2),w:r.width,h:r.height,up:e.classList.contains('up'),inside:ir.width>2&&ir.height>2,pages:document.getElementById('pageBadge').innerText,diag:document.getElementById('diagBadge').innerText}}}})()""")
                    exp=pg.evaluate(f"imgArOf(ws.tasks.find(t=>t.id==='{tid}'),'{key}')")
                    if not r: problems.append((tid,key,f,fit,'không có pic trên phiếu'));
                    else:
                        want=(eval(exp) if isinstance(exp,str) else exp) if exp else None
                        bad=[]
                        if key!='G1' and abs(r['ar']-want)>0.06 and not pg.evaluate(f"!!(cellFr(ws.tasks.find(t=>t.id==='{tid}'),'{key[1:]}').h)"): bad.append(f"tỉ lệ {r['ar']} != {want}")
                        if not r['up']: bad.append('chưa hiện ảnh up')
                        if not r['inside']: bad.append('img rỗng')
                        if not r['pages'].startswith('11') and not r['pages'].startswith('12'): bad.append('trang '+r['pages'])
                        if r['diag']!='Không lỗi tràn': bad.append(r['diag'])
                        if bad: problems.append((tid,key,f,fit,bad,r['pages']))
                    pg.evaluate(f"openGen('{tid}','{key}')"); pg.wait_for_timeout(60)
                pg.keyboard.press('Escape')
    print('PROBLEMS',len(problems))
    for x in problems: print(x)
    print(errs)
