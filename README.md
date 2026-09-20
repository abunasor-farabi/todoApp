# TodoApp – Full-Stack Task Manager

A full-stack task management application with JWT authentication, built with ASP.NET Core 8 Web API, React + Redux Toolkit, and MySQL (or Microsoft SQL Server).

## Table of Contents
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Database Configuration](#database-configuration)
  - [Using MySQL (Default)](#using-mysql-default)
  - [Using Microsoft SQL Server](#using-microsoft-sql-server)
- [Running the Application](#running-the-application)
- [Packages & Versions](#packages--versions)
  - [Backend (NuGet)](#backend-nuget)
  - [Frontend (npm)](#frontend-npm)
- [License](#license)

## Tech Stack
- **Backend:** ASP.NET Core 8 Web API, Entity Framework Core, JWT Authentication
- **Frontend:** React 19, Redux Toolkit, React Router, Vite
- **Database:** MySQL (default) or Microsoft SQL Server (optional)

## Prerequisites
Before you begin, ensure you have the following installed:

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (or later)
- [Node.js](https://nodejs.org/) v18.x or later (v20.x recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (if using MySQL)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (if using MSSQL)
- [Entity Framework Core Tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) (`dotnet tool install --global dotnet-ef`)


## Getting Started

### Backend Setup
1. Navigate to the `TodoApi/` directory:
   ```bash
   cd TodoApi
   ```
2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```
3. Configure the database (see [Database Configuration](#database-configuration)).
4. Apply migrations and run:
   ```bash
   dotnet ef database update
   dotnet run
   ```
   The API will be available at `http://localhost:5000` (or as configured).

### Frontend Setup
1. Navigate to the `todo-frontend/` directory:
   ```bash
   cd todo-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (default Vite port).

## Database Configuration

### Using MySQL (Default)
The application is pre-configured for MySQL using Pomelo.EntityFrameworkCore.MySql.

1. Open `TodoApi/appsettings.json`.
2. Locate the `ConnectionStrings:DefaultConnection` entry.
3. Replace `__YOUR_PASSWORD__` with your MySQL root password:
   ```json
   "DefaultConnection": "Server=localhost;Database=TodoApiDb;User=root;Password=YourActualPassword;"
   ```
4. **No other changes are required.** Proceed to run migrations and start the backend.

### Using Microsoft SQL Server
If you prefer Microsoft SQL Server, follow these steps:

1. **Change the connection string** in `TodoApi/appsettings.json`:
   ```json
   "DefaultConnection": "Server=localhost;Database=TodoApiDb;Trusted_Connection=True;TrustServerCertificate=True;"
   ```
   (Adjust for your SQL Server instance, user, and password.)

2. **Register the SQL Server DbContext** in `TodoApi/Program.cs`.
   Replace the existing MySQL registration:
   ```csharp
   // Remove or comment out:
   // var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
   // builder.Services.AddDbContext<ApplicationDbContext>(options =>
   //     options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

   // Add:
   var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
   builder.Services.AddDbContext<ApplicationDbContext>(options =>
       options.UseSqlServer(connectionString));
   ```
   Ensure you have the `Microsoft.EntityFrameworkCore.SqlServer` NuGet package installed. You can add it via:
   ```bash
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.2
   ```

3. **Remove existing migrations** (if any) since they were generated for MySQL:
   ```bash
   rm -rf TodoApi/Migrations
   ```

4. **Create new migrations** for SQL Server:
   ```bash
   dotnet ef migrations add InitialCreate
   ```

5. **Update the database**:
   ```bash
   dotnet ef database update
   ```

6. Run the backend as usual.

## Running the Application
1. Start the backend (from `TodoApi/`):
   ```bash
   dotnet run
   ```
2. Start the frontend (from `todo-frontend/`):
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`.

## Packages & Versions

### Backend (NuGet)
| Package | Version |
|---------|---------|
| Microsoft.AspNetCore.Authentication.JwtBearer | 8.0.2 |
| Microsoft.AspNetCore.Identity.EntityFrameworkCore | 8.0.2 |
| Microsoft.AspNetCore.Mvc.NewtonsoftJson | 8.0.31 |
| Microsoft.AspNetCore.OpenApi | 8.0.30 |
| Microsoft.EntityFrameworkCore | 8.0.2 |
| Microsoft.EntityFrameworkCore.Design | 8.0.0 |
| Microsoft.EntityFrameworkCore.Tools | 8.0.0 |
| Microsoft.Extensions.Identity.Core | 8.0.2 |
| Pomelo.EntityFrameworkCore.MySql | 8.0.2 |
| Swashbuckle.AspNetCore | 6.6.2 |

### Frontend (npm)
#### Dependencies
| Package | Version |
|---------|---------|
| @reduxjs/toolkit | ^2.12.0 |
| react | ^19.2.8 |
| react-dom | ^19.2.8 |
| react-redux | ^9.3.0 |
| react-router-dom | ^7.18.4 |

#### Dev Dependencies
| Package | Version |
|---------|---------|
| @eslint/js | ^10.0.1 |
| @types/react | ^19.2.18 |
| @types/react-dom | ^19.2.7 |
| @vitejs/plugin-react | ^6.1.1 |
| eslint | ^10.10.0 |
| eslint-plugin-react-hooks | ^7.1.1 |
| eslint-plugin-react-refresh | ^0.5.6 |
| globals | ^17.12.0 |
| vite | ^8.3.0 |

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
