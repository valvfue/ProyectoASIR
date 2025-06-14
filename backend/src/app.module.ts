import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { ZabbixModule } from './zabbix/zabbix.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionLog } from './auth/entities/session-log.entity';
import { ZendeskModule } from './zendesk/zendesk.module'; 
import { UserController } from './user/user.controller'; 


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mariadb_auth',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'usuarios_db',
      entities: [User, SessionLog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, SessionLog]),
    UserModule,
    AuthModule,
    ZabbixModule,
    ZendeskModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}























