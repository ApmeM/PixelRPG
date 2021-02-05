using LocomotorECS;
using LocomotorECS.Matching;
using PixelRPG.Base.AdditionalStuff.TurnBase;
using PixelRPG.Base.AdditionalStuff.TurnBase.Components;
using PixelRPG.Base.AdditionalStuff.TurnBase.EntitySystems;
using NUnit.Framework;
using System;

namespace PixelRPG.Tests.AdditionalContent
{
    public class DumbGameLogicSystem : EntityProcessingSystem
    {
        public DumbGameLogicSystem() : base(new Matcher().All(typeof(DumbGameState), typeof(ApplyTurnComponent)))
        {

        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var applyTurn = entity.GetComponent<ApplyTurnComponent>();
            if (applyTurn.TurnApplied)
            {
                return;
            }

            var gameState = entity.GetComponent<DumbGameState>();
            for (var i = 0; i < applyTurn.TurnsData.Count; i++)
            {
                gameState.State.Data += ((TurnData)applyTurn.TurnsData[i]).Data;
            }

            applyTurn.TurnApplied = true;
        }
    }

    public class DumbPlayerSystem : EntityProcessingSystem
    {
        public DumbPlayerSystem() : base(new Matcher().All(typeof(PlayerTurnComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var playerTurn = entity.GetComponent<PlayerTurnComponent>();
            if (playerTurn.TurnMade)
            {
                return;
            }

            playerTurn.TurnMade = true;
        }
    }

    public class TurnData : ITurnData
    {

        public int Data;

        public TurnData(int data)
        {
            this.Data = data;
        }
    }

    public class DumbGameState: Component
    {
        public TurnData State = new TurnData(0);
    }

    [TestFixture]
    public class TurnBaseIntegrationTest
    {
        [Test]
        public void TurnBaseProcess_TwoPlayersOneByOne_TurnsAppliedOneByOne()
        {
            var entities = new EntityList();
            var systems = new EntitySystemList(entities);
            systems.Add(new DumbPlayerSystem());
            systems.Add(new TurnSelectorUpdateSystem());
            systems.Add(new DumbGameLogicSystem());

            systems.AddExecutionOrder<DumbPlayerSystem, TurnSelectorUpdateSystem>();
            systems.AddExecutionOrder<TurnSelectorUpdateSystem, DumbGameLogicSystem>();

            var player1 = new Entity("player1");
            var player1Turn = player1.AddComponent<PlayerTurnComponent>();
            player1Turn.TurnData = new TurnData(5);
            entities.Add(player1);
            var player2 = new Entity("player2");
            var player2Turn = player2.AddComponent<PlayerTurnComponent>();
            player2Turn.TurnData = new TurnData(7);
            entities.Add(player2);
            var gameRule = new Entity();
            gameRule.AddComponent(new PlayerSwitcherComponent(PlayerSwitcherComponent.PlayerSwitchType.OneByOne, player1Turn, player2Turn));
            gameRule.AddComponent(new ApplyTurnComponent());
            var gameState = gameRule.AddComponent<DumbGameState>();
            entities.Add(gameRule);
            entities.CommitChanges();

            // Player 1 make turn, selector put turn to be applied, game logic apply turn
            systems.NotifyDoAction(TimeSpan.Zero);
            Assert.AreEqual(5, gameState.State.Data);

            // Player 2 enabled to make its turn
            systems.NotifyDoAction(TimeSpan.Zero);

            // Player 2 make turn, selector put turn to be applied, game logic apply turn
            systems.NotifyDoAction(TimeSpan.Zero);
            Assert.AreEqual(12, gameState.State.Data);

            // Player 1 enabled to make its turn
            systems.NotifyDoAction(TimeSpan.Zero);

            // Player 1 make turn, selector put turn to be applied, game logic apply turn
            systems.NotifyDoAction(TimeSpan.Zero);
            Assert.AreEqual(17, gameState.State.Data);

            // Player 2 enabled to make its turn
            systems.NotifyDoAction(TimeSpan.Zero);

            // Player 2 make turn, selector put turn to be applied, game logic apply turn
            systems.NotifyDoAction(TimeSpan.Zero);
            Assert.AreEqual(24, gameState.State.Data);
        }
     
        [Test]
        public void TurnBaseProcess_TwoPlayersAllAtOnce_TurnsAppliedAllAtOnce()
        {
            var entities = new EntityList();
            var systems = new EntitySystemList(entities);
            systems.Add(new DumbPlayerSystem());
            systems.Add(new TurnSelectorUpdateSystem());
            systems.Add(new DumbGameLogicSystem());

            systems.AddExecutionOrder<DumbPlayerSystem, TurnSelectorUpdateSystem>();
            systems.AddExecutionOrder<TurnSelectorUpdateSystem, DumbGameLogicSystem>();

            var player1 = new Entity("player1");
            var player1Turn = player1.AddComponent<PlayerTurnComponent>();
            player1Turn.TurnData = new TurnData(5);
            entities.Add(player1);
            var player2 = new Entity("player2");
            var player2Turn = player2.AddComponent<PlayerTurnComponent>();
            player2Turn.TurnData = new TurnData(7);
            entities.Add(player2);
            var gameRule = new Entity();
            gameRule.AddComponent(new PlayerSwitcherComponent(PlayerSwitcherComponent.PlayerSwitchType.AllAtOnce, player1Turn, player2Turn));
            gameRule.AddComponent(new ApplyTurnComponent());
            var gameState = gameRule.AddComponent<DumbGameState>();
            entities.Add(gameRule);
            entities.CommitChanges();

            // Player 1 make turn, selector put turn to be applied, game logic wait for other players
            systems.NotifyDoAction(TimeSpan.Zero);
            Assert.AreEqual(0, gameState.State.Data);

            // Player 2 make turn, selector put turn to be applied, game logic apply turn
            systems.NotifyDoAction(TimeSpan.Zero);
            Assert.AreEqual(12, gameState.State.Data);

            // Player 1 and 2 enabled to make its turns
            systems.NotifyDoAction(TimeSpan.Zero);

            // Player 1 make turn, selector put turn to be applied, game logic wait for other players
            systems.NotifyDoAction(TimeSpan.Zero);
            Assert.AreEqual(12, gameState.State.Data);

            // Player 2 make turn, selector put turn to be applied, game logic apply turn
            systems.NotifyDoAction(TimeSpan.Zero);
            Assert.AreEqual(24, gameState.State.Data);
        }
    }
}
