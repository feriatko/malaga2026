
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const visitedKey='dovolenka-visited-v1';
let visited=new Set(JSON.parse(localStorage.getItem(visitedKey)||'[]'));
function saveVisited(){localStorage.setItem(visitedKey,JSON.stringify([...visited]));renderVisited();}
function renderVisited(){
  $$('[data-visited]').forEach(b=>b.classList.toggle('active',visited.has(b.dataset.visited)));
  const total=$$('[data-visited]').length, count=visited.size, pct=total?Math.round(count/total*100):0;
  if($('#progressValue')) $('#progressValue').textContent=pct+'%'; if($('#progressRing')) $('#progressRing').style.setProperty('--p',(pct*3.6)+'deg');
  if($('#progressText')) $('#progressText').textContent=count?`Navštívené ${count} z ${total} miest.`:'Zatiaľ nemáte označené žiadne miesto.';
}
$$('[data-visited]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.visited;visited.has(id)?visited.delete(id):visited.add(id);saveVisited()}));
if($('#resetVisited')) $('#resetVisited').addEventListener('click',()=>{if(confirm('Vynulovať všetky navštívené miesta?')){visited.clear();saveVisited()}});
renderVisited();

$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
  $$('.place-card').forEach(card=>card.classList.toggle('hidden',btn.dataset.filter!=='all'&&card.dataset.group!==btn.dataset.filter));
}));

$$('[data-check]').forEach(ch=>{
  ch.checked=localStorage.getItem('check-'+ch.dataset.check)==='1';
  ch.addEventListener('change',()=>localStorage.setItem('check-'+ch.dataset.check,ch.checked?'1':'0'));
});

const themeBtn=$('#themeBtn');
if(localStorage.getItem('holiday-theme')==='dark')document.body.classList.add('darkmode');
if(themeBtn) themeBtn.addEventListener('click',()=>{document.body.classList.toggle('darkmode');localStorage.setItem('holiday-theme',document.body.classList.contains('darkmode')?'dark':'light')});

async function weather(){
  if(!$('#temperature')) return;
  try{
    const url='https://api.open-meteo.com/v1/forecast?latitude=36.5961&longitude=-4.5727&current=temperature_2m,weather_code&daily=temperature_2m_max,uv_index_max,sunset&timezone=Europe%2FMadrid&forecast_days=1';
    const r=await fetch(url); if(!r.ok)throw new Error(); const d=await r.json();
    const codes={0:'Jasno',1:'Prevažne jasno',2:'Polooblačno',3:'Zamračené',45:'Hmla',51:'Slabé mrholenie',61:'Slabý dážď',63:'Dážď',80:'Prehánky',95:'Búrka'};
    $('#temperature').textContent=Math.round(d.current.temperature_2m);$('#maxTemp').textContent=Math.round(d.daily.temperature_2m_max[0]);
    $('#uv').textContent=Math.round(d.daily.uv_index_max[0]);$('#sunset').textContent=d.daily.sunset[0].slice(11,16);
    $('#weatherText').textContent=(codes[d.current.weather_code]||'Aktuálne počasie')+'. Pri vysokom UV plánujte pamiatky ráno a oddych počas poludnia.';
    $('#weatherStatus').textContent='Aktualizované online';
  }catch(e){$('#weatherStatus').textContent='Offline režim';}
}
weather();

let deferredPrompt; const installBtn=$('#installBtn');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});
if(installBtn) installBtn.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.hidden=true});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js'));
