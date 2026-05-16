const confessions = [
    "I once shipped a fix by deleting the problem file.",
    "Comments in code are where ideas go to die.",
    "I name variables after my mood: 'rip', 'maybe', 'nope'.",
    "Documentation? I prefer to wing it.",
    "I can reproduce bugs locally, but only on Fridays."
];

function animateHero(){
    const hero = document.querySelector('.hero');
    if(!hero) return;
    // stagger entrance
    setTimeout(()=> hero.classList.add('entered'), 180);
}

function setupConfessions(){
    const honestyBtn = document.getElementById('honesty');
    const confessionEl = document.getElementById('confession');
    if(honestyBtn && confessionEl){
        honestyBtn.addEventListener('click', ()=>{
            const i = Math.floor(Math.random()*confessions.length);
            confessionEl.textContent = confessions[i];
        });
    }
}

function setupReveal(){
    const obs = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
            if(e.isIntersecting) e.target.classList.add('visible');
        });
    },{threshold:0.12});

    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

function animateRatingWhenVisible(){
    const ratingEl = document.getElementById('rating');
    if(!ratingEl) return;
    const obs = new IntersectionObserver((entries, o)=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                let p = 0;
                const fill = setInterval(()=>{
                    p += 5;
                    const bars = '█'.repeat(Math.round(p/10)) + '░'.repeat(10 - Math.round(p/10));
                    ratingEl.textContent = `[${bars}] ${Math.min(100,Math.round(p))}%`;
                    if(p>=100) clearInterval(fill);
                },60);
                o.disconnect();
            }
        });
    }, {threshold: 0.2});
    obs.observe(ratingEl);
}

function setupScrollProgress(){
    const bar = document.createElement('div');
    bar.className = 'progress';
    document.body.appendChild(bar);
    window.addEventListener('scroll', ()=>{
        const s = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h>0 ? (s/h)*100 : 0;
        bar.style.width = pct + '%';
    },{passive:true});
}

function initSite(){
    animateHero();
    setupConfessions();
    setupReveal();
    animateRatingWhenVisible();
    setupScrollProgress();
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSite);
else initSite();