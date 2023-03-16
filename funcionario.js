const funcionario_form = '<form action="#"><input type="hidden" id="id_id" name="id"><input type="hidden" id="id_atestados" name="atestados"><div class="row g-1"><div class="form-floating mb-1 col-lg-2"><input type="text" class="form-control" name="matricula" id="id_matricula" placeholder=" "><label for="id_matricula">Matricula</label></div><div class="form-floating mb-1 col-lg-4"><select class="form-select" id="id_empresa" name="empresa"></select><label for="id_empresa">Empresa</label></div></div><div class="row g-1"><div class="form-floating mb-1 col-lg-6"><input type="text" class="form-control" name="nome" id="id_nome" placeholder=" "><label for="id_nome">Nome</label></div></div><div class="row g-1"><div class="form-floating mb-1 col-lg-2"><select class="form-select" id="id_cargo" name="cargo"></select><label for="id_cargo">Cargo</label></div><div class="form-floating mb-1 col-lg-2"><input type="date" class="form-control" name="admissao" id="id_admissao"><label for="id_admissao">Admissão</label></div><div class="form-floating mb-1 col-lg-2"><select class="form-select bg-body-secondary" id="id_status" name="status"><option value="Ativo" selected>Ativo</option><option value="Afastado">Afastado</option><option value="Desligado">Desligado</option></select><label for="id_status">Status</label></div></div></form><div id="funcionario_extras" class="mt-2 d-none"></div>';
class Funcionario{
    constructor(options){
        this.id = this.nextId();
        this.matricula = options?.matricula || 'Matricula';
        this.nome = options?.nome || 'Nome funcionario';
        this.empresa = options?.empresa || '';
        this.cargo = options?.cargo || '';
        this.admissao = options?.admissao || '';
        this.status = options?.status || 'ATIVO';
        this.atestados = [];
    }
    nextId(){return model.index.funcionario++;}
}

function guiFuncionarios(){
    guiClear();
    model_label.innerHTML = 'Funcionario';
    guiBuildFormFuncionario();
    funcionarioExtrasStart();
    let matricula = document.getElementById('id_matricula');
    matricula.onblur = () => {
        let target = model.funcionarios.filter((e) => {return e.matricula == matricula.value})[0];
        if(target){
            formLoad(target);
            funcionarioExtrasShow();
        }
        else{
            funcionarioFormClean();
            funcionarioExtrasHide();
        }
        submit_btn.onclick = () => {
            let form = formToDict();
            if(form.matricula.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>matrícula</b> obrigatório'); return false;}
            if(form.nome.trim() == ''){dotNotify('danger', '<b>Erro:</b> Campo <b>nome</b> obrigatório'); return false;}
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

function guiAtestados(funcionario){
    main_container.innerHTML = '';
    main_table = new jsTable('atestados', {
        container: main_container,
        data: funcionario.atestados,
        caption: `<h5 class="ps-1">Atestados: <span class="text-purple">${funcionario.matricula} ${funcionario.nome}</span></h5>`,
        editableCols: ['data','dias','cid','status'],
        canAddRow: true,
        canDeleteRow: true,
        canSave:true
    });
    function calcularRetorno(tr){
        return 0;
    }
    main_table.tbody.querySelectorAll('tr').forEach((el) => { // Adiciona listener para calculo do retorno de dias para as linhas pre cadastradas
        el.firstChild.onblur = () => {calcularRetorno(el)}
        el.firstChild.nextElementSibling.onblur = () => {calcularRetorno(el)}
        // PAREI AQUIIIIIIIIIIII
    });
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
function funcionarioExtrasStart(){
    let atestados_btn = document.createElement('button');atestados_btn.id = "atestados_btn";atestados_btn.type = 'button';atestados_btn.classList = 'btn btn-sm btn-warning me-1';atestados_btn.innerHTML = 'A<b>t</b>estados';
    atestados_btn.onclick = () => {
        let matricula = document.getElementById('id_matricula');
        let target = model.funcionarios.filter((e) => {return e.matricula == matricula.value})[0];
        guiAtestados(target);
    }
    document.getElementById('funcionario_extras').appendChild(atestados_btn);
    let afastamentos_btn = document.createElement('button');afastamentos_btn.type = 'button';afastamentos_btn.classList = 'btn btn-sm btn-purple me-1';afastamentos_btn.innerHTML = 'A<b>f</b>astamentos';
    document.getElementById('funcionario_extras').appendChild(afastamentos_btn);
}
function funcionarioExtrasShow(){
    document.getElementById('funcionario_extras').classList.remove('d-none');
    SHORTCUT_MAP['tTFF'] = () => {document.getElementById('atestados_btn').click()};
}
function funcionarioExtrasHide(){
    document.getElementById('funcionario_extras').classList.add('d-none');
    SHORTCUT_MAP['tTFF'] = null;
}