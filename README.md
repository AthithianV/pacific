# Pacific - E Commerce API

## Steps to Set Up Locally

1. Clone the Repository.
2. Change Directory to Project `cd pacific`.
3. Install Packages `npm install`.
4. Build the Project `npm run build`.
5. Start the application `npm start`.

<span style="color:red">**Note: Before starting application, make sure database set up is completed.**</span>

## Database Set up

### Create Batabase and Set up User

Run the following command on Mysql Workbench or Mysql Shell.

```sql
CREATE DATABASE IF NOT EXISTS pacific;
CREATE USER '<new_username>'@'localhost' IDENTIFIED BY '<password_desired>';
GRANT ALL PRIVILEGES ON pacific.* TO '<new_username>'@'localhost';
```

### Create Env File

```env
DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_NAME="pacific"
DATABASE_USER="<new_username>"
DATABASE_PASS="<password_desired>"

SECRET_KEY="YOUR_SECRET_KEY"
```

<span style="color:red">**Note: The DATABASE_USER and DATABASE_PASS in .env file must match with the username and password created during database creation.**</span>

### Generate and Migrate Tables

In the project root directory run following command:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### After Migration

Run the following command on Mysql Workbench or Mysql Shell.

```sql
USE pacific;
INSERT IGNORE INTO roles (name) VALUES ('ADMIN'), ('STAFF'), ('VENDOR'), ('USER');
INSERT
INTO users (username, email, password, role_id)
VALUES (
    "superadmin",
    "admin@pacific.com",
    "$2b$12$CiwXadSCtZR1VVDR4WK9heN5puDQudSDGWVyqrnR2o7E6r455JBdu",
    (SELECT id FROM roles WHERE name="ADMIN")
);
```

[Assessment Link](https://workdrive.zohopublic.in/external/62c8876bc4894fe2f4dc8862c021bbb86bd1a6db08765d518926ef7d80cb82a3?layout=list)
