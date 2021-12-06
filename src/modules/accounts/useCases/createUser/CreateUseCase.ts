import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUserRepository";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    driver_license,
    email,
    password,
    name,
  }: ICreateUserDTO): Promise<void> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    // criptografando a senha com bcrypt
    const passwordHash = await hash(password, 8);
    await this.usersRepository.create({
      driver_license,
      email,
      password: passwordHash,
      name,
    });
  }
}

export { CreateUserUseCase };