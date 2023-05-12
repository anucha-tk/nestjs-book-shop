import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { CommonModule } from 'src/common/common.module';
import { RoleModule } from 'src/modules/role/role.module';
import { MigrationApiKeySeed } from 'src/migration/seeds/migration.api-key.seed';
import { MigrationRoleSeed } from 'src/migration/seeds/migration.role.seed';

@Module({
  imports: [CommonModule, CommandModule, ApiKeyModule, RoleModule],
  providers: [MigrationApiKeySeed, MigrationRoleSeed],
  exports: [],
})
export class MigrationModule {}