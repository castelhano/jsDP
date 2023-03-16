const empresa_form = '<form action="#"><input type="hidden" name="id" id="id_id"><div class="row g-1"><div class="form-floating mb-1 col-lg-4"><input type="text" id="id_nome" name="nome" class="form-control" placeholder=" "><label for="id_nome">Nome Empresa</label></div><div class="form-floating mb-1 col-lg-4"><input type="text" id="id_cnpj" name="cnpj" class="form-control" placeholder=" "><label for="id_cnpj">CNPJ</label></div></div><div class="row g-1"><div class="form-floating mb-1 col-lg-8"><input type="text" id="id_razaoSocial" name="razaoSocial" class="form-control" placeholder=" "><label for="id_razaoSocial">Razão Social</label></div></div></form>';
class Empresa{
    constructor(options){
        this.id = this.nextId();
        this.nome = options?.nome || 'Nova empresa';
        this.razaoSocial = options?.razaoSocial || '';
        this.cnpj = options?.cnpj || '';
    }
    nextId(){return model.index.empresa++;}
}

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
    model_label.innerHTML = 'Empresa';
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