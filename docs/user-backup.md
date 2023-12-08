# User API Spec

## Register User API

Endpoint: POST /api/users

Request Body :

```json
{
  "username": "rzky",
  "password": "rahasia",
  "name": "Rizky Darmawan"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "rzky",
    "name": "Rizky Darmawan"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "rzky",
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Errpr :

```json
{
  "errors": "username or password wrong"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

Request Body :

```json
{
  "name": "Rizky Darmawan", // optional
  "password": "new password" // optional
}
```

Response Body Success :

```json
{
  "data": {
    "username": "rzky",
    "name": "Rizky Darmawan"
  }
}
```

Response Body Error :

```json
{
  "errors": "max length name 100"
}
```

## Get User API

Endpoint : GET /api/users/current

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "username": "rzky",
    "name": "Rizky Darmawan"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```
