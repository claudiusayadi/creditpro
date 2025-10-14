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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { IdDto } from '../../core/common/dto/id.dto';
import { QueryDto } from '../../core/common/dto/query.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../users/enums/roles.enum';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactStatus } from './enums/contact-status.enum';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a contact message' })
  async create(@Body() createContactDto: CreateContactDto) {
    return await this.contactService.create(createContactDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all contact messages (Admin only)' })
  async findAll(@Query() query: QueryDto) {
    return await this.contactService.findAll(query);
  }

  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get contact message statistics (Admin only)' })
  async getStats() {
    return await this.contactService.getStats();
  }

  @Get('status/:status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get contact messages by status (Admin only)' })
  async findByStatus(
    @Param('status') status: ContactStatus,
    @Query() query: QueryDto,
  ) {
    return await this.contactService.findByStatus(status, query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a contact message by ID (Admin only)' })
  async findOne(@Param() { id }: IdDto) {
    return await this.contactService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a contact message (Admin only)' })
  async update(
    @Param() { id }: IdDto,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return await this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a contact message (Admin only)' })
  async remove(@Param() { id }: IdDto) {
    await this.contactService.remove(id);
    return { message: 'Contact message deleted successfully' };
  }
}
