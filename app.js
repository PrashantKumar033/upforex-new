/** UPFOREX Horizon: progressive enhancement, no dependencies or tracking. */
(() => {
  'use strict';
  const root=document.getElementById('uf-home'); if(!root)return;
  const $=(s,b=root)=>b.querySelector(s), $$=(s,b=root)=>Array.from(b.querySelectorAll(s));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  let motionPaused=reduced.matches;
  const motion=()=>!motionPaused&&!reduced.matches&&!document.hidden;
  const pointerAllowed=()=>motion()&&fine.matches;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const revealNodes=$$('.animate-in');
  root.classList.add('js-enabled');
  $('#currentYear').textContent=String(new Date().getFullYear());
  if(motion()&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver((entries,o)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');o.unobserve(e.target);}}),{threshold:.07,rootMargin:'0px 0px 40px 0px'});
    revealNodes.forEach((el,i)=>{el.style.transitionDelay=`${(i%3)*45}ms`;observer.observe(el);});
  }else revealNodes.forEach(el=>el.classList.add('in-view'));
  // The source menu groups are native details elements; support keyboard and outside dismissal.
  const menuButton=$('.mobile-menu-button'),menu=$('#mobile-navigation');
  function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');menu.querySelectorAll('details').forEach(d=>d.open=false);}
  menuButton.addEventListener('click',()=>{if(menu.hidden){menu.hidden=false;menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Close menu');}else closeMenu();});
  $$('#mobile-navigation a').forEach(a=>a.addEventListener('click',closeMenu));
  const drops=$$('.site-header details');
  drops.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)drops.forEach(other=>{if(other!==d)other.open=false;});}));
  // Desktop hover disclosure. Native <details> retains touch and keyboard behavior.
  const desktopDrops=$$('.desktop-navigation details');
  const desktopHover=()=>fine.matches && innerWidth>1190;
  desktopDrops.forEach(d=>{
    d.addEventListener('pointerenter',e=>{
      if(e.pointerType!=='mouse'||!desktopHover())return;
      desktopDrops.forEach(other=>{if(other!==d)other.open=false;});
      d.open=true;
    });
    d.addEventListener('pointerleave',e=>{
      if(e.pointerType!=='mouse'||!desktopHover())return;
      if(!d.contains(document.activeElement))d.open=false;
    });
    d.querySelector('summary').addEventListener('click',e=>{
      if(!desktopHover()||e.detail===0||(e.pointerType&&e.pointerType!=='mouse'))return; // keep Enter/Space and touch native
      e.preventDefault();d.open=true;
    });
    d.addEventListener('focusout',()=>requestAnimationFrame(()=>{
      if(!d.contains(document.activeElement)&&!d.matches(':hover'))d.open=false;
    }));
  });
  $$('.desktop-navigation > a,.desktop-navigation > .nav-actions').forEach(el=>el.addEventListener('pointerenter',e=>{
    if(e.pointerType==='mouse'&&desktopHover())desktopDrops.forEach(d=>{if(!d.contains(document.activeElement))d.open=false;});
  }));
  window.addEventListener('resize',()=>{if(innerWidth<=1190)desktopDrops.forEach(d=>d.open=false);},{passive:true});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header')){drops.forEach(d=>d.open=false);closeMenu();}else drops.forEach(d=>{if(d.open&&!d.contains(e.target))d.open=false;});});
  document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const open=drops.find(d=>d.open);if(open){open.open=false;open.querySelector('summary')?.focus();}else if(!menu.hidden){closeMenu();menuButton.focus();}});
  window.addEventListener('resize',()=>{if(innerWidth>1190&&!menu.hidden)closeMenu();},{passive:true});
  let progressPending=false;
  function progress(){const max=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.transform=`scaleX(${max>0?clamp(scrollY/max,0,1):0})`;}
  window.addEventListener('scroll',()=>{if(!progressPending){progressPending=true;requestAnimationFrame(()=>{progressPending=false;progress();});}},{passive:true});progress();
  // Exact feedback from src/app/layouts/social-menu/social-menu.component.html in supplied ZIP.
  // No claim that the snapshot reflects current aggregate ratings.
  const reviews = [
  {
    "title": "Very fantastic services even customer…",
    "text": "Very fantastic services even customer help get on Sunday.",
    "name": "Yuvraj singh Kachhawa",
    "region": "Aug 10, 2026"
  },
  {
    "title": "Best Broker used till Date",
    "text": "This is by far the best broker that I have used for trading… 3 cheers to the Support team.",
    "name": "Raviraj Singh Tomar",
    "region": "Aug 10, 2026"
  },
  {
    "title": "Very Good and reliable service",
    "text": "Very Good and reliable service. I get support for my query on Sunday also. Very Fast.",
    "name": "Umang Suthar",
    "region": "Jun 22, 2026"
  }
];
  const reviewContainer = $('#reviewCards');
  const dotContainer = $('#reviewDots');
  const carouselRegion = $('.review-carousel');
  let reviewIndex = 0;
  let autoTimer = null;
  let paused = false;
  let reviewsVisible = false;
  const visibleCount = () => window.innerWidth <= 600 ? 1 : window.innerWidth <= 1190 ? 2 : 3;
  const reviewCard = (item, i) => {
    const article = document.createElement('article'); article.className = 'review-card';
    article.style.animationDelay = `${i * 75}ms`;
    const node = (tag, cls, text) => { const el=document.createElement(tag);el.className=cls;el.textContent=text;return el; };
    const meta=node('div','footer-review-meta','');
    const rating=node('div','rating','★★★★★');rating.setAttribute('aria-label','5 stars in source review');
    meta.append(rating,node('span','footer-review-date',item.region));
    const glyph=node('span','quote-glyph','”');glyph.setAttribute('aria-hidden','true');
    const author=node('div','footer-review-author',''); const initial=node('span','review-initial',item.name.charAt(0).toUpperCase()); initial.setAttribute('aria-hidden','true'); author.append(initial,node('span','review-name',item.name));
    article.append(meta,node('h3','footer-review-title',item.title),node('blockquote','footer-review-quote',item.text),author,glyph);
    return article;
  };
  function renderReviews() {
    const count = visibleCount();
    const nextItems = Array.from({ length: count }, (_, index) => reviews[(reviewIndex + index) % reviews.length]);
    const focusedDot = dotContainer.contains(document.activeElement) ? Array.from(dotContainer.children).indexOf(document.activeElement) : -1;
    reviewContainer.replaceChildren(...nextItems.map(reviewCard));
    dotContainer.replaceChildren(...reviews.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button'; dot.setAttribute('aria-label', `Show testimonial group ${i + 1}`);
      dot.setAttribute('aria-current', i === reviewIndex ? 'true' : 'false');
      dot.addEventListener('click', () => { reviewIndex = i; renderReviews(); restartCarousel(); });
      return dot;
    }));
    if (focusedDot >= 0) dotContainer.children[focusedDot]?.focus({preventScroll:true});
  }
  function moveReview(shift) { reviewIndex = (reviewIndex + shift + reviews.length) % reviews.length; renderReviews(); }
  $('.arrow-left').addEventListener('click', () => { moveReview(-1); restartCarousel(); });
  $('.arrow-right').addEventListener('click', () => { moveReview(1); restartCarousel(); });
  function stopCarousel() { if (autoTimer !== null) { clearInterval(autoTimer); autoTimer = null; } }
  function restartCarousel() {
    stopCarousel();
    if (motion() && !paused && reviewsVisible && visibleCount() < reviews.length) autoTimer = setInterval(() => moveReview(1), 6800);
  }
  carouselRegion.addEventListener('mouseenter', () => { paused = true; stopCarousel(); });
  carouselRegion.addEventListener('mouseleave', () => { paused = false; restartCarousel(); });
  carouselRegion.addEventListener('focusin', () => { paused = true; stopCarousel(); });
  carouselRegion.addEventListener('focusout', (event) => {
    if (!carouselRegion.contains(event.relatedTarget)) { paused = false; restartCarousel(); }
  });
  carouselRegion.addEventListener('touchstart', () => { paused = true; stopCarousel(); }, { passive: true });
  carouselRegion.addEventListener('touchend', () => { paused = false; restartCarousel(); }, { passive: true });
  let prevVisibleCount = visibleCount();
  window.addEventListener('resize', () => { const next = visibleCount(); if (next !== prevVisibleCount) { prevVisibleCount = next; renderReviews(); restartCarousel(); } }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopCarousel(); else restartCarousel(); });
  renderReviews();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { reviewsVisible=entry.isIntersecting; restartCarousel(); }, {threshold:.08}).observe(carouselRegion);
  } else { reviewsVisible=true; restartCarousel(); }
  let touchStart = 0;
  carouselRegion.addEventListener('touchstart',e => { touchStart=e.changedTouches[0].clientX; },{passive:true});
  carouselRegion.addEventListener('touchend',e => { const dx=e.changedTouches[0].clientX-touchStart; if(Math.abs(dx)>55) moveReview(dx<0?1:-1); },{passive:true});


  // Deterministic, illustrative OHLC data. Not a price feed or investment signal.
  const marketData = {
    forex:{name:'Forex',text:'Explore major currency pairs and the movements that connect global currency markets.',icon:'FX',pair:'EUR / USD',route:'forex-cfds',seed:17,price:1.0942,decimals:4,volatility:.014},
    metals:{name:'Metals',text:'Discover precious metal CFDs, including gold, and their role in global markets.',icon:'Au',pair:'XAU / USD',route:'precious-metal',seed:32,price:2048.36,decimals:2,volatility:.035},
    indices:{name:'Indices',text:'Explore index CFDs and major international benchmarks.',icon:'IX',pair:'US 100',route:'index-cfds',seed:56,price:18563.2,decimals:1,volatility:.025},
    stocks:{name:'Stocks',text:'Explore stock CFDs and the factors that influence equity markets.',icon:'EQ',pair:'STOCK CFD',route:'stock-cfds',seed:87,price:180.5,decimals:2,volatility:.06},
    crypto:{name:'Crypto',text:'Explore cryptocurrency CFDs and the volatility of digital-asset markets.',icon:'₿',pair:'BTC / USD',route:'cryptocurrencies-cfd',seed:103,price:67842.1,decimals:1,volatility:.09},
    energy:{name:'Energy',text:'Explore energy CFDs and the forces affecting oil and other energy markets.',icon:'EN',pair:'OIL CFD',route:'energy-cfds',seed:129,price:78.5,decimals:2,volatility:.065}
  };
  const chart=$('#marketChart'), grid=$('#candleGrid'), volumes=$('#candleVolumes'), bodies=$('#candleBodies'), axes=$('#candleAxes'), marker=$('#priceMarker'), cross=$('#chartCrosshair'), tooltip=$('#chartTooltip');
  const marketTabs=$$('.market-tab'), periods=$$('.time-pill');
  const N=44, NS='http://www.w3.org/2000/svg';
  let selectedMarket='forex',selectedPeriod='1D',chartVisible=false,chartRaf=0,current=null,cursor=-1,layout=null,targetData=null,chartMode='desktop';
  function node(tag,attrs={},text=''){const el=document.createElementNS(NS,tag); for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(text)el.textContent=text;return el;}
  function setAttrs(el,attrs){for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));}
  const candleNodes=Array.from({length:N},()=>{const wick=node('line',{class:'candle-wick'}),body=node('rect',{rx:1,class:'candle-body'}),vol=node('rect',{rx:1});bodies.append(wick,body);volumes.append(vol);return {wick,body,vol};});
  function generate(name,period){
    const d=marketData[name],p=['1D','1W','1M','3M'].indexOf(period), f=[1,1.6,2.25,3][p];
    let seed=(d.seed*92821+p*937+11)>>>0;
    const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    let prev=.34+rand()*.15;
    return Array.from({length:N},(_,i)=>{
      const t=i/(N-1),o=prev+(rand()-.5)*.035;
      // Local pullbacks, alternating candle colors, and non-monotonic market swings.
      const drift=(name==='crypto'?-.002:.008)+Math.sin(t*16+p+d.seed)*.022;
      const c=Math.max(.13,Math.min(.87,o+drift+(rand()-.46)*.14));
      const h=Math.max(o,c)+.012+rand()*.047,l=Math.min(o,c)-.012-rand()*.045;
      prev=c;return {o,c,h,l,v:.18+rand()*.67+Math.abs(c-o)*1.5,base:d.price,spread:d.price*d.volatility*f};
    });
  }
  function price(v,item){return item.base+(v-.5)*item.spread;}
  const fmt=(n)=>n.toLocaleString('en-US',{minimumFractionDigits:marketData[selectedMarket].decimals,maximumFractionDigits:marketData[selectedMarket].decimals});
  function chartLayout(){
    const small=chart.clientWidth<510,W=small?Math.max(230,chart.clientWidth):840,H=small?240:345;
    chartMode=small?'mobile':'desktop';chart.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const left=small?4:12,right=W-(small?60:78),top=14,priceBottom=H-(small?68:77),volTop=priceBottom+10,volBottom=H-24;
    return {W,H,left,right,top,priceBottom,volTop,volBottom,step:(right-left)/N};
  }
  function draw(data){
    if(!data)return;current=data;layout=chartLayout();const {W,H,left,right,top,priceBottom,volTop,volBottom,step}=layout;
    const low=Math.min(...data.map(c=>c.l)),high=Math.max(...data.map(c=>c.h)),padding=Math.max(.04,(high-low)*.13);
    layout.min=low-padding;layout.max=high+padding;
    const y=v=>priceBottom-(v-layout.min)/(layout.max-layout.min)*(priceBottom-top);
    const base=data[0],lastY=y(data[N-1].c); grid.replaceChildren();axes.replaceChildren();marker.replaceChildren();
    for(let j=0;j<=5;j++){const v=layout.min+(layout.max-layout.min)*j/5,Y=y(v);grid.append(node('line',{x1:left,y1:Y,x2:right,y2:Y}));if(Math.abs(Y-lastY)>16)axes.append(node('text',{x:right+8,y:Y+4,class:'axis-price'},fmt(price(v,base))));}
    for(let j=0;j<=5;j++){const x=left+(right-left)*j/5;grid.append(node('line',{x1:x,y1:top,x2:x,y2:volBottom}));}
    const times={'1D':['00:00','04:00','08:00','12:00','16:00','20:00'],'1W':['Mon','Tue','Wed','Thu','Fri','End'],'1M':['W1','W2','W3','W4','W5','End'],'3M':['Start','W2','W5','W7','W10','End']}[selectedPeriod];
    times.forEach((s,i)=>{if(chartMode==='mobile'&&![0,2,4,5].includes(i))return;axes.append(node('text',{x:left+(right-left)*i/5,y:H-9,'text-anchor':i===0?'start':i===5?'end':'middle',class:'axis-time'},s));});
    data.forEach((c,i)=>{const x=left+step*(i+.5),up=c.c>=c.o,color=up?'#3cff19':'#ff5d67',bw=step*.62;const n=candleNodes[i];setAttrs(n.wick,{x1:x,x2:x,y1:y(c.h),y2:y(c.l),stroke:color});setAttrs(n.body,{x:x-bw/2,y:Math.min(y(c.o),y(c.c)),width:bw,height:Math.max(1.6,Math.abs(y(c.o)-y(c.c))),fill:color});const vh=Math.min(1,c.v)*(volBottom-volTop);setAttrs(n.vol,{x:x-bw/2,y:volBottom-vh,width:bw,height:vh,fill:color,opacity:.34});});
    const last=data[N-1],Y=y(last.c),color=last.c>=last.o?'#3cff19':'#ff5d67';
    marker.append(node('line',{x1:left,x2:right,y1:Y,y2:Y,stroke:color,'stroke-opacity':.65,'stroke-dasharray':'4 5'}),node('rect',{x:right+3,y:Y-11,width:W-right-5,height:22,rx:3,fill:color}),node('text',{x:right+3+(W-right-5)/2,y:Y+4,'text-anchor':'middle',fill:'#0d0d0d',class:'price-label'},fmt(price(last.c,last))));
    $('#chartLast').textContent=fmt(price(last.c,last));const change=(price(last.c,last)/price(data[0].o,data[0])-1)*100;$('#chartChange').textContent=`${change>=0?'+':''}${change.toFixed(2)}%`;$('#chartChange').classList.toggle('negative',change<0);
    if(cursor>=0)showCursor(cursor);
  }
  function clearCursor(){cursor=-1;cross.setAttribute('visibility','hidden');tooltip.hidden=true;}
  function showCursor(i){if(!current||!layout)return;cursor=Math.max(0,Math.min(N-1,i));const c=current[cursor],{W,H,left,right,top,priceBottom,volBottom,step}=layout,x=left+step*(cursor+.5),y=priceBottom-(c.c-layout.min)/(layout.max-layout.min)*(priceBottom-top);setAttrs($('#crossV'),{x1:x,x2:x,y1:top,y2:volBottom});setAttrs($('#crossH'),{x1:left,x2:right,y1:y,y2:y});cross.setAttribute('visibility','visible');tooltip.textContent=`O ${fmt(price(c.o,c))}   H ${fmt(price(c.h,c))}   L ${fmt(price(c.l,c))}   C ${fmt(price(c.c,c))}`;tooltip.hidden=false;}
  chart.addEventListener('pointermove',e=>{const r=chart.getBoundingClientRect();if(!layout||!r.width)return;showCursor(Math.floor(((e.clientX-r.left)/r.width*layout.W-layout.left)/layout.step));});
  chart.addEventListener('pointerleave',clearCursor);chart.addEventListener('blur',clearCursor);
  chart.tabIndex=0;chart.addEventListener('keydown',e=>{if(e.key==='Escape'){clearCursor();return;}if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();showCursor(cursor<0?N-1:cursor+(e.key==='ArrowLeft'?-1:1));});
  function renderMarket(animate=true){
    const d=marketData[selectedMarket],title=$('#selectedMarketName');title.replaceChildren(document.createTextNode(d.name+' '));const em=document.createElement('span');em.textContent='markets';title.append(em);
    $('#selectedMarketDesc').textContent=d.text;$('#marketDisplayIcon').textContent=d.icon;$('#marketPair').textContent=d.pair;$('#marketPairCaption').textContent=`Illustrative ${selectedPeriod} candles`;$('#marketProductLink').href='https://www.upforex.com/products/'+d.route;$('#marketProductLink').textContent=`Explore ${d.name} CFDs ↗`;
    chart.setAttribute('aria-label',`${d.name} ${selectedPeriod} illustrative OHLC candles. Use left or right arrow to inspect candles. Not live prices.`);
    clearCursor();cancelAnimationFrame(chartRaf);targetData=generate(selectedMarket,selectedPeriod);
    const info=$('.market-display-top');info.classList.remove('market-changing');void info.offsetWidth;info.classList.add('market-changing');
    if(!current||!animate||!motion()||!chartVisible){draw(targetData);return;}
    const from=current.map((c,i)=>({...c,base:targetData[i].base,spread:targetData[i].spread}));const start=performance.now();
    function step(now){if(!motion()||!chartVisible){draw(targetData);return;}const t=Math.min(1,(now-start)/620),e=1-(1-t)**3;draw(targetData.map((c,i)=>({...c,...Object.fromEntries(['o','h','l','c','v'].map(k=>[k,from[i][k]+(c[k]-from[i][k])*e]))})));if(t<1)chartRaf=requestAnimationFrame(step);}
    chartRaf=requestAnimationFrame(step);
  }
  function setMarket(name,focus=false){if(!marketData[name])return;selectedMarket=name;marketTabs.forEach(tab=>{const on=tab.dataset.market===name;tab.classList.toggle('active',on);tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;if(on){$('#marketPanel').setAttribute('aria-labelledby',tab.id);if(focus){tab.focus({preventScroll:true});if(innerWidth<=850)tab.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});}}});renderMarket();}
  marketTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>setMarket(tab.dataset.market));tab.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const j=e.key==='Home'?0:e.key==='End'?marketTabs.length-1:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+marketTabs.length)%marketTabs.length;setMarket(marketTabs[j].dataset.market,true);});});
  periods.forEach(btn=>btn.addEventListener('click',()=>{selectedPeriod=btn.dataset.period;periods.forEach(x=>{const on=x===btn;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on));});renderMarket();}));
  renderMarket(false);
  if('IntersectionObserver' in window){let entered=false;new IntersectionObserver(([entry])=>{chartVisible=entry.isIntersecting;if(chartVisible&&!entered){entered=true;if(motion()){bodies.classList.add('candles-enter');volumes.classList.add('candles-enter');}}},{threshold:.12}).observe(chart);}else chartVisible=true;
  if('ResizeObserver' in window){new ResizeObserver(()=>draw(current)).observe(chart);}else window.addEventListener('resize',()=>draw(current),{passive:true});
  // Pause decorative CSS animations when sections leave the viewport.
  if('IntersectionObserver' in window){const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('offscreen-motion',!entry.isIntersecting)),{rootMargin:'100px 0px'});$$('main section, .premium-footer').forEach(el=>sectionObserver.observe(el));}
  // Hero market buttons activate the corresponding chart and scroll to its accessible tab panel.
  $$('[data-jump-market]').forEach(b=>b.addEventListener('click',()=>{
    setMarket(b.dataset.jumpMarket);$('#markets').scrollIntoView({behavior:motion()?'smooth':'auto',block:'start'});
  }));
  // One event-driven spring-like damping loop for all pointer effects. Only fine pointers.
  const selector='.hover-card,.review-card,.footer-reg-card,.button,.platform-stage,.partner-art,.footer-social-link,.footer-back';
  const state=new Map();let active=new Set(),frame=0,last=0;
  const props=['--spot-x','--spot-y','--spot-on','--lift','--tilt-x','--tilt-y','--image-x','--image-y','--device-x','--device-y','--mag-x','--mag-y','--hover-button-x','--hover-button-y'];
  function reset(el){props.forEach(k=>el.style.removeProperty(k));}
  function release(el){const s=state.get(el);if(s){s.tx=0;s.ty=0;s.tp=0;}}
  function request(){if(!frame&&state.size&&pointerAllowed()){last=0;frame=requestAnimationFrame(tick);}}
  function clear(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;state.forEach((_,el)=>reset(el));state.clear();active.clear();}
  function leave(){active.forEach(release);active.clear();request();}
  function tick(now){frame=0;if(!pointerAllowed()){clear();return;}const dt=last?Math.min(now-last,48):16.7;last=now;const a=1-Math.exp(-dt/105);let moving=false;
    state.forEach((s,el)=>{if(!el.isConnected){state.delete(el);active.delete(el);return;}s.x+=(s.tx-s.x)*a;s.y+=(s.ty-s.y)*a;s.p+=(s.tp-s.p)*a;
      const stable=Math.abs(s.tx-s.x)+Math.abs(s.ty-s.y)+Math.abs(s.tp-s.p)<.006;if(stable){s.x=s.tx;s.y=s.ty;s.p=s.tp;}
      if(stable&&s.tp===0){reset(el);state.delete(el);return;}
      const {x,y,p}=s;
      if(s.card){const max=el.matches('.footer-reg-card,.review-card')?2.7:4.6;el.style.setProperty('--spot-x',`${50+x*50}%`);el.style.setProperty('--spot-y',`${50+y*50}%`);el.style.setProperty('--spot-on',p.toFixed(3));el.style.setProperty('--lift',`${-6*p}px`);el.style.setProperty('--tilt-x',`${-y*max}deg`);el.style.setProperty('--tilt-y',`${x*max}deg`);el.style.setProperty('--image-x',`${x*-7}px`);el.style.setProperty('--image-y',`${y*-5}px`);}
      if(s.visual){el.style.setProperty('--device-x',`${x*11}px`);el.style.setProperty('--device-y',`${y*8}px`);}
      if(s.button){el.style.setProperty('--mag-x',`${x*5}px`);el.style.setProperty('--mag-y',`${y*3}px`);el.style.setProperty('--hover-button-x',`${x*3}px`);el.style.setProperty('--hover-button-y',`${y*2}px`);}
      if(!stable)moving=true;
    });if(moving)frame=requestAnimationFrame(tick);else last=0;
  }
  root.addEventListener('pointermove',e=>{if(!pointerAllowed()||e.pointerType!=='mouse'){if(state.size)clear();return;}if(!(e.target instanceof Element))return;const next=new Set();
    for(let el=e.target.closest(selector);el&&root.contains(el);el=el.parentElement?.closest(selector)){
      next.add(el);let s=state.get(el);if(!s){s={x:0,y:0,p:0,tx:0,ty:0,tp:0,card:el.matches('.hover-card,.review-card,.footer-reg-card'),visual:el.matches('.platform-stage,.partner-art'),button:el.matches('.button,.footer-social-link,.footer-back'),rect:el.getBoundingClientRect()};state.set(el,s);}if(!active.has(el))s.rect=el.getBoundingClientRect();const r=s.rect;if(r.width<1||r.height<1)continue;s.tx=clamp((e.clientX-r.left)/r.width*2-1,-1,1);s.ty=clamp((e.clientY-r.top)/r.height*2-1,-1,1);s.tp=1;
    }active.forEach(el=>{if(!next.has(el))release(el);});active=next;request();
  },{passive:true});root.addEventListener('pointerleave',leave,{passive:true});root.addEventListener('pointercancel',clear,{passive:true});window.addEventListener('scroll',leave,{passive:true});window.addEventListener('resize',clear,{passive:true});window.addEventListener('blur',clear);fine.addEventListener?.('change',clear);
  // Hero responds across the entire section, not only over the artwork. Use eased, bounded translation.
  const hero=$('#hero');let hFrame=0,hx=0,hy=0,tx=0,ty=0,hlast=0;
  function setHero(){hero.style.setProperty('--hero-x',`${hx*15}px`);hero.style.setProperty('--hero-y',`${hy*10}px`);hero.style.setProperty('--panel-x',`${-hx*13}px`);hero.style.setProperty('--panel-y',`${-hy*9}px`);hero.style.setProperty('--light-x',`${67+hx*22}%`);hero.style.setProperty('--light-y',`${43+hy*25}%`);}
  function heroTick(now){hFrame=0;if(!pointerAllowed())return;const dt=hlast?Math.min(now-hlast,48):16.7;hlast=now;const a=1-Math.exp(-dt/120);hx+=(tx-hx)*a;hy+=(ty-hy)*a;setHero();if(Math.abs(tx-hx)+Math.abs(ty-hy)>.005)hFrame=requestAnimationFrame(heroTick);else{hx=tx;hy=ty;setHero();hlast=0;}}
  function heroRequest(){if(!hFrame&&pointerAllowed()){hlast=0;hFrame=requestAnimationFrame(heroTick);}}
  hero.addEventListener('pointermove',e=>{if(!pointerAllowed()||e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();tx=clamp((e.clientX-r.left)/r.width*2-1,-1,1);ty=clamp((e.clientY-r.top)/r.height*2-1,-1,1);heroRequest();},{passive:true});
  function heroLeave(){tx=0;ty=0;heroRequest();}hero.addEventListener('pointerleave',heroLeave,{passive:true});hero.addEventListener('pointercancel',heroLeave,{passive:true});
  function resetHero(){if(hFrame)cancelAnimationFrame(hFrame);hFrame=0;hx=hy=tx=ty=0;setHero();}
  const motionButton=$('.motion-toggle');
  function applyMotion(){const isPaused=motionPaused||reduced.matches;root.classList.toggle('motion-paused',isPaused);motionButton.setAttribute('aria-pressed',String(isPaused));motionButton.setAttribute('aria-label',isPaused?'Resume decorative motion':'Pause decorative motion');$('.motion-icon').textContent=isPaused?'▷':'Ⅱ';$('.motion-text').textContent=reduced.matches?'Reduced motion':isPaused?'Resume motion':'Pause motion';motionButton.disabled=reduced.matches;
    if(isPaused){clear();resetHero();revealNodes.forEach(el=>el.classList.add('in-view'));cancelAnimationFrame(chartRaf);renderMarket(false);}restartCarousel();
  }
  motionButton.addEventListener('click',()=>{if(!reduced.matches){motionPaused=!motionPaused;applyMotion();}});reduced.addEventListener?.('change',()=>{motionPaused=reduced.matches;applyMotion();});
  document.addEventListener('visibilitychange',()=>{root.classList.toggle('page-inactive',document.hidden);if(document.hidden){clear();resetHero();}});applyMotion();
})();
