
# start docker
docker-compose up -d

# int user data
docker exec user-db bash -c "neo4j-admin database import full --overwrite-destination --nodes=User=/import/users_header.csv,/import/users.csv --nodes=Account=/import/accounts_header.csv,/import/accounts.csv"
