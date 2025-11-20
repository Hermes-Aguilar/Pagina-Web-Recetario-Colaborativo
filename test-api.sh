#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/api"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   Probando API de RedRecetas${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Test 1: Obtener usuarios
echo -e "${YELLOW}📋 Test 1: Obtener usuarios${NC}"
response=$(curl -s "${API_URL}/usuarios")
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Usuarios obtenidos correctamente${NC}"
  echo "$response" | jq '.' 2>/dev/null || echo "$response"
else
  echo -e "${RED}❌ Error al obtener usuarios${NC}"
fi
echo ""

# Test 2: Obtener recetas
echo -e "${YELLOW}📋 Test 2: Obtener recetas${NC}"
response=$(curl -s "${API_URL}/recetas")
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Recetas obtenidas correctamente${NC}"
  echo "$response" | jq '.' 2>/dev/null || echo "$response"
else
  echo -e "${RED}❌ Error al obtener recetas${NC}"
fi
echo ""

# Test 3: Obtener valoraciones
echo -e "${YELLOW}📋 Test 3: Obtener valoraciones${NC}"
response=$(curl -s "${API_URL}/valoraciones")
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Valoraciones obtenidas correctamente${NC}"
  echo "$response" | jq '.' 2>/dev/null || echo "$response"
else
  echo -e "${RED}❌ Error al obtener valoraciones${NC}"
fi
echo ""

# Test 4: Obtener blogs
echo -e "${YELLOW}📋 Test 4: Obtener blogs${NC}"
response=$(curl -s "${API_URL}/blogs")
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Blogs obtenidos correctamente${NC}"
  echo "$response" | jq '.' 2>/dev/null || echo "$response"
else
  echo -e "${RED}❌ Error al obtener blogs${NC}"
fi
echo ""

# Test 5: Obtener comentarios de blog
echo -e "${YELLOW}📋 Test 5: Obtener comentarios de blog${NC}"
response=$(curl -s "${API_URL}/comentariosBlog")
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Comentarios obtenidos correctamente${NC}"
  echo "$response" | jq '.' 2>/dev/null || echo "$response"
else
  echo -e "${RED}❌ Error al obtener comentarios${NC}"
fi
echo ""

# Test 6: Crear un nuevo usuario
echo -e "${YELLOW}📝 Test 6: Crear nuevo usuario${NC}"
response=$(curl -s -X POST "${API_URL}/usuarios" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreUsuario": "@testUser'$(date +%s)'",
    "correoElectronico": "test'$(date +%s)'@example.com",
    "contrasena": "password123",
    "imagenPerfil": {
      "nombreArchivo": "test.jpg",
      "tipo": "image/jpeg",
      "almacenadoEn": "uploads/perfiles/"
    }
  }')
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Usuario creado correctamente${NC}"
  echo "$response" | jq '.' 2>/dev/null || echo "$response"
else
  echo -e "${RED}❌ Error al crear usuario${NC}"
fi
echo ""

# Test 7: Crear una nueva receta
echo -e "${YELLOW}📝 Test 7: Crear nueva receta${NC}"
response=$(curl -s -X POST "${API_URL}/recetas" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "@chefLuis",
    "titulo": "Receta de prueba '$(date +%s)'",
    "tipo": "Desayuno",
    "ingredientes": ["Huevos", "Pan", "Mantequilla"],
    "descripcion": "Receta de prueba automatizada"
  }')
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Receta creada correctamente${NC}"
  echo "$response" | jq '.' 2>/dev/null || echo "$response"
else
  echo -e "${RED}❌ Error al crear receta${NC}"
fi
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   Pruebas completadas${NC}"
echo -e "${YELLOW}========================================${NC}"
