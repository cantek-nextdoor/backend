import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends CreateUserDto {
  display_name: string;
  points: number;
}
