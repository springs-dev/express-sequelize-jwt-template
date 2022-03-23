
## Project setup

1. Replace `app-name` with your real app name

1. Install NodeJS (above the 12.22 version is recommended, edit .nvmrc and package.json if yoy want to use different version)
https://nodejs.org/en/download/package-manager/
or via NVM

1. Install PostgreSQL https://www.postgresql.org/download/
    ```bash
    sudo apt install postgresql postgresql-contrib
    ```
    and create or use existed user and create `app-name` database
    ```bash
    sudo -u postgres createuser "some-username" --superuser --pwprompt
    sudo -u postgres createdb -O "some-username" app-name
    ```

1. Copy `.env` to `.env.local` and put the right values to copied file
    ```bash
    cp .env .env.local
    nano .env.local
    ```
1. Go through all the folders and files to remove unused or uncomment code parts

1. Open terminal in a current directory and put commands here
    ```bash
    npm install -g yarn yo
    
    yarn install
    yarn migrate
    ```

1. Now you are able to start development with `yarn dev`\
With default configuration your api will be available at http://localhost:3001/api and swagger documentation at http://localhost:3001/api-docs


## Development

### Code verification
Choose your NodeJS version and enable ESlint and Prettier support in your IDE.

### Generators
You can use generators to speed-up development.

#### Scaffold generation
Most efficient. Will create model, migration, routes and swagger annotations.
```bash
yarn scaffold User "name:string email:string(50)"
yarn scaffold User "names:array(string)"
yarn scaffold User "names:[string]"
```
All supported data types you can find at https://sequelize.org/v5/manual/data-types.html
Edit `./_templates/*.js.ejs` files in case you will need to make changes in the templates.\

#### Model generation
```bash
yarn model User --attributes name:string,email:string
```

#### Migration generation
```bash
yarn migration add-password-to-user
```

#### Seed generation
```bash
yarn seed add-roles
```

run `npx sequelize --help` to see more commands


## Available Scripts

### Development

#### `yarn install`
Will setup all dependencies for front-end and back-enf

#### `yarn migrate`
Apply migrations and seeds locally

#### `yarn dev`
Runs the app in the development mode.\
The api will reload if you make edits.

#### `yarn migrate:undo`
Undo last migration locally

#### `yarn seed:undo`
Undo last seed locally


### Production

#### `yarn prod`
Start or restart production process using pm2

#### `yarn prod:start`
First time starting production process using pm2

#### `yarn prod:restart`
Restart production process using pm2

#### `yarn prod:delete`
Kill production process using pm2 

#### `yarn prod:migrate`
Apply migrations and seeds on production


### Code quality

#### `yarn lint`
Verify code style
    
#### `yarn lint:fix`
Verify code style with autofixing.\
Also will be runned automatically on every commit.


### DB switching
To switch to MySQL, you need to use `mysql` dialect and port in configuration `/config/db.js` and run `yarn remove pg && yarn add mysql2`


### Security
- do not save any production credentials/keys in .env and repository
- protect raw SQL queries in ORM from injections with passing **replacements** https://sequelize.org/master/manual/raw-queries.html
- validate mime-type using **fileFilter** and use hashes instead of names on upload https://github.com/expressjs/multer#diskstorage
