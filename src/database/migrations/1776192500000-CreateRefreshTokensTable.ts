import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshTokensTable1776192500000
  implements MigrationInterface
{
  name = 'CreateRefreshTokensTable1776192500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "tokenHash" character varying(255) NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_refresh_tokens_userId" UNIQUE ("userId"), CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_tokens_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_tokens_tokenHash" ON "refresh_tokens" ("tokenHash")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_refresh_tokens_tokenHash"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_userId"`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "UQ_refresh_tokens_userId"`
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
