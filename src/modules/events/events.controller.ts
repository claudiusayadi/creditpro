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
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new event (Admin only)' })
  async create(@Body() createEventDto: CreateEventDto) {
    return await this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async findAll(@Query() query: QueryDto) {
    return await this.eventsService.findAll(query);
  }

  @Get('published')
  @ApiOperation({ summary: 'Get all published events' })
  async findPublished(@Query() query: QueryDto) {
    return await this.eventsService.findPublished(query);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming published events' })
  async findUpcoming(@Query() query: QueryDto) {
    return await this.eventsService.findUpcoming(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured upcoming events' })
  async findFeatured() {
    return await this.eventsService.findFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an event by ID' })
  async findOne(@Param() { id }: IdDto) {
    return await this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an event (Admin only)' })
  async update(@Param() { id }: IdDto, @Body() updateEventDto: UpdateEventDto) {
    return await this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an event (Admin only)' })
  async remove(@Param() { id }: IdDto) {
    await this.eventsService.remove(id);
    return { message: 'Event deleted successfully' };
  }
}
