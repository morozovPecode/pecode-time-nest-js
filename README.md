# PecodeTime NestJS Learning Project

# Завдання 1. Робота з контролерами

Нові packages:

- class-transformer
- class-validator
- @nestjs/swagger

class-validator — це бібліотека, що добре працює разом з NestJS Pipes для того, щоб валідувати payload-и, query параметри, search параметри та інше.
class-transformer — це біблітека, що також добре працює з NestJS Pipes і дозволяє конвертувати обʼєкти в інстанси класів та навпаки.

Більше про їх використання можете почитати тут: https://docs.nestjs.com/techniques/validation

class-transformer також використовується для серіалізації. В NestJS є свій interceptor для серіалізації (https://docs.nestjs.com/techniques/serialization), проте для підтримки такого функціоналу, як `SerializeList`, щоб мати доступ до контексту API запиту, потрібно створювати свій власний serializer interceptor. Ви можете побачити їх імплементацію в `src/interceptors`.

@nestjs/swagger буде в подальшому використовуватись для OpenAPI документації проєкту. Проте, окрім цього, цей пакет надає такі untilities, як `PartialType`, `PickType`, `OmitType`, etc., використання яких доволі зрозуміле, приклади можете побачити в DTO файлах.


# Завдання 2. Робота з TypeORM

Нові packages:
- typeorm
- @nestjs/typeorm
- pg

typeorm — це ORM бібліотека, що дає змогу працювати з різними базами даних, зокрема з PostgreSQL.

@nestjs/typeorm — бібліотека, що надає потрібні injector's для роботи з TypeORM в NestJS (такі як InjectRepository, InjectDataSource, etc).

pg — це бібліотека для роботи з PostgreSQL в NodeJS. Вона не надає можливість працювати з entity-ями бази в ООП стилі, проте виконує задачу створення SQL запитів безпечно (можете прочитати більше про SQL injection). Є peer dependency для TypeORM при роботі з Postgres.

### Додатковий setup
Як ви можете побачити, зʼявився файл `.env.example`. Для того, щоб pg міг законектитись до вашого Postgres-у, вам потрібно створити `.env` файл та заповнити його відповідним чином (перед цим створіть нову БД в pgAdmin).

### Робота з міграціями
TypeORM може сам генерувати schema міграції дивлячись на зміни в entity definitions. Для цього в проєкті використовується TypeORM CLI (https://typeorm.io/docs/advanced-topics/using-cli/). В проєкті доступні наступні команди:
- `typeorm`: базова команда, що дає TypeORM CLI вказівку на використання потрібного Data Source.
- `migration:generate`: генерує міграцію згідно зі змінами в схемах. Очікує параметр `name`, напр.:
    `npm run migration:generate -- --name=my-migration`
    або
    `npm run migration:generate --name=my-migration`
- `migration:up`: виконує міграції, які ще не були виконані в базі.
- `migration:down`: відкатує останню міграцію.

Data migrations також можна створювати в TypeORM власноруч. Для цього потрібно створити migration файл:
`npm run typeorm migration:create src/migrations/my-data-migration`
і прописати міграцію власноруч.

Як ви можете побачити, в проєкті вже є одна міграція, що повʼязана зі створенням таблиць Activities модулю. Виконайте команду `npm run migration:up` та впевніться, що відповідні таблиці створилися в базі через pgAdmin.
