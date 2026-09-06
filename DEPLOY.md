# Barber-Now no Servidor EC2

Instruções para subir ou atualizar o **Barber-Now** no mesmo servidor sem instalar nada novo, usando a rede Docker e o PostgreSQL existente:

### 1. Banco de Dados existente
O banco `barbernow` e o usuário `barbernow_user` já estão configurados no contêiner `algodoal-postgres`.

### 2. Atualização via arquivo ZIP enviado para `/home/ec2-user/ftp/upload`
Caso você tenha subido o arquivo `.zip` para a pasta do FTP:

```bash
# 1. Garantir que a pasta do app existe
mkdir -p /home/ec2-user/app_barbernow

# 2. Fazer backup do docker-compose.yml ou .env atual (se já tiver sua senha configurada)
cp /home/ec2-user/app_barbernow/docker-compose.yml /home/ec2-user/docker-compose.yml.bak 2>/dev/null || true

# 3. Entrar na pasta do app e extrair o novo zip
cd /home/ec2-user/app_barbernow
unzip -o /home/ec2-user/ftp/upload/*.zip

# 4. Restaurar o docker-compose.yml com suas credenciais salvas (se existia backup)
if [ -f /home/ec2-user/docker-compose.yml.bak ]; then
  cp /home/ec2-user/docker-compose.yml.bak /home/ec2-user/app_barbernow/docker-compose.yml
fi
```

### 3. Recompilar e subir o contêiner
Dentro de `/home/ec2-user/app_barbernow`:
```bash
docker compose up -d --build
```

### 4. Acompanhar os logs
```bash
docker logs -f barber-now-app
```
O servidor inicializará e conectará automaticamente ao banco `barbernow` na porta interna 3000 (exposta externamente na porta 3001).

### 5. Portas no servidor
- **App atual (`algodoal-connect-app`)**: Porta `3000` (inalterada)
- **Barber-Now (`barber-now-app`)**: Porta `3001`
- **Banco de Dados (`algodoal-postgres`)**: Porta `5432` compartilhado na rede `app_default`

### 6. Configuração dos E-mails via site3facil@gmail.com
Para os e-mails serem entregues de verdade na caixa de entrada dos clientes e barbeiros:
1. Gere uma **Senha de Aplicativo** de 16 letras na conta Google de `site3facil@gmail.com`:
   - Acesse: https://myaccount.google.com/apppasswords
   - Dê o nome `BarberNow` e copie a senha de 16 caracteres gerada.
2. Você pode ativar de duas formas simples:
   - **Opção A (Pelo Navegador):** Abra o Barber-Now, clique no rodapé em **"Testar E-mails (site3facil@gmail.com)"**, cole a senha de 16 letras no campo e clique em **"Salvar Senha"**.
   - **Opção B (Pelo Terminal EC2):** Crie ou edite o arquivo `.env` dentro de `/home/ec2-user/app_barbernow`:
     ```bash
     echo 'SMTP_USER="site3facil@gmail.com"' >> /home/ec2-user/app_barbernow/.env
     echo 'SMTP_PASS="sua_senha_de_16_digitos_aqui"' >> /home/ec2-user/app_barbernow/.env
     ```

