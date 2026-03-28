# ✅ DEPLOY COMPLETO - SUCESSO

**Data**: 22/12/2025
**Servidor**: 72.61.223.226
**Domínio**: i9script.com

---

## 🎉 SISTEMAS FUNCIONANDO

### 1. i9Script - Sistema de Gestão

**URLs**:
- 🌐 Frontend: https://i9script.com
- 🔌 API: https://i9script.com/api
- 📊 Status: ✅ ONLINE

**Tecnologias**:
- Frontend: React (Create React App)
- Backend: Node.js 18 + Express
- Banco: MariaDB (MySQL 8.0)
- Container: Docker (porta 5000)

**Credenciais**:
- Email: admin@i9script.com
- Senha: Admin@123

---

### 2. Guia do Empreendedor

**URLs**:
- 🌐 Frontend: https://i9script.com/guiadoempreendedor/
- 🔌 API: https://i9script.com/guiadoempreendedor/api
- 📊 Status: ✅ ONLINE

**Tecnologias**:
- Frontend: React + Vite
- Backend: Node.js 20 + Hono
- Banco: Supabase (PostgreSQL)
- Container: Docker (porta 5001)

**Base Path**: `/guiadoempreendedor/`

---

## 🏗️ ARQUITETURA DO SERVIDOR

```
/var/www/i9script/
├── frontend/                    # i9script React build
├── backend/                     # i9script Node.js API
│   ├── src/
│   ├── .env.production
│   └── package.json
├── config/
│   └── nginx-i9script.conf      # Config Nginx principal
├── docker-compose.backend-only.yml
│
└── guia_do_empreendedor/
    ├── frontend/                # Guia Vite build
    │   ├── index.html
    │   └── assets/
    ├── backend/                 # Guia Hono API
    │   ├── server/
    │   ├── api/
    │   └── .env
    └── docker-compose.yml
```

---

## 🔧 NGINX CONFIGURAÇÃO

**Arquivo**: `/var/www/i9script/config/nginx-i9script.conf`
**Symlink**: `/etc/nginx/sites-enabled/i9script.com`

**Locations (ordem de prioridade)**:

1. `^~ /guiadoempreendedor` → Guia frontend (alias)
2. `/guiadoempreendedor/api` → Guia backend (proxy porta 5001)
3. `/api` → i9script backend (proxy porta 5000)
4. `/` → i9script frontend (root)

**SSL**: Let's Encrypt
**Certificado**: `/etc/letsencrypt/live/i9script.com/`

---

## 🐳 CONTAINERS DOCKER

### i9script Backend
```bash
Container: i9script-backend-prod
Image: node:18-alpine
Porta: 5000 (host network)
Status: UP (2 hours)

# Comandos:
docker logs i9script-backend-prod
cd /var/www/i9script
docker-compose -f docker-compose.backend-only.yml restart
```

### Guia do Empreendedor Backend
```bash
Container: guia-empreendedor-backend
Image: node:20-alpine
Porta: 5001 (host network)
Status: UP (2 hours)

# Comandos:
docker logs -f guia-empreendedor-backend
cd /var/www/i9script/guia_do_empreendedor
docker-compose restart
```

---

## 🗄️ BANCOS DE DADOS

### i9script - MariaDB Local
- Host: 127.0.0.1:3306
- Database: i9script_db
- User: i9script
- Status: ✅ Conectado

### Guia - Supabase Cloud
- URL: https://znmguqnsteslftyrewun.supabase.co
- Type: PostgreSQL
- Status: ✅ Conectado

**Bancos isolados** - nenhuma interferência entre sistemas.

---

## ✅ TESTES DE VALIDAÇÃO

### Frontend i9script
```bash
curl -s https://i9script.com | grep "<title>"
# Retorna: і9Script - Sistema de Gestão ✅
```

### Frontend Guia
```bash
curl -s https://i9script.com/guiadoempreendedor/ | grep -A 2 "<title>"
# Retorna: Guia Portal Empreendedor ✅
```

### API i9script
```bash
# Backend está processando requisições:
GET /api/auth/login 200 ✅
GET /api/projects 200 ✅
GET /api/tickets 200 ✅
```

### API Guia
```bash
curl http://localhost:5001/api/health
# Retorna: {"status":"ok","message":"API Server is running"} ✅
```

### Assets Guia
```bash
curl -I https://i9script.com/guiadoempreendedor/assets/index-Se_SGqxd.js
# HTTP/2 200, 946KB ✅
# Cache: max-age=31536000 ✅
```

---

## 🔒 SEGURANÇA

- ✅ HTTPS obrigatório (redirect automático)
- ✅ SSL/TLS 1.2 e 1.3
- ✅ Headers de segurança configurados
- ✅ CORS configurado
- ✅ JWT com expiração de 7 dias
- ✅ Senhas hasheadas (bcrypt)
- ✅ Bancos isolados

---

## 📋 MANUTENÇÃO

### Ver logs em tempo real
```bash
# i9script
docker logs -f i9script-backend-prod

# Guia
docker logs -f guia-empreendedor-backend

# Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Reiniciar serviços
```bash
# i9script
cd /var/www/i9script
docker-compose -f docker-compose.backend-only.yml restart

# Guia
cd /var/www/i9script/guia_do_empreendedor
docker-compose restart

# Nginx
systemctl reload nginx

# MariaDB
systemctl restart mariadb
```

### Ver status
```bash
docker ps
systemctl status nginx
systemctl status mariadb
```

---

## 🚀 PORTAS UTILIZADAS

| Porta | Serviço                      | Status |
|-------|------------------------------|--------|
| 80    | Nginx HTTP (redirect)        | ✅     |
| 443   | Nginx HTTPS                  | ✅     |
| 3306  | MariaDB                      | ✅     |
| 5000  | i9script Backend             | ✅     |
| 5001  | Guia Backend                 | ✅     |

---

## 📝 PROBLEMAS RESOLVIDOS

1. ✅ Nginx servindo i9script ao invés do Guia
   - **Causa**: `root` global sobrescrevendo `alias`
   - **Solução**: Movido `root` para dentro da `location /`

2. ✅ Frontend do Guia com arquivos errados
   - **Causa**: Upload de arquivos incorretos
   - **Solução**: Build correto com `base: "/guiadoempreendedor/"`

3. ✅ Assets do Guia com redirect 301
   - **Causa**: Location aninhado para assets
   - **Solução**: Removido location aninhado, cache direto na location principal

4. ✅ Backend do Guia com erro de Node version
   - **Causa**: Supabase requer Node 20+
   - **Solução**: Upgrade de node:18-alpine para node:20-alpine

---

## 🎯 PRÓXIMOS PASSOS (OPCIONAL)

- [ ] Configurar backup automático dos bancos
- [ ] Implementar monitoramento (Uptime, PM2, etc)
- [ ] Configurar renovação automática SSL
- [ ] Implementar rate limiting no Nginx
- [ ] Configurar CDN para assets estáticos

---

## 📞 CREDENCIAIS E ACESSOS

### Servidor VPS
- IP: 72.61.223.226
- Porta SSH: 22
- Usuário: root
- Senha: 4xmnqiB@t234

### i9script
- URL: https://i9script.com
- Admin: admin@i9script.com / Admin@123
- DB User: i9script
- DB Pass: Usri9Sc7pT4dB2025Sec

### Guia do Empreendedor
- URL: https://i9script.com/guiadoempreendedor/
- Supabase: Console em https://supabase.com/dashboard

---

**✅ DEPLOY FINALIZADO COM SUCESSO!**

Ambos os sistemas estão online e funcionando corretamente em produção.
