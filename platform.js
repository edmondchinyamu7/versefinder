/* VerseFinder Phase 3: PWA installation, update notices and connectivity feedback. */
(() => {
  const installButton=document.querySelector("#installApp");
  let installPrompt=null;
  const announce=message=>{const toast=document.querySelector("#toast");if(!toast)return;toast.textContent=message;toast.classList.add("show");window.clearTimeout(announce.timer);announce.timer=window.setTimeout(()=>toast.classList.remove("show"),3200)};
  window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();installPrompt=event;if(installButton)installButton.hidden=false});
  window.addEventListener("appinstalled",()=>{installPrompt=null;if(installButton)installButton.hidden=true;announce("VerseFinder has been installed.")});
  installButton?.addEventListener("click",async()=>{if(!installPrompt){announce("To install, use your browser menu and choose Install app or Add to Home Screen.");return}installButton.disabled=true;try{await installPrompt.prompt();const choice=await installPrompt.userChoice;if(choice?.outcome==="accepted")announce("Installing VerseFinder…");else announce("Installation was cancelled.")}catch{announce("Your browser could not start installation. Try its menu instead.")}finally{installPrompt=null;installButton.hidden=true;installButton.disabled=false}});
  window.addEventListener("online",()=>announce("You are back online."));
  window.addEventListener("offline",()=>announce("You are offline. Downloaded Bible books remain available on this device."));
  if("serviceWorker" in navigator&&location.protocol.startsWith("http")){
    navigator.serviceWorker.ready.then(registration=>{registration.update().catch(()=>{});registration.addEventListener("updatefound",()=>{const installing=registration.installing;if(!installing)return;installing.addEventListener("statechange",()=>{if(installing.state==="installed"&&navigator.serviceWorker.controller)announce("A VerseFinder update is ready. Reload to use the latest version.")})})}).catch(()=>{});
    let refreshing=false;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(refreshing)return;refreshing=true;window.location.reload()});
  }
})();
