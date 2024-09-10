import { SavePurchases } from "@/domain/useCases";
import { faker } from '@faker-js/faker';

export const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: faker.string.uuid(),
    date: faker.date.recent(),
    value: faker.number.int(),
  },

  {
    id: faker.string.uuid(),
    date: faker.date.recent(),
    value: faker.number.int(),
  },
]