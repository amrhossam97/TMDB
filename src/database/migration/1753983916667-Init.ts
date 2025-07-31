import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1753983916667 implements MigrationInterface {
    name = 'Init1753983916667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "genre" ("id" SERIAL NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300), "tmdbId" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300), "userName" text NOT NULL, "email" character varying(300), "phoneNumber" character varying(20) NOT NULL, "password" character varying(300) NOT NULL, "access_token" character varying, "gender" "public"."users_gender_enum" NOT NULL DEFAULT 'male', "isverify" boolean NOT NULL DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, "smscode" integer, "reset_code" integer, "isSuspended" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rate" ("id" SERIAL NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300), "score" double precision NOT NULL, "userId" integer, "movieId" integer, CONSTRAINT "PK_2618d0d38af322d152ccc328f33" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movies" ("id" SERIAL NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300), "tmdbId" integer NOT NULL, "title" character varying NOT NULL, "overview" character varying NOT NULL, "releaseDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "watchlist" ("id" SERIAL NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300), "isFavorite" boolean NOT NULL DEFAULT false, "userId" integer, "movieId" integer, CONSTRAINT "PK_0c8c0dbcc8d379117138e71ad5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movies_genres_genre" ("moviesId" integer NOT NULL, "genreId" integer NOT NULL, CONSTRAINT "PK_d0310c7436842921457074dcb9d" PRIMARY KEY ("moviesId", "genreId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_333011e3bddca97f0d3dfb766c" ON "movies_genres_genre" ("moviesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab06362e9f665c1d65b72f3bcb" ON "movies_genres_genre" ("genreId") `);
        await queryRunner.query(`ALTER TABLE "rate" ADD CONSTRAINT "FK_7440b44c5acbec8b2ebfc3af7d2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rate" ADD CONSTRAINT "FK_44ce2f5acbd08961b3f9e74a0bc" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "watchlist" ADD CONSTRAINT "FK_03878f3f177c680cc195900f80a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "watchlist" ADD CONSTRAINT "FK_e208d245e60584f555df1b35e54" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genre" ADD CONSTRAINT "FK_333011e3bddca97f0d3dfb766c8" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genre" ADD CONSTRAINT "FK_ab06362e9f665c1d65b72f3bcba" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies_genres_genre" DROP CONSTRAINT "FK_ab06362e9f665c1d65b72f3bcba"`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genre" DROP CONSTRAINT "FK_333011e3bddca97f0d3dfb766c8"`);
        await queryRunner.query(`ALTER TABLE "watchlist" DROP CONSTRAINT "FK_e208d245e60584f555df1b35e54"`);
        await queryRunner.query(`ALTER TABLE "watchlist" DROP CONSTRAINT "FK_03878f3f177c680cc195900f80a"`);
        await queryRunner.query(`ALTER TABLE "rate" DROP CONSTRAINT "FK_44ce2f5acbd08961b3f9e74a0bc"`);
        await queryRunner.query(`ALTER TABLE "rate" DROP CONSTRAINT "FK_7440b44c5acbec8b2ebfc3af7d2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab06362e9f665c1d65b72f3bcb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_333011e3bddca97f0d3dfb766c"`);
        await queryRunner.query(`DROP TABLE "movies_genres_genre"`);
        await queryRunner.query(`DROP TABLE "watchlist"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`DROP TABLE "rate"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "genre"`);
    }

}
