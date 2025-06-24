# Agricultural Insights Platform

Sistema completo de apresentação de slides integrado ao projeto Agricultural Insights Platform, com funcionalidades avançadas de navegação, edição e reprodução.

## 🚀 Novo Sistema de Banco de Dados Local

O projeto agora inclui um sistema de banco de dados local para armazenamento de mídia (imagens e vídeos) que:

- ✅ Salva arquivos localmente na pasta `DBmidia/`
- ✅ Persiste após fechar o VSCode
- ✅ É incluído no `git push` (versionado)
- ✅ Funciona offline após o primeiro carregamento

### 📁 Estrutura de Pastas

```
ProjetoBF/
├── DBmidia/
│   ├── DBimg/          # Imagens salvas localmente
│   ├── DBvideo/        # Vídeos salvos localmente
│   └── metadata.json   # Metadados dos arquivos
├── src/
│   └── utils/
│       └── mediaStorage.ts  # Sistema de armazenamento atualizado
└── server.js           # Servidor backend Node.js
```

## 🛠️ Como Usar

### 1. Instalação das Dependências

```bash
npm install
```

### 2. Executar o Projeto Completo

Para rodar tanto o frontend quanto o backend:

```bash
npm run dev:full
```

Ou executar separadamente:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

### 3. Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 📸 Funcionalidades do Sistema de Mídia

### Upload de Arquivos
- Arraste e solte arquivos ou clique para selecionar
- Suporte para imagens: JPEG, PNG, GIF, WebP
- Suporte para vídeos: MP4, AVI, MOV, WebM
- Limite de 500MB por arquivo

### Biblioteca de Mídia
- Visualização de todos os arquivos salvos
- Estatísticas de armazenamento
- Busca e filtros
- Remoção de arquivos

### Integração com Slides
- Adicione mídia diretamente aos slides
- Redimensione e posicione elementos
- Controles de reprodução para vídeos
- Efeitos e transparência

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa apenas o frontend
- `npm run server` - Executa apenas o backend
- `npm run dev:full` - Executa frontend + backend
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

## 📦 Versionamento com Git

O sistema está configurado para incluir a pasta `DBmidia/` no controle de versão:

```bash
git add .
git commit -m "Adicionar mídia ao projeto"
git push
```

**Importante**: A pasta `DBmidia/` NÃO está no `.gitignore`, então todos os arquivos de mídia serão versionados junto com o código.

## 🚨 Solução de Problemas

### Servidor Offline
Se aparecer "Servidor Offline", execute:
```bash
npm run server
```

### Erro de Conexão
Verifique se as portas 3001 (backend) e 5173 (frontend) estão livres.

### Arquivos Não Aparecem
1. Verifique se o servidor backend está rodando
2. Verifique se a pasta `DBmidia/` existe
3. Recarregue a página

## 🔄 Migração de Dados Antigos

O sistema detecta automaticamente dados antigos do IndexedDB/localStorage e sugere migração quando necessário.

## 📱 Compatibilidade

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile (responsivo)

## 🎯 Próximos Passos

- [ ] Compressão automática de imagens
- [ ] Sincronização em nuvem (opcional)
- [ ] Backup automático
- [ ] Otimização de performance

---

**Desenvolvido para o Agricultural Insights Platform**

