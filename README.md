# Open CMS

An open-source JSON CMS system.

## Getting Started

The [Getting Started](https://github.com/zackdavis88/open-cms/wiki/Getting-Started-%E2%80%90-Debian) wiki page has instructions on how to setup your local environment and run the application.

## Test Suite

Integration tests have been created for each endpoint to ensure that they are working as expected. To run the integration test suite you will need to first start the application, refer to the Getting Started wiki page.

After the app is running, run the test suite with the following command

```bash
npm run test
```

## API Documentation

Open CMS uses OpenAPI specs for endpoint documentation. After starting the application, you can access this data in a couple of ways:

- The discovery endpoint can be called at `GET /api/discovery`. This will return OpenAPI specs in JSON format which can be useful for clients that want to generate their requests/types.
- SwaggerUI can be reached by opening http://localhost:3000/docs and/or https://www.open-cms.com/docs depending on how are running the application locally.
