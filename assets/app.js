const checks=[...document.querySelectorAll('#checklist input')];
checks.forEach((box,i)=>{
  box.checked=localStorage.getItem(`malaga-check-${i}`)==='1';
  box.addEventListener('change',()=>localStorage.setItem(`malaga-check-${i}`,box.checked?'1':'0'));
});
let deferredPrompt;
const installBtn=document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault(); deferredPrompt=e; installBtn.hidden=false;
});
installBtn?.addEventListener('click',async()=>{
  if(!deferredPrompt)return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null; installBtn.hidden=true;
});
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js'));
}
