# 🎥 StreamScape - Event-Driven Microservices Platform

**StreamScape**, yüksek ölçeklenebilir video yükleme ve canlı yayın süreçlerini modelleyen, **Event-Driven (Olay Güdümlü) mikroservis mimarisi** üzerine inşa edilmiş bir backend projesidir.

Bu proje; mikroservisler arası **asenkron iletişim**, **event-driven workflow**, **veri tutarlılığı** ve **dağıtık sistem prensiplerini** pratik olarak uygulamak amacıyla geliştirilmiştir.

---

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js + TypeScript |
| Framework | NestJS (Monorepo Structure) |
| Message Broker | RabbitMQ |
| Database | PostgreSQL + TypeORM |
| Object Storage | MinIO (S3 Compatible) |
| API Gateway | NestJS + Express HTTP Proxy |
| Authentication | JWT |
| Containerization | Docker Compose |

---

## 🏗️ System Architecture

Sistem, her biri kendi sorumluluk alanına ve bağımsız veritabanına sahip mikroservislerden oluşur.

### 1. API Gateway (`Port: 8000`)
Tüm istemci isteklerinin tek giriş noktasıdır.

**Responsibilities**
- JWT Authentication & Authorization
- Request routing
- Guard mekanizması
- Identity Forwarding (`UserID propagation`)

### 2. Auth Service (`Port: 3000`)
Kimlik doğrulama süreçlerini yönetir.

**Responsibilities**
- User registration
- User login
- JWT token generation

### 3. User Service (`Port: 3001`)
Kullanıcı profil ve kanal verilerini yönetir.

**Responsibilities**
- User profile management
- Channel creation
- Event consumption from Auth Service

### 4. Video Service (`Port: 3002`)
Video metadata yönetimi ve dosya yükleme işlemlerini yürütür.

**Responsibilities**
- Video upload
- Metadata management
- MinIO storage integration
- Event publishing

### 5. Encoding Service (`Port: 3003`)
Video işleme (transcoding) süreçlerini simüle eder.

**Responsibilities**
- Consume `video_uploaded` events
- Simulated video processing
- Publish `encoding_completed` events

---

## 🔄 Implemented Workflows

### 1️⃣ User Registration & Profile Creation

Bu workflow, servisler arası **event-driven communication** mantığını göstermektedir.

```text
User
   │
   ▼
Auth Service
   │ emits: user_created
   ▼
RabbitMQ
   │
   ▼
User Service
   ├── Creates User Profile
   └── Creates Channel
```

**Flow**
1. Kullanıcı `Auth Service` üzerinden kayıt olur.
2. `Auth Service`, kullanıcıyı veritabanına kaydeder.
3. `user_created` event’i RabbitMQ üzerinden publish edilir.
4. `User Service` event’i consume eder.
5. Otomatik olarak **User Profile** ve **Channel** oluşturulur.

---

### 2️⃣ Video Upload & Processing Workflow

Bu workflow, **asenkron feedback loop mimarisini** göstermektedir.

```text
Client
   │
   ▼
API Gateway
   │
   ▼
Video Service
   ├── Upload file to MinIO
   └── emits: video_uploaded
                │
                ▼
           RabbitMQ
                │
                ▼
        Encoding Service
                │
                └── emits: encoding_completed
                                │
                                ▼
                          Video Service
                       Status → READY
```

**Flow**
1. Kullanıcı Gateway üzerinden video yükler.
2. Video dosyası **MinIO** içerisine kaydedilir.
3. `Video Service`, `video_uploaded` event’ini publish eder.
4. `Encoding Service` event’i consume ederek videoyu işler (simülasyon).
5. İşlem tamamlandığında `encoding_completed` event’i yayınlanır.
6. `Video Service`, video durumunu `READY` olarak günceller.

---

## 🛠️ Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd streamscape
```

### 2. Start Infrastructure

```bash
cd infra
docker-compose up -d
```

Bu işlem aşağıdaki servisleri ayağa kaldırır:

- PostgreSQL
- RabbitMQ
- MinIO

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Services

Her servisi ayrı terminalde çalıştırın:

```bash
npm run start:dev api-gateway
```

```bash
npm run start:dev auth-service
```

```bash
npm run start:dev user-service
```

```bash
npm run start:dev video-service
```

```bash
npm run start:dev encoding-service
```

---

## 📌 Project Goals

Bu proje aşağıdaki backend ve distributed systems konseptlerini pratiğe dökmeyi amaçlamaktadır:

- Microservices Architecture
- Event-Driven Communication
- Asynchronous Messaging
- Distributed System Design
- API Gateway Pattern
- Authentication & Authorization
- Object Storage Integration
- Eventual Consistency

---

## 🚧 Roadmap

Planned improvements:

- [ ] Real video transcoding with FFmpeg
- [ ] Redis caching
- [ ] Distributed logging
- [ ] Monitoring (Prometheus + Grafana)
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline

---

## 📄 License

This project is developed for educational and portfolio purposes.