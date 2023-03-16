const error_icon = document.createElement('div');error_icon.classList = 'bug_icon d-none';error_icon.innerHTML = '<i class="fas fa-bug"></i>';document.body.appendChild(error_icon);
window.addEventListener('error', (ev) => {error_icon.classList.remove('d-none');});
if(localStorage.theme){document.documentElement.dataset.bsTheme = localStorage.theme;}
// *****************
function dotAlert(tipo, mensagem, autodismiss=true){
    try {document.querySelector('[data-type="dotAlert"]').remove();}catch(e){}let e = document.createElement('div');e.setAttribute('data-type','dotAlert');e.style.zIndex = 100;let b = document.createElement('button');b.classList.add('btn-close');b.setAttribute('data-bs-dismiss','alert');e.classList.add('alert','slideIn','dotAlert',`alert-${tipo}`,'alert-dismissible','fade','show','mb-0');e.innerHTML = mensagem;e.appendChild(b);document.body.appendChild(e);if(autodismiss){setTimeout(function() {e.remove()}, 5000);}
}

function dotNotify(tipo, mensagem, autodismiss=true){
    let e = document.createElement('div'); e.classList = `alert alert-${tipo} alert-dismissible slideIn mb-2`; let b = document.createElement('button'); b.classList = 'btn-close'; b.setAttribute('data-bs-dismiss','alert'); e.innerHTML = mensagem; e.appendChild(b); document.getElementById('notify_container').appendChild(e); if(autodismiss){setTimeout(function() {e.remove()}, 4500);}
}

function dotToday(dias=0, meses=0, anos=0, native=false, el=null){
    let today = new Date();
    today.setDate(today.getDate() + dias);
    today.setMonth(today.getMonth() + meses + 1);
    today.setFullYear(today.getFullYear() + anos);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth()).padStart(2, '0');
    const yyyy = today.getFullYear();
    if(!el){return native == true ? `${yyyy}-${mm}-${dd}` : `${dd}/${mm}/${yyyy}`;}
    else{
        if(el.hasAttribute('value')){el.value = native == true ? `${yyyy}-${mm}-${dd}` : `${dd}/${mm}/${yyyy}`;}
        else{el.innerHTML = native == true ? `${yyyy}-${mm}-${dd}` : `${dd}/${mm}/${yyyy}`;}
    }
}