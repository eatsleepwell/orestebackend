# Sub Criteria API Spec

## Add Sub Criteria API

Endpoint : POST /api/criteria/:criteriaId/sub-criteria

Headers :

- Authorization : token

Request Body :

```json
{
  "sub_criteria_name": "Konsisten",
  "sub_criteria_score": 90
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "sub_criteria_name": "Konsisten",
    "sub_criteria_score": 90
  }
}
```

Response Body Error :

```json
{
  "errors": "Sub Kriteria tidak boleh sama"
}
```

## Update Sub Criteria API

Endpoint : PUT /api/criteria/:criteriaId/sub-criteria/:id

Headers :

- Authorization : token

Request Body :

```json
{
  "sub_criteria_name": "Konsisten",
  "sub_criteria_score": 90
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "sub_criteria_name": "Konsisten",
    "sub_criteria_score": 90
  }
}
```

Response Body Error :

```json
{
  "errors": "Sub Kriteria tidak boleh sama"
}
```

## GET List Sub Criteria API

Endpoint : GET /api/sub-criteria/:criteriaId

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
      "criteria_code": "C1",
      "sub_criteria": [
        {
          "id": 1,
          "sub_criteria_name": "Konsisten",
          "sub_criteria_score": 90
        },
        {
          "id": 2,
          "sub_criteria_name": "Teratur",
          "sub_criteria_score": 80
        },
        {
          "id": 3,
          "sub_criteria_name": "Cukup",
          "sub_criteria_score": 70
        },
        {
          "id": 4,
          "sub_criteria_name": "Kurang",
          "sub_criteria_score": 50
        },
        {
          "id": 5,
          "sub_criteria_name": "Tidak Disiplin",
          "sub_criteria_score": 20
        }
      ]
    },
    {
      "id": 2,
      "criteria_name": "Tanggung Jawab",
      "criteria_code": "C2",
      "sub_criteria": [
        {
          "id": 1,
          "sub_criteria_name": "Bertanggung Jawab",
          "sub_criteria_score": 90
        },
        {
          "id": 2,
          "sub_criteria_name": "Andal",
          "sub_criteria_score": 80
        },
        {
          "id": 3,
          "sub_criteria_name": "Memadai",
          "sub_criteria_score": 70
        },
        {
          "id": 4,
          "sub_criteria_name": "Kurang Bertanggung Jawab",
          "sub_criteria_score": 50
        },
        {
          "id": 5,
          "sub_criteria_name": "Tidak Bertanggung Jawab",
          "sub_criteria_score": 20
        }
      ]
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

## Remove Sub Criteria API

Endpoint : DELETE /api/criteria/:criteriaId/sub-criteria/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "Sub Criteria telah dihapus"
}
```

Response Body Error :

```json
{
  "errors": "Sub Criteria tidak dapat ditemukan"
}
```
