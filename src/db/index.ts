import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export * as Notion from '$db/Notion'
export * as Fields from '$db/Fields'
export * as Projects from '$db/Projects'
