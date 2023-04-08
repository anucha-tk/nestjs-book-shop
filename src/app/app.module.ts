import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { RouterModule } from 'src/router/router.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  providers: [],
  imports: [CommonModule, RouterModule.forRoot()],
})
export class AppModule {}
