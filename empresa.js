class Empresa{
    constructor(options){
        this.id = this.nextId();
        this.nome = options?.nome || 'Nova empresa';
        this.razaoSocial = options?.razaoSocial || '';
        this.cnpj = options?.cnpj || '';
    }
    nextId(){return model.index.empresa++;}
}