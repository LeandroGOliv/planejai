# Planej.ai

Educador financeiro com IA — desafio da DIO.

## O que o projeto faz

O Planej.ai transforma alguns números do seu orçamento em um plano financeiro comentado por IA.

Você responde um formulário de 6 passos (renda mensal, custos fixos, dívidas, nome da meta, custo da meta e prazo desejado) e o app calcula quanto sobra por mês e quanto seria necessário guardar para atingir o objetivo no prazo. Esses dados vão para o Gemini, que devolve um diagnóstico personalizado: se a meta é viável, onde o orçamento está comprometido, sugestões práticas de corte, ideias de renda extra e opções de investimento.

Cada simulação fica salva e pode ser consultada depois. O `localStorage` é usado como se fosse uma API — todo acesso passa pelo hook `useSimulationStorage`, que concentra leitura, gravação e remoção. A troca por um back-end real depois é uma questão de reimplementar esse hook.

Tema claro e escuro, e layout responsivo do mobile ao desktop.

## Como executar a aplicação

Pré-requisitos: **Node 22+** (desenvolvido no 24.15.0) e **pnpm** (10.x).

```bash
pnpm install
```

A aplicação depende de uma chave da API do Gemini. Crie um arquivo `.env.local` na raiz:

```
VITE_GEMINI_API_KEY=sua_chave_aqui
```

A chave é gratuita e sai do [Google AI Studio](https://aistudio.google.com/apikey). Sem ela o formulário funciona, mas a tela de resultado não consegue gerar o insight.

```bash
pnpm dev       # servidor de desenvolvimento
pnpm build     # typecheck + build de produção
pnpm preview   # serve o build gerado
pnpm lint      # ESLint + Prettier
```

> **Atenção com a chave:** o prefixo `VITE_` faz o Vite embutir a variável no bundle do navegador, ou seja, a chave fica visível para qualquer pessoa que abrir o app publicado. Para um projeto de estudo isso é aceitável, mas em produção a chamada ao Gemini precisaria passar por um back-end que guardasse a chave no servidor.

## Quais tecnologias foram usadas

| Tecnologia                             | Papel no projeto                                                           |
| -------------------------------------- | -------------------------------------------------------------------------- |
| **React 19** + **TypeScript 6**        | base da aplicação                                                          |
| **Vite 8**                             | dev server e build                                                         |
| **Tailwind CSS 4**                     | estilos, com os tokens de tema em CSS variables                            |
| **React Router 7**                     | rotas `/`, `/resultado/:id` e `/historico`                                 |
| **Gemini API** (`gemini-flash-latest`) | geração do insight e das respostas do chat                                 |
| **lucide-react**                       | ícones                                                                     |
| **react-loading-skeleton**             | feedback de carregamento                                                   |
| **@fontsource/inter**                  | fonte Inter auto-hospedada                                                 |
| **ESLint** + **Prettier**              | padronização, com ordenação automática de imports e de classes do Tailwind |

## Melhorias implementadas

### Histórico de simulações

A rota `/historico` lista tudo o que já foi simulado, em cards com o nome da meta, a data, o custo, o prazo e a economia mensal. Dá para excluir uma simulação — com modal de confirmação, porque o dado não tem como voltar — e o botão **Ver detalhes** leva de volta à tela de resultado com o insight que já havia sido gerado, sem gastar uma nova chamada à IA.

Layout responsivo: linha horizontal no desktop, card empilhado no mobile. Quando não há nada salvo, um empty state convida a fazer a primeira simulação.

### Chat com o mentor no card de insight

O card de insight ganhou um campo de pergunta. O usuário pode perguntar quantas vezes quiser sobre a própria simulação, e cada pergunta e resposta fica salva junto do registro no `localStorage` — reabrir a tela recupera a conversa inteira.

Detalhes do comportamento:

- O contexto (dados da simulação + insight já gerado + regras de resposta) vai no campo `systemInstruction` da requisição, separado do `contents`, que carrega apenas os turnos reais da conversa.
- O card respeita uma altura máxima com scroll interno, e o scroll vai automaticamente para o fim quando a resposta chega.
- Enquanto a IA responde, a pergunta já aparece na tela com um skeleton no lugar da resposta.
- Se a requisição falhar, a pergunta continua visível e um botão reenvia a mesma pergunta, sem redigitar.
- O par pergunta/resposta só é gravado depois que a resposta chega, para que um recarregamento no meio do caminho nunca deixe uma pergunta órfã salva.

## Como testar o fluxo principal

1. `pnpm dev` e abra o endereço que o Vite imprimir.
2. Preencha os 6 passos do formulário. Para ver um cenário viável, algo como renda `5.000,00`, custos `2.000,00`, dívidas `500,00`, meta `Viagem para o Japão`, custo `15.000,00` e prazo `12` meses.
3. Clique em **Gerar simulação**. A tela de resultado mostra os cards de valores e o insight da IA — o skeleton aparece enquanto o Gemini responde.
4. No card de insight, escreva uma pergunta no campo de baixo e envie. Confira que a pergunta aparece na hora, que o skeleton dá lugar à resposta e que o scroll desce sozinho.
5. Faça uma segunda pergunta e verifique que a IA mantém o contexto da conversa, sem repetir o diagnóstico.
6. Recarregue a página (F5). O insight e a conversa devem voltar exatamente como estavam, sem nova chamada à IA.
7. Vá em **Histórico** no topo. A simulação aparece na lista; **Ver detalhes** volta para o resultado com tudo preservado.
8. Clique na lixeira e confirme a exclusão — o card sai da lista.
9. Troque o tema no ícone do topo e repita o passeio pelas telas.
10. Reduza a janela para largura de celular e confira o histórico empilhado e o card de insight.

Para testar o estado vazio, limpe a chave `simulation-data` no `localStorage` pelo DevTools e recarregue `/historico`.

## O que aprendi durante o desafio

**Conversa com LLM não é só concatenar texto.** Minha primeira versão do chat jogava o contexto como primeiro turno `user` e precisava de uma resposta falsa do modelo (`"Entendi o contexto..."`) só para não deixar dois turnos `user` seguidos. Funcionava, mas era gambiarra: instruções e pergunta do usuário disputavam o mesmo canal. Descobrir o `systemInstruction` resolveu de verdade — e de quebra separou as regras do texto digitado por quem usa o app, o que evita que alguém sobrescreva o comportamento pelo campo de pergunta.

**Hook que devolve função nova a cada render é uma armadilha.** O `useSimulationStorage` recria suas funções em cada renderização, então colocá-las no array de dependências de um `useEffect` gera loop infinito de leitura. A saída foi inicializador lazy no `useState`, o mesmo padrão que o `useInsight` já usava e entender o _porquê_ daquele padrão existir.
