# Django REST Framework + React Integration

This project demonstrates a full-stack application integrating Django REST Framework (DRF) as the backend API with React as the frontend client. The application manages a simple book library with CRUD operations.

## Project Overview

The application consists of:
- **Backend**: Django REST Framework API with JWT authentication
- **Frontend**: React application that consumes the API
- **Database**: SQLite (default Django database)
- **CORS**: Enabled for cross-origin requests between frontend and backend

## Prerequisites

Before running this application, ensure you have the following installed:

- **Python 3.8+**
- **Node.js 14+**
- **npm or yarn**
- **Git**

## Backend Setup Instructions

1. **Navigate to the Backend Directory**
   ```bash
   cd Backend
   ```

2. **Activate Virtual Environment**
   ```bash
   # On Windows
   myEnv\Scripts\activate

   # On macOS/Linux
   source myEnv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Migrations**
   ```bash
   cd myProject
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create Superuser (Optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the Django Server**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://127.0.0.1:8000/`

## Frontend Setup Instructions

1. **Navigate to the Frontend Directory**
   ```bash
   npx create-react-app myfrontend
   cd myfrontend
   ```

2. **Install Dependencies**
   ```bash
   npm install axios
   npm install react-router-dom
   ```

3. **Start the React Development Server**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000/`

## Running the Application

1. **Start Backend First** (in one terminal):
   ```bash
   cd Backend/myProject
   python manage.py runserver
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd myfrontend
   npm start
   ```

3. **Access the Application**:
   - Frontend: `http://localhost:3000/`
   - Backend API: `http://127.0.0.1:8000/api/`
   - Django Admin: `http://127.0.0.1:8000/admin/` (if superuser created)

## Backend Implementation Details

This section provides a step-by-step walkthrough of the key backend files that implement the Django REST Framework API.

### 1. Models (`Backend/myProject/myApp/models.py`)

The model defines the data structure for our Book entity:

```python
from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    published_date = models.DateField()

    def __str__(self):
        return self.title
```

**Step-by-step explanation:**
- Import Django's models module
- Define `Book` class inheriting from `models.Model`
- Add three fields:
  - `title`: Character field with max 100 characters
  - `author`: Character field with max 100 characters
  - `published_date`: Date field
- Override `__str__` method to return the book title for better representation in admin interface

### 2. Serializers (`Backend/myProject/myApp/serializers.py`)

The serializer converts Django model instances to JSON and validates input data:

```python
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
```

**Step-by-step explanation:**
- Import DRF's serializers module and the Book model
- Create `BookSerializer` class inheriting from `ModelSerializer`
- Define `Meta` class with:
  - `model = Book`: Specify which model to serialize
  - `fields = '__all__'`: Include all model fields in serialization

### 3. Views (`Backend/myProject/myApp/views.py`)

The viewset provides the CRUD operations for the Book model:

```python
from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
```

**Step-by-step explanation:**
- Import DRF's viewsets and the Book model and serializer
- Create `BookViewSet` class inheriting from `ModelViewSet`
- Define `queryset`: All Book objects from database
- Define `serializer_class`: Use BookSerializer for serialization

### 4. URLs (`Backend/myProject/myApp/urls.py`)

The URL configuration routes API requests to the appropriate views:

```python
from rest_framework.routers import DefaultRouter
from .views import BookViewSet

router = DefaultRouter()
router.register('books', BookViewSet, basename='books')

urlpatterns = router.urls
```

**Step-by-step explanation:**
- Import DRF's DefaultRouter and the BookViewSet
- Create a DefaultRouter instance
- Register the BookViewSet with URL prefix 'books' and basename 'books'
- Set urlpatterns to router.urls (automatically generates CRUD URLs)

### 5. Main Project URLs (`Backend/myProject/myProject/urls.py`)

The main URL configuration includes the app URLs under the `/api/` path:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('myApp.urls')),
]
```

**Step-by-step explanation:**
- Import necessary Django modules
- Define urlpatterns list with:
  - Admin interface at `/admin/`
  - API endpoints at `/api/` by including myApp.urls

### 6. Settings Configuration (`Backend/myProject/myProject/settings.py`)

Key settings for DRF, authentication, and CORS:

```python
INSTALLED_APPS = [
    # ... other apps
    "myApp",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders"
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    # ... other middleware
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

CORS_ALLOW_ALL_ORIGINS = True
```

**Step-by-step explanation:**
- Add required apps to INSTALLED_APPS
- Add CORS middleware to MIDDLEWARE
- Configure REST_FRAMEWORK with JWT authentication and AllowAny permissions
- Enable CORS for all origins (development only)

## How It All Connects

1. **Request Flow**: Frontend makes request to `/api/books/` → Django URLs route to myApp.urls → Router directs to BookViewSet
2. **Data Processing**: ViewSet uses BookSerializer to convert Book model instances to JSON
3. **Database**: Book model defines the database table structure
4. **Authentication**: JWT tokens can be used for authenticated requests
5. **CORS**: Headers allow cross-origin requests from React frontend

## Generated API Endpoints

The router automatically creates these endpoints:
- `GET /api/books/` - List all books
- `POST /api/books/` - Create new book
- `GET /api/books/{id}/` - Get specific book
- `PUT /api/books/{id}/` - Update specific book
- `DELETE /api/books/{id}/` - Delete specific book

## API Endpoints Documentation

### Books API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books/` | List all books |
| POST | `/api/books/` | Create a new book |
| GET | `/api/books/{id}/` | Retrieve a specific book |
| PUT | `/api/books/{id}/` | Update a specific book |
| DELETE | `/api/books/{id}/` | Delete a specific book |

### Authentication Endpoints (JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/token/` | Obtain JWT token pair |
| POST | `/api/token/refresh/` | Refresh JWT access token |

### Request/Response Examples

**GET /api/books/**
```json
[
  {
    "id": 1,
    "title": "Programming Language",
    "author": "Rajesh Kumar Das",
    "published_date": "2023-01-01"
  }
]
```

**POST /api/books/**
```json
{
  "title": "Discreet Math",
  "author": "Rajesh",
  "published_date": "2023-12-01"
}
```

## How Frontend Connects to Backend

### API Configuration (`myfrontend/src/api.js`)

The frontend uses Axios for HTTP requests with a configured base URL:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

export default API;
```

### Data Fetching (`myfrontend/src/App.js`)

The React component fetches data using the configured API instance:

```javascript
import React, { useEffect, useState } from 'react';
import API from './api';

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    API.get('books/')
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>📚 Book List</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>{book.title} - {book.author}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Technologies Used

### Backend
- **Django 5.2.7**: Web framework
- **Django REST Framework 3.16.1**: API framework
- **djangorestframework-simplejwt 5.5.1**: JWT authentication
- **django-cors-headers 4.9.0**: CORS handling
- **SQLite**: Database

### Frontend
- **React 19.2.0**: UI library
- **Axios 1.12.2**: HTTP client
- **React Router DOM 7.9.4**: Routing (available for future use)

## Project Structure

```
Backend+Frontend/
├── Backend/
│   ├── myEnv/                 # Python virtual environment
│   └── myProject/             # Django project
│       ├── myProject/         # Project settings
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── ...
│       └── myApp/             # Django app
│           ├── models.py      # Book model
│           ├── serializers.py # DRF serializers
│           ├── views.py       # API views
│           ├── urls.py        # API routing
│           └── ...
├── myfrontend/                # React application
│   ├── src/
│   │   ├── api.js             # API configuration
│   │   ├── App.js             # Main React component
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md                  # This documentation
```

## CORS Configuration

CORS is enabled in Django settings to allow the React frontend to communicate with the backend:

```python
# settings.py
CORS_ALLOW_ALL_ORIGINS = True  # For development only
```

## Authentication

The backend is configured with JWT authentication using `djangorestframework-simplejwt`. To enable authentication:

1. Include authentication headers in API requests
2. Use `/api/token/` endpoint to obtain tokens
3. Include `Authorization: Bearer <token>` in subsequent requests

## Development Notes

- The backend runs on port 8000, frontend on port 3000
- CORS is configured to allow all origins in development
- Database is SQLite by default (no additional setup required)
- Hot reloading is enabled for both frontend and backend development

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS headers are properly configured in Django settings
2. **Connection Refused**: Make sure both backend and frontend servers are running
3. **Module Not Found**: Activate virtual environment and install dependencies
4. **Port Conflicts**: Change ports if 3000 or 8000 are already in use

### Useful Commands

```bash
# Backend
cd Backend/myProject
python manage.py runserver 8001  # Run on different port

# Frontend
cd myfrontend
npm start  # Runs on port 3000 by default
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both backend and frontend
5. Submit a pull request

## License

This project is for educational purposes. Feel free to modify and use as needed.
