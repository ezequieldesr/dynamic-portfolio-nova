# CI e segurança

Workflows: **Portfolio CI**, **CodeQL** e **Dependency review**. Dependabot cobre npm e GitHub Actions.
Actions fixadas por SHA; checkout sem credenciais persistidas; token de leitura por padrão.
Não há deploy automático nestes workflows nem segredos de produção. CodeQL precisa de escrita em security-events.

Use npm e package-lock.json; o lock antigo do Bun foi removido para evitar instalações divergentes.
A CI executa instalação pelo package-lock, lint, typecheck, build, Chromium e testes Playwright.
A auditoria bloqueia dependências com alertas high/critical. Dependency Review examina alterações de dependências em PRs.
Ative dependency graph e verifique os requisitos de licença caso o repositório se torne privado.
Não há upload automático de traces, vídeos de teste ou formulários como artefatos públicos.

Após o primeiro push, configure Settings > Rules > Rulesets para main: exigir PR, checks
**Quality and browser tests**, **Dependency audit** e **Dependency review**, resolução de conversas;
bloquear force push e exclusão. Trabalhando sozinho, pode deixar zero aprovações obrigatórias.
CodeQL publica alertas: check concluído não significa ausência de vulnerabilidades.

## Revisão aplicada

- Removido script externo de edição e ferramenta de marcação do gerador do bundle.
- Formulário não registra dados de contato nem respostas detalhadas do provedor no console.
- Limites de comprimento e validação de campos; proteção básica contra cliques repetidos.
- Sem EmailJS configurado, o botão fica desabilitado e o contato alternativo é exibido.
- Identificadores VITE_ são públicos. Não use chaves privadas no frontend.
- Links externos usam proteção noopener; headers da Vercel restringem framing e permissões desnecessárias.
- Preferência de idioma desconhecida volta a pt-BR.

## Limites

Validações do navegador e throttle local não impedem requisições diretas ou spam distribuído.
Configure domínios autorizados, quotas e proteção antiabuso no EmailJS antes de habilitar o envio.
Os testes locais não enviam mensagens reais; valide a entrega manualmente em uma caixa sob seu controle.
Imagens de cards vêm do GitHub e dependem desse serviço. O currículo e os contatos são públicos por escolha
já presente no projeto: revise-os antes de divulgar. As verificações não equivalem a uma auditoria completa.
