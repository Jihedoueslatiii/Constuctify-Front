# Constructify 🏗️

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Jihedoueslatiii/Constructify)](https://github.com/Jihedoueslatiii/Constructify/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Jihedoueslatiii/Constructify)](https://github.com/Jihedoueslatiii/Constructify/issues)

## Overview

Constructify is a comprehensive construction project management application designed to streamline collaboration between clients, contractors, and construction professionals. The platform provides tools for project planning, tracking, document management, and communication in a centralized environment, enhancing efficiency and transparency throughout the construction process.

## Repository Structure

This project is split into two separate repositories:

1. **Backend (Spring Boot)**: [https://github.com/Jihedoueslatiii/Constructify/tree/integration](https://github.com/Jihedoueslatiii/Constructify/tree/integration)
2. **Frontend (Angular)**: [https://github.com/Jihedoueslatiii/Constuctify-Front/tree/integration](https://github.com/Jihedoueslatiii/Constuctify-Front/tree/integration)

## Features

### Project Management
- **Project Dashboard**: Get a quick overview of all active projects, statuses, and upcoming deadlines
- **Task Management**: Create, assign, and track tasks with customizable workflows
- **Timeline View**: Visual representation of project schedules and milestones
- **Resource Allocation**: Manage human resources, equipment, and materials effectively

### Document Management
- **Centralized Repository**: Store and organize blueprints, contracts, permits, and specifications
- **Version Control**: Track document revisions and maintain history
- **Access Control**: Set permissions based on user roles
- **Digital Signatures**: Securely sign documents online

### Communication Tools
- **Real-time Chat**: Communicate with team members instantly
- **Discussion Boards**: Topic-based conversations for effective collaboration
- **Notification System**: Stay updated with automated alerts for important events

### Financial Management
- **Budget Tracking**: Monitor project expenses against allocated budgets
- **Invoice Generation**: Create and send professional invoices to clients
- **Payment Processing**: Track payments and outstanding balances
- **Financial Reporting**: Generate detailed financial reports for stakeholders

### Analytics & Reporting
- **Performance Metrics**: Track key performance indicators for projects
- **Custom Reports**: Generate customized reports based on specific requirements
- **Data Visualization**: Visual representation of project data through charts and graphs

### Mobile Access
- **Responsive Design**: Access the platform from any device
- **Mobile App**: Dedicated applications for iOS and Android
- **Offline Functionality**: Work even without internet connection with data synchronization

## Getting Started

### Prerequisites
- JDK 11 or higher
- Maven 3.6+ or Gradle 6.0+
- MySQL/PostgreSQL database
- npm or yarn package manager (for frontend)

### Installation and Setup

#### Backend (Spring Boot)

1. Clone the backend repository:
```bash
git clone https://github.com/Jihedoueslatiii/Constructify.git
cd Constructify
git checkout integration
```

2. Build the application:
```bash
# Using Maven
mvn clean install

# Using Gradle (if applicable)
./gradlew build
```

3. Configure application properties:
```bash
# Edit application.properties or application.yml in src/main/resources
# Set up database connection, JWT secret, etc.
```

4. Run the Spring Boot application:
```bash
# Using Maven
mvn spring-boot:run

# Using Gradle (if applicable)
./gradlew bootRun
```

#### Frontend (Angular)

1. Clone the frontend repository:
```bash
git clone https://github.com/Jihedoueslatiii/Constuctify-Front.git
cd Constuctify-Front
git checkout integration
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Update environment.ts and environment.prod.ts with backend API URL
```

4. Run the development server:
```bash
ng serve
```

5. Build for production:
```bash
ng build --prod
```

### Project Structure

#### Backend Repository
```
Constructify/
├── src/                  # Spring Boot backend
│   ├── main/
│   │   ├── java/         # Java source code
│   │   │   ├── controllers/  # REST controllers
│   │   │   ├── models/       # Data models/entities
│   │   │   ├── repositories/ # Spring Data repositories
│   │   │   ├── services/     # Business logic
│   │   │   ├── config/       # Configuration classes
│   │   │   └── security/     # Security implementation
│   │   └── resources/    # Application properties, static resources
│   └── test/             # Test files
├── .gitignore            # Git ignore file
├── pom.xml               # Maven configuration
└── README.md             # Project documentation
```

#### Frontend Repository
```
Constuctify-Front/
├── src/                  # Angular application source
│   ├── app/              # Application components
│   │   ├── components/   # Reusable UI components
│   │   ├── models/       # Data models/interfaces
│   │   ├── services/     # API services
│   │   ├── store/        # NgRx store (actions, reducers, effects)
│   │   └── shared/       # Shared utilities and modules
│   ├── assets/           # Static assets (images, fonts)
│   ├── environments/     # Environment configuration
│   └── styles/           # Global styles
├── angular.json          # Angular CLI configuration
├── package.json          # NPM dependencies
└── README.md             # Project documentation
```

## Technology Stack

### Frontend
- Angular framework (latest version)
- NgRx for state management
- Angular Material for UI components
- Chart.js for data visualization
- RxJS for reactive programming
- TypeScript as the programming language

### Backend
- Spring Boot for Java-based backend
- Hibernate ORM for database interactions
- Spring Security for authentication and authorization
- Spring Data JPA for data access
- JWT for secure token-based authentication
- RESTful API architecture

### DevOps
- Docker for containerization
- CI/CD pipeline with GitHub Actions
- AWS/Azure/GCP for hosting

## API Documentation

The API documentation is available at `/api/docs` when running the development server. It provides detailed information about available endpoints, request methods, parameters, and response formats.

## Contributing

We welcome contributions to Constructify! Please follow these steps to contribute:

1. Fork the respective repository (backend or frontend)
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request against the `integration` branch

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Jihed Oueslatii - [LinkedIn](https://linkedin.com/in/jihedoueslatii)

Project Links:
- Backend: [https://github.com/Jihedoueslatiii/Constructify](https://github.com/Jihedoueslatiii/Constructify)
- Frontend: [https://github.com/Jihedoueslatiii/Constuctify-Front](https://github.com/Jihedoueslatiii/Constuctify-Front)

## Acknowledgements

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Angular](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [Hibernate](https://hibernate.org/)
- [MySQL/PostgreSQL](https://www.mysql.com/)
