class Funcionario{
    constructor(options){
        this.id = this.nextId();
        this.matricula = options?.matricula || 'Matricula';
        this.nome = options?.nome || 'Nome funcionario';
        this.empresa = options?.empresa || '';
        this.cargo = options?.cargo || '';
        this.admissao = options?.admissao || '';
        this.status = options?.status || 'ATIVO';
    }
    nextId(){return model.index.funcionario++;}
}