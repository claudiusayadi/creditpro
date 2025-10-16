import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  LIKE = 'like',
  ILIKE = 'ilike', // Case-insensitive LIKE
  IN = 'in',
  NOT_IN = 'nin',
  BETWEEN = 'between',
  IS_NULL = 'null',
  NOT_NULL = 'notNull',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  CONTAINS = 'contains',
}

export enum LogicalOperator {
  AND = 'and',
  OR = 'or',
}

export class FilterCondition {
  /**
   * Field name to filter on
   * @example "name"
   */
  @IsString()
  field: string;

  @ApiPropertyOptional({
    description: 'Filter operator',
    enum: FilterOperator,
    example: FilterOperator.EQUALS,
  })
  @IsEnum(FilterOperator)
  operator: FilterOperator;

  /**
   * Filter value (can be any type depending on operator)
   * @example "John"
   */
  @IsOptional()
  value?: any;
}

export class FilterGroup {
  @ApiPropertyOptional({
    description: 'Logical operator to combine conditions',
    enum: LogicalOperator,
    default: LogicalOperator.AND,
  })
  @IsEnum(LogicalOperator)
  @IsOptional()
  operator?: LogicalOperator = LogicalOperator.AND;

  @ApiPropertyOptional({
    description: 'Array of filter conditions',
    type: [FilterCondition],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterCondition)
  @IsOptional()
  conditions?: FilterCondition[];

  @ApiPropertyOptional({
    description: 'Nested filter groups for complex queries',
    type: [FilterGroup],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterGroup)
  @IsOptional()
  groups?: FilterGroup[];
}

export class FilterDto {
  @ApiPropertyOptional({
    description: 'Filter configuration',
    type: FilterGroup,
    example: {
      operator: 'and',
      conditions: [
        { field: 'status', operator: 'eq', value: 'active' },
        { field: 'age', operator: 'gte', value: 18 },
      ],
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterGroup)
  @IsObject()
  filter?: FilterGroup;
}
