import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTagUniqueInMessage1776238903747
  implements MigrationInterface
{
  name = 'ChangeTagUniqueInMessage1776238903747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "UQ_c2718ee76a1a5a0f3b5834154ea"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "UQ_c2718ee76a1a5a0f3b5834154ea" UNIQUE ("tag")`
    );
  }
}
