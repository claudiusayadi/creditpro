import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { IdDto } from 'src/core/common/dto/id.dto';
import { QueryDto } from 'src/core/common/dto/query.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { UserRole } from 'src/modules/users/enums/roles.enum';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourcesService } from './resources.service';

@ApiTags('Resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new resource (Admin only)' })
  async create(@Body() createResourceDto: CreateResourceDto) {
    return await this.resourcesService.create(createResourceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all resources' })
  async findAll(@Query() query: QueryDto) {
    return await this.resourcesService.findAll(query);
  }

  @Get('published')
  @ApiOperation({ summary: 'Get all published resources' })
  async findPublished(@Query() query: QueryDto) {
    return await this.resourcesService.findPublished(query);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get resources by category' })
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: QueryDto,
  ) {
    return await this.resourcesService.findByCategory(categoryId, query);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get resources by type' })
  async findByType(@Param('type') type: string, @Query() query: QueryDto) {
    return await this.resourcesService.findByType(type, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a resource by ID' })
  async findOne(@Param() { id }: IdDto) {
    return await this.resourcesService.findOne(id);
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Increment download count for a resource' })
  async incrementDownload(@Param() { id }: IdDto) {
    await this.resourcesService.incrementDownloadCount(id);
    return { message: 'Download count incremented' };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a resource (Admin only)' })
  async update(
    @Param() { id }: IdDto,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return await this.resourcesService.update(id, updateResourceDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a resource (Admin only)' })
  async remove(@Param() { id }: IdDto) {
    await this.resourcesService.remove(id);
    return { message: 'Resource deleted successfully' };
  }
}
