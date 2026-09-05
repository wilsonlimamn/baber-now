# Barber-Now no Servidor EC2

Instruções para subir o **Barber-Now** no mesmo servidor sem instalar nada novo, usando a rede Docker e o PostgreSQL existente:

### 1. Banco de Dados existente
O banco `barbernow` e o usuário `barbernow_user` já estão configurados no contêiner `algodoal-postgres`.

### 2. Pasta do app no servidor
```bash
cd /home/ec2-user/app_barbernow
```
Copie ou descompacte os arquivos do projeto para essa pasta.

### 3. Subir o contêiner com Docker Compose
Dentro de `/home/ec2-user/app_barbernow`:
```bash
docker compose up -d --build
```

### 4. Acompanhar os logs
```bash
docker logs -f barber-now-app
```
O servidor inicializará e criará/verificará automaticamente as tabelas `barbers`, `appointments` e `neighborhoods` dentro do banco `barbernow`.

### 5. Portas no servidor
- **App atual (`algodoal-connect-app`)**: Porta `3000` (inalterada)
- **Novo app (`barber-now-app`)**: Porta `3001`
- **Banco de Dados (`algodoal-postgres`)**: Porta `5432` compartilhado com bancos independentes (`algodoal_db` e `barbernow`)
