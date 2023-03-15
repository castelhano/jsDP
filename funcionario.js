class Funcionario{
    constructor(options){
        this.id = this.nextId();
        this.nome = options?.nome || 'Nome funcionario';
        this.cargo = options?.funcao || 'Motorista';
    }
    nextId(){return model.index.funcionario++;}
}