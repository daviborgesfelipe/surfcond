# 🌊 SurfCond

**Previsão Inteligente para Surfistas**

O SurfCond é uma aplicação web desenvolvida para oferecer previsões oceânicas e meteorológicas detalhadas, permitindo que surfistas tomem decisões mais assertivas sobre quando e onde surfar. A ideia surgiu da vivência prática de surfistas que enfrentam, frequentemente, deslocamentos frustrantes até praias com condições ruins de surf.

## 🔍 Objetivo

Desenvolver uma plataforma acessível e responsiva que concentre, de forma visual e organizada, as informações essenciais para a prática do surf, como:
- Altura e direção da ondulação (swell)
- Direção e velocidade do vento
- Temperatura da água e do ar
- Maré e fases da lua (futuramente)
- Qualidade das condições com classificação automática

## 🧪 Tecnologias Utilizadas

- **Angular 16** (Front-end SPA)
- **TypeScript**
- **HTML5 / CSS3**
- **API StormGlass** – Fonte dos dados ambientais
- **Render** – Plataforma de deploy gratuito
- **Azure DevOps** – Organização do backlog e board do projeto
- **GitHub** – Controle de versão e deploy
- **Visual Studio Code** – IDE utilizada no desenvolvimento

## 🚀 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/daviborgesfelipe/surfcond.git
cd surfcond
npm install
ng serve
```

Acesse a aplicação local em: `http://localhost:4200`

## 🔗 Deploy

O projeto é publicado automaticamente via GitHub na plataforma [Render](https://render.com/).

## 📋 Funcionalidades da Primeira Entrega (MVP)

- Consumo de dados reais da API StormGlass
- Visualização gráfica de dados oceânicos por dia e hora
- Foco em swell, vento e maré
- Interface responsiva com gráficos utilizando `ng2-charts` e `Chart.js`

## 📈 Próximos Passos

- Implementar filtro por localidade/praia
- Adicionar fases da lua e índice de qualidade automática
- Suporte para alertas personalizados
- Possível expansão para pescadores, remadores e outros esportes náuticos

## 📚 Relatório Acadêmico

Este projeto foi desenvolvido como parte do componente curricular HOW-X da UNIVALI, utilizando metodologias ágeis e ferramentas como Canvas de Proposta de Valor, Business Model Canvas, MVP Canvas e análise paramétrica de concorrentes.
