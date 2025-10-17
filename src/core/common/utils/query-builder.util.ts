import {
  Between,
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import {
  FilterCondition,
  FilterGroup,
  FilterOperator,
  LogicalOperator,
} from '../dto/filter.dto';
import { QueryDto } from '../dto/query.dto';
import { IPaginatedResult } from '../interfaces/paginated-result.interface';

export class QB {
  static buildFindOptions<T>(
    query: QueryDto,
    defaultSearchFields?: (keyof T)[],
  ): FindManyOptions<T> {
    const options: FindManyOptions<T> = {};

    // Pagination
    if (query.page && query.limit) {
      options.skip = (query.page - 1) * query.limit;
      options.take = query.limit;
    }

    // Sorting
    if (query.sortBy) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      options.order = this.buildOrder(query.sortBy, query.sortOrder) as any;
    }

    // Search
    if (query.search) {
      const searchWhere = this.buildSearchWhere<T>(
        query.search,
        query.searchFields as (keyof T)[] | undefined,
        defaultSearchFields,
      );
      options.where = searchWhere;
    }

    // Filtering
    if (query.filter) {
      const filterWhere = this.buildFilterWhere<T>(query.filter);
      if (options.where) {
        // Combine search and filter using AND
        options.where = Array.isArray(options.where)
          ? options.where.map((w) => ({ ...w, ...filterWhere }))
          : { ...options.where, ...filterWhere };
      } else {
        options.where = filterWhere;
      }
    }

    // Field selection
    if (query.select && query.select.length > 0) {
      options.select = this.buildSelect<T>(query.select, query.exclude);
    }

    // Relations
    if (query.loadAll) {
      // This needs to be handled in the service layer with entity metadata
      options.relations = [];
    } else if (query.relations && query.relations.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      options.relations = this.buildRelations(query.relations) as any;
    }

    return options;
  }

  static async paginate<T extends Record<string, any>>(
    repository: Repository<T>,
    query: QueryDto,
    options?: {
      defaultSearchFields?: (keyof T)[];
      additionalWhere?: FindOptionsWhere<T>;
      additionalRelations?: string[];
    },
  ): Promise<IPaginatedResult<T>> {
    const findOptions = this.buildFindOptions<T>(
      query,
      options?.defaultSearchFields,
    );

    // Merge additional where conditions
    if (options?.additionalWhere) {
      if (findOptions.where) {
        findOptions.where = Array.isArray(findOptions.where)
          ? findOptions.where.map((w) => ({ ...w, ...options.additionalWhere }))
          : { ...findOptions.where, ...options.additionalWhere };
      } else {
        findOptions.where = options.additionalWhere;
      }
    }

    // Merge additional relations
    if (options?.additionalRelations) {
      const existingRelations = findOptions.relations
        ? Array.isArray(findOptions.relations)
          ? (findOptions.relations as string[])
          : []
        : [];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      findOptions.relations = [
        ...existingRelations,
        ...options.additionalRelations,
      ] as any;
    }

    const [data, total] = await repository.findAndCount(findOptions);

    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        currentPage: page,
        items: limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static createMeta(
    page: number,
    limit: number,
    total: number,
  ): IPaginatedResult<any>['meta'] {
    const totalPages = Math.ceil(total / limit);
    return {
      currentPage: page,
      items: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  /**
   * Build sort order
   */
  private static buildOrder(
    sortBy: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Record<string, string | Record<string, string>> {
    const order: Record<string, string | Record<string, string>> = {};
    const fields = sortBy.split(',');
    const orders = sortOrder?.split(',') || [];

    fields.forEach((field, index) => {
      const fieldOrder = orders[index] || sortOrder || 'ASC';
      // Handle nested sorting (e.g., 'user.first_name')
      if (field.includes('.')) {
        const parts = field.split('.');
        let current: Record<string, any> = order;
        parts.forEach((part, i) => {
          if (i === parts.length - 1) {
            current[part] = fieldOrder;
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            current[part] = current[part] || {};
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            current = current[part];
          }
        });
      } else {
        order[field] = fieldOrder;
      }
    });

    return order;
  }

  /**
   * Build search where conditions
   */
  private static buildSearchWhere<T>(
    search: string,
    searchFields?: (keyof T)[],
    defaultSearchFields?: (keyof T)[],
  ): FindOptionsWhere<T>[] {
    const fields = searchFields || defaultSearchFields || [];
    if (fields.length === 0) {
      return [];
    }

    // Create OR conditions for each field
    return fields.map((field) => ({
      [field]: ILike(`%${search}%`),
    })) as FindOptionsWhere<T>[];
  }

  /**
   * Build filter where conditions from FilterGroup
   */
  private static buildFilterWhere<T>(
    filterGroup: FilterGroup,
  ): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
    const conditions: FindOptionsWhere<T>[] = [];

    // Process direct conditions
    if (filterGroup.conditions && filterGroup.conditions.length > 0) {
      filterGroup.conditions.forEach((condition) => {
        const conditionWhere = this.buildConditionWhere<T>(condition);
        if (conditionWhere) {
          conditions.push(conditionWhere);
        }
      });
    }

    // Process nested groups
    if (filterGroup.groups && filterGroup.groups.length > 0) {
      filterGroup.groups.forEach((group) => {
        const groupWhere = this.buildFilterWhere<T>(group);
        if (Array.isArray(groupWhere)) {
          conditions.push(...groupWhere);
        } else if (groupWhere) {
          conditions.push(groupWhere);
        }
      });
    }

    // Combine conditions based on operator
    if (conditions.length === 0) {
      return {} as FindOptionsWhere<T>;
    }

    if (filterGroup.operator === LogicalOperator.OR) {
      // OR: Return array of conditions
      return conditions;
    } else {
      // AND: Merge all conditions into single object
      return conditions.reduce(
        (acc, condition) => ({ ...acc, ...condition }),
        {} as FindOptionsWhere<T>,
      );
    }
  }

  /**
   * Build single condition where clause
   */
  private static buildConditionWhere<T>(
    condition: FilterCondition,
  ): FindOptionsWhere<T> | null {
    const where: Record<string, any> = {};

    switch (condition.operator) {
      case FilterOperator.EQUALS:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where[condition.field] = condition.value;
        break;

      case FilterOperator.NOT_EQUALS:
        where[condition.field] = Not(condition.value);
        break;

      case FilterOperator.GREATER_THAN:
        where[condition.field] = MoreThan(condition.value);
        break;

      case FilterOperator.GREATER_THAN_OR_EQUAL:
        where[condition.field] = MoreThanOrEqual(condition.value);
        break;

      case FilterOperator.LESS_THAN:
        where[condition.field] = LessThan(condition.value);
        break;

      case FilterOperator.LESS_THAN_OR_EQUAL:
        where[condition.field] = LessThanOrEqual(condition.value);
        break;

      case FilterOperator.LIKE:
        where[condition.field] = Like(`%${String(condition.value)}%`);
        break;

      case FilterOperator.ILIKE:
        where[condition.field] = ILike(`%${String(condition.value)}%`);
        break;

      case FilterOperator.IN:
        where[condition.field] = In(
          Array.isArray(condition.value) ? condition.value : [condition.value],
        );
        break;

      case FilterOperator.NOT_IN:
        where[condition.field] = Not(
          In(
            Array.isArray(condition.value)
              ? condition.value
              : [condition.value],
          ),
        );
        break;

      case FilterOperator.BETWEEN:
        if (Array.isArray(condition.value) && condition.value.length === 2) {
          where[condition.field] = Between(
            condition.value[0],
            condition.value[1],
          );
        }
        break;

      case FilterOperator.IS_NULL:
        where[condition.field] = IsNull();
        break;

      case FilterOperator.NOT_NULL:
        where[condition.field] = Not(IsNull());
        break;

      case FilterOperator.STARTS_WITH:
        where[condition.field] = Like(`${String(condition.value)}%`);
        break;

      case FilterOperator.ENDS_WITH:
        where[condition.field] = Like(`%${String(condition.value)}`);
        break;

      case FilterOperator.CONTAINS:
        where[condition.field] = ILike(`%${String(condition.value)}%`);
        break;

      default:
        return null;
    }

    return where as FindOptionsWhere<T>;
  }

  /**
   * Build field selection
   */
  private static buildSelect<T>(
    select: string[],
    exclude?: string[],
  ): FindOptionsSelect<T> {
    const selectObj: Record<string, boolean> = {};

    select.forEach((field) => {
      if (!exclude || !exclude.includes(field)) {
        selectObj[field] = true;
      }
    });

    return selectObj as FindOptionsSelect<T>;
  }

  /**
   * Build relations array
   */
  private static buildRelations(relations: string[]): string[] {
    // Remove duplicates and sort by depth (shallow first)
    const uniqueRelations = Array.from(new Set(relations));
    return uniqueRelations.sort((a, b) => {
      const aDepth = a.split('.').length;
      const bDepth = b.split('.').length;
      return aDepth - bDepth;
    });
  }
}
