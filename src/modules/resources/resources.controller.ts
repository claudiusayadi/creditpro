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
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { IdDto } from '../../core/common/dto/id.dto';
import { QueryDto } from '../../core/common/dto/query.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/roles.enum';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @ApiOperation({ summary: 'Create a new resource (Admin only)' })
  @ApiCreatedResponse({
    description: 'Resource created successfully',
    type: Resource,
  })
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createResourceDto: CreateResourceDto) {
    return await this.resourcesService.create(createResourceDto);
  }

  @ApiOperation({ summary: 'Get all resources' })
  @ApiOkResponse({ description: 'List of resources', type: [Resource] })
  @Public()
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.resourcesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get all published resources' })
  @ApiOkResponse({
    description: 'List of published resources',
    type: [Resource],
  })
  @Public()
  @Get('published')
  async findPublished(@Query() query: QueryDto) {
    return await this.resourcesService.findPublished(query);
  }

  @ApiOperation({ summary: 'Get resources by category' })
  @ApiOkResponse({
    description: 'List of resources by category',
    type: [Resource],
  })
  @Public()
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: QueryDto,
  ) {
    return await this.resourcesService.findByCategory(categoryId, query);
  }

  @ApiOperation({ summary: 'Get resources by type' })
  @ApiOkResponse({ description: 'List of resources by type', type: [Resource] })
  @Public()
  @Get(':type')
  async findByType(@Param('type') type: string, @Query() query: QueryDto) {
    return await this.resourcesService.findByType(type, query);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get a resource by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return await this.resourcesService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Get a resource by ID' })
  @ApiOkResponse({ description: 'Resource details', type: Resource })
  @Public()
  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return await this.resourcesService.findOne(id);
  }

  @ApiOperation({ summary: 'Increment download count for a resource' })
  @ApiNoContentResponse({
    description: 'Download count incremented successfully',
  })
  @Public()
  @Post(':id/download')
  async incrementDownload(@Param() { id }: IdDto) {
    await this.resourcesService.incrementDownloadCount(id);
    return { message: 'Download count incremented' };
  }

  @ApiOperation({ summary: 'Update a resource (Admin only)' })
  @ApiOkResponse({
    description: 'Resource updated successfully',
    type: Resource,
  })
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return await this.resourcesService.update(id, updateResourceDto);
  }

  @ApiOperation({ summary: 'Delete a resource (Admin only)' })
  @ApiNoContentResponse({ description: 'Resource deleted successfully' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    await this.resourcesService.remove(id);
    return { message: 'Resource deleted successfully' };
  }
}
