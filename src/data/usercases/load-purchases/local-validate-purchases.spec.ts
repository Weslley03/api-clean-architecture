import { LocalLoadPurchases } from "@/data/usercases";
import { mockPurchases, CacheStoreSpy, getCacheExpirationDate } from "@/data/tests";

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

describe('LocalValidatePurchases', () =>{
  test('should not delete or insert cache on sut.init', () => {
    const { cacheStore, sut } = makeSut();
    expect(cacheStore.actions).toEqual([]);
  });

  test('should delete cache if load fails', () => {
    const { cacheStore, sut} = makeSut();
    cacheStore.simulateFetchError();
    sut.validate();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
    expect(cacheStore.deleteKey).toBe('purchases');
  });

  test('should has no side effect is load succeeds', () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() +1)
    
    const { cacheStore, sut} = makeSut();
    cacheStore.fetchResult = { timestamp };
    sut.validate();
    expect(cacheStore.actions).toBe([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe('purchases');
  });
});
