<h3 align="center">Simple Search Dropdown</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/KingTimer12/diamond.svg)](https://github.com/KingTimer12/simple-search-dropdown/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/KingTimer12/diamond.svg)](https://github.com/KingTimer12/simple-search-dropdown/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Componente com sistema de pesquisa e dropdown imbutidos em um só. É possível listar todos os itens duma lista e filtrar por aquilo que você está buscando, sendo compativel até mesmo com requisições de APIs.
    <br> 
</p>

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

> [!IMPORTANT]  
> Caso queira usar somente o componente `SearchSelect`, é necessário importar o CSS como mostrado abaixo:

```css
@import url('../node_modules/simple-search-dropdown/dist/style.css');
```

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
import { useForm } from 'react-hook-form'
import { SearchSelect } from 'simple-search-dropdown'

function App() {
  const { handleSubmit, register } = useForm()
  const promiseOptions = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          { value: 1, label: 'Abacaxi' },
          { value: 2, label: 'Banana' },
          { value: 3, label: 'Avião' },
          { value: 4, label: 'Bola' },
          { value: 5, label: 'Lula' },
          { value: 6, label: 'Faca' },
          { value: 7, label: 'Magnus' },
          { value: 8, label: 'Xadrez' },
        ]
        resolve(data)
      }, 1000)
    })

  return (
    <main className="flex flex-col justify-center items-center ">
      <form className="flex flex-col mt-2" onSubmit={handleSubmit((data) => console.log(data))}>
        <SearchSelect data={promiseOptions} placeholder="Pesquisar" {...register('abc')} />
        <button type="submit" className="p-2 bg-blue-500 text-white mt-2">
          Submit
        </button>
      </form>
    </main>
  )
}

export default App
```

### Criando seu próprio

É possível fazer seu próprio componente usando o `Select` e `useDataSearch` do pacote.

> [!NOTE]  
> O uso do CSS presente na dependência se torna totalmente **OPCIONAL** aqui.

```javascript
import { Select, useDataSearch } from 'simple-search-dropdown'

function YourSelectComponent({ data, name }) {
  const itemFiltered = useDataSearch(data, name)

  return (
    <Select name={name}>
      <Select.Trigger>
        <Select.Search />
      </Select.Trigger>
      <Select.Panel>
        {itemFiltered.length > 0 &&
          itemFiltered.map((item, idx) => <Select.Item key={idx} value={item.value} label={item.label} />)}
      </Select.Panel>
    </Select>
  )
}

export default YourSelectComponent
```

> [!WARNING]  
> Os dados vindo do parâmetro `data` precisa ser uma lista com o seguinte formato:
> `{ label: "", value: 0 || "" }`. E o parâmetro `name` servirá para vincular o campo com os dados filtrados.

## Funcionalidades

- Faz a menor quantidade de requisições possível.
- Aceita lista de dados ou uma função assíncrona.
- Componente primitivo para customização pessoal.
- Compatível com react-hook-form.
- Sistema de pesquisa e dropdown em um só.

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

## Tecnologias

- [Tailwind](https://tailwindcss.com/) - CSS Framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State-management Library
- [react-remove-scroll-bar](https://www.npmjs.com/package/react-remove-scroll-bar) - Dependency to Remove Scroll Bar
- [React](https://react.dev/) - Web Library

## Licença

[MIT](https://github.com/KingTimer12/simple-search-dropdown/blob/dev/LICENSE)

## Autores

- [@Aaron King](https://github.com/KingTimer12)
- [@Mateus Bessa](https://github.com/Mateusinbessa)
- [@Henrique Mota](https://github.com/henriquemota)
