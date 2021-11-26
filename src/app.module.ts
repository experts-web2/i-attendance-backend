import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserModule } from './modules/user/user.module';
import { CityModule } from './modules/city/city.module';
import { CenterModule } from './modules/center/center.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/attendance', {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
    }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
    UserModule,
    CityModule,
    CenterModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
