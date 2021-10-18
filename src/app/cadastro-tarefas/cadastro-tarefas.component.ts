import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Tarefa } from '../models/tarefa.model';
import { TarefasService } from '../services/tarefas.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cadastro-tarefas',
  templateUrl: './cadastro-tarefas.component.html',
  styleUrls: ['./cadastro-tarefas.component.css']
})
export class CadastroTarefasComponent implements OnInit {

  //atributo
  mensagem: string = "";

  //utilizando o método construtor do componente para
  //inicializar a classe tarefas.service (injeção de dependencia)
  constructor(
    private httpClient: HttpClient, //inicialização!
    private tarefasService: TarefasService //inicialização!
  ) { }

  ngOnInit(): void {
  }

  //declarando o conteudo do formulário
  formCadastro = new FormGroup({
    //declarando os campos do formulário
    nome: new FormControl('', [Validators.required, Validators.minLength(6)]),
    data: new FormControl('', [Validators.required]),
    hora: new FormControl('', [Validators.required]),
    descricao: new FormControl('', [Validators.required, Validators.minLength(10)]),
    prioridade: new FormControl('', [Validators.required])
  });

  //função para exibir na página as mensagens de validação de cada campo
  //permitindo acessar as propriedades de cada campo do formulario
  get form(): any {
    return this.formCadastro.controls;
  }

  //função para processar o SUBMIT do formulário
  onSubmit(): void {

    //capturar os dados do formulario e armazenar na model
    const tarefa: Tarefa = {
      idTarefa: this.tarefasService.gerarId(),
      nome: this.formCadastro.value.nome,
      data: this.formCadastro.value.data,
      hora: this.formCadastro.value.hora,
      descricao: this.formCadastro.value.descricao,
      prioridade: this.formCadastro.value.prioridade
    };

    //fazendo a chamada para a API..
    this.httpClient.post(environment.apiTarefas + "/tarefas", tarefa)
      .subscribe( //capturando o promisse (retorno da API)
        (data:any) => { //resposta de sucesso da API
          
          //imprimir na página o retorno da API
          this.mensagem = data.message;

          //limpar o formulario
          this.formCadastro.reset();
        },
        (e) => { //resposta de erro da API
          console.log(e);
        }
      )

  }

  //função para limpar a mensagem
  clear(): void {
    this.mensagem = "";
  }

}
