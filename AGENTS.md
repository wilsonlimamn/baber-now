# Diretrizes Permanentes do Projeto Barber-Now

## Configuração do Docker Compose & Banco de Dados
- **NÃO ALTERE** o arquivo `docker-compose.yml`.
- O banco de dados já existe no servidor com o nome `barbernow`.
- O usuário do banco é `barbernow_user`.
- O host do banco de dados no Docker é `algodoal-postgres` na porta `5432`.
- A rede Docker externa é `app_default`.
- Mantenha rigorosamente essa configuração de conexão e limites de memória em qualquer geração futura.

## Localidade e Escopo
- O aplicativo está configurado para operar exclusivamente em **Belém, Pará**.
- Todos os bairros, referências e cidades são de **Belém-PA**.
