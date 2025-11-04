
document.addEventListener('DOMContentLoaded', ()=>{
  // theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      document.body.dataset.theme = next;
      localStorage.setItem('site-theme', next);
    });
  }
  // hero carousel
  const heroSlides = Array.from(document.querySelectorAll('.hero-image'));
  let heroIndex=0;
  function showHero(i){ heroSlides.forEach((s,idx)=>s.classList.toggle('active', idx===i)); }
  if(heroSlides.length){ showHero(0); setInterval(()=>{ heroIndex=(heroIndex+1)%heroSlides.length; showHero(heroIndex); },4000); }

  // reviews carousel (simple)
  const track = document.querySelector('.reviews-track');
  const reviews = track ? Array.from(track.children) : [];
  let rIndex=0, rTimer=null;
  function updateReviews(){ if(!track) return; const w = track.clientWidth || reviews[0].offsetWidth; track.style.transform = `translateX(-${rIndex * w}px)`; }
  function startReviews(){ stopReviews(); rTimer=setInterval(()=>{ rIndex=(rIndex+1)%reviews.length; updateReviews(); },5000); }
  function stopReviews(){ if(rTimer){ clearInterval(rTimer); rTimer=null; } }
  if(track){ startReviews(); track.addEventListener('mouseenter', stopReviews); track.addEventListener('mouseleave', startReviews); window.addEventListener('resize', updateReviews); updateReviews(); }

  // burger
  const burger = document.getElementById('burgerBtn');
  const nav = document.querySelector('.nav-menu');
  burger && burger.addEventListener('click', ()=>{ nav && nav.classList.toggle('nav-open'); });

  // modal & form
  const modal = document.getElementById('contactModal');
  const openBtn = document.getElementById('contactBtn');
  const closeBtn = document.querySelector('.modal-close');
  const cancelBtn = document.querySelector('.modal-cancel');
  const form = document.getElementById('contactForm');
  openBtn && openBtn.addEventListener('click',(e)=>{ e.preventDefault(); modal.classList.add('active'); });
  closeBtn && closeBtn.addEventListener('click', ()=> modal.classList.remove('active'));
  cancelBtn && cancelBtn.addEventListener('click', ()=> modal.classList.remove('active'));
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') modal.classList.remove('active'); });

  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled=true; btn.textContent='Отправка...';
      const payload = Object.fromEntries(new FormData(form).entries());
      try{
        const res = await fetch('/send-message', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
        const json = await res.json();
        if(!res.ok) throw new Error((json && json.error) ? json.error : 'server_error');
        document.getElementById('successOverlay').style.display='flex'; modal.classList.remove('active'); form.reset();
      }catch(err){
        alert('Ошибка отправки: ' + (err.message || 'попробуйте позже'));
      }finally{ btn.disabled=false; btn.textContent='Отправить'; }
    });
  }

  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
});


/* === PATCH ADDED === */

// PATCH: reveal on scroll
(function(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, {threshold:0.12});
  document.querySelectorAll('section, .review-card, .staff-card, .gallery-slide').forEach(el=>{ el.classList.add('reveal'); obs.observe(el); });
})();

// PATCH: burger toggle
const burgerBtn = document.getElementById('burgerBtn');
const navMenu = document.querySelector('.nav-menu');
if(burgerBtn && navMenu){
  burgerBtn.addEventListener('click', ()=>{ navMenu.classList.toggle('nav-open'); });
}

// ensure phone link / whatsapp links have proper behavior (no-op here)


document.addEventListener('click', function(e){ if(e.target && e.target.id==='successClose'){ document.getElementById('successOverlay').style.display='none'; } });


/* THEME TOGGLE PATCH */


/* THEME TOGGLE PATCH */
(function(){
  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle){
    const saved = localStorage.getItem('site-theme');
    if(saved) document.body.setAttribute('data-theme', saved);
    themeToggle.addEventListener('click', ()=>{
      const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', next);
      localStorage.setItem('site-theme', next);
    });
  }
})();


/* MODAL PATCH */

/* MODAL PATCH */
(function(){
  const modal = document.getElementById('contactModal');
  const openBtn = document.getElementById('contactBtn');
  const closeBtn = document.querySelector('.modal-close');
  const cancelBtn = document.querySelector('.modal-cancel');
  if(openBtn && modal){
    openBtn.addEventListener('click',(e)=>{ e.preventDefault(); modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); const f = modal.querySelector('input,textarea'); if(f) f.focus(); });
  }
  if(closeBtn){
    closeBtn.addEventListener('click', ()=>{ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); });
  }
  if(cancelBtn){
    cancelBtn.addEventListener('click', ()=>{ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); });
  }
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ modal && modal.classList.remove('show'); } });
})();


/* REVIEWS PATCH */

/* REVIEWS PATCH */
(function(){
  const track = document.querySelector('.reviews-track');
  const prev = document.querySelector('.review-prev');
  const next = document.querySelector('.review-next');
  const cards = track ? Array.from(track.children) : [];
  let idx = 0;
  function update(){ if(!track || cards.length===0) return; const w = track.clientWidth || cards[0].offsetWidth; track.style.transform = `translateX(-${idx * w}px)`; }
  if(prev) prev.addEventListener('click', ()=>{ idx = (idx-1+cards.length)%cards.length; update(); });
  if(next) next.addEventListener('click', ()=>{ idx = (idx+1)%cards.length; update(); });
  window.addEventListener('resize', update);
  update();
  // autoplay
  let t = setInterval(()=>{ idx = (idx+1)%cards.length; update(); }, 5000);
  if(track){ track.addEventListener('mouseenter', ()=>clearInterval(t)); track.addEventListener('mouseleave', ()=> t = setInterval(()=>{ idx = (idx+1)%cards.length; update(); }, 5000)); }
})();
