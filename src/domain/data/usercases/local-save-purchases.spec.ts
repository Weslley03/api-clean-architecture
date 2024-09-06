class LocalSavePurchases{
  constructor(private readonly cacheStore: CacheStore) {}
};

interface CacheStore {
  //
}

class CacheStoreSpy implements CacheStore {
  deleteCallCount = 0
}

describe('LocalSavePurchases', () =>{
  test('should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy();
    new LocalSavePurchases(cacheStore);
    expect(cacheStore.deleteCallCount).toBe(0);
  });
});
