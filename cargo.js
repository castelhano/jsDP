class Cargo{
    constructor(options){
        this.id = this.nextId();
        this.nome = options?.nome || 'Nova empresa';
    }
    nextId(){return model.index.cargo++;}
}