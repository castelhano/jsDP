const funcionario_form = '<form action="#"><input type="hidden" id="id_id" name="id"><div class="row g-1"><div class="form-floating mb-1 col-lg-2"><input type="text" class="form-control" name="matricula" id="id_matricula" placeholder=" "><label for="id_matricula">Matricula</label></div><div class="form-floating mb-1 col-lg-4"><select class="form-select" id="id_empresa" name="empresa"></select><label for="id_empresa">Empresa</label></div></div><div class="row g-1"><div class="form-floating mb-1 col-lg-6"><input type="text" class="form-control" name="nome" id="id_nome" placeholder=" "><label for="id_nome">Nome</label></div></div><div class="row g-1"><div class="form-floating mb-1 col-lg-2"><select class="form-select" id="id_cargo" name="cargo"></select><label for="id_cargo">Cargo</label></div><div class="form-floating mb-1 col-lg-2"><input type="date" class="form-control" name="admissao" id="id_admissao"><label for="id_admissao">Admissão</label></div><div class="form-floating mb-1 col-lg-2"><select class="form-select bg-body-secondary" id="id_status" name="status"><option value="Ativo" selected>Ativo</option><option value="Afastado">Afastado</option><option value="Desligado">Desligado</option></select><label for="id_status">Status</label></div></div></form>';
class Funcionario{
    constructor(options){
        this.id = this.nextId();
        this.matricula = options?.matricula || 'Matricula';
        this.nome = options?.nome || 'Nome funcionario';
        this.empresa = options?.empresa || '';
        this.cargo = options?.cargo || '';
        this.admissao = options?.admissao || '';
        this.status = options?.status || 'Ativo';
    }
    nextId(){return model.index.funcionario++;}
}

function guiFuncionarios(funcionario=null){
    guiClear();
    model_label.innerHTML = 'Funcionario';
    guiBuildFormFuncionario();
    dateInputExtra_start();
    if(funcionario){ // Caso chamada de funcao forneca dados do funcionario, pre carrega dados
        formLoad(funcionario);
    }
    let matricula = document.getElementById('id_matricula');
    matricula.onblur = () => {
        let target = model.funcionarios.filter((e) => {return e.matricula == matricula.value})[0];
        if(target){
            formLoad(target, ['admissao']);
            if(target.admissao != ''){document.getElementById('id_admissao').value = dateStrBr2Standard(target.admissao)}
        }
        else{
            funcionarioFormClean();
            document.getElementById('id_admissao').value = dotToday(0,0,0,true);
        }   
        submit_btn.onclick = () => {
            let form = formToDict();
            if(form.empresa == undefined){dotNotify('danger', '<b>Erro:</b> Informe a empresa'); return false;}
            if(form.matricula.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>matrícula</b> obrigatório'); return false;}
            if(form.nome.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>nome</b> obrigatório'); return false;}
            if(form.cargo == undefined){dotNotify('danger', '<b>Erro:</b> Informe o cargo'); return false;}
            if(form.admissao != ''){form.admissao = dateStandart2DateBR(form.admissao)}
            if(target){
                let index = model.funcionarios.indexOf(target);
                model.funcionarios[index] = form;
                dotNotify('success', `Funcionario <b>${form.matricula}</b> atualizado`);
            }
            else{
                model.funcionarios.push(new Funcionario(form));
                dotNotify('success', `Funcionario <b>${form.matricula}</b> cadastrado`);
            }
            modelSave();
            funcionarioFormCleanAll();
        }
    }
    let showAll = document.createElement('button');showAll.type = 'button';showAll.classList = 'btn btn-sm btn-secondary';showAll.innerHTML = '<i class="fas fa-users me-2"></i>Todos';
    showAll.onclick = () => {funcionarioShowAll()};
    btn_extra_container.appendChild(showAll);
}
function guiBuildFormFuncionario(){
    main_container.innerHTML = funcionario_form;
    let empresas = document.getElementById('id_empresa');
    model.empresas.forEach((e) => {
        let empresa = document.createElement('option');
        empresa.value = e.id;
        empresa.innerHTML = e.nome;
        empresas.appendChild(empresa);
    });
    let cargos = document.getElementById('id_cargo');
    model.cargos.forEach((e) => {
        let cargo = document.createElement('option');
        cargo.value = e.id;
        cargo.innerHTML = e.nome;
        cargos.appendChild(cargo);
    });
    back_btn.classList.remove('d-none');
    back_btn.onclick = () => {document.getElementById('clear').click()}
    submit_btn.classList.remove('d-none');
    setTimeout(() => {document.getElementById('id_matricula').focus()}, 120);
}

function funcionarioFormClean(){
    let form = {id:'', nome:'',empresa:0,cargo:0,admissao:'',status:'Ativo'};
    formLoad(form);
}
function funcionarioFormCleanAll(){
    let form = {id:'',matricula:'', nome:'',empresa:0,cargo:0,admissao:'',status:'Ativo'};
    formLoad(form);
    document.getElementById('id_matricula').focus();
}

function funcionarioShowAll(){
    guiClear();
    // let ajustedForm = model.funcionarios;
    let ajustedForm = JSON.parse(JSON.stringify(model.funcionarios));
    // ajustedForm = []
    ajustedForm.forEach((e) => {
        e.empresa = model.empresas[e.empresa].nome;
        e.cargo = model.cargos[e.cargo].nome;
    });
    main_table = new jsTable('funcionarios', {
        container: main_container,
        data: ajustedForm,
        canFilter: true,
        filterCols: ['matricula', 'nome', 'empresa', 'cargo', 'status'],
        enablePaginate: true
    })
}