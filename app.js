var model = localStorage.model ? JSON.parse(localStorage.model) : {index:{empresa:0, funcionario:0, cargo:0}, empresas:[], cargos:[], ativos:{}, afastados:{}, desligados:{}};
function modelRead(data=localStorage.model){}
function modelSave(){localStorage.model = JSON.stringify(model)}
function modelDownload(){
    dotNotify('warning', 'Baixando JSON....');
}
function modelClearLocal(){localStorage.removeItem('model')}