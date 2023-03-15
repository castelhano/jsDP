class Cargo{
    constructor(options){
        this.id = this.nextId();
        this.nome = options?.nome || 'Nova cargo';
    }
    nextId(){return model.index.cargo++;}
}