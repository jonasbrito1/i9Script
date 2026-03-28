# 🚀 Deploy Landing Page Jonas - i9script.com/jonas

**Data**: 28/12/2025
**URL Final**: https://i9script.com/jonas

---

## 📋 RESUMO

Deploy da landing page pessoal do Jonas em produção sem interromper os serviços existentes (i9script e Guia do Empreendedor).

---

## 📁 ARQUIVOS PREPARADOS

Todos os arquivos estão em: `upload_vps/jonas/`

**Arquivos principais**:
- ✅ index.html (53KB) - Landing page principal
- ✅ styles.css (58KB) - Estilos
- ✅ script.js (44KB) - JavaScript
- ✅ favicon.svg - Ícone
- ✅ jonas-pro.jpg, jonas-pro1.jpg, jonas-pro2.jpg - Fotos
- ✅ logo-jonas-*.svg - Logos
- ✅ privacy-policy.html, terms-of-service.html - Políticas
- ✅ privacy-policy-en.html, terms-of-service-en.html - Versões em inglês

---

## 🔧 PASSO A PASSO (SEM INTERRUPÇÃO)

### PASSO 1: Fazer Upload via SFTP

**Conectar no Termius**:
- Host: 72.61.223.226
- Porta: 22
- Usuário: root
- Senha: 4xmnqiB@t234

**Upload dos arquivos**:
- **Local**: `C:\Users\Home\Desktop\Projects\i9script\upload_vps\jonas\*`
- **Remoto**: `/var/www/i9script/jonas/`

**Via SSH, criar pasta se não existir**:
```bash
mkdir -p /var/www/i9script/jonas
```

---

### PASSO 2: Atualizar Configuração Nginx (SEM INTERRUPÇÃO)

**Via SSH**:

```bash
# 1. Fazer BACKUP da configuração atual
cp /var/www/i9script/config/nginx-i9script.conf /var/www/i9script/config/nginx-i9script.conf.backup-$(date +%Y%m%d-%H%M%S)

# 2. Verificar se o arquivo de upload foi enviado
ls -la /var/www/i9script/upload_vps/config/nginx-i9script-com-jonas.conf

# 3. Copiar nova configuração
cp /var/www/i9script/upload_vps/config/nginx-i9script-com-jonas.conf /var/www/i9script/config/nginx-i9script.conf

# 4. TESTAR configuração (CRÍTICO - não pula este passo!)
nginx -t

# Se aparecer "syntax is ok" e "test is successful", continuar:

# 5. Recarregar Nginx (SEM DERRUBAR CONEXÕES)
systemctl reload nginx

# 6. Verificar se recarregou com sucesso
systemctl status nginx
```

**⚠️ IMPORTANTE**: O comando `reload` NÃO derruba conexões existentes. Os serviços i9script e Guia continuam funcionando normalmente.

---

### PASSO 3: Verificar Arquivos no Servidor

```bash
# Ver arquivos enviados
ls -la /var/www/i9script/jonas/

# Deve mostrar:
# index.html
# styles.css
# script.js
# favicon.svg
# jonas-pro.jpg
# etc...

# Verificar permissões (devem ser 644 ou 755)
chmod 644 /var/www/i9script/jonas/*.html
chmod 644 /var/www/i9script/jonas/*.css
chmod 644 /var/www/i9script/jonas/*.js
chmod 644 /var/www/i9script/jonas/*.jpg
chmod 644 /var/www/i9script/jonas/*.svg
```

---

### PASSO 4: Testar Funcionamento

```bash
# Teste 1: Verificar se a página carrega (deve retornar 200 ou 301)
curl -I https://i9script.com/jonas

# Teste 2: Ver conteúdo HTML (primeiras linhas)
curl -s https://i9script.com/jonas/ | head -20

# Teste 3: Verificar CSS
curl -I https://i9script.com/jonas/styles.css

# Teste 4: Verificar JS
curl -I https://i9script.com/jonas/script.js

# Teste 5: Verificar imagem
curl -I https://i9script.com/jonas/jonas-pro.jpg
```

**Todos devem retornar HTTP/2 200 ✅**

---

### PASSO 5: Testar Serviços Existentes (Garantir Nenhuma Interrupção)

```bash
# Testar i9script (raiz)
curl -I https://i9script.com
# Deve retornar 200 ✅

# Testar Guia do Empreendedor
curl -I https://i9script.com/guiadoempreendedor/
# Deve retornar 200 ✅

# Testar APIs
curl http://localhost:5000/api/auth/check
curl http://localhost:5001/api/health
```

**Todos devem estar funcionando normalmente!**

---

### PASSO 6: Teste Final no Navegador

1. **Abrir**: https://i9script.com/jonas/
2. **Pressionar**: Ctrl+Shift+R (reload forçado)
3. **Verificar**:
   - Landing page carrega completamente
   - Estilos aplicados
   - Imagens aparecem
   - JavaScript funciona
   - Links de navegação funcionam

4. **Testar URLs adicionais**:
   - https://i9script.com/jonas/privacy-policy.html
   - https://i9script.com/jonas/terms-of-service.html

---

## 🗺️ ESTRUTURA FINAL NO SERVIDOR

```
/var/www/i9script/
├── frontend/                    # i9script (raiz)
├── backend/                     # i9script API (porta 5000)
├── config/
│   └── nginx-i9script.conf      # Config Nginx atualizada
├── jonas/                       # ⭐ NOVO - Landing page Jonas
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── favicon.svg
│   ├── jonas-pro.jpg
│   ├── jonas-pro1.jpg
│   ├── jonas-pro2.jpg
│   ├── logo-jonas-*.svg
│   ├── privacy-policy.html
│   ├── privacy-policy-en.html
│   ├── terms-of-service.html
│   └── terms-of-service-en.html
└── guia_do_empreendedor/
    ├── frontend/                # Guia frontend
    └── backend/                 # Guia API (porta 5001)
```

---

## 🌐 URLS FINAIS

| Serviço | URL | Status |
|---------|-----|--------|
| i9script | https://i9script.com | ✅ Mantido |
| i9script API | https://i9script.com/api | ✅ Mantido |
| Guia Empreendedor | https://i9script.com/guiadoempreendedor/ | ✅ Mantido |
| Guia API | https://i9script.com/guiadoempreendedor/api | ✅ Mantido |
| **Jonas Landing** | **https://i9script.com/jonas/** | **🆕 NOVO** |
| Jonas Privacy | https://i9script.com/jonas/privacy-policy.html | 🆕 NOVO |
| Jonas Terms | https://i9script.com/jonas/terms-of-service.html | 🆕 NOVO |

---

## 🔒 SEGURANÇA E CACHE

**Nginx configurado com**:
- ✅ HTTPS obrigatório (SSL via Let's Encrypt)
- ✅ Cache de 1 ano para assets estáticos (CSS, JS, imagens)
- ✅ Headers de segurança
- ✅ Compressão gzip automática

---

## 🔄 SE ALGO DER ERRADO (Rollback)

```bash
# Restaurar configuração anterior
cp /var/www/i9script/config/nginx-i9script.conf.backup-YYYYMMDD-HHMMSS /var/www/i9script/config/nginx-i9script.conf

# Testar
nginx -t

# Recarregar
systemctl reload nginx
```

**Lista de backups**:
```bash
ls -lt /var/www/i9script/config/*.backup*
```

---

## ✅ CHECKLIST FINAL

- [ ] Upload de todos os arquivos via SFTP
- [ ] Backup da configuração Nginx atual
- [ ] Atualização da configuração Nginx
- [ ] Teste `nginx -t` (syntax check)
- [ ] Reload do Nginx
- [ ] Teste https://i9script.com/jonas/ no navegador
- [ ] Teste i9script.com (confirmar que não foi afetado)
- [ ] Teste guiadoempreendedor (confirmar que não foi afetado)
- [ ] Verificar console do navegador (sem erros)
- [ ] Testar responsividade mobile

---

## 📝 OBSERVAÇÕES

- ✅ **Zero downtime**: Nenhum serviço será interrompido
- ✅ **Rollback rápido**: Backup automático da config anterior
- ✅ **Isolamento**: Landing page Jonas não interfere nos outros serviços
- ✅ **Performance**: Cache otimizado para assets estáticos
- ✅ **SEO**: DOCTYPE correto, meta tags presentes

---

**Deploy pronto para execução!** 🚀
