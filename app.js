var model = localStorage.model ? JSON.parse(localStorage.model) : {index:{empresa:0, funcionario:0, cargo:0, afastamento:0}, empresas:[], cargos:[], funcionarios:[], afastamentos:[]};
const main_container = document.getElementById('main_container');
const add_btn = document.getElementById('add');
const submit_btn = document.getElementById('submit');
const back_btn = document.getElementById('back');
const modalDelete_btn = document.getElementById('modal_delete_btn');
const modalDelete = new bootstrap.Modal(document.getElementById('delete_modal'), {keyboard: false});
const delete_btn = document.getElementById('delete');
const model_label = document.getElementById('model_label');
var main_table = null;


function modelRead(data=localStorage.model){}
function modelSave(){localStorage.model = JSON.stringify(model)}
function modelDownload(){
    dotNotify('warning', 'Baixando JSON....');
}
function modelClearLocal(){localStorage.removeItem('model')}


function formToDict(){
    let form = document.querySelector("form");
    let formData = new FormData(form);
    let resp = {};
    for([key, value] of formData){resp[key] = value}
    return resp;
}
function formLoad(dict){
    for(key in dict){document.getElementById(`id_${key}`).value = dict[key]}
}

function addControls(btns){
    let th = document.createElement('th');
    main_table.thead.querySelector('tr').appendChild(th);
    let td_content = '';
    for(let i in btns){
        td_content += `<button class="${btns[i].classList}" onclick="${btns[i].action}">${btns[i].innerHTML}</button>`
    }
    main_table.tbody.querySelectorAll('tr').forEach((el) => {
        let td = document.createElement('td');td.classList = 'text-end py-1';td.innerHTML = td_content;
        el.appendChild(td);
    })
    
}
function guiClear(){
    main_container.innerHTML = '';
    add_btn.classList.add('d-none');
    add_btn.onclick = null;
    back_btn.classList.add('d-none');
    back_btn.onclick = null;
    submit_btn.classList.add('d-none');
    submit_btn.onclick = null;
    modalDelete_btn.classList.add('d-none');
    delete_btn.onclick = null;
}

function dateStrBr2Date(str){
    let [dia, mes, ano] = str.split('/');
    if(!Date.parse(`${ano}-${mes}-${dia}`)){return null}
    return new Date(`${ano}-${mes}-${dia} 00:00`)

}