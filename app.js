class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        //para recuperar todos os atributos do objeto;
        /*for in recupera as chaves de um determinado array ou os atributos de um determinado objeto e esse atributo é colocado dentro de uma variável, nesse caso como vamos percorrer os atributos do obj Despesa em  questão, vamos fazer
        um for no próprio objeto, então o this faz refência para a própria despesa;*/
        //podemos acessar a partir de um objeto, atributos utilizando uma notação semelhante as notações de array, this[i];
        for(let i in this) {
            if(this[i] == undefined || this[i] == "" || this[i] == null) {
                return false;
            }
        }

        return true;
    }
}
    

//índices dinâmicos para inclusão de registros dentro de Local Storage;
//a classe Bd vai nos permitir instanciar um objeto para lidar com o banco de dados, com o Local Storage da aplicação;
class Bd {
    //construção do índice dinâmico: para fazer isso é necessário armazenar a informação de índice, é fundamental que o obj Bd tenha condições de identificar qual será o prox índice que poderá utilizar para inserção do registro e não sobrepor anterior;

    /*através do método costructor é possível veririficar se a informação let proximoId = localStorage.getItem("id") existe, caso não exista o "id" em Local Storage, podemos fazer um teste, se o id for null podemos setar o id inicial como sendo 0,
    então através do Local Storage, vamos executar o método setItem() passando a chave que queremos inserir("id") e o valor dessa respectiva chave(0);*/
    constructor(){
        let id = localStorage.getItem("id");

        if(id === null) {
            localStorage.setItem("id", 0);
        }
    }

    //esse método irá verificar primeiro se já existe um id inserido em Local Storage, então precisamos persisitir esse id para que ele seja a origem da lógica emregistros posteriores;
    getProximoId() {
        let proximoId = localStorage.getItem("id");
        
        return parseInt(proximoId) + 1;
    }

    gravar(dadosDespesa) {
        let valorDaKey = this.getProximoId();
        localStorage.setItem(valorDaKey, JSON.stringify(dadosDespesa));
        /*após a lógica da gravação, depois de recuperado o próximo id, se o processo de gravação for realizado com sucesso, a partir do obj localStorage executar o método setItem, atualizando o valor contido dentro da chave "id, com a informação
        do novo id, produzido pelo método getProximoId(), então sempre que o gravar for executado, vamos pegar o próximo id e na sequencia vamos atualizar o documento "id" de chave id, com o id recuperado, de tal modo que numa próxima gravação
        ao executar o método getProximoId() o retorno será o id atualizado + 1;*/
        localStorage.setItem("id", valorDaKey);
    }

    recuperarTodosRegistros() {
        //array de despesas
        let despesas = Array();

        let id = localStorage.getItem("id");

        //recuperar todas as despesas cadastradas em Local Storage;
        for(let i = 1; i <= id; i++){
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i));

            //existe a possibilidade de haver índices que foram pulados/removidos;
            //nesses casos nós vamos pular esses índices;
            if(despesa === null) {
                continue;
            }

            despesa.id = i;
            despesas.push(despesa);
        }     
        
        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();

        if(despesa.ano != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }

        if(despesa.mes != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }

        if(despesa.dia != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }

        if(despesa.tipo != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }

        if(despesa.descricao != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        if(despesa.valor != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }   
        
        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
    }
}

let bd = new Bd();

function cadastrarDespesa() {
    let ano = document.getElementById("ano");
    let mes = document.getElementById("mes");
    let dia = document.getElementById("dia");
    let tipo = document.getElementById("tipo");
    let descricao = document.getElementById("descricao");
    let valor = document.getElementById("valor");

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);
    
    if(despesa.validarDados()) {
        bd.gravar(despesa);
        
        document.getElementById("modal_titulo").innerHTML = "Registro inserido com sucesso";
        document.getElementById("modal_titulo_div").className = "modal-header text-success";
        document.getElementById("modal_conteudo").innerHTML = "Despesa foi cadastrada com sucesso!";
        document.getElementById("modal_botao").innerHTML = "Voltar";
        document.getElementById("modal_botao").className = "btn btn-success";

        //dialog sucesso;
        $("#modalRegistraDespesa").modal("show");

        
        //para limpar o campo após cadastro com sucesso;
        ano.value = "";
        mes.value = "";
        dia.value = "";
        tipo.value = "";
        descricao.value = "";
        valor.value = "";

    } else {
        document.getElementById("modal_titulo").innerHTML = "Erro na inclusão do registro";
        document.getElementById("modal_titulo_div").className = "modal-header text-danger";
        document.getElementById("modal_conteudo").innerHTML = "Existem campos obrigatórios que não foram preenchidos!";
        document.getElementById("modal_botao").innerHTML = "Voltar e corrigir";
        document.getElementById("modal_botao").className = "btn btn-danger";

        //dialog erro;
        $("#modalRegistraDespesa").modal("show");
    }  

}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros();
    }
    
    //selecionando o elemento tbody da tabela;
    let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = "";

    //percorrer o array despesas, listando cada despesa de forma dinâmica;
    despesas.forEach(function(d) {
        //criando a linha (tr);
        let linha = listaDespesas.insertRow();

        //criando as colunas (td);
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        //ajustar o tipo;
        switch(d.tipo) {
            case "1": d.tipo = "Alimentação";
                break;
            case "2": d.tipo = "Educação";
                break;
            case "3": d.tipo = "Lazer";
                break;
            case "4": d.tipo = "Saúde";
                break;
            case "5": d.tipo = "Transporte";
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        //criar botão de exclusão;
        let btn = document.createElement("button");
        btn.className = "btn btn-danger";
        btn.innerHTML = "<i class='fas fa-times'></i>";
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function() {
            //remover despesa;
            let id = this.id.replace("id_despesa_", "");
            bd.remover(id);
            window.location.reload();
        }
        linha.insertCell(4).append(btn);
    });
 }

 function pesquisarDespesa() {
    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value;
    let valor = document.getElementById("valor").value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    carregaListaDespesas(despesas, true);
 }




