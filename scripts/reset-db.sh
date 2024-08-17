# .SYNOPSIS
# Resets the database for the lab-reservas project.

# .DESCRIPTION
# This script stops and removes the 'db-reservas' Docker container, deletes the '.drizzle' directory, and performs database migrations using 'pnpm'.

# .PARAMETER None
# This script does not accept any parameters.

# .EXAMPLE
# .\reset-db.ps1
# This command runs the script and resets the database for the lab-reservas project.

# .NOTES
# Author: Tomas Panqueva (T-Hash06)
# Date: 16 August 2024

docker stop db-reservas
docker rm db-reservas
docker run --name db-reservas -e POSTGRES_PASSWORD=root -p5432:5432 -d postgres

rm -rf ./.drizzle

pnpm migration:generate
pnpm migration:push