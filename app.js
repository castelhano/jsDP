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
const dayWeeks = {0:'DOM', 1:'SEG', 2:'TER', 3:'QUA', 4:'QUI', 5:'SEX', 6:'SAB'};

function afastamentosPendentes(){
    let pendentes = model.afastamentos.filter((e) => {
        if(!e.retorno){return true}
        return dateGTENow(e.retorno);
    })
    pendentes.sort((a,b) => (dateStrBr2GetTime(a.retorno) > dateStrBr2GetTime(b.retorno)) ? 1 : ((dateStrBr2GetTime(b.retorno) > dateStrBr2GetTime(a.retorno)) ? -1 : 0));
    let ul = document.getElementById('acompanhamento_list');
    for(i in pendentes){
        let li = document.createElement('li');li.classList = 'd-flex justify-content-between';
        if(pendentes[i].retorno){
            li.innerHTML = `<span>${pendentes[i].retorno} ${dateGetDayWeek(pendentes[i].retorno)} <a href="#"><b>${pendentes[i].funcionario}</b> - ${model.funcionarios.filter((e)=>{return e.matricula == pendentes[i].funcionario})[0].nome}</a></span><small class="text-purple">${dataGetDaysFromNow(pendentes[i].retorno)}</small>`
        }
        else{
            li.innerHTML = `<span>--/--/---- --- <a href="#"><b>${pendentes[i].funcionario}</b> - ${model.funcionarios.filter((e)=>{return e.matricula == pendentes[i].funcionario})[0].nome}</a></span><small class="text-purple">--</small>`
        }
        ul.appendChild(li)
    }
}

afastamentosPendentes();




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
function formLoad(dict, ignore=[]){
    for(key in dict){
        if(!ignore.includes(key)){document.getElementById(`id_${key}`).value = dict[key]}
    }
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
    document.activeElement.blur();
}

function dateStrBr2Date(str){
    let [dia, mes, ano] = str.split('/');
    if(!Date.parse(`${ano}-${mes}-${dia}`)){return null}
    return new Date(`${ano}-${mes}-${dia} 00:00`)

}

function dateStandart2DateBR(str){
    let [ano, mes, dia] = str.split('-');
    return `${dia}/${mes}/${ano}`;
}

function dateCompare(d1, d2){
    d1 = dateStrBr2Date(d1);
    return d1.getTime()
    if(d1.getTime() == d2.getTime()){return 0}
    else{}
}

function dateGTENow(d1){
    let today = new Date()
    today.setHours(0,0,0,0);
    let [dia, mes, ano] = d1.split('/');
    d1 = new Date(`${ano}-${mes}-${dia} 00:00`);
    return d1.getTime() >= today.getTime();
}

function dateStrBr2GetTime(d1){
    let [dia, mes, ano] = d1.split('/');
    return new Date(`${ano}-${mes}-${dia} 00:00`).getTime();
}

function dateGetDayWeek(d1){
    let [dia, mes, ano] = d1.split('/');
    d1 = new Date(`${ano}-${mes}-${dia} 00:00`);
    return dayWeeks[d1.getDay()];
}

function dataGetDaysFromNow(d1){
    let today = new Date()
    today.setHours(0,0,0);
    let [dia, mes, ano] = d1.split('/');
    d1 = new Date(`${ano}-${mes}-${dia} 00:00`);
    let diff = d1.getTime() - today.getTime();
    let diffDays = Math.floor(diff / (1000*3600*24)) + 1;
    if(diffDays == 0){return 'Hoje'}
    if(diffDays == 1){return 'Amanha'}
    return `${diffDays} dias`;
}