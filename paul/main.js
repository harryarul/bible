// reveal on scroll + active nav
document.addEventListener('DOMContentLoaded',()=>{
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%4*60)+'ms';io.observe(el);});

  const here=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('nav a').forEach(a=>{
    if(a.getAttribute('href')===here) a.classList.add('active');
  });
});
