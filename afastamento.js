const afastamento_form = '';

class Afastamento{
    constructor(options){
        this.id = this.nextId();
        this.funcionario = options?.funcionario || '';
        this.inicio = options?.inicio || dotToday(0,0,0,true);
        this.concluido = options?.concluido || !options?.concluido == false;
        this.retorno = options?.retorno || '';
        this.motivo = options?.motivo || 'Doenca';
        this.avaliacao = options?.avaliacao || '';
    }
    nextId(){return model.index.afastamento++;}
}

function guiAfastamentos(funcionario=null){
    guiClear();
    let dados = funcionario ? model.afastamentos.filter((e) => {return e.matricula == funcionario.matricula.value}) : model.afastamentos;
    let options = {container: main_container,data: dados};
    if(funcionario){options.caption = `<h5 class="ps-1">Afastamentos: <span class="text-purple">${funcionario.matricula} ${funcionario.nome}</span></h5>`}
    main_table = new jsTable('afastamentos', options);
    if(main_table.raw.length > 0){addControls([{classList:'btn btn-sm btn-dark',innerHTML:'<i class="fas fa-pen"></i>',action:'guiAfastamebtoId(this)'}])}
    model_label.innerHTML = 'Afastamento';
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {
        if(funcionario){guiFuncionarios(funcionario)}
        else{document.getElementById('clear').click()}
    }
    add_btn.classList.remove('d-none');
    add_btn.onclick = () => {guiAfastamentoAdd()};

}
function guiAfastamentoAdd(){
    guiClear();
    main_container.innerHTML = afastamento_form;
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {guiAfastamentos();}
    submit_btn.classList.remove('d-none');
    submit_btn.onclick = () => {
        let form = formToDict();
        if(form.nome.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>nome</b> obrigatório'); return false;}
        model.afastamentos.push(new Afastamento(form));
        modelSave();
        dotNotify('success', `Afastamento <b>${form.nome}</b> cadastrado`);
        guiAfastamentos();
    };
    setTimeout(() => {document.getElementById('id_nome').focus()}, 120);
}
function guiAfastamentoId(el){
    guiClear();
    main_container.innerHTML = afastamento_form;
    let id = el.parentNode.parentNode.firstChild.innerText;
    let target = model.afastamentos.filter((e) => {return e.id == id})[0];
    let index = model.afastamentos.indexOf(target);
    formLoad(target); 
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {guiAfastamentos();}
    submit_btn.classList.remove('d-none');
    modalDelete_btn.classList.remove('d-none');
    submit_btn.onclick = () => {
        let form = formToDict();
        if(form.nome.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>nome</b> obrigatório'); return false;}
        model.afastamentos[index] = form;
        dotNotify('success', `Afastamento <b>${form.nome}</b> atualidado`);
        modelSave();
        guiAfastamentos();
    }
    delete_btn.onclick = () => {
        let tmp = model.afastamentos[index].nome;
        model.afastamentos.splice(index, 1);
        modalDelete.hide();
        dotNotify('warning', `Afastamento <b>${tmp}</b> removido, este processo não pode ser desfeito.`)
        modelSave();
        guiAfastamentos();
    };
    setTimeout(() => {document.getElementById('id_nome').focus()}, 120);
}