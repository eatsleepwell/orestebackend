# Criteria API Spec

## Add Criteria API

Endpoint : POST /api/criteria

Headers :

- Authorization : token

Request Body :

```json
{
  "criteria_name": "disiplin",
  "criteria_code": "C1"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "criteria_name": "disiplin"
  }
}
```

Response Body Error :

```json
{
  "errors": "Kriteria tidak boleh sama"
}
```

## Update Criteria API

Endpoint : PUT /api/criteria/:id

Headers :

- Authorization : token

Request Body :

```json
{
  "criteria_name": "Kedisiplinan"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "criteria_name": "Kedisiplinan",
    "criteria_code": "C1"
  }
}
```

Response Body Error :

```json
{
  "errors": "Kriteria tidak boleh sama"
}
```

## GET Criteria API

Endpoint : GET /api/criteria

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
      "criteria_name": "Kedisiplinan",
      "criteria_code": "C1"
    },
    {
      "id": 2,
      "criteria_name": "Tanggung Jawab",
      "criteria_code": "C2"
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
  "errors": "Kriteria tidak dapat ditemukan"
}
```

## Remove Criteria API

Endpoint : DELETE /api/criteria/:id

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
  "errors": "Kriteria tidak dapat ditemukan"
}
```
