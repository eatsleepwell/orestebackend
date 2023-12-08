# User API Spec

## Register User API

Endpoint: POST /api/users

Request Body :

```json
{
  "username": "rizky",
  "password": "rahasia",
  "confirmPassword": "rahasia",
  "name": "Rizky Darmawan"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "rizky",
    "name": "Rizky Darmawan"
  },
  "message": "Registrasi berhasil"
}
```

Response Body Error :

```json
{
  "errors": "Username telah terdaftar"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "rizky",
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "rizky",
    "name": "rizky darmawan",
    "token": "unique-token"
  },
  "message": "Login berhasil"
}
```

Response Body Errpr :

```json
{
  "errors": "username atau password salah"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "Logout berhasil"
}
```

Response Body Error :

```json
{
  "errors": "belum login"
}
```
