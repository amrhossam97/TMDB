import { instanceToPlain, plainToClass } from "class-transformer";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Movie } from "./movies.entity";
import { User } from "./users.entity";
@Entity({ name: "rate" })
export class Rating extends BaseEntity {
  @Column({ type: "float" })
  score: number;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.ratings)
  movie: Movie;
  static toEntity(DtoObject): Rating {
    const data = instanceToPlain(DtoObject);
    return plainToClass(Rating, data);
  }
}
