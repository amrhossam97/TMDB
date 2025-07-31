import { instanceToPlain, plainToClass } from "class-transformer";
import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Movie } from "./movies.entity";
@Entity({ name: "genre" })
export class Genre extends BaseEntity {
 @Column()
  tmdbId: number;

  @Column()
  name: string;

  @ManyToMany(() => Movie, movie => movie.genres)
  movies: Movie[];

  static toEntity(DtoObject): Genre {
    const data = instanceToPlain(DtoObject);
    return plainToClass(Genre, data);
  }
}
