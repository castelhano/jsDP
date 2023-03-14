const main_container = document.getElementById('main_container');
const add_btn = document.getElementById('add');
const submit_btn = document.getElementById('submit');
const back_btn = document.getElementById('back');
const empresa_form = '<form action="#"><input type="hidden" name="id" id="id_id"><div class="row g-1"><div class="form-floating mb-1 col-lg-4"><input type="text" id="id_nome" name="nome" class="form-control" placeholder=" "><label for="id_nome">Nome Empresa</label></div><div class="form-floating mb-1 col-lg-4"><input type="text" id="id_cnpj" name="cnpj" class="form-control" placeholder=" "><label for="id_cnpj">CNPJ</label></div></div><div class="row g-1"><div class="form-floating mb-1 col-lg-8"><input type="text" id="id_razaoSocial" name="razaoSocial" class="form-control" placeholder=" "><label for="id_razaoSocial">Razão Social</label></div></div></form>';    
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
    formLoad(model.empresas[id]);
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {guiEmpresas();}
    submit_btn.classList.remove('d-none');
    submit_btn.onclick = () => {
        let form = formToDict();
        if(form.nome.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>nome</b> obrigatório'); return false;}
        model.empresas[id] = form;
        dotNotify('success', `Empresa <b>${form.nome}</b> atualidada`);
        modelSave();
        guiEmpresas();
    }
    setTimeout(() => {document.getElementById('id_nome').focus()}, 120);
}

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
}