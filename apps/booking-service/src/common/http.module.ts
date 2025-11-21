import { Module, Global } from '@nestjs/common';
import { HttpModule as NestHttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [
    NestHttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  exports: [NestHttpModule],
})
export class HttpModule {}
