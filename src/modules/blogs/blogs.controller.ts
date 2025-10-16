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
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import type { IRequestUser } from '../users/interfaces/user.interface';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiCreatedResponse({
    description: 'Blog post created successfully',
    type: Blog,
  })
  @Post()
  async create(
    @Body() dto: CreateBlogDto,
    @ActiveUser() user: IRequestUser,
  ): Promise<Blog> {
    return await this.blogsService.create(dto, user);
  }

  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiOkResponse({ description: 'List of blog posts', type: [Blog] })
  @Public()
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.blogsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get all published blog posts' })
  @Public()
  @Get('published')
  async findPublished(@Query() query: QueryDto) {
    return await this.blogsService.findPublished(query);
  }

  @ApiOperation({ summary: 'Get featured blog posts' })
  @Public()
  @Get('featured')
  async findFeatured(@Query() query: QueryDto) {
    return await this.blogsService.findFeatured(query);
  }

  @ApiOperation({ summary: 'Get blog posts by category' })
  @Public()
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: QueryDto,
  ) {
    return await this.blogsService.findByCategory(categoryId, query);
  }

  @ApiOperation({ summary: 'Get a blog post by slug' })
  @ApiOkResponse({ description: 'Blog post details', type: Blog })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Blog> {
    return await this.blogsService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiOkResponse({ description: 'Blog post details', type: Blog })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  @Public()
  @Get(':id')
  async findOne(@Param() params: IdDto): Promise<Blog> {
    return await this.blogsService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Update a blog post' })
  @ApiOkResponse({
    description: 'Blog post updated successfully',
    type: Blog,
  })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  @Patch(':id')
  async update(
    @Param() params: IdDto,
    @Body() dto: UpdateBlogDto,
  ): Promise<Blog> {
    return await this.blogsService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiNoContentResponse({ description: 'Blog post deleted successfully' })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  @Delete(':id')
  async remove(@Param() params: IdDto): Promise<void> {
    return await this.blogsService.remove(params.id);
  }
}
