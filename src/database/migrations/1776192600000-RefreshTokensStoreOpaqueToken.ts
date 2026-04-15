import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshTokensStoreOpaqueToken1776192600000
  implements MigrationInterface
{
  name = 'RefreshTokensStoreOpaqueToken1776192600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "refresh_tokens"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_refresh_tokens_tokenHash"`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "tokenHash"`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "token" character varying(512) NOT NULL`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_refresh_tokens_token" ON "refresh_tokens" ("token")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "UQ_refresh_tokens_token"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "token"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "tokenHash" character varying(255) NOT NULL`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_tokens_tokenHash" ON "refresh_tokens" ("tokenHash")`
    );
  }
}
