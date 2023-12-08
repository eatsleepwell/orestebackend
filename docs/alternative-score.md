# Alternative Score API Spec

## Add Alternative Score API

Endpoint : POST /api/alternative-score/:alternativeId

Headers :

- Authorization : token

Request Body :

```json
{
  "data": [
    {
      "criteria_name": "Kedisiplinan",
      "criteria_code": "C1",
      "score": 90
    },
    {
      "criteria_name": "Tanggung Jawab",
      "criteria_code": "C2",
      "score": 90
    },
    {
      "criteria_name": "Etos Kerja",
      "criteria_code": "C3",
      "score": 90
    },
    {
      "criteria_name": "Komunikasi",
      "criteria_code": "C4",
      "score": 90
    },
    {
      "criteria_name": "Hubungan dengan siswa",
      "criteria_code": "C5",
      "score": 90
    }
  ]
}
```

Response Body Success :

```json
{
  "data": "Skor Berhasil ditambahkan"
}
```

Response Body Error :

```json
{
  "errors": "Skor tidak boleh kosong"
}
```

## Update Alternative API

Endpoint : PUT /api/alternative-score/:alternativeId

Headers :

- Authorization : token

Request Body :

```json
{
  "data": [
    {
      "id": 96,
      "criteria_name": "Kedisiplinan",
      "criteria_code": "C1",
      "score": 50
    },
    {
      "id": 97,
      "criteria_name": "Tanggung Jawab",
      "criteria_code": "C2",
      "score": 70
    },
    {
      "id": 98,
      "criteria_name": "Etos Kerja",
      "criteria_code": "C3",
      "score": 50
    },
    {
      "id": 99,
      "criteria_name": "Komunikasi",
      "criteria_code": "C4",
      "score": 70
    },
    {
      "id": 100,
      "criteria_name": "Hubungan dengan siswa",
      "criteria_code": "C5",
      "score": 50
    }
  ]
}
```

Response Body Success :

```json
{
  "data": "Skor Berhasil Diubah"
}
```

Response Body Error :

```json
{
  "errors": "Skor tidak boleh kosong"
}
```

## GET Alternative Score API

Endpoint : GET /api/alternative-score/id

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
      "criteria_name": "Kedisiplinan",
      "criteria_code": "C1",
      "score": 70
    },
    {
      "criteria_name": "Tanggung Jawab",
      "criteria_code": "C2",
      "score": 90
    },
    {
      "criteria_name": "Etos Kerja",
      "criteria_code": "C3",
      "score": 50
    },
    {
      "criteria_name": "Komunikasi",
      "criteria_code": "C4",
      "score": 70
    },
    {
      "criteria_name": "Hubungan dengan siswa",
      "criteria_code": "C5",
      "score": 80
    }
  ]
}
```

Response Body Error :

```json
{
  "errors": "Alternative-score tidak dapat ditemukan"
}
```
