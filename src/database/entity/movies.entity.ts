import { instanceToPlain, plainToClass } from "class-transformer";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Genre } from "./genre.entity";
import { Rating } from "./rate.entity";
import { WatchList } from "./watchList.entity";
@Entity({ name: "movies" })
export class Movie extends BaseEntity {
  @Column()
  tmdbId: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  overview: string;

  @Column({ type: "date" })
  releaseDate: Date;

  @Column()
  backdropPath: string;

  @Column()
  posterPath: string;

  @Column()
  originalLanguage: string;

  @Column()
  originalTitle: string;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => Rating, (rating) => rating.movie)
  ratings: Rating[];

  @OneToMany(() => WatchList, (watch) => watch.movie)
  watchlistItems: WatchList[];

  static toEntity(DtoObject): Movie {
    const data = instanceToPlain(DtoObject);
    return plainToClass(Movie, data);
  }
}
