document.addEventListener('DOMContentLoaded',()=>{
  const header=document.getElementById('header');
  const menu=document.getElementById('menuToggle');

  menu?.addEventListener('click',()=>{
    const open=header.classList.toggle('mobile-open');
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  });

  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{
    header.classList.remove('mobile-open');
    menu?.setAttribute('aria-expanded','false');
    menu?.setAttribute('aria-label','Abrir menu');
  }));

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      if(!id||id==='#')return;
      const target=document.querySelector(id);
      if(!target)return;
      e.preventDefault();
      const y=target.getBoundingClientRect().top+window.scrollY-header.offsetHeight-8;
      window.scrollTo({top:y,behavior:'smooth'});
    });
  const slides=document.querySelectorAll('#heroSlides img');
  if(slides.length>1&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  let s=0;
  setInterval(()=>{
    slides[s].classList.remove('active');
    s=(s+1)%slides.length;
    slides[s].classList.add('active');
  },4500);
}});

  const faq=document.querySelectorAll('.faq-item');
  faq.forEach(item=>{
    const q=item.querySelector('.faq-question');
    const answer=item.querySelector('.faq-answer');
    q.addEventListener('click',()=>{
      const wasOpen=item.classList.contains('open');
      faq.forEach(other=>{
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight=null;
        other.querySelector('.faq-question').setAttribute('aria-expanded','false');
      });
      if(!wasOpen){
        item.classList.add('open');
        answer.style.maxHeight=answer.scrollHeight+'px';
        q.setAttribute('aria-expanded','true');
      }
    });
  });

  const track=document.getElementById('testimonialTrack');
  const dots=document.getElementById('sliderDots');
  const prev=document.querySelector('.t-prev');
  const next=document.querySelector('.t-next');
  let page=0;

  const visible=()=>window.innerWidth>=1024?3:window.innerWidth>=768?2:1;
  const pages=()=>track?Math.max(1,Math.ceil(track.children.length/visible())):1;

  function renderDots(){
    if(!dots||!track)return;
    dots.innerHTML='';
    for(let i=0;i<pages();i++){
      const d=document.createElement('button');
      d.className='dot'+(i===page?' active':'');
      d.setAttribute('aria-label',`Ir para página ${i+1}`);
      d.addEventListener('click',()=>go(i));
      dots.appendChild(d);
    }
  }
  function go(p){
    if(!track||!track.children.length)return;
    page=(p+pages())%pages();
    const card=track.children[0];
    const gap=parseFloat(getComputedStyle(track).gap)||0;
    const step=card.getBoundingClientRect().width+gap;
    track.style.transform=`translateX(-${page*visible()*step}px)`;
    renderDots();
  }
  prev?.addEventListener('click',()=>go(page-1));
  next?.addEventListener('click',()=>go(page+1));
  renderDots();

  let timer=setInterval(()=>go(page+1),6500);
  const viewport=document.querySelector('.testimonial-viewport');
  viewport?.addEventListener('mouseenter',()=>clearInterval(timer));
  viewport?.addEventListener('mouseleave',()=>{timer=setInterval(()=>go(page+1),6500)});

  let resizeTimer;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{page=0;if(track)track.style.transform='translateX(0)';renderDots()},120);
  });

  const tg=document.querySelector('.team-grid');
  const td=document.querySelectorAll('.team-dots .dot');
  const tstep=d=>tg&&tg.scrollBy({left:d*tg.clientWidth,behavior:'smooth'});
  document.querySelector('.team-prev')?.addEventListener('click',()=>tstep(-1));
  document.querySelector('.team-next')?.addEventListener('click',()=>tstep(1));
  tg?.addEventListener('scroll',()=>{const i=Math.round(tg.scrollLeft/tg.clientWidth);td.forEach((d,n)=>d.classList.toggle('active',n===i))},{passive:true});

  const navLinks=[...document.querySelectorAll('.nav a')];
  const navSecs=navLinks.map(a=>document.querySelector(a.getAttribute('href')));
  const measure=()=>navLinks.forEach(a=>{const l=a.querySelector('.nav-label');if(l)l.style.setProperty('--w',l.firstElementChild.offsetWidth+'px')});
  const setActive=i=>navLinks.forEach((a,n)=>{a.classList.toggle('active',n===i);n===i?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')});
  let navLock=0;
  const spy=()=>{
    if(Date.now()<navLock)return;
    const y=header.offsetHeight+140;let c=0;
    navSecs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<=y)c=i});
    if(window.innerHeight+window.scrollY>=document.body.scrollHeight-4)c=navSecs.length-1;
    setActive(c);
  };
  navLinks.forEach((a,i)=>a.addEventListener('click',()=>{setActive(i);navLock=Date.now()+900;setTimeout(spy,950)}));
  window.addEventListener('scroll',spy,{passive:true});
  window.addEventListener('load',()=>{measure();spy()});
  document.fonts?.ready.then(measure);
  measure();spy();

  let tx=0;
  viewport?.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
  viewport?.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)go(page+(d<0?1:-1))});
  const closeMenu=()=>{header.classList.remove('mobile-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Abrir menu')};
  matchMedia('(min-width:768px)').addEventListener('change',e=>{if(e.matches)closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  const reveal=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}
      });
    },{threshold:.08,rootMargin:'0px 0px -30px 0px'});
    reveal.forEach(el=>io.observe(el));
  }else reveal.forEach(el=>el.classList.add('visible'));

  const year=document.querySelector('.copyright');
  if(year) year.innerHTML=year.innerHTML.replace('2026',new Date().getFullYear());
});