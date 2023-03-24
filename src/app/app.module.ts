import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { RouterModule } from 'src/router/router.module';

@Module({
  imports: [CommonModule, RouterModule.register()],
  controllers: [],
  providers: [],
})
export class AppModule {}
