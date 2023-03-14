class Empresa{
    constructor(options){
        this.id = this.nextId();
        this.nome = options?.nome || 'Nova empresa';
        this.razaoSocial = options?.razaoSocial || '';
        console.log(this);
    }
    nextId(){
        return 1;
    }
}