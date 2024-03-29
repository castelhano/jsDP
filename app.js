var model = localStorage.model ? JSON.parse(localStorage.model) : {index:{version:0, empresa:0, funcionario:0, cargo:0, afastamento:0}, empresas:[], cargos:[], funcionarios:[], afastamentos:[],codigos:[]};
const main_container = document.getElementById('main_container');///
const btn_extra_container = document.getElementById('btn_extra_container');
const add_btn = document.getElementById('add');
const submit_btn = document.getElementById('submit');
const back_btn = document.getElementById('back');
const modalDelete_btn = document.getElementById('modal_delete_btn');
const modalDelete = new bootstrap.Modal(document.getElementById('delete_modal'), {keyboard: false});
const modalUpload = new bootstrap.Modal(document.getElementById('upload_modal'), {keyboard: false});
const delete_btn = document.getElementById('delete');
const model_label = document.getElementById('model_label');
var main_table = null;
const dayWeeks = {0:'DOM', 1:'SEG', 2:'TER', 3:'QUA', 4:'QUI', 5:'SEX', 6:'SAB'};

function afastamentosPendentes(){
    let pendentes = model.afastamentos.filter((e) => {
        // if(!e.retorno){return true};return dateGTENow(e.retorno); // Antigo filtro, pegava pela data de retorno
        if(e.pendente == 'Retorno'){return true}
    })
    pendentes.sort((a,b) => (dateStrBr2GetTime(a.retorno) > dateStrBr2GetTime(b.retorno)) ? 1 : ((dateStrBr2GetTime(b.retorno) > dateStrBr2GetTime(a.retorno)) ? -1 : 0));
    let retornos = document.getElementById('retornos_list');
    for(i in pendentes){
        let li = document.createElement('li');li.classList = 'd-flex justify-content-between';
        if(pendentes[i].retorno){
            li.innerHTML = `<span>${pendentes[i].retorno} ${dateGetDayWeek(pendentes[i].retorno)} <span class="btn btn-link p-0 text-decoration-none" onclick="guiAfastamentoId(null, ${pendentes[i].id})"><b>${pendentes[i].funcionario}</b> - ${model.funcionarios.filter((e)=>{return e.matricula == pendentes[i].funcionario})[0].nome}</span></span><small class="text-purple">${dataGetDaysFromNow(pendentes[i].retorno)}</small>`
        }
        else{
            li.innerHTML = `<span>--/--/---- --- <a href="#"><b>${pendentes[i].funcionario}</b> - ${model.funcionarios.filter((e)=>{return e.matricula == pendentes[i].funcionario})[0].nome}</a></span><small class="text-purple">--</small>`
        }
        retornos.appendChild(li)
    }
    if(retornos.childNodes.length == 0){
        retornos.innerHTML = '<li>Nenhum retorno agendado<li>';
    }
    // ******************
    let decisoes = model.afastamentos.filter((e) => {
        if(e.pendente == 'Decisao'){return true}
    })
    decisoes.sort((a,b) => (dateStrBr2GetTime(a.retorno) > dateStrBr2GetTime(b.retorno)) ? 1 : ((dateStrBr2GetTime(b.retorno) > dateStrBr2GetTime(a.retorno)) ? -1 : 0));
    let decisao = document.getElementById('decisao_list');
    for(i in decisoes){
        let li = document.createElement('li');li.classList = 'd-flex justify-content-between';
        if(decisoes[i].retorno){
            li.innerHTML = `<span>${decisoes[i].retorno} ${dateGetDayWeek(decisoes[i].retorno)} <span class="btn btn-link p-0 text-decoration-none" onclick="guiAfastamentoId(null, ${decisoes[i].id})"><b>${decisoes[i].funcionario}</b> - ${model.funcionarios.filter((e)=>{return e.matricula == decisoes[i].funcionario})[0].nome}</span></span><small class="text-purple">${dataGetDaysFromNow(decisoes[i].retorno)}</small>`
        }
        else{
            li.innerHTML = `<span>--/--/---- --- <a href="#"><b>${decisoes[i].funcionario}</b> - ${model.funcionarios.filter((e)=>{return e.matricula == decisoes[i].funcionario})[0].nome}</a></span><small class="text-purple">--</small>`
        }
        decisao.appendChild(li)
    }
    if(decisao.childNodes.length == 0){
        decisao.innerHTML = '<li>Nenhum aguardando decisão<li>';
    }
}

afastamentosPendentes();

function modelRead(data=localStorage.model){}
function modelSave(){localStorage.model = JSON.stringify(model)}
function modelDownload(){
    let version = model.index.version++;
    modelSave();
    let data = JSON.stringify(model);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(data);
    let filename = `afastamentos_${model.index.version}.json`;
    let btn = document.createElement('a');
    btn.classList = 'd-none';
    btn.setAttribute('href', dataUri);
    btn.setAttribute('download', filename);
    btn.click();
    btn.remove();
    dotNotify('success', 'Arquivos <b>exportado</b> com sucesso.')
}

function modelUpload(){
    let file = document.getElementById('modelInputFile').files[0];
    let helper = document.getElementById('uploadModalHelper');
    if(!file){
        helper.innerHTML = '<div class="callout callout-danger"><div class="body bg-danger-subtle">Selecione um arquivo</div></div>';
        return false;
    }
    helper.innerHTML = '';
    let fr = new FileReader();
    fr.onload = (function(){
        try {
            let result = JSON.parse(fr.result);
            let valid = true;
            if(!('index' in result)){valid = false}
            else if(!('empresas' in result)){valid = false}
            else if(!('cargos' in result)){valid = false}
            else if(!('funcionarios' in result)){valid = false}
            else if(!('afastamentos' in result)){valid = false}
            else if(!('codigos' in result)){valid = false}
            if(!valid){throw 'error'}
            model = result;
            modelSave();
            dotNotify('success', 'Dados carregados com sucesso.');
        } catch (e) {
            dotNotify('danger', 'O arquivo tem formato <b>inválido</b>, processo abortado.');
        }
    });
    fr.readAsText(document.getElementById('modelInputFile').files[0]);
    modalUpload.hide();
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
        td_content += `<button class="${btns[i].classList}" onclick="${btns[i].action}" title="${btns[i]?.alt || ''}">${btns[i].innerHTML}</button>`
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
    btn_extra_container.innerHTML = '';
    document.activeElement.blur();
}

function dateStrBr2Date(str){
    let [dia, mes, ano] = str.split('/');
    if(!Date.parse(`${ano}-${mes}-${dia}`)){return null}
    return new Date(`${ano}-${mes}-${dia} 00:00`)
}

function dateStrBr2Standard(str){
    let [dia, mes, ano] = str.split('/');
    return `${ano}-${mes}-${dia}`;
}

function dateStandart2DateBR(str){
    let [ano, mes, dia] = str.split('-');
    return `${dia}/${mes}/${ano}`;
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