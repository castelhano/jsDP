const afastamento_form = '<form action="#"><input type="hidden" id="id_id" name="id"><div class="row g-1"><div class="form-floating mb-lg-1 col-auto"><input type="text" id="id_funcionario" name="funcionario" class="form-control"><label for="id_funcionario">Matricula</label></div><div class="form-floating mb-lg-1 col"><input type="text" id="id_nome_funcionario" class="form-control" disabled><label for="id_nome_funcionario">Nome</label></div><div class="form-floating mb-1 col-lg-2"><input type="text" id="id_cargo_funcionario" class="form-control" disabled><label for="id_cargo_funcionario">Cargo</label></div></div><div class="row g-1"><div class="form-floating mb-lg-1 col-lg-2"><select class="form-select" id="id_motivo" name="motivo"><option value="Doenca">Doenca</option><option value="Acidente">Acidente</option></select><label for="id_motivo">Motivo</label></div><div class="form-floating mb-lg-1 col-lg-2"><input type="date" id="id_pericia" name="pericia" class="form-control"><label for="id_pericia">Pericia</label></div><div class="form-floating mb-lg-1 col-lg-2"><input type="date" id="id_inicio" name="inicio" class="form-control"><label for="id_inicio">Inicio</label></div><div class="form-floating mb-lg-1 col-lg-2"><input type="number" id="id_dias" name="dias" min="1" value="15" class="form-control"><label for="id_dias">Dias ATM</label></div><div class="form-floating mb-lg-1 col-lg-2"><input type="text" id="id_retorno" name="retorno" class="form-control fw-bold" tabindex="-1" readonly><label for="id_retorno">Retorno</label></div><div class="form-floating mb-1 col-lg-2"><select class="form-select" id="id_inss" name="inss"><option value="Sim">Sim</option><option value="Nao">Nao</option></select><label for="id_inss">INSS</label></div></div><div class="row g-1"><div class="col"><textarea name="parecer" id="id_parecer" class="form-control" placeholder="Parecer médico" style="min-height: 150px;"></textarea></div><divclass="col"id="avaliacoes_container"></div></div></form>';

class Afastamento{
    constructor(options){
        this.id = this.nextId();
        this.funcionario = options?.funcionario || '';
        this.motivo = options?.motivo || 'Doenca';
        this.pericia = options?.pericia || '';
        this.inss = options?.inss || 'Sim';
        this.inicio = options?.inicio || `${dotToday(0,0,0,true)}`;
        this.dias = options?.dias || 15;
        this.retorno = options?.retorno || '';
        this.avaliacao = options?.avaliacao || []; // {retorno: '10/12/2023', status: 'Apto'}
        this.parecer = options?.parecer || '';
    }
    nextId(){return model.index.afastamento++;}
}

function guiAfastamentos(){
    guiClear();
    let dados = model.afastamentos;
    main_table = new jsTable('afastamentos', {
        container: main_container,
        data: dados,
        canFilter: true,
        filterCols: ['funcionario', 'motivo'], 
        hideCols: ['avaliacao','parecer']
    });
    if(main_table.raw.length > 0){addControls([{classList:'btn btn-sm btn-dark',innerHTML:'<i class="fas fa-pen"></i>',action:'guiAfastamentoId(this)'}])}
    model_label.innerHTML = 'Afastamento';
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {document.getElementById('clear').click()}
    add_btn.classList.remove('d-none');
    add_btn.onclick = () => {guiAfastamentoAdd()};
}

function calcularRetorno(inicio, dias){
    if(!Date.parse(inicio) || !parseInt(dias)){return ''}
    let retorno = new Date(`${inicio} 00:00`);
    retorno.setDate(retorno.getDate() + parseInt(dias));
    const dd = String(retorno.getDate()).padStart(2, '0');
    const mm = String(retorno.getMonth() + 1).padStart(2, '0');
    const yyyy = retorno.getFullYear();
    return `${dd}/${mm}/${yyyy}`
}

function guiAfastamentoAdd(){
    guiClear();
    main_container.innerHTML = afastamento_form;
    let matricula = document.getElementById('id_funcionario');
    let nome = document.getElementById('id_nome_funcionario');
    let cargo = document.getElementById('id_cargo_funcionario');
    let inicio = document.getElementById('id_inicio');
    let dias = document.getElementById('id_dias');
    let retorno = document.getElementById('id_retorno');
    matricula.onblur = () => {
        let target = model.funcionarios.filter((e) => {return e.matricula == matricula.value})[0];
        if(!target){
            matricula.classList.add('is-invalid');
            nome.value = '';
            cargo.value = '';
            matricula.select();
            return false;
        }
        matricula.classList.remove('is-invalid');
        nome.value = target.nome;
        cargo.value = model.cargos[target.cargo].nome;
    };
    inicio.onblur = () => {retorno.value = calcularRetorno(inicio.value, dias.value)}
    dias.onblur = () => {retorno.value = calcularRetorno(inicio.value, dias.value)}
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {guiAfastamentos();}
    submit_btn.classList.remove('d-none');
    submit_btn.onclick = () => {
        let form = formToDict();
        if(form.funcionario.trim() == '' || matricula.classList.contains('is-invalid')){dotNotify('danger', '<b>Erro:</b> Informe um funcionário válido'); return false;}
        if(form.pericia.trim() != ''){form.pericia = dateStandart2DateBR(form.pericia)};
        if(form.inicio.trim() != ''){form.inicio = dateStandart2DateBR(form.inicio)};
        model.afastamentos.push(new Afastamento(form));
        let funcionario = model.funcionarios.filter((e) => {return e.matricula == form.funcionario})[0];
        funcionario.status = 'Afastado';
        modelSave();
        dotNotify('success', `Funcionário <b>${form.funcionario}</b> afastado`);
        guiAfastamentos();
    };
    setTimeout(() => {matricula.focus()}, 120);
}
function guiAfastamentoId(el){
    guiClear();
    main_container.innerHTML = afastamento_form;
    let id = el.parentNode.parentNode.firstChild.innerText;
    let target = model.afastamentos.filter((e) => {return e.id == id})[0];
    let index = model.afastamentos.indexOf(target);
    

    formLoad(target, ['avaliacao']);    
    let matricula = document.getElementById('id_funcionario');
    matricula.setAttribute('readonly','');
    let funcionario = model.funcionarios.filter((e) => {return e.matricula == target.funcionario})[0];
    document.getElementById('id_nome_funcionario').value = funcionario.nome;
    document.getElementById('id_cargo_funcionario').value = model.cargos[funcionario.cargo].nome;
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {guiAfastamentos();}
    submit_btn.classList.remove('d-none');
    modalDelete_btn.classList.remove('d-none');
    submit_btn.onclick = () => {
        let form = formToDict();
        if(form.funcionario.trim() == '' || matricula.classList.contains('is-invalid')){dotNotify('danger', '<b>Erro:</b> Informe um funcionario válido'); return false;}
        model.afastamentos[index] = form;
        dotNotify('success', `Afastamento <b>${form.funcionario}</b> atualidado`);
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
    setTimeout(() => {document.getElementById('id_motivo').focus()}, 120);
}