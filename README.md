
## Project setup

1. Replace `app-name` with your real app name

1. Install NodeJS (above the 10.17 version is recommended, edit .nvmrc and package.json if yoy want to use different version)
https://nodejs.org/en/download/package-manager/
or via NVM

1. Install PostgreSQL https://www.postgresql.org/download/
and create `app-name` database

1. Open terminal in a current directory and put commands here
    ```bash
    npm install -g yarn
    yarn install
    ```

1. Now you are able to start development with `yarn dev`


## Available Scripts

In the project directory, you can run:

### `yarn install`
Will setup all dependencies for front-end and back-enf


### `yarn dev`

Runs the app in the development mode.<br>

The api will reload if you make edits.

### `yarn migrate`
Apply migration

### `yarn migrate`
Apply migration locally


### `yarn prod:start`
First time starting production process using pm2

### `yarn prod:restart`
Restart production process using pm2

### `yarn prod:migrate`
Apply migration locally on production


### `yarn lint`
Verify code style
    
### `yarn lint:fix`
Verify code style with autofixing. Also will be runned automatically on every commit


## Development

### Code verification
Enable Eslint and Prettier support in your IDE.

### Model generation
```bash
npx sequelize model:create --name User --attributes name:string,email:string
```

### Migration generation
```bash
npx sequelize migration:generate --name add-password-to-user
```

run `npx sequelize --help` to see more commands
