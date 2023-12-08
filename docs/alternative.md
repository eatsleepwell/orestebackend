# Alternative API Spec

## Add Alternative API

Endpoint : POST /api/alternative

Headers :

- Authorization : token

Request Body :

```json
{
  "alternative_name": "alternatif 1"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "alternative_name": "alternative 1"
  }
}
```

Response Body Error :

```json
{
  "errors": "Alternative tidak boleh sama"
}
```

## Update Alternative API

Endpoint : PUT /api/alternative/:id

Headers :

- Authorization : token

Request Body :

```json
{
  "alternative_name": "Alternative Baru"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "criteria_name": "Alternative Baru"
  }
}
```

Response Body Error :

```json
{
  "errors": "Alternative tidak boleh sama"
}
```

## GET Alternative API

Endpoint : GET /api/alternative

Headers :

- Authorization : token

Query params :

- page : number of page, default 1
- size : size per page, default 5

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "alternative_name": "Alternative 1"
    },
    {
      "id": 2,
      "alternative_name": "Alternative 2"
    }
  ],
  "pagging": {
    "page": 1,
    "total_page": 3,
    "total_item": 15
  }
}
```

Response Body Error :

```json
{
  "errors": "Alternative tidak dapat ditemukan"
}
```

## Remove Alternative API

Endpoint : DELETE /api/alternative/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "Deleted"
}
```

Response Body Error :

```json
{
  "errors": "Alternative tidak dapat ditemukan"
}
```
