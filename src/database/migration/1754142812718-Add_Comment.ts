import { MigrationInterface, QueryRunner } from "typeorm";

export class AddComment1754142812718 implements MigrationInterface {
    name = 'AddComment1754142812718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rate" ADD "comment" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rate" DROP COLUMN "comment"`);
    }

}
