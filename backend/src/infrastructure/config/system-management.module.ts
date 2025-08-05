import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemManagementController } from '../../presentation/controllers/system-management.controller';
import { SystemManagementService } from '../../application/services/system-management.service';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
  ],
  controllers: [SystemManagementController],
  providers: [
    {
      provide: 'ISystemManagementService',
      useClass: SystemManagementService,
    },
  ],
  exports: ['ISystemManagementService'],
})
export class SystemManagementModule {} 