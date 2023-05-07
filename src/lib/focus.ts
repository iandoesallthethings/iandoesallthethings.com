import localStore from '$lib/localStore'
import type { Field } from '@prisma/client'
import { allTheThings } from './Fields'

export default localStore<Field>('focus', allTheThings)
