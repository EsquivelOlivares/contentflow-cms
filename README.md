CONTENTFLOW CMS - GUÍA RÁPIDA

1. CLONAR:
git clone <tu-repo>
cd contentflow

2. BASE DE DATOS:
psql postgres
CREATE DATABASE contentflow;
CREATE USER contentflow_user WITH PASSWORD 'contentflow123';
GRANT ALL PRIVILEGES ON DATABASE contentflow TO contentflow_user;
\q

3. LEVANTAR SERVICIOS (EN 5 TERMINALES DISTINTAS):

Terminal 1 - User Service:
cd backend/microservices/user-service
npm install
npm run start:dev

Terminal 2 - Content Service:
cd backend/microservices/content-service
npm install
npm run start:dev

Terminal 3 - API Gateway:
cd backend/microservices/api-gateway
npm install
npm run start:dev

Terminal 4 - Frontend:
cd frontend
npm install
npm run dev

4. ACCEDER:
Frontend: http://localhost:3001
Login: victoria@test.com / 123456
