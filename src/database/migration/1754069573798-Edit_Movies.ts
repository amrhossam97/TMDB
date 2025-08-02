import { MigrationInterface, QueryRunner } from "typeorm";

export class EditMovies1754069573798 implements MigrationInterface {
    name = 'EditMovies1754069573798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" ADD "backdropPath" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "posterPath" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "originalLanguage" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "originalTitle" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "overview"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "overview" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "releaseDate"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "releaseDate" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "releaseDate"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "releaseDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "overview"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "overview" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "originalTitle"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "originalLanguage"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "posterPath"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "backdropPath"`);
    }

}
