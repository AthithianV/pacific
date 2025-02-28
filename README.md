# Pacific - E Commerce API

### SQL for Creating Database and User

```sql
CREATE DATABASE IF NOT EXISTS pacific;
CREATE USER 'pacific_sql_user'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON pacific.* TO 'pacific_sql_user'@'localhost';
```

### After Migration

```sql
USE pacific;
INSERT INTO roles (name) VALUES ('ADMIN'), ('STAFF'), ('VENDOR'), ('USER');
```

[Assessment Link](https://workdrive.zohopublic.in/external/62c8876bc4894fe2f4dc8862c021bbb86bd1a6db08765d518926ef7d80cb82a3?layout=list)
