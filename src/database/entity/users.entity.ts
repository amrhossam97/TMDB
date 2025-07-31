import { BadRequestException } from "@nestjs/common";
import { Gender } from "@root/common/enums/gender.enum";
import * as bcrypt from "bcrypt";
import { instanceToPlain, plainToClass } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Rating } from "./rate.entity";
import { WatchList } from "./watchList.entity";
export const letterRegex = new RegExp("^(?=.*[a-zA-Z])"),
  specialcharRegex = new RegExp("^(?=.*[!@#\\$%\\^&\\*\\+])"),
  digitRegex = new RegExp("^(?=.*[0-9])");
@Entity({ name: "users" })
export class User extends BaseEntity {
  @Column({ type: "text", nullable: false })
  userName: string;

  @Column({ type: "varchar", length: 300, nullable: true, unique: true })
  email: string;

  @Column({ type: "varchar", length: 20, nullable: false, unique: true })
  phoneNumber: string;

  @Column({ type: "varchar", length: 300 })
  password: string;

  @Column({ type: "varchar", default: null })
  access_token: string;

  // ENUM
  @Column({
    type: "enum",
    enum: Gender,
    default: Gender.MALE,
  })
  gender: Gender;

  //verifying
  @Column({ type: "boolean", default: false })
  isverify: boolean;

  @Column({ type: "boolean", default: false })
  isDeleted: boolean;
  //Verify Code
  @Column({ type: "integer", default: null })
  smscode: number;

  //Reset Password Code
  @Column({ type: "integer", default: null })
  reset_code: number;

  @Column({ type: "boolean", default: false })
  isSuspended: boolean;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => WatchList, (watch) => watch.user)
  watchlist: WatchList[];
  static async hashPassword(pass: string) {
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(pass, salt);
    return hash;
  }
  static async validatePassword(
    password: string,
    hashedPass: string
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPass);

    return isMatch;
  }
  static async checkPassword(password: string) {
    // Check for minimum and maximum length (8 to 50 characters)
    if (password.length < 8 || password.length > 50) {
      throw new BadRequestException(
        "Password must be between 8 and 50 characters long."
      );
    }

    // Check that the password contains at least one letter
    if (!letterRegex.test(password)) {
      throw new BadRequestException(
        "Password must contain at least one letter."
      );
    }

    // Check that the password contains at least one digit
    if (!digitRegex.test(password)) {
      throw new BadRequestException(
        "Password must contain at least one digit."
      );
    }

    return true;
  }

  static toEntity(DtoObject): User {
    const data = instanceToPlain(DtoObject);
    return plainToClass(User, data);
  }
}
