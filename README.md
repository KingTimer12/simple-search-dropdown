
# Search Dropdown

Componente com sistema de pesquisa e dropdown imbutidos em um só. É possível listar todos os itens duma lista e filtrar por aquilo que você está buscando, sendo compativel até mesmo com requisições de APIs.
## Instalação

Instalando `simple-search-dropdown`:

```bash
  npm install simple-search-dropdown
  # OU
  yarn add simple-search-dropdown
  # OU
  pnpm add simple-search-dropdown
```
    
## Uso/Exemplos

### Dados como Array
```javascript
import { SearchSelect } from 'simple-search-dropdown'

function App() {
  const data = [
    {value: 1, label: "Abacaxi"},
    {value: 2, label: "Banana"},
    {value: 3, label: "Avião"},
    {value: 4, label: "Bola"},
    {value: 5, label: "Lula"},
    {value: 6, label: "Faca"},
    {value: 7, label: "Magnus"},
    {value: 8, label: "Xadrez"},
  ]

  return (
    <main className="flex flex-col justify-center items-center ">
      <div className="flex flex-col mt-2">
        <SearchSelect data={data} placeholder="Pesquisar"} />
      </div>
    </main>
  )
}

export default App
```

### Dados como função Async
```javascript
import { SearchSelect } from 'simple-search-dropdown'

function App() {
  const promiseOptions = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          {value: 1, label: "Abacaxi"},
          {value: 2, label: "Banana"},
          {value: 3, label: "Avião"},
          {value: 4, label: "Bola"},
          {value: 5, label: "Lula"},
          {value: 6, label: "Faca"},
          {value: 7, label: "Magnus"},
          {value: 8, label: "Xadrez"},
        ]
        resolve(data);
      }, 1000);
    });

  return (
    <main className="flex flex-col justify-center items-center ">
      <div className="flex flex-col mt-2">
        <SearchSelect data={promiseOptions} placeholder="Pesquisar"} />
      </div>
    </main>
  )
}

export default App
```

### Usando react-hook-form
```javascript
import { useForm } from "react-hook-form";
import { SearchSelect } from 'simple-search-dropdown'

function App() {
  const { handleSubmit, register } = useForm()
  const promiseOptions = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          {value: 1, label: "Abacaxi"},
          {value: 2, label: "Banana"},
          {value: 3, label: "Avião"},
          {value: 4, label: "Bola"},
          {value: 5, label: "Lula"},
          {value: 6, label: "Faca"},
          {value: 7, label: "Magnus"},
          {value: 8, label: "Xadrez"},
        ]
        resolve(data);
      }, 1000);
    });

  return (
    <main className="flex flex-col justify-center items-center ">
      <form className="flex flex-col mt-2" onSubmit={handleSubmit((data) => console.log(data))}>
        <SearchSelect
          data={promiseOptions}
          placeholder="Pesquisar" {...register("abc")}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white mt-2">Submit</button>
      </form>
    </main>
  )
}

export default App
```


## Funcionalidades

- Lista de dados ou uma função assíncrona.


## Para Desenvolvedores

Contribuições são sempre bem-vindas!

### Conhecimento
É necessário o entendimento de TypeScript para contribuições envolvendo os componentes. Além do TypeScript, entender como funciona o react e ref são essenciais.

### Pré requisito
- Git
- Node.js
- IDE (VSCode/Zed)

### Contribuindo
1. Crie um fork do projeto clicando no botão localizado a direita do nome do repositório.
2. Clone o repositório que está na sua conta do github. (Siga os passos do próximo tópico)
3. Faça suas alterações.
4. Commit e abra um Pull Request.
5. Espere a aprovação de algum desenvolvedor.
## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/KingTimer12/simple-search-dropdown.git
```

Entre no diretório do projeto

```bash
  cd simple-search-dropdown
```

Instale as dependências

```bash
  pnpm install
```


## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test
  # OU
  yarn test
  # OU
  pnpm test
```
## Autores

- [@Aaron King](https://github.com/KingTimer12)
- [@Mateus Bessa](https://github.com/Mateusinbessa)
- [@Henrique Mota](https://github.com/henriquemota)
