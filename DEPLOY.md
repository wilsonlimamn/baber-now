# Barber-Now no Servidor EC2

Instruções para subir o **Barber-Now** no mesmo servidor sem instalar nada novo, usando a rede Docker e o PostgreSQL existente:

### 1. Criar o banco no seu PostgreSQL existente
No terminal da sua EC2, rode:
```bash
docker exec -it algodoal-postgres psql -U postgres -c "CREATE DATABASE barber_db;"
```

### 2. Criar a pasta do app no servidor
```bash
mkdir -p /home/ec2-user/barber-now
cd /home/ec2-user/barber-now
```
Copie ou clone os arquivos do projeto para essa pasta.

### 3. Subir o contêiner com Docker Compose
Dentro de `/home/ec2-user/barber-now`:
```bash
docker compose up -d --build
```

### 4. Acompanhar os logs
```bash
docker logs -f barber-now-app
```
O servidor inicializará e criará automaticamente as tabelas `barbers`, `appointments` e `neighborhoods` dentro do banco `barber_db`.

### 5. Portas no servidor
- **App atual (`algodoal-connect-app`)**: Porta `3000` (inalterada)
- **Novo app (`barber-now-app`)**: Porta `3001` (ou a porta que preferir)
- **Banco de Dados (`algodoal-postgres`)**: Porta `5432` compartilhado com bancos independentes (`algodoal_db` e `barber_db`)
