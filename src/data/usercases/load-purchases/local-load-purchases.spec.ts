import { LocalLoadPurchases } from "@/data/usercases";
import { CacheStoreSpy } from "@/data/tests";

type SutType = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
};

const makeSut = (timeStamp = new Date()): SutType => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timeStamp);
  return {
    sut,
    cacheStore
  };
};

describe('LocalLoadPurchases', () =>{
  test('should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.actions).toEqual([]);
  });

  test('should call correct key on load',  async () => {
    const { cacheStore, sut} = makeSut();
    await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe('purchases');
  });

  test('should return empty list if load fails',  async () => {
    const { cacheStore, sut} = makeSut();
    cacheStore.simulateFetchError();
    const purchases =  await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });
});
