const error_icon = document.createElement('div');error_icon.classList = 'bug_icon d-none';error_icon.innerHTML = '<i class="fas fa-bug"></i>';document.body.appendChild(error_icon);
window.addEventListener('error', (ev) => {error_icon.classList.remove('d-none');});
if(localStorage.theme){document.documentElement.dataset.bsTheme = localStorage.theme;}
const notify_container = document.createElement('div');notify_container.id = 'notify_container';notify_container.style = 'position: fixed;top: 50px;right: 10px;max-width: 450px;z-index: 1000;';document.body.appendChild(notify_container);
// *****************
function dotNotify(tipo, mensagem, autodismiss=true){
    try {document.querySelector('[data-type="dotAlert"]').remove();}catch(e){} let e = document.createElement('div'); e.classList = `alert alert-${tipo} alert-dismissible slideIn mb-2`; let b = document.createElement('button'); b.classList = 'btn-close'; b.setAttribute('data-bs-dismiss','alert'); e.innerHTML = mensagem; e.appendChild(b); document.getElementById('notify_container').appendChild(e); if(autodismiss){setTimeout(function() {e.remove()}, 4500);} }