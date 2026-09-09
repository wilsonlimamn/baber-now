# Barber-Now — Guia de Deploy e App Android (Capacitor)

Este documento contém todas as instruções para:
1. **Configurar o Domínio `barbernow.3facil.com` com Nginx e SSL Grátis (Let's Encrypt)**
2. **Atualizar o Servidor EC2 via Docker Compose e PostgreSQL existente**
3. **Gerar e Compilar o Aplicativo Android Nativo com Capacitor (`.apk` / `.aab`)**

---

## PARTE 1: Configuração do Domínio e Nginx na EC2

### 1. Criar o Registro DNS (Painel do seu Domínio)
No registrador onde o domínio `3facil.com` está configurado:
- **Tipo:** `A`
- **Nome/Host:** `barbernow`
- **Valor/Destino:** `56.125.35.169`
- **TTL:** `3600` (ou padrão)

Para testar a propagação no terminal:
```bash
nslookup barbernow.3facil.com
```

### 2. Instalar o Nginx no Servidor EC2
```bash
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. Configurar o Proxy Reverso para o Barber-Now (Porta 3001)
```bash
sudo tee /etc/nginx/conf.d/barbernow.conf << 'EOF'
server {
    listen 80;
    server_name barbernow.3facil.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo nginx -t
sudo systemctl reload nginx
```
*(Certifique-se de que a porta 80 e 443 estão liberadas no Security Group da AWS).*

### 4. Instalar Certificado SSL HTTPS Gratuito (Let's Encrypt)
Assim que o DNS estiver respondendo:
```bash
sudo yum install -y certbot python3-certbot-nginx
sudo certbot --nginx -d barbernow.3facil.com
```
O Certbot configurará automaticamente o HTTPS com redirecionamento de HTTP para HTTPS.

---

## PARTE 2: Atualização do Servidor EC2 (Docker)

Caso você suba uma nova versão do `.zip` para `/home/ec2-user/ftp/upload`:

```bash
# 1. Backup de segurança do docker-compose e do .env com senhas
cp /home/ec2-user/app_barbernow/docker-compose.yml /home/ec2-user/docker-compose.yml.bak 2>/dev/null || true
cp /home/ec2-user/app_barbernow/.env /home/ec2-user/.env.bak 2>/dev/null || true

# 2. Entrar na pasta e extrair
cd /home/ec2-user/app_barbernow
unzip -o /home/ec2-user/ftp/upload/*.zip

# 3. Restaurar o docker-compose.yml e .env originais para preservar banco e senhas
if [ -f /home/ec2-user/docker-compose.yml.bak ]; then
  cp /home/ec2-user/docker-compose.yml.bak /home/ec2-user/app_barbernow/docker-compose.yml
fi
if [ -f /home/ec2-user/.env.bak ]; then
  cp /home/ec2-user/.env.bak /home/ec2-user/app_barbernow/.env
fi

# 4. Recompilar e subir os contêineres
docker compose up -d --build

# 5. Acompanhar os logs
docker logs -f barber-now-app
```

---

## PARTE 3: Aplicativo Android Nativo (Capacitor)

O projeto já está 100% configurado com:
- **App ID:** `com.barbernow.app`
- **Nome do App:** `Barber-Now`
- **Servidor Remoto:** `https://barbernow.3facil.com`
- **Esquema Android:** `https`
- **Permissões no AndroidManifest.xml:** `INTERNET`, `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`
- **Tema & Splash Screen:** Cor de fundo de marca `#0F172A` com logo centralizado e ícones adaptativos.

### 1. Pré-requisitos na sua máquina local
- **Node.js** v18+ instalado.
- **Android Studio** instalado (com Android SDK e Java JDK 17+).

### 2. Comandos para Build e Sincronização Local

Abra o terminal na pasta raiz do projeto:

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Gerar o build da aplicação web
npm run build

# 3. Sincronizar com o projeto Android
npx cap sync android
# ou:
npm run cap:sync
```

### 3. Personalizar o Ícone do App (Opcional)
Se você quiser substituir o logo por uma imagem própria:
1. Coloque a sua imagem em alta resolução (1024x1024 px) na pasta `assets/logo.png` (ou `assets/icon.png`).
2. Execute o comando:
   ```bash
   npm run generate:icons
   ```
   *O script redimensionará e distribuirá automaticamente todos os ícones (`mipmap-mdpi` até `mipmap-xxxhdpi`), ícones circulares e o ícone de 512x512 para a Google Play Store.*
3. Execute novamente:
   ```bash
   npx cap sync android
   ```

### 4. Abrir no Android Studio e Gerar o APK / AAB
Para abrir o projeto diretamente no Android Studio:
```bash
npx cap open android
# ou:
npm run cap:open
```

No Android Studio:
1. Aguarde o Gradle sincronizar as dependências automaticamente na primeira vez.
2. **Para gerar um APK de teste (Debug APK):**
   - Acesse o menu superior: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Ao finalizar, clique em **locate** para pegar o arquivo `app-debug.apk` e instalar diretamente no seu celular Android.
3. **Para gerar o pacote de publicação na Google Play Store (Release AAB):**
   - Acesse: **Build > Generate Signed Bundle / APK**.
   - Escolha **Android App Bundle (.aab)**.
   - Selecione ou crie sua chave de assinatura (Keystore).
   - O arquivo `.aab` gerado estará pronto para upload no Google Play Console.
