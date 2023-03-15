const main_container = document.getElementById('main_container');
const add_btn = document.getElementById('add');
const submit_btn = document.getElementById('submit');
const back_btn = document.getElementById('back');
const modalDelete_btn = document.getElementById('modal_delete_btn');
const modalDelete = new bootstrap.Modal(document.getElementById('delete_modal'), {keyboard: false});
const delete_btn = document.getElementById('delete');
const model_label = document.getElementById('model_label');
const empresa_form = '<form action="#"><input type="hidden" name="id" id="id_id"><div class="row g-1"><div class="form-floating mb-1 col-lg-4"><input type="text" id="id_nome" name="nome" class="form-control" placeholder=" "><label for="id_nome">Nome Empresa</label></div><div class="form-floating mb-1 col-lg-4"><input type="text" id="id_cnpj" name="cnpj" class="form-control" placeholder=" "><label for="id_cnpj">CNPJ</label></div></div><div class="row g-1"><div class="form-floating mb-1 col-lg-8"><input type="text" id="id_razaoSocial" name="razaoSocial" class="form-control" placeholder=" "><label for="id_razaoSocial">Razão Social</label></div></div></form>';    
const cargo_form = '<form action="#"><input type="hidden" name="id" id="id_id"><div class="row g-1"><div class="form-floating mb-1 col-lg-4"><input type="text" id="id_nome" name="nome" class="form-control" placeholder=" "><label for="id_nome">Nome Cargo</label></div></div></form>';    
var main_table = null;
// ***************************
function guiEmpresas(){
    guiClear();
    main_table = new jsTable('empresas', {
        container: main_container,
        data: model.empresas,
        canFilter: true,
        filterCols: ['nome']
    });
    addControls([{classList:'btn btn-sm btn-dark',innerHTML:'<i class="fas fa-pen"></i>',action:'guiEmpresaId(this)'}]);
    setTimeout(() => {main_table.filterInput.focus()}, 120);
    model_label.innerHTML = 'Empresas';
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {document.getElementById('clear').click()};
    add_btn.classList.remove('d-none');
    add_btn.onclick = () => {guiEmpresaAdd()};

}
function guiEmpresaAdd(){
    guiClear();
    main_container.innerHTML = empresa_form;
    VMasker(document.getElementById("id_cnpj")).maskPattern('99.999.999/9999-99');
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {guiEmpresas();}
    submit_btn.classList.remove('d-none');
    submit_btn.onclick = () => {
        let form = formToDict();
        if(form.nome.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>nome</b> obrigatório'); return false;}
        model.empresas.push(new Empresa(form));
        modelSave();
        dotNotify('success', `Empresa <b>${form.nome}</b> cadastrada`);
        guiEmpresas();
    };
    setTimeout(() => {document.getElementById('id_nome').focus()}, 120);
}
function guiEmpresaId(el){
    guiClear();
    main_container.innerHTML = empresa_form;
    VMasker(document.getElementById("id_cnpj")).maskPattern('99.999.999/9999-99');
    let id = el.parentNode.parentNode.firstChild.innerText;
    let target = model.empresas.filter((e) => {return e.id == id})[0];
    let index = model.empresas.indexOf(target);
    formLoad(target); 
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {guiEmpresas();}
    submit_btn.classList.remove('d-none');
    modalDelete_btn.classList.remove('d-none');
    submit_btn.onclick = () => {
        let form = formToDict();
        if(form.nome.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>nome</b> obrigatório'); return false;}
        model.empresas[index] = form;
        dotNotify('success', `Empresa <b>${form.nome}</b> atualidada`);
        modelSave();
        guiEmpresas();
    }
    delete_btn.onclick = () => {
        let tmp = model.empresas[index].nome;
        model.empresas.splice(index, 1);
        modalDelete.hide();
        dotNotify('warning', `Empresa <b>${tmp}</b> removida, este processo não pode ser desfeito.`)
        modelSave();
        guiEmpresas();
    };
    setTimeout(() => {document.getElementById('id_nome').focus()}, 120);
}
// *********************
function guiCargos(){
    guiClear();
    main_table = new jsTable('cargos', {
        container: main_container,
        data: model.cargos,
        canFilter: true,
        filterCols: ['nome']
    });
    addControls([{classList:'btn btn-sm btn-dark',innerHTML:'<i class="fas fa-pen"></i>',action:'guiCargoId(this)'}]);
    setTimeout(() => {main_table.filterInput.focus()}, 120);
    model_label.innerHTML = 'Cargos';
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {document.getElementById('clear').click()};
    add_btn.classList.remove('d-none');
    add_btn.onclick = () => {guiCargoAdd()};

}
function guiCargoAdd(){
    guiClear();
    main_container.innerHTML = cargo_form;
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {guiCargos();}
    submit_btn.classList.remove('d-none');
    submit_btn.onclick = () => {
        let form = formToDict();
        if(form.nome.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>nome</b> obrigatório'); return false;}
        model.cargos.push(new Cargo(form));
        modelSave();
        dotNotify('success', `Cargo <b>${form.nome}</b> cadastrado`);
        guiCargos();
    };
    setTimeout(() => {document.getElementById('id_nome').focus()}, 120);
}
function guiCargoId(el){
    guiClear();
    main_container.innerHTML = cargo_form;
    let id = el.parentNode.parentNode.firstChild.innerText;
    let target = model.cargos.filter((e) => {return e.id == id})[0];
    let index = model.cargos.indexOf(target);
    formLoad(target); 
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {guiCargos();}
    submit_btn.classList.remove('d-none');
    modalDelete_btn.classList.remove('d-none');
    submit_btn.onclick = () => {
        let form = formToDict();
        if(form.nome.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>nome</b> obrigatório'); return false;}
        model.cargos[index] = form;
        dotNotify('success', `Cargo <b>${form.nome}</b> atualidado`);
        modelSave();
        guiCargos();
    }
    delete_btn.onclick = () => {
        let tmp = model.cargos[index].nome;
        model.cargos.splice(index, 1);
        modalDelete.hide();
        dotNotify('warning', `Cargo <b>${tmp}</b> removido, este processo não pode ser desfeito.`)
        modelSave();
        guiCargos();
    };
    setTimeout(() => {document.getElementById('id_nome').focus()}, 120);
}
// *******************

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