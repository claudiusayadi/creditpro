import { IntersectionType } from '@nestjs/swagger';
import { FilterDto } from './filter.dto';
import { PaginationDto } from './pagination.dto';
import { RelationsDto } from './relations.dto';
import { SearchDto } from './search.dto';
import { SelectDto } from './select.dto';
import { SortDto } from './sort.dto';

export class QueryDto extends IntersectionType(
  PaginationDto,
  SortDto,
  SearchDto,
  FilterDto,
  SelectDto,
  RelationsDto,
) {}
