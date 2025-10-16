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
import { Public } from '../../modules/auth/decorators/public.decorator';
import { Roles } from '../../modules/auth/decorators/roles.decorator';
import { UserRole } from '../../modules/users/enums/roles.enum';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Create a new event (Admin only)' })
  @ApiCreatedResponse({
    description: 'Event created successfully',
    type: Event,
  })
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return await this.eventsService.create(createEventDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all events' })
  async findAll(@Query() query: QueryDto) {
    return await this.eventsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get all published events' })
  @Public()
  @Get('published')
  async findPublished(@Query() query: QueryDto) {
    return await this.eventsService.findPublished(query);
  }

  @ApiOperation({ summary: 'Get upcoming published events' })
  @ApiOkResponse({ description: 'List of upcoming events', type: [Event] })
  @Public()
  @Get('upcoming')
  async findUpcoming(@Query() query: QueryDto) {
    return await this.eventsService.findUpcoming(query);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured upcoming events' })
  async findFeatured() {
    return await this.eventsService.findFeatured();
  }

  @ApiOperation({ summary: 'Get an event by slug' })
  @ApiOkResponse({ description: 'Event details', type: Event })
  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.eventsService.findBySlug(slug);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get an event by ID' })
  async findOne(@Param() { id }: IdDto) {
    return await this.eventsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an event (Admin only)' })
  @ApiOkResponse({ description: 'Event updated successfully', type: Event })
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(@Param() { id }: IdDto, @Body() updateEventDto: UpdateEventDto) {
    return await this.eventsService.update(id, updateEventDto);
  }

  @ApiOperation({ summary: 'Delete an event (Admin only)' })
  @ApiNoContentResponse({ description: 'Event deleted successfully' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    await this.eventsService.remove(id);
    return { message: 'Event deleted successfully' };
  }
}
