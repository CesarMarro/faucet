# Sepolia Faucet - Setup Guide

Este proyecto es un faucet de Sepolia que permite a los usuarios solicitar 0.01 ETH de prueba cada 24 horas.

## Tecnologías

- **Frontend**: Next.js 16 + React + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno)
- **Blockchain**: Ethereum Sepolia via Infura
- **Database**: Supabase PostgreSQL

## Configuración Inicial

### 1. Crear cuenta en Infura

1. Ve a [https://infura.io](https://infura.io) y crea una cuenta
2. Crea un nuevo proyecto/API key
3. Selecciona **Ethereum** como red
4. En la configuración del proyecto, asegúrate de que **Sepolia** esté habilitado
5. Copia el endpoint HTTPS de Sepolia, ejemplo:
   ```
   https://sepolia.infura.io/v3/TU_API_KEY
   ```

### 2. Configurar Supabase

#### Obtener credenciales de Supabase

1. Ve a tu proyecto en [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Settings → API
3. Copia:
   - **Project URL**: `https://mxplbofburllynccbwao.supabase.co`
   - **anon public key**: Tu clave pública anon

#### Configurar secrets de la Edge Function

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Login
supabase login

# Vincular proyecto
supabase link --project-ref mxplbofburllynccbwao

# Configurar secrets para la Edge Function
supabase secrets set INFURA_RPC_URL=https://sepolia.infura.io/v3/TU_API_KEY
supabase secrets set FAUCET_PRIVATE_KEY=TU_CLAVE_PRIVADA
```

### 3. Configurar variables de entorno locales

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase (Frontend)
NEXT_PUBLIC_SUPABASE_URL=https://mxplbofburllynccbwao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Infura RPC (para desarrollo local - opcional)
INFURA_RPC_URL=https://sepolia.infura.io/v3/TU_API_KEY
FAUCET_PRIVATE_KEY=tu_clave_privada_aqui
```

### 4. Preparar wallet del faucet

1. Crea una wallet nueva o usa una existente (solo para el faucet)
2. Obtén la clave privada de esa wallet
3. Fondea la wallet con Sepolia ETH desde un faucet público:
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
   - [Chainlink Faucet](https://faucets.chain.link/)

⚠️ **IMPORTANTE**: Nunca compartas ni subas tu clave privada al repositorio. Mantenla solo en `.env.local` (que está en `.gitignore`) y en los secrets de Supabase.

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## Estructura del Proyecto

```
faucet/
├── src/
│   ├── app/
│   │   ├── api/faucet/route.ts    # API route que llama a la Edge Function
│   │   └── page.tsx                # Landing page
│   └── components/
│       └── ui/
│           ├── void-hero.tsx       # Hero 3D con animación
│           ├── faucet-form.tsx     # Formulario del faucet
│           └── button.tsx          # Componente de botón
├── supabase/
│   ├── functions/
│   │   └── faucet/
│   │       └── index.ts            # Edge Function principal
│   └── migrations/
│       └── 20241022000001_create_faucet_requests.sql
└── .env.local                      # Variables de entorno (no subir a git)
```

## Cómo Funciona

1. **Usuario ingresa dirección**: El formulario valida que sea una dirección Ethereum válida
2. **Llamada a API**: `/api/faucet` recibe la solicitud y la reenvía a la Edge Function
3. **Edge Function**:
   - Valida la dirección con `ethers.isAddress`
   - Consulta la tabla `faucet_requests` para verificar el rate limit de 24h
   - Si pasa la validación, envía 0.01 ETH usando Infura
   - Registra la transacción en la base de datos
4. **Respuesta**: Devuelve el hash de la transacción o un error

## Rate Limiting

- **Límite**: 0.01 ETH por dirección cada 24 horas
- **Implementación**: La tabla `faucet_requests` guarda cada solicitud con timestamp
- **Validación**: Antes de enviar ETH, se verifica si existe una solicitud reciente (< 24h)

## Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
```

Asegúrate de configurar las variables de entorno en tu plataforma de deployment.

### Edge Function (Supabase)

La función ya está desplegada. Si haces cambios:

```bash
supabase functions deploy faucet
```

## Troubleshooting

### Error: "Server configuration error"
- Verifica que los secrets `INFURA_RPC_URL` y `FAUCET_PRIVATE_KEY` estén configurados en Supabase

### Error: "Faucet temporarily out of funds"
- La wallet del faucet no tiene suficiente Sepolia ETH
- Fondea la wallet desde un faucet público

### Error: "Ya solicitaste en las últimas 24h"
- El rate limit está activo para esa dirección
- Espera 24 horas desde la última solicitud

### Error de conexión a Infura
- Verifica que tu API key de Infura sea válida
- Asegúrate de que Sepolia esté habilitado en tu proyecto de Infura

## Seguridad

- ✅ Rate limiting por dirección (24h)
- ✅ Validación de direcciones Ethereum
- ✅ Claves privadas en secrets (nunca en código)
- ✅ CORS configurado
- ✅ Manejo de errores robusto

## Créditos

Creado por: César Marroquín · Daniel Hidalgo · Rodrigo Reyes
