# 🟢 Express Sequelize JWT Template

The **Express Sequelize JWT Template** provides a ready-to-use setup for developing an Express.js application integrated with Sequelize for database operations and JWT (JSON Web Tokens) authentication. With this template, you can kickstart your web application development quickly.

## 🛠 Installation

To set up the Express Sequelize JWT template on your local machine, follow these steps:

### 1. **Repository Setup**

- **Clone the Repository:**
  ```bash
  git clone https://github.com/springs-dev/express-sequelize-jwt-template
  cd express-sequelize-jwt-template
  ```

### 2. **Dependencies Installation**

- Ensure that all required packages are installed for smooth operation:
  ```bash
  yarn install
  ```

### 3. **Environment Configuration**

- **Set Up Environment Variables**: Duplicate the example environment file and customize it according to your requirements:
  ```bash
  cp .env.local.example .env.local
  ```
- Edit the `.env.local` file to match your local environment settings, including database connection strings, JWT secrets, and other necessary configuration variables.

### 4. **Database Preparation**

- If you've chosen PostgreSQL as your database:

  - Make sure PostgreSQL is installed:
    ```bash
    sudo apt install postgresql postgresql-contrib
    ```
  - Create a PostgreSQL user and a corresponding database for your project. Replace `"some-username"` and `"server-name"` with your desired names:
    ```bash
    sudo -u postgres createuser "some-username" --superuser --pwprompt
    sudo -u postgres createdb -O "some-username" "server-name"
    ```

### 5. **Switching to MySQL (Optional)**

- If you prefer to use MySQL instead of PostgreSQL:
  - Update the dialect and port in the `.env.local` configuration file to reflect MySQL settings.
  - Adjust package dependencies accordingly:
    ```bash
    yarn remove pg
    yarn add mysql2
    ```

### 6. **Migrations and Seeding**

- With the database set up, implement the schema and seed initial data (if available):
  ```bash
  yarn db:migrate:up
  ```

### 7. **Kickstart Development**

- Launch the development server:
  ```bash
  yarn start:dev
  ```
- By default, your API endpoints will be available at `http://localhost:3001/api`, and the Swagger documentation can be accessed at `http://localhost:3001/api-docs`.

You are now ready to start building with the Express Sequelize JWT template! 🚀

## 📂 Project Structure

Here's an overview of the project structure:

- **.husky**: Configuration and scripts for Git hooks.
- **.\_generators**: Contains generator scripts.
- **docs**: Documentation and related files.
- **public**: Stores static assets for the web server.
- **src**: The main application source code.
  - **configs**: Configuration files for the application.
  - **libs**: Utility libraries.
  - **middlewares**: Middleware setup.
  - **migrations**: Sequelize migration scripts.
  - **models**: Definitions of data models.
  - **routes**: Definitions of API endpoints and core business logic.
  - **seeders**: Scripts for seeding the database.
  - **services**: Common business logic.
  - **utils**: Utility functions.
- **Root Level Config & Scripts**: Configuration files such as `.editorconfig` and `.eslintrc.json`, along with scripts like `erd.js` and `sequelize-manager.js`.

### ⚙️ Generators

Generators are tools or scripts that help automate repetitive tasks in your development workflow. They can speed up development and reduce errors. In this project, several generators are available to assist you:

#### Scaffold Generation

Scaffold generation is one of the most efficient ways to create code components like models, migrations, routes, and Swagger annotations. You can use the `yarn generate:scaffold` command to generate scaffolds for your application. Here are some examples:

- Create a User model with name and email attributes:

  ```bash
  yarn generate:scaffold User "name:string email:string(50)"
  ```

- Create a User model with an array of names:

  ```bash
  yarn generate:scaffol User "names:array(string)"
  ```

- Create a User model with an array of strings (another syntax):
  ```bash
  yarn generate:scaffol User "names:[string]"
  ```

You can explore all supported data types for attributes at [Sequelize Data Types](https://sequelize.org/v5/manual/data-types.html). If you need to make changes in the scaffold templates, you can edit the `.ejs` files located in the `./_generators/templates/` directory.

#### Model Generation

You can generate a Sequelize model using the `yarn model` command. For example, to create a User model with name and email attributes:

```bash
yarn generate:model User "name:string email:string"
```

#### Empty Migration Generation

To create an empty migration script, you can use the `yarn migration` command. For instance, to add a password column to the User table:

```bash
yarn generate:migration add-password-to-user
```

#### Add Column Migration Generation

To generate a migration that adds columns to an existing model, you can use the `yarn addColumnsMigration` command. For example, to add name and email columns to the User model:

```bash
yarn generate:migration:add-columns User "name:string email:string(50)"
```

#### Empty Seed Generation

Seeding involves populating your database with initial data. To create an empty seed file, use the `yarn seed` command. For example, to add roles:

```bash
yarn generate:seed add-roles
```

By utilizing these generators and commands, you can streamline your development process, reduce manual work, and ensure consistency in your Node.js application.

## ▶️ Available Scripts

This project includes various scripts in your `package.json` for different purposes:

### 🚀 Starting the Application

- `start`: Launches the application in production mode.
- `start:dev`: Starts the server in development mode with hot-reloads.

### 🗄 Database Scripts

- `db:migrate:up`: Runs migrations and seeds locally.
- `db:migrate:undo`: Rolls back the last migration locally.
- `db:seed:up`: Populates the database using seeders.
- `db:seed:undo`: Rolls back the last seeding operation.
- `db:erd`: Generates a database schema in ERD (Entity-Relationship Diagram) format.

### 🛠 Generators

- `generate:migration`: Initializes a new migration file.
- `generate:migration:add-columns`: Generates a migration to add columns.
- `generate:seed`: Creates a new seeding file.
- `generate:model`: Creates a new Sequelize model.
- `generate:scaffold`: Creates a model, migration, routes, and Swagger annotations

### 🚧 Stage and Production

- `stage`: Sets up the staging environment.
- `stage:start`: Starts the application in staging.
- `stage:restart`: Restarts the staging application.
- `stage:delete`: Deletes the staging application process.
- `prod`: Sets up the production environment.
- `prod:start`: Starts the application in production.
- `prod:restart`: Restarts the production application.
- `prod:delete`: Deletes the production application process.
- `prod:migrate`: Applies migrations and seeds on the production environment.

### 📜 Code Quality and Checks

- `lint`: Checks code syntax and style using ESLint.
- `lint:fix`: Automatically fixes syntax errors and code style using ESLint.
- `prettier:fix`: Automatically formats code using Prettier.
- `prepare`: Sets up Git Hooks using Husky.
- `depcheck`: Analyzes project dependencies.

## 🔐 Security

Ensuring the security of your application is paramount. Here are some best practices and recommendations to maintain your app's integrity:

### 🔑 Credentials Management

- **Avoid Storing Production Credentials in .env or Repository**: Always use environment-specific configuration or secret management tools to store sensitive information. Avoid checking in secrets or credentials into your source control.

### 🛡️ SQL Injection Protection

- **Protect from Raw SQL Injections**: When executing raw SQL queries using an ORM, always use placeholders or parameterized queries to protect against SQL injections. Sequelize, for instance, provides the `replacements` option for this purpose. For more information, refer to the [Sequelize documentation](https://sequelize.org/master/manual/raw-queries.html).

### 📂 File Uploads

- **Validate MIME Types**: When accepting file uploads, always validate the MIME type to ensure only valid file types are processed. This can prevent potential security vulnerabilities or unwanted files.
- **Use Hashes for Filenames**: To prevent potential enumeration attacks or unwanted exposure, save uploaded files using a hash or UUID as the filename instead of the original name. Refer to the [Multer documentation](https://github.com/expressjs/multer#diskstorage) for more details.

### 🌐 CORS and Headers

- **Define CORS Policies**: Ensure that your CORS settings are strict and allow requests only from trusted origins, especially if you're dealing with sensitive data or operations.
- **Use Security Headers**: Libraries like [Helmet](https://helmetjs.github.io/) can help set various HTTP headers to secure your application.

### 🧪 Regularly Update Dependencies

- **Patch Vulnerabilities**: Frequently check and update your application dependencies to patch potential vulnerabilities. Tools like `yarn audit`

or `npm audit` can be helpful.

Certainly, it seems like you want to replace the section about "Express-Validator" with "Express-OAS-Validator." Here's how it can be restructured:

---

## 📜 Data Validations

Validating the data your application processes is crucial for security and data integrity. Here's how to approach data validation within your application:

### ✅ Sequelize Model Validations

Most data validation requirements can be satisfied directly within your Sequelize models:

- **Built-in Validations**: Sequelize provides a set of built-in validators. For instance, you can specify if a string field must be an email or a certain length.

- **Custom Validators**: Beyond the built-in validators, Sequelize allows you to define custom validation methods to run more complex checks on your data.

- **Constraints**: Apart from basic validations, Sequelize lets you set constraints like `unique` or `notNull`, which can further ensure data integrity at the database level.

For a detailed overview of how to use these validations and constraints, refer to the [Sequelize Documentation](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/).

### 🔍 Express Route Validations

For route-level data validation, we recommend:

- **Express-Validator**: [Express-Validator](https://express-validator.github.io/docs) is a set of Express.js middlewares that wraps validator.js validator and sanitizer functions. It allows you to validate data as it comes in through your Express routes before handling them in your application logic.

- **Yup Middleware with express-yup-middleware**: For developers who prefer declarative schema validation, `express-yup-middleware` provides a seamless integration with Express.js, enabling you to validate request objects using Yup schemas. Check out the [express-yup-middleware](https://www.npmjs.com/package/express-yup-middleware) for usage and setup.

- **Joi Validation with express-joi-validation**: Joi offers a rich set of data types and validation logic. With `express-joi-validation`, you can create Joi validation schemas to validate request data robustly. It's a great fit for complex validation requirements. Explore the [express-joi-validation](https://www.npmjs.com/package/express-joi-validation) package for more details.

Using tools like Express-Validator, you can set up middleware functions that validate request data and return errors to the client if the data doesn't meet the specified criteria.

### 📚️ Best Practices

- **Comprehensive Error Handling**: Ensure your validation provides clear error messages that can be relayed to the client. This helps users understand any mistakes in their input without revealing too much about the internal workings of your application.

- **Consistent Validations**: Ensure that validations are consistent across all platforms and interfaces of your application, be it web, mobile, or API endpoints.

---
