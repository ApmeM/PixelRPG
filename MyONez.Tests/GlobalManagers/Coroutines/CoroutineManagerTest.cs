namespace MyONez.Tests.GlobalManagers.Coroutines
{
    using System.Collections;

    using MyONez.GlobalManagers.Coroutines;

    using NUnit.Framework;

    [TestFixture]
    public class CoroutineManagerTest
    {
        [SetUp]
        public void Setup()
        {
            this.globalManager = new CoroutineGlobalManager();
            this.value = 0;
        }

        private CoroutineGlobalManager globalManager;

        private int value;

        private IEnumerator testCoroutine()
        {
            yield return null;
            this.value = 11;
            yield return null;
            this.value = 12;
        }

        private IEnumerator testCoroutineNested()
        {
            yield return null;
            this.value = 21;
            yield return null;
            this.value = 22;
            yield return this.testCoroutine();
            this.value = 23;
        }

        [Test]
        public void Update_NestedCoroutine()
        {
            this.globalManager.StartCoroutine(this.testCoroutineNested());
            this.globalManager.Update(null);
            Assert.AreEqual(21, this.value);
            this.globalManager.Update(null);
            Assert.AreEqual(22, this.value);
            this.globalManager.Update(null);
            Assert.AreEqual(11, this.value);
            this.globalManager.Update(null);
            Assert.AreEqual(23, this.value);
        }

        [Test]
        public void Update_SimpleCoroutine()
        {
            this.globalManager.StartCoroutine(this.testCoroutine());
            this.globalManager.Update(null);
            Assert.AreEqual(11, this.value);
            this.globalManager.Update(null);
            Assert.AreEqual(12, this.value);
        }
    }
}