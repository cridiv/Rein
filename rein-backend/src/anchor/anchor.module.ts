import { DynamicModule, Module } from '@nestjs/common';
import { AnchorService } from './anchor.service';
import { AnchorStorage } from './anchor.storage';
import { PrismaModule } from '../prisma/prisma.module';
import { MESSAGING_SERVICE } from './messaging.interface';

@Module({
  imports: [PrismaModule],
  providers: [AnchorStorage],
  exports: [AnchorService],
})
export class AnchorModule {
  static forRoot(messagingServiceClass: any): DynamicModule {
    return {
      module: AnchorModule,
      imports: [PrismaModule],
      providers: [
        AnchorService,
        AnchorStorage,
        {
          provide: MESSAGING_SERVICE,
          useClass: messagingServiceClass,
        },
      ],
      exports: [AnchorService],
    };
  }
}