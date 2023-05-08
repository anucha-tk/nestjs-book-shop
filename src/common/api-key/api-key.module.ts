import { Module } from '@nestjs/common';
import { ApiKeyXApiKeyStrategy } from './guards/x-api-key/api-key.x-api-key.strategy';
import { ApiKeyRepositoryModule } from './repository/api-key.repository.module';
import { ApiKeyService } from './services/api-key.service';

@Module({
  providers: [ApiKeyService, ApiKeyXApiKeyStrategy],
  exports: [ApiKeyService],
  controllers: [],
  imports: [ApiKeyRepositoryModule],
})
export class ApiKeyModule {}
