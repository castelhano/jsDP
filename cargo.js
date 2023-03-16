const cargo_form = '<form action="#"><input type="hidden" name="id" id="id_id"><div class="row g-1"><div class="form-floating mb-1 col-lg-4"><input type="text" id="id_nome" name="nome" class="form-control" placeholder=" "><label for="id_nome">Nome Cargo</label></div></div></form>';

class Cargo{
    constructor(options){
        this.id = this.nextId();
        this.nome = options?.nome || 'Nova cargo';
    }
    nextId(){return model.index.cargo++;}
}

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
    model_label.innerHTML = 'Cargo';
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