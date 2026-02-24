# Medilab Hospital - Angular Application

Medilab Hospital is a comprehensive healthcare website built with Angular, featuring:

- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Component-Based Architecture**: Organized into reusable Angular components
- **Service-Driven Data**: Angular services for doctors, departments, and appointments
- **Modern UI/UX**: Clean, professional healthcare design
- **Performance Optimized**: Lazy loading and code optimization ready

## Project Structure

```
src/
├── app/
│   ├── components/          # Shared components
│   │   ├── header/
│   │   ├── footer/
│   │   └── appointment-form/
│   ├── pages/               # Page components
│   │   └── home/
│   ├── services/            # Angular services
│   │   ├── appointment.service.ts
│   │   ├── doctor.service.ts
│   │   └── department.service.ts
│   ├── app.component.*      # Root component
│   ├── app.module.ts        # App module
│   └── app-routing.module.ts # Routing configuration
├── assets/                  # Static assets (images, fonts, etc.)
├── styles.css              # Global styles
├── index.html              # HTML template
└── main.ts                 # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Navigate to the project directory:
```bash
cd hospitalweb
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Features

### Components

- **Header**: Navigation bar with contact information and social links
- **Footer**: Footer with links and contact information
- **Home Page**: Landing page with hero section, about, services, appointments, departments, doctors, FAQ, and contact
- **Appointment Form**: Booking system with patient information and appointment scheduling

### Services

- **AppointmentService**: Manages appointment bookings and storage
- **DoctorService**: Manages doctor information
- **DepartmentService**: Manages department information

## Development

### Build for Production
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Technologies Used

- **Angular**: v17.0.0
- **Bootstrap**: v5.3.3
- **TypeScript**: v5.2.2
- **RxJS**: v7.8.0

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this template for your projects.

## Support

For issues and questions, please visit the hospital website or contact support.

## Future Enhancements

- [ ] Patient portal with login
- [ ] Online prescription management
- [ ] Medical records access
- [ ] Video consultation integration
- [ ] Payment gateway integration
- [ ] SMS/Email notifications
- [ ] Multi-language support
- [ ] Admin dashboard

---

**Built with ❤️ by Medilab Team**
