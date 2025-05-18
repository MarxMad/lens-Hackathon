# 🎓 StudentLens

StudentLens es una plataforma social descentralizada que incentiva la creación de contenido educativo y socialmente valioso dentro de la comunidad estudiantil, utilizando Lens Protocol y recompensas en GHO.

## 🌟 Características Principales

### 📱 Feed Vertical Tipo TikTok
- Interfaz moderna y atractiva
- Navegación intuitiva
- Optimizado para contenido educativo

### 🎥 Sistema de Publicación
- Subida de videos educativos
- Integración con IPFS para almacenamiento descentralizado
- Soporte para múltiples formatos

### 💰 Sistema de Recompensas
- Recompensas en GHO por contenido de calidad
- Sistema de milestones y achievements
- Verificación on-chain de interacciones

### 🏆 Sistema de Reputación
- Badges por contribuciones
- Ranking semanal/mensual
- Prueba de participación y valor

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js, TailwindCSS, HeadlessUI
- **Blockchain**: Lens Protocol, GHO Token
- **Almacenamiento**: IPFS (web3.storage)
- **Autenticación**: ConnectKit, Continue with Family
- **Smart Contracts**: Solidity, Lens Chain

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/MarxMad/lens-Hackathon.git
cd lens-hackathon
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 📋 Requisitos del Sistema

- Node.js 18+
- npm 9+
- Wallet compatible con Ethereum (MetaMask, WalletConnect)

## 🔑 Variables de Entorno

```env
NEXT_PUBLIC_LENS_API_URL=
NEXT_PUBLIC_LENS_HUB_CONTRACT=
NEXT_PUBLIC_POLYGON_RPC_URL=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=
```

## 🎯 Funcionalidades

### Sistema de Recompensas
- 5 videos publicados
- 5 likes por video
- Recompensa en GHO
- Verificación on-chain

### Moderación de Contenido
- Categorización automática
- Filtrado de spam
- Verificación de perfiles

### Interacción Social
- Likes (mirrors)
- Comentarios
- Compartir contenido
- Seguimiento de creadores

## 🏗️ Arquitectura

### Frontend
- Componentes modulares
- Diseño responsive
- Optimización de rendimiento

### Backend
- API RESTful
- Integración con Lens Protocol
- Sistema de indexación

### Smart Contracts
- Gestión de recompensas
- Verificación de milestones
- Distribución de GHO

## 📈 Roadmap

### Fase 1: MVP
- [x] Feed básico
- [x] Sistema de publicación
- [x] Integración con Lens
- [x] Sistema de recompensas básico

### Fase 2: Mejoras
- [ ] Sistema de moderación
- [ ] Badges y reputación
- [ ] Analytics avanzado
- [ ] Gamificación

### Fase 3: Escalabilidad
- [ ] Optimización de gas
- [ ] Mejoras de UI/UX
- [ ] Integración con más redes
- [ ] Sistema de gobernanza

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 👥 Equipo

- [@MarxMad](https://github.com/MarxMad) - Desarrollador Principal

## 🙏 Agradecimientos

- Lens Protocol
- Aave
- Polygon
- Web3.Storage

## 📞 Contacto

- Twitter: [@StudentLens](https://twitter.com/StudentLens)
- Discord: [StudentLens](https://discord.gg/studentlens)
- Email: contact@studentlens.io

---

⭐️ Si te gusta el proyecto, ¡déjanos una estrella!
