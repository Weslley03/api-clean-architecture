class LocalSavePurchases{
  constructor(private readonly cacheStore: CacheStore) {}
  
  async save(): Promise<void> {
    this.cacheStore.delete()
  }
};

interface CacheStore {
  delete: () => void

}

class CacheStoreSpy implements CacheStore {
  deleteCallCount = 0

  delete(): void {
    this.deleteCallCount++
  }
}

describe('LocalSavePurchases', () =>{
  test('should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy();
    new LocalSavePurchases(cacheStore);
    expect(cacheStore.deleteCallCount).toBe(0);
  });

  test('should delete old cache save on sut.save', async () => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchases(cacheStore);
    await sut.save();

    expect(cacheStore.deleteCallCount).toBe(1);
  });
});
