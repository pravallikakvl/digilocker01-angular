# Database Setup Instructions

## CockroachDB Connection Details
- **Host:** 102.210.148.206
- **Port:** 26257
- **Database:** kemis_db
- **Username:** root
- **Password:** (no password)

## Step 1: Create the Users Table

Connect to your CockroachDB database and run the SQL script in `create_users_table.sql`:

```bash
cockroach sql --host=102.210.148.206:26257 --database=kemis_db --user=root --insecure < create_users_table.sql
```

Or manually execute the SQL commands in your CockroachDB console.

## Step 2: Verify Table Creation

```sql
SHOW TABLES;
SELECT * FROM users;
```

## Step 3: Test the API

Once the table is created, the API endpoints will work:

- **Test Connection:** GET http://localhost:5159/api/auth/test-connection
- **Get Users:** GET http://localhost:5159/api/auth/users
- **Login:** POST http://localhost:5159/api/auth/login
- **Register:** POST http://localhost:5159/api/auth/register

## Troubleshooting

If you get connection errors:
1. Check if the CockroachDB server is running
2. Verify the IP address and port are correct
3. Ensure the `kemis_db` database exists
4. Check firewall settings allow connection to port 26257
