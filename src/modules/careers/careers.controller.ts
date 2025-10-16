import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { IdDto } from '../../core/common/dto/id.dto';
import { QueryDto } from '../../core/common/dto/query.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/roles.enum';
import { CareersService } from './careers.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { Career } from './entities/career.entity';

@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @ApiOperation({ summary: 'Create a new career posting' })
  @ApiCreatedResponse({
    description: 'Career posting created successfully',
    type: Career,
  })
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateCareerDto): Promise<Career> {
    return await this.careersService.create(dto);
  }

  @ApiOperation({ summary: 'Get all career postings' })
  @ApiOkResponse({ description: 'List of career postings', type: [Career] })
  @Public()
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.careersService.findAll(query);
  }

  @ApiOperation({ summary: 'Get active career postings' })
  @ApiOkResponse({
    description: 'List of active career postings',
    type: [Career],
  })
  @Public()
  @Get('active')
  async findActive(@Query() query: QueryDto) {
    return await this.careersService.findActive(query);
  }

  @ApiOperation({ summary: 'Get a career posting by slug' })
  @ApiOkResponse({ description: 'Career posting details', type: Career })
  @ApiNotFoundResponse({ description: 'Career posting not found' })
  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Career> {
    return await this.careersService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Get a career posting by ID' })
  @ApiOkResponse({ description: 'Career posting details', type: Career })
  @ApiNotFoundResponse({ description: 'Career posting not found' })
  @Public()
  @Get(':id')
  async findOne(@Param() params: IdDto): Promise<Career> {
    return await this.careersService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Update a career posting' })
  @ApiOkResponse({
    description: 'Career posting updated successfully',
    type: Career,
  })
  @ApiNotFoundResponse({ description: 'Career posting not found' })
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param() params: IdDto,
    @Body() dto: UpdateCareerDto,
  ): Promise<Career> {
    return await this.careersService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Delete a career posting' })
  @ApiNoContentResponse({ description: 'Career posting deleted successfully' })
  @ApiNotFoundResponse({ description: 'Career posting not found' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param() params: IdDto) {
    await this.careersService.remove(params.id);
    return { message: 'Career posting deleted successfully' };
  }
}
