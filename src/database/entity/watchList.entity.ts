import { instanceToPlain, plainToClass } from "class-transformer";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Movie } from "./movies.entity";
import { User } from "./users.entity";
@Entity({ name: "watchlist" })
export class WatchList extends BaseEntity {
   @ManyToOne(() => User, user => user.watchlist)
  user: User;

  @ManyToOne(() => Movie, movie => movie.watchlistItems)
  movie: Movie;

  @Column({ default: false })
  isFavorite: boolean;
  static toEntity(DtoObject): WatchList {
    const data = instanceToPlain(DtoObject);
    return plainToClass(WatchList, data);
  }
}
