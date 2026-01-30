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
