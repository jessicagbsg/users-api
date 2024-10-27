# Users Api
This is a simple api to create, read, update and delete users.

# Instructions 
## Running the project

To run the project and use it you have to:

1. clone the project and open in your prefered editor
2. copy the `env.example` rename it to `.env`, fill in the PORT and DB_STORAGE with your prefered values, eg:
```
PORT=3000
DB_STORAGE="./database.sqlite"
```
3. run `npm i` and then `npm run dev`.

## Database configuration
Once the project is running a sqlite file will be created in the path you set for the DB_STORAGE. 

## Running tests
To run the tests you just have to go to the project's directory through terminal and run `npm run test`.

# Available Endpoints 

* POST - {base_url}/api/users/create - create users
```
payload example:

{
  "name": "John Doe",
  "email": "john@email.com",
  "age": 88, // optional
  "active": true // optional
}

validations:
  1. the name can not be less than 3 characters long (this will throw a validation error).
  2. the email must be a valid email, see exemple above, otherwise, this will throw a validation error. 
```
  
* GET - {base_url}/api/users?{filters} - find all users
```
only not deleted users will be returned in this endpoint.

available filters: name, email, age, minAge, maxAge

the filters can be passed together or alone, with the following valdations:
  1. if the age filter id present, the min and max age should not be passed (this will throw an error).
  2. if the min and max age are present, the min age can not be higher than the max age (this will throw an error).
  3. both min and max age can not be lower than 0 (this will also throw an error).
```

* GET - {base_url}/api/users/:id - find one user
```
only not deleted users will be returned in this endpoint.
```

* PUT - {base_url}/api/users/:id - update one user
```
same payload as create users but all fields are optional.

payload example:

{
  "name": "John Doe", 
  "email": "john@email.com",
  "age": 88,
  "active": true
}
```

* DELETE - {base_url}/api/users/:id - delete one user
```
Following best practices, the users are being soft deleted, therefore
the column "deletedAt" is being updated with the current timestamp.
```

# Documentation

To check the documentation of this project download the collection bellow and import into postman.

[Uploading Users API.postman_collection.json…]()

# Tools Used

* ``Node.js``
* ``Express.js``
* ``TypeScript`` 
* ``SQLite3``
* ``Sequelize``
* ``Jest``
* ``Zod``
* ``Faker``
* ``Fishery``
  
# Author
LinkedIn:
https://www.linkedin.com/in/jessicagondim/

E-mail:
jessicagbsg@gmail.com
