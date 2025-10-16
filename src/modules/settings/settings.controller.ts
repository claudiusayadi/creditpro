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
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { UserRole } from 'src/modules/users/enums/roles.enum';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Create a new setting (Admin only)' })
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createSettingDto: CreateSettingDto) {
    return await this.settingsService.create(createSettingDto);
  }

  @ApiOperation({ summary: 'Get all settings (Admin only)' })
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.settingsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get public settings' })
  @Public()
  @Get('public')
  async findPublic() {
    return await this.settingsService.findPublic();
  }

  @Get('group/:group')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get settings by group (Admin only)' })
  async findByGroup(@Param('group') group: string) {
    return await this.settingsService.findByGroup(group);
  }

  @Get('key/:key')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a setting by key (Admin only)' })
  async findByKey(@Param('key') key: string) {
    return await this.settingsService.findByKey(key);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a setting by ID (Admin only)' })
  async findOne(@Param() { id }: IdDto) {
    return await this.settingsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a setting (Admin only)' })
  async update(
    @Param() { id }: IdDto,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return await this.settingsService.update(id, updateSettingDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a setting (Admin only)' })
  async remove(@Param() { id }: IdDto) {
    await this.settingsService.remove(id);
    return { message: 'Setting deleted successfully' };
  }
}
