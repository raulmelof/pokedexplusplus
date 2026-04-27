# Análise Crítica da Arquitetura Atual - Pokédex

## 1. Estrutura de Diretórios
A organização atual dos arquivos (separada em `screens`, `components`, `services`, `types`, `utils`) é clara e atende bem às necessidades de um projeto em estágio inicial, pois separa as responsabilidades técnicas. 
**Mudança proposta:** Conforme o projeto cresce (ex: adicionando itens, treinadores, gerações), eu migraria de uma "Arquitetura Orientada a Camadas" para uma "Arquitetura Orientada a Features". Em vez de separar tudo por tipo de arquivo, agruparia por domínio (ex: `src/features/pokemon`, `src/features/items`), mantendo componentes, serviços e telas do mesmo domínio próximos uns dos outros, aumentando a coesão.

## 2. Componentização
O `PokemonCard` é um excelente exemplo de componente reutilizável (Dumb Component), pois ele não possui lógica de negócio ou chamadas de API; ele apenas recebe os dados do Pokémon via `props` e os renderiza, limitando-se à lógica de navegação visual.
**Refatoração da `PokemonDetailsScreen`:** A tela de detalhes está acumulando muitas marcações visuais. Para mantê-la mais limpa, eu extrairia:
* `TypeBadge`: Um componente reutilizável para renderizar as "pílulas" com as cores dos tipos do Pokémon.
* `PokemonStatsView`: Um componente para encapsular a exibição de imagem, nome e ID, recebendo apenas o objeto Pokémon como propriedade.

## 3. Gerenciamento de Estado e Lógica
* **Na `PokedexScreen`:** A lógica de busca (filtro) e o armazenamento da lista (estado) estão localizados diretamente dentro do componente funcional da tela, misturados com a renderização (`FlatList`).
* **Na `PokemonDetailsScreen`:** A lógica de requisição HTTP (`fetchDetails`) para buscar os detalhes por ID e o controle de estado (`isLoading`, `error`) residem no próprio componente da tela via `useEffect` e `useState`.
* **Sustentabilidade:** Essa abordagem (Massive View-Controller) não é sustentável a longo prazo. 
    * **Prós:** Facilidade e rapidez na prototipação inicial; curva de aprendizado menor para iniciantes.
    * **Contras:** A lógica de negócio fica fortemente acoplada à renderização visual (UI). Isso impossibilita testes unitários isolados da lógica (ex: testar o filtro sem renderizar a tela) e dificulta o reaproveitamento dessa lógica em outras partes do app.

## 4. Pontos Fortes e Fracos
**Pontos Fortes:**
1. **Isolamento da Camada de Rede (`services/api.ts`):** O uso de um arquivo dedicado para as chamadas Axios blinda os componentes da biblioteca HTTP. Se precisarmos trocar o Axios pelo Fetch, a mudança ocorrerá em apenas um lugar.
2. **Uso Rigoroso de Tipagem (`types/`):** A definição de interfaces como `Pokemon` e `RootStackParamList` garante segurança de tráfego de dados entre as rotas, prevenindo erros em tempo de execução através do analisador estático do TypeScript.

**Pontos Fracos:**
1. **Acoplamento de Responsabilidades (Massive View-Controller):** As telas tomam a decisão de *quando* e *como* buscar os dados, ferindo o princípio de responsabilidade única. A View deveria apenas renderizar o que lhe é entregue.
2. **Ausência de Gerenciamento de Estado Global/Cache:** Navegar para os detalhes de um Pokémon e voltar para a Pokédex faz com que o aplicativo não retenha adequadamente o contexto sem forçar re-renderizações ou novas buscas, o que não é ideal para performance e uso de rede.