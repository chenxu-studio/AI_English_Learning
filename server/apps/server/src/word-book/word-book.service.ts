import { Injectable } from '@nestjs/common';
import { WordQuery } from '@en/common/word/index';
import { ResponseService, PrismaService } from '@libs/shared';
import type { Prisma } from '@libs/shared/generated/prisma/client';

@Injectable()
export class WordBookService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly prismaService: PrismaService,
  ) {}

  private toBoolean(value: string | boolean): boolean | undefined {
    return value === 'true' ? true : undefined;
  }

  // async findAll(query: WordQuery) {
  //   const { page = 1, pageSize = 12, word, ...rest } = query;
  //   const tags = Object.fromEntries(
  //     Object.entries(rest).map(([key, value]) => [key, this.toBoolean(value)]),
  //   );
  //   const where: Prisma.WordBookWhereInput = {
  //     word: word ? { contains: word } : undefined,
  //     ...tags,
  //   };
  //   const [total = 0, list = []] = await Promise.all([
  //     this.prismaService.wordBook.count({ where }),
  //     this.prismaService.wordBook.findMany({
  //       where,
  //       skip: (Number(page) - 1) * Number(pageSize),
  //       take: Number(pageSize),
  //       orderBy: {
  //         frq: 'desc',
  //       },
  //     }),
  //   ]);
  //   return this.responseService.success({ total, list });
  // }

  async findAll(query: WordQuery) {
    // 结构一下查询参数
    const { page, pageSize, word, ...rest } = query;
    const tags = Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [key, this.toBoolean(value)]),
    );
    const where: Prisma.WordBookWhereInput = {
      word: word ? { contains: word } : undefined,
      ...tags,
    };
    const [total, list] = await Promise.all([
      this.prismaService.wordBook.count({ where }),
      this.prismaService.wordBook.findMany({
        where,
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: {
          frq: 'desc', // 按照平率从大到小排序
        },
      }),
    ]);
    return this.responseService.success({ total, list });
  }
}
