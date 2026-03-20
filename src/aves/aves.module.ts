import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AvesController } from './controller/aves.controller';
import { AvesService } from './service/aves.service';

@Module({
  imports: [HttpModule],
  controllers: [AvesController],
  providers: [AvesService],
})
export class AvesModule {}
