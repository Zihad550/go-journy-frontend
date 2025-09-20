# Go Journy 🚗

A modern, full-featured ride-sharing platform built with React, TypeScript, and cutting-edge web technologies. Go Journy connects riders with drivers through an intuitive interface featuring real-time ride matching, driver selection, and comprehensive trip management.

## 🌟 Features

### Core Functionality

- **Smart Ride Matching**: Advanced algorithm connects riders with available drivers
- **Driver Interest System**: Drivers can express interest in ride requests
- **Rider Choice**: Riders select preferred drivers from interested candidates
- **Real-time Updates**: Live synchronization of ride status and driver availability
- **Multi-role Support**: Tailored experiences for Riders, Drivers, and Administrators

### User Experience

- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Interactive Maps**: Leaflet-powered location services with real-time tracking
- **Smart Forms**: React Hook Form with Zod validation for frictionless data entry
- **Toast Notifications**: Immediate feedback for all user actions
- **Theme Support**: Light/dark mode with system preference detection

### Security & Reliability

- **JWT Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Granular permissions for different user types
- **Error Handling**: Comprehensive error recovery with user-friendly messages
- **Input Validation**: Server-side and client-side validation with Zod schemas
- **Rate Limiting**: Built-in protection against abuse

## 🛠️ Tech Stack

### Frontend Framework

- **
  React 19** - Latest React with concurrent features
- **TypeScript 5.8** - Full type safety and enhanced developer experience
- **Vite 7** - Lightning-fast build tool and development server

### State Management & Data

- **Redux Toolkit** - Predictable state management with RTK Query
- **React Router v7** - Declarative routing with data loading
- **Axios** - HTTP client with interceptors for API communication

### UI/UX

- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled component primitives
- **Shadcn/ui** - Beautiful, customizable components
- **Lucide React** - Consistent icon library
- **GSAP** - Professional-grade animations
- **Leaflet** - Interactive maps and geolocation

### Development Tools

- **ESLint** - Code linting with TypeScript support
- **PNPM** - Efficient package manager with workspace support

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ and PNPM installed
- Backend API running (see [API Documentation](./API_DOCUMENTATION.md))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Zihad550/go-journy-frontend.git
cd go-journy-frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_ATTRIBUTION=© OpenStreetMap contributors
```

## 🏗️ Project Structure

```
go-journy-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── modules/        # Feature-specific components
│   │   ├── ui/            # Base UI components (shadcn/ui)
│   │   └── layout/        # Layout components
│   ├── pages/             # Route components
│   ├── redux/             # Redux store and slices
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # Application constants
│   ├── config/            # Application configuration
│   ├── contexts/          # React contexts
│   ├── lib/               # Core libraries and utilities
│   ├── providers/         # Context providers
│   └── routes/            # Route configurations
├── public/                # Static assets
└── API_DOCUMENTATION.md   # API documentation
```

## 🚀 Key Components

### Driver Interest Workflow

- **DriverHeroContent**: Interface for drivers to browse and express interest in rides
- **InterestedDrivers**: Rider interface for selecting from interested drivers
- **RideDetails**: Comprehensive ride information display
- **Real-time State Management**: Automatic UI updates using Redux Toolkit

### Authentication System

- **Login/Register**: Secure authentication with role detection
- **Protected Routes**: Role-based access control
- **Profile Management**: User profile updates with validation
- **Password Recovery**: Secure password reset flow

### Dashboard Interfaces

- **Rider Dashboard**: Ride history, active rides, and request management
- **Driver Dashboard**: Earnings, availability management, and ride requests
- **Admin Dashboard**: Analytics, user management, and system controls

## 🔧 API Integration

The application integrates with the Go Journy backend API featuring:

- **RESTful Endpoints**: Comprehensive CRUD operations
- **JWT Authentication**: Secure token-based access
- **Role-based Permissions**: Granular access control
- **Real-time Updates**: WebSocket support for live data
- **Error Handling**: Consistent error response format

See [API Documentation](./API_DOCUMENTATION.md) for detailed endpoint information.

## 🧪 Testing

Testing framework not yet configured. To add testing in the future:

- Install Vitest and React Testing Library
- Configure test scripts in package.json
- Add test files alongside components
- Set up test coverage reporting

## 📱 Mobile Responsiveness

The application is built with a mobile-first approach:

- **Responsive Grid System**: Adaptive layouts for all screen sizes
- **Touch-friendly Interface**: Optimized for mobile interaction
- **Progressive Web App**: Installable on mobile devices
- **Offline Support**: Service worker for basic offline functionality

## 🔒 Security Best Practices

- **Input Sanitization**: All user inputs are validated and sanitized
- **HTTPS Enforcement**: Secure communication with backend
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: Protection against abuse and DDoS
- **Secure Storage**: Sensitive data encrypted in localStorage

## 🌍 Internationalization

- **Multi-language Support**: i18n ready architecture
- **RTL Support**: Right-to-left language compatibility
- **Currency/Date Formatting**: Locale-aware formatting
- **Timezone Support**: Automatic timezone detection and conversion

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Image Optimization**: Responsive images with WebP support
- **Caching Strategy**: Aggressive caching with cache invalidation
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Performance Monitoring**: Core Web Vitals tracking

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style and conventions
- Run `pnpm lint` before committing
- Ensure TypeScript compilation passes with `pnpm exec tsc --noEmit`

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **API Documentation**: Check our [API Documentation](./API_DOCUMENTATION.md)
- **Issues**: Report bugs via [GitHub Issues](https://github.com/your-org/go-journy-frontend/issues)
- **Discussions**: Join community discussions in [GitHub Discussions](https://github.com/your-org/go-journy-frontend/discussions)
- **Contact**: Email us at jehadhossain008@gmail.com

## 🙏 Acknowledgments

- React community for the amazing ecosystem
- Radix UI team for accessible component primitives
- Tailwind CSS team for the utility-first approach
- All contributors who have helped shape this project

---

**Go Journy** - Connecting riders and drivers, one journey at a time. 🚗✨
