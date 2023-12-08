# Result API Spec

## GET Alternative Data API

Endpoint : GET /api/result/alternative-data

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
      "alternative_name": "Alternatif 1",
      "alternative_score": [
        {
          "criteria_code": "C1",
          "score": 90
        },
        {
          "criteria_code": "C2",
          "score": 80
        },
        {
          "criteria_code": "C3",
          "score": 80
        },
        {
          "criteria_code": "C4",
          "score": 50
        },
        {
          "criteria_code": "C5",
          "score": 70
        }
      ]
    },
    {
      "id": 2,
      "alternative_name": "Alternatif 2",
      "alternative_score": [
        {
          "criteria_code": "C1",
          "score": 90
        },
        {
          "criteria_code": "C2",
          "score": 80
        },
        {
          "criteria_code": "C3",
          "score": 80
        },
        {
          "criteria_code": "C4",
          "score": 50
        },
        {
          "criteria_code": "C5",
          "score": 70
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
  "errors": "Data Alternatif tidak dapat ditemukan"
}
```

## GET Criteria Weight API

Endpoint : GET /api/result/criteria-weight

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
      "criteria_code": "C1",
      "criteria_weight": [
        {
          "id": 1,
          "alternative_name": "Alternatif 1",
          "alternative_score": 90,
          "rank": 1
        },
        {
          "id": 2,
          "alternative_name": "Alternatif 2",
          "alternative_score": 80,
          "rank": 2
        }
      ]
    },
    {
      "criteria_code": "C2",
      "criteria_weight": [
        {
          "id": 1,
          "alternative_name": "Alternatif 1",
          "alternative_score": 90,
          "rank": 1
        },
        {
          "id": 2,
          "alternative_name": "Alternatif 2",
          "alternative_score": 80,
          "rank": 2
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
  "errors": "Bobot Kriteria tidak dapat ditemukan"
}
```

## GET Distance Score API

Endpoint : GET /api/result/distance-score

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
      "alternative_name": "Alternatif 1",
      "alternative_score": [
        {
          "criteria_code": "C1",
          "distance_score": 3000
        },
        {
          "criteria_code": "C2",
          "distance_score": 4000
        },
        {
          "criteria_code": "C3",
          "distance_score": 5000
        },
        {
          "criteria_code": "C4",
          "distance_score": 1000
        },
        {
          "criteria_code": "C5",
          "distance_score": 2000
        }
      ]
    },
    {
      "id": 2,
      "alternative_name": "Alternatif 2",
      "alternative_score": [
        {
          "criteria_code": "C1",
          "distance_score": 3000
        },
        {
          "criteria_code": "C2",
          "distance_score": 4000
        },
        {
          "criteria_code": "C3",
          "distance_score": 5000
        },
        {
          "criteria_code": "C4",
          "distance_score": 1000
        },
        {
          "criteria_code": "C5",
          "distance_score": 2000
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
  "errors": "Distance Score tidak dapat ditemukan"
}
```

## GET Distance Score Accumulation API

Endpoint : GET /api/result/distance-score/accumulation

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
      "alternative_name": "Alternatif 1",
      "distance_score": 2
    },
    {
      "id": 2,
      "alternative_name": "Alternatif 2",
      "distance_score": 5000
    },
    {
      "id": 3,
      "alternative_name": "Alternatif 3",
      "distance_score": 14000
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
  "errors": "Akumulasi Distance Score tidak dapat ditemukan"
}
```

## GET Oreste Result API

Endpoint : GET /api/result/oreste-result

Headers :

- Authorization : token

Query params :

- name : result name

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "alternative_name": "Alternatif 1",
      "rank": 2
    },
    {
      "id": 2,
      "alternative_name": "Alternatif 2",
      "rank": 3
    },
    {
      "id": 3,
      "alternative_name": "Alternatif 3",
      "rank": 1
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
  "errors": "Rank tidak dapat ditemukan"
}
```

## GET Results API

Endpoint : GET /api/result

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
      "result_name": "Hasil 1"
    },
    {
      "id": 2,
      "result_name": "Hasil 2",
      "rank": 3
    },
    {
      "id": 3,
      "result_name": "Hasil 3",
      "rank": 1
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
  "errors": "Hasil tidak dapat ditemukan"
}
```

## GET Result API

Endpoint : GET /api/result/:id

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
      "alternative_name": "Alternatif 1",
      "rank": 2
    },
    {
      "id": 2,
      "alternative_name": "Alternatif 2",
      "rank": 3
    },
    {
      "id": 3,
      "alternative_name": "Alternatif 3",
      "rank": 1
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
  "errors": "Hasil tidak dapat ditemukan"
}
```

## GET Result Download API

Endpoint : GET /api/result/download/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "alternative_name": "Alternatif 1",
      "rank": 2
    },
    {
      "id": 2,
      "alternative_name": "Alternatif 2",
      "rank": 3
    },
    {
      "id": 3,
      "alternative_name": "Alternatif 3",
      "rank": 1
    }
  ]
}
```

Response Body Error :

```json
{
  "errors": "Hasil tidak dapat ditemukan"
}
```
