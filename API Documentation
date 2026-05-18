## API Documentation

## API Endpoints

### Authentication

* POST /api/auth/register
* POST /api/auth/login

### Leads

* GET /api/leads
* POST /api/leads
* GET /api/leads/:id
* PUT /api/leads/:id
* DELETE /api/leads/:id

---

### Authentication

#### Register User

POST /api/auth/register

Request Body:
{
"email": "[user@example.com](mailto:user@example.com)",
"password": "123456"
}

Response:
{
"message": "User registered successfully",
"userId": "..."
}

---

#### Login User

POST /api/auth/login

Request Body:
{
"email": "[user@example.com](mailto:user@example.com)",
"password": "123456"
}

Response:
{
"token": "jwt_token_here"
}

---

### Leads

#### Get All Leads

GET /api/leads

Headers:
Authorization: <token>

Query Parameters:

* search (optional)
* status (optional)
* source (optional)
* page (optional)

Response:
{
"leads": [...],
"total": 20,
"page": 1,
"totalPages": 2
}

---

#### Create Lead

POST /api/leads

Headers:
Authorization: <token>

Request Body:
{
"name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)",
"status": "New",
"source": "Website"
}

---

#### Get Single Lead

GET /api/leads/:id

---

#### Update Lead

PUT /api/leads/:id

---

#### Delete Lead

DELETE /api/leads/:id

---

#### Export Leads (CSV)

GET /api/leads/export

Returns a downloadable CSV file containing leads data.
