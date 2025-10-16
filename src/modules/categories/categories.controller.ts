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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    description: 'Category created successfully',
    type: Category,
  })
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(dto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({
    description: 'List of categories',
    type: [Category],
  })
  @Public()
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.categoriesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a category by slug' })
  @ApiOkResponse({ description: 'Category details', type: Category })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Category> {
    return await this.categoriesService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiOkResponse({ description: 'Category details', type: Category })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @Public()
  @Get(':id')
  async findOne(@Param() params: IdDto): Promise<Category> {
    return await this.categoriesService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiOkResponse({
    description: 'Category updated successfully',
    type: Category,
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param() params: IdDto,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @ApiNoContentResponse({ description: 'Category deleted successfully' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param() params: IdDto): Promise<void> {
    return await this.categoriesService.remove(params.id);
  }
}
