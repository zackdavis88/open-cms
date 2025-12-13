# Open CMS

A JSON CMS system that will allow you to:

1. Create `Blueprints` - Structure of a Component.
2. Create `Components` - Content that will fit a Blueprint's structure.
3. Create `Layouts` - Ordered groups of Components.

### Run Instructions

1. Install node_modules

```bash
npm install
```

2. Create an .env file at the root of the repository, you can use [.env.example](https://github.com/zackdavis88/open-cms/blob/dev/.env.example) as a base.
   **Make sure that you replace DATABASE values with your database instance's info.**

```bash
AUTH_SECRET=YOUR_AUTH_SECRET
AUTH_TOKEN_EXPIRATION=36000
DATABASE_USERNAME=YOUR_DATABASE_USERNAME
DATABASE_PASSWORD=YOUR_DATABASE_PASSWORD
DATABASE_HOSTNAME=YOUR_DATABASE_HOSTNAME
DATABASE_PORT=YOUR_DATABASE_PORT
DATABASE_NAME=YOUR_DATABASE_NAME
SALT_ROUNDS=10
SERVER_PORT=3000
```

3. Run the app with one of the following commands:

```bash
# Development: Uses node to watch files auto-reload if any changes are made.
npm run start:dev

# Production mode: Builds the app and runs the production-ready javascript.
npm run start:prod
```

After starting the app you should be able to start sending requests to the server at: `http://localhost:3000`

**_Note:_** The URL above assumes you are using the default SERVER_PORT config value of 3000.

### HTTPS Setup (Optional)

During development it may be useful to serve the API over HTTPS.

1. Update your `/etc/hosts` file. Add a new entry for

```
127.0.0.1 www.open-cms.com open-cms.com
```

2. Generate a self-signed certificate.

```bash
openssl req -x509 -days 364 -out www.open-cms.com.crt -keyout www.open-cms.com.key \
-newkey rsa:2048 -nodes -sha256 \
-subj "/CN=www.open-cms.com" -extensions EXT -config <( \printf "[dn]
\nCN=www.open-cms.com\n[req]\ndistinguished_name = dn\n[EXT]
\nsubjectAltName=DNS:*.open-cms.com,DNS:open-cms.com
\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

3. Install [nginx](https://nginx.org/en/docs/install.html) and add a config

```
server {
    listen 80;
    server_name open-cms.com www.open-cms.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    listen 443 ssl;
    ssl_certificate /path/to/www.open-cms.com.crt;
    ssl_certificate_key /path/to/www.open-cms.com.key;
}
```

**_Note:_** Ensure the `proxy_pass` value uses the correct port value, this example assumes port 3000.

**_Note:_** Ensure the `ssl_certificate` and `ssl_certificate_key` value has the correct path to your self-signed certificate.

**_Note:_** Restart nginx after adding this config.

After completing these steps you should be able to start sending requests to the server at: `https://www.open-cms.com` or `https://open-cms.com`


### API Documentation
Open CMS uses OpenAPI specs for endpoint documentation. You can access this data in a couple of ways:

* The discovery endpoint can be called at `GET /api/discovery`. This will return OpenAPI specs in JSON format for the Open CMS API.
* SwaggerUI can be reached by opening https://www.open-cms.com/docs or http://localhost:3000/docs.
<img width="1577" height="763" alt="image" src="https://github.com/user-attachments/assets/131e289b-373b-4440-bb55-49142eb43c0c" />
