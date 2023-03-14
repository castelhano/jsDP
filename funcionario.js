class Funcionario{
    constructor(options){
        this.id = this.nextId();
        this.nome = options?.nome || 'Nome funcionario';
        this.funcao = options?.funcao || 'Motorista';
        console.log(this);
    }
    nextId(){return model.index.funcionario++;}
}