import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from '../../core/common/dto/query.dto';
import { PaginatedResult } from '../../core/common/interfaces/paginated-result.interface';
import { compareIds } from '../../core/common/utils/compare-ids.util';
import { PaginationUtil } from '../../core/common/utils/pagination.util';
import { AuthDto } from '../auth/dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './enums/roles.enum';
import { IRequestUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  public async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) throw new ConflictException('Email already exists');

    const user = this.usersRepo.create(dto);
    return await this.usersRepo.save(user);
  }

  public async findAll(query: QueryDto): Promise<PaginatedResult<User>> {
    return await PaginationUtil.paginate(this.usersRepo, {
      pagination: query,
      sort: query,
    });
  }

  public async findOne(id: string, currentUser: IRequestUser): Promise<User> {
    if (currentUser.role !== UserRole.ADMIN) compareIds(currentUser.id, id);

    return await this.usersRepo.findOneOrFail({
      where: { id },
    });
  }

  public async update(
    id: string,
    currentUser: IRequestUser,
    dto: UpdateUserDto,
  ): Promise<User> {
    if (currentUser.role !== UserRole.ADMIN) compareIds(currentUser.id, id);

    const user = await this.usersRepo.preload({
      id,
      ...dto,
    });

    if (!user) throw new NotFoundException('User not found');
    return this.usersRepo.save(user);
  }

  public async remove(
    id: string,
    currentUser: IRequestUser,
    soft: boolean = false,
  ): Promise<User> {
    if (currentUser.role !== UserRole.ADMIN) compareIds(currentUser.id, id);
    if (!soft) throw new ForbiddenException('Forbidden resource');

    const user = await this.findOne(id, currentUser);
    return soft ? this.usersRepo.softRemove(user) : this.usersRepo.remove(user);
  }

  public async recover(dto: AuthDto): Promise<User> {
    const { email, password } = dto;

    const user = await this.usersRepo.findOne({
      where: { email },
      withDeleted: true,
    });

    if (!user || !(await user.compare(password)))
      throw new UnauthorizedException('Invalid credentials!');

    if (!user.isDeleted) throw new ConflictException('User not deleted');
    return await this.usersRepo.recover(user);
  }
}
