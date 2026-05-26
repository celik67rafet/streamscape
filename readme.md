code
Markdown
# StreamScape - Event-Driven Microservices Platform

StreamScape, yüksek ölçeklenebilir video yükleme ve canlı yayın süreçlerini modelleyen, **Event-Driven (Olay Güdümlü)** mimariye sahip bir backend projesidir. Proje, mikroservisler arası asenkron iletişim, veri tutarlılığı ve dağıtık sistem prensipleri üzerine inşa edilmiştir.

## 🚀 Teknolojik Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS (Monorepo Structure)
- **Message Broker:** RabbitMQ
- **Database:** PostgreSQL (TypeORM)
- **Object Storage:** MinIO (S3 Compatible)
- **API Gateway:** NestJS + Express Http Proxy
- **Security:** JWT (Authentication & Authorization)
- **Container:** Docker Compose

## 🏗️ Sistem Mimarisi

Sistem, her biri kendi veritabanına ve sorumluluk alanına sahip bağımsız mikroservislerden oluşur:

1.  **API Gateway (Port 8000):** Tüm isteklerin tek giriş noktası. JWT doğrulama, Guard mekanizması ve Identity Forwarding (UserID taşıma) işlemlerini yapar.
2.  **Auth Service (Port 3000):** Kullanıcı kayıt, giriş ve JWT üretim süreçlerini yönetir.
3.  **User Service (Port 3001):** Kullanıcı profil ve kanal bilgilerini yönetir. Auth servisinden gelen eventleri dinleyerek otomatik profil oluşturur.
4.  **Video Service (Port 3002):** Video metadata yönetimi ve dosya yükleme işlemlerini yapar. Dosyaları MinIO üzerinde saklar.
5.  **Encoding Service (Port 3003):** Videoların işleme süreçlerini (transcoding) simüle eder ve sonuçları asenkron olarak iletir.

## 🔄 Tamamlanan İş Akışları (Workflows)

### 1. Kullanıcı Kayıt & Profil Oluşturma
- Kullanıcı `Auth Service` üzerinden kayıt olur.
- `Auth Service` kullanıcıyı kaydeder ve RabbitMQ üzerinden `user_created` event'ini fırlatır.
- `User Service` bu mesajı yakalar, otomatik olarak **User Profile** ve **Channel** kayıtlarını oluşturur.

### 2. Video Yükleme & İşleme Döngüsü (Feedback Loop)
- Kullanıcı Gateway üzerinden `Video Service`'e bir dosya yükler.
- Dosya **MinIO** (Object Storage) içine güvenli bir şekilde kaydedilir.
- `Video Service`, `video_uploaded` mesajını fırlatır.
- `Encoding Service` bu mesajı alır, videoyu işler (simülasyon) ve bittiğinde `encoding_completed` mesajını geri gönderir.
- `Video Service` bu sonucu dinleyerek veritabanındaki video durumunu `READY` olarak günceller.

## 🛠️ Kurulum ve Çalıştırma

1. **Altyapıyı Başlat:**
   ```bash
   cd infra
   docker-compose up -d
Bağımlılıkları Yükle:
code
Bash
npm install
Servisleri Çalıştır:
code
Bash
npm run start:dev api-gateway
npm run start:dev auth-service
npm run start:dev user-service
npm run start:dev video-service
npm run start:dev encoding-service
Bu proje adım adım mikroservis mimarisi standartlarına göre geliştirilmektedir.