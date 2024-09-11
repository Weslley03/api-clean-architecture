import { LocalLoadPurchases } from "@/data/usercases";
import { CacheStoreSpy, mockPurchases, getCacheExpirationDate } from "@/data/tests";

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

  test('should return empty list if load fails',  async () => {
    const { cacheStore, sut} = makeSut();
    cacheStore.simulateFetchError();
    const purchases =  await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });

  test('should return a list of purchases if cache is less then 3 days old',  async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() +1)
    const { cacheStore, sut} = makeSut(currentDate);
    
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    };

    const purchases =  await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(purchases).toEqual(cacheStore.fetchResult.value);
  });

  test('should return an empty list if cache is more than 3 days old',  async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() -1)

    const { cacheStore, sut} = makeSut(currentDate);
    
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    };

    const purchases =  await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });

  test('should return an empty list if cache is on expiration date',  async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);

    const { cacheStore, sut} = makeSut(currentDate);
    
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    };

    const purchases =  await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });

  test('should return an empty list if cache is empty',  async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() +1)

    const { cacheStore, sut} = makeSut(currentDate);
    
    cacheStore.fetchResult = {
      timestamp,
      value: []
    };

    const purchases =  await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });
});
