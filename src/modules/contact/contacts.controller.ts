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
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { Contact } from 'src/modules/contact/entities/contact.entity';
import { IdDto } from '../../core/common/dto/id.dto';
import { QueryDto } from '../../core/common/dto/query.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/roles.enum';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactStatus } from './enums/contact-status.enum';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactService: ContactsService) {}

  @ApiOperation({ summary: 'Submit a contact message' })
  @ApiCreatedResponse({ description: 'Contact message submitted successfully' })
  @Public()
  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return await this.contactService.create(createContactDto);
  }

  @ApiOperation({ summary: 'Get all contact messages (Admin only)' })
  @ApiOkResponse({
    description: 'List of contact messages',
    type: [Contact],
  })
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.contactService.findAll(query);
  }

  @ApiOperation({ summary: 'Get contact message statistics (Admin only)' })
  @ApiOkResponse({ description: 'Contact message statistics' })
  @Roles(UserRole.ADMIN)
  @Get('stats')
  async getStats() {
    return await this.contactService.getStats();
  }

  @ApiOperation({ summary: 'Get contact messages by status (Admin only)' })
  @ApiOkResponse({
    description: 'List of contact messages filtered by status',
    type: [Contact],
  })
  @Roles(UserRole.ADMIN)
  @Get('status/:status')
  async findByStatus(
    @Param('status') status: ContactStatus,
    @Query() query: QueryDto,
  ) {
    return await this.contactService.findByStatus(status, query);
  }

  @ApiOperation({ summary: 'Get a contact message by ID (Admin only)' })
  @ApiOkResponse({ description: 'Contact message details', type: Contact })
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return await this.contactService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a contact message (Admin only)' })
  @ApiOkResponse({
    description: 'Contact message updated successfully',
    type: Contact,
  })
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return await this.contactService.update(id, updateContactDto);
  }

  @ApiOperation({ summary: 'Delete a contact message (Admin only)' })
  @ApiOkResponse({ description: 'Contact message deleted successfully' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    await this.contactService.remove(id);
    return { message: 'Contact message deleted successfully' };
  }
}
