# Proposta de Refatoração - Pokédex

## Padrão Escolhido: MVVM (Model-View-ViewModel)
**Justificativa:** O padrão MVVM é a escolha mais natural e eficiente para o ecossistema React Native. Como o React funciona baseando-se em reatividade e Data Binding unidirecional (através de estados), o MVVM permite extrair toda a lógica de negócio e de apresentação para Custom Hooks (ViewModels). Assim, isolamos a lógica da UI sem precisarmos lutar contra o ciclo de vida funcional do React, algo que ocorreria ao tentar forçar classes puras como no MVP.

## Nova Estrutura de Arquivos
A tela da Pokédex passará a ter sua própria subpasta para abrigar a View e o ViewModel juntos:

```text
PokedexApp/
├─ src/
│  └─ screens/
│     └─ Pokedex/
│        ├─ PokedexScreen.tsx         (View)
│        └─ usePokedexViewModel.ts    (ViewModel)