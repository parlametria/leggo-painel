# LeggoPainel

## Sobre o projeto

Leg.go é uma plataforma de inteligência para o acompanhamento das atividades no Congresso Nacional. Coletamos dados da Câmara e do Senado para encontrar quais proposições estão quentes, o que está tramitando com mais energia, como o conteúdo dos projetos é alterado e quem são os atores importantes nesse processo. Acesse o [Leg.go](https://leggo.parlametria.org).

## Desenvolvimento

Recomendamos que você instale o [docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce) e o [docker-compose](https://docs.docker.com/compose/install/) para configuração do ambiente de desenvolvimento.

### Como configurar todo o ambiente de desenvolvimento da aplicação?

Este repositório é responsável apenas pelo código do frontend do Leg.go. Recomendamos que caso você esteja interessado em configurar o ambiente de desenvolvimento por completo, acesse nosso [orquestrador de repositórios](https://github.com/parlametria/leggo-geral/tree/master/compose): o leggo-geral. Lá você irá encontrar instruções para configurar todo o ambiente incluindo: **banco de dados, backend e frontend**.

### Já configurei o ambiente de desenvolvimento usando o leggo-geral, o que mais preciso saber?

Se você já configurou o ambiente de desenvolvimento usando o leggo-geral, deu pra perceber que é possível executar comandos docker diretamente naquele repositório e dessa forma orquestrar os serviços de forma mais automática.

Caso você queira realizar um novo build do leggo-painel é possível utilizar o comando:

```
docker-compose build
```

É possível executar um build ainda mais rígido (sem usar cache) usando a flag --no-cache:

```
docker-compose --no-cache
```

**Sempre que uma nova dependência for adicionada ao repositório é necessário realizar um novo build da imagem**

É possível abrir um terminal diretamente do container que está executando o leggo-painel, para isto faça:

```
docker exec -it frontend_painel_dev sh
```

Um terminal será aberto referente ao container em execução com o leggo-painel.

Para parar o container do leggo-painel, execute:

```
docker stop frontend_painel_dev
```

### Não consigo instalar dependências, o que posso fazer?

É importante você saber que o node_modules executando localmente na sua máquina não é refletido para o node_modules dentro do container. Por este motivo o node_modules do container em execução com o leggo-painel nem sempre terá as dependências que você acabou de instalar localmente. Faz-se necessário realizar um novo build sempre que alguma dependência do package.json mudar. Você pode realizar o build pelo leggo-geral ou pode executá-lo diretamente aqui (como falado em comandos anteriores). Caso ainda tenha problemas tente entrar no container do leggo-painel:

```
docker exec -it frontend_painel_dev sh
```

Delete a pasta node_modules:
```
rm -rf node_modules
```
O serviço irá parar acusando a falta do node_modules.

Execute novamente o build (sem usar cache):

```
docker-compose build --no-cache
```

Agora basta subir o serviço novamente via legg-geral e tudo deverá voltar ao normal.

### Não usei o leggo-geral, e agora?
Caso você tenha optado por executar o leggo-backend e o leggo-painel de forma isolada, sem a ajuda do leggo-geral. É possível levantar o serviço do leggo-painel executando:

```
docker-compose up
```

Qualquer dúvida entre em [contato](https://github.com/parlametria/leggo-painel/issues).

Este projeto foi gerado usando a [Angular CLI](https://github.com/angular/angular-cli) na versão 9.1.7.
