using SpineEngine.Utils.Collections;
using PixelRPG.Base.AdditionalStuff.ClientServer;
namespace PixelRPG.Base.TransferMessages
{
public partial class ClientConnectTransferMessage : IPoolableTransferMessage
{
public partial class UnitSubMessage : IPoolable
{
public void Free()
{
Pool<UnitSubMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
if (this.Skills != null)
{
for (var thisSkillsIndex = 0; thisSkillsIndex < this.Skills.Count; thisSkillsIndex++)
{
var thisSkillsListValue = this.Skills[thisSkillsIndex];
thisSkillsListValue = 0;
}
}
this.Skills.Clear();
this.UnitType = 0;
}
}
}
public void Free()
{
Pool<ClientConnectTransferMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.PlayerName = null;
if (this.UnitsData != null)
{
for (var thisUnitsDataIndex = 0; thisUnitsDataIndex < this.UnitsData.Count; thisUnitsDataIndex++)
{
var thisUnitsDataListValue = this.UnitsData[thisUnitsDataIndex];
thisUnitsDataListValue?.Free();
thisUnitsDataListValue = null;
}
}
this.UnitsData.Clear();
}
}
}
}
namespace PixelRPG.Base.TransferMessages
{
public partial class ClientTurnDoneTransferMessage : IPoolableTransferMessage
{
public partial class UnitActionSubMessage : IPoolable
{
public void Free()
{
Pool<UnitActionSubMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.AttackDirection?.Free();
this.AttackDirection = null;
this.NewPosition?.Free();
this.NewPosition = null;
}
}
}
public partial class PointSubMessage : IPoolable
{
public void Free()
{
Pool<PointSubMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.X = 0;
this.Y = 0;
}
}
}
public void Free()
{
Pool<ClientTurnDoneTransferMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
if (this.UnitActions != null)
{
foreach (var thisUnitActionsKVP in this.UnitActions)
{
var thisUnitActionsKVPKey = thisUnitActionsKVP.Key;
var thisUnitActionsKVPValue = thisUnitActionsKVP.Value;
thisUnitActionsKVPKey = 0;
thisUnitActionsKVPValue?.Free();
thisUnitActionsKVPValue = null;
}
}
this.UnitActions.Clear();
}
}
}
}
namespace PixelRPG.Base.TransferMessages
{
public partial class ServerClientConnectedTransferMessage : IPoolableTransferMessage
{
public partial class UnitSubMessage : IPoolable
{
public void Free()
{
Pool<UnitSubMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.UnitId = 0;
this.UnitType = 0;
}
}
}
public void Free()
{
Pool<ServerClientConnectedTransferMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.CurrentCount = 0;
this.PlayerId = 0;
this.PlayerName = null;
if (this.Units != null)
{
for (var thisUnitsIndex = 0; thisUnitsIndex < this.Units.Count; thisUnitsIndex++)
{
var thisUnitsListValue = this.Units[thisUnitsIndex];
thisUnitsListValue?.Free();
thisUnitsListValue = null;
}
}
this.Units.Clear();
this.WaitingCount = 0;
}
}
}
}
namespace PixelRPG.Base.TransferMessages
{
public partial class ServerCurrentStateTransferMessage : IPoolableTransferMessage
{
public partial class PlayerSubMessage : IPoolable
{
public void Free()
{
Pool<PlayerSubMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.LevelScore = 0;
this.PlayerId = 0;
this.TotalScore = 0;
if (this.Units != null)
{
for (var thisUnitsIndex = 0; thisUnitsIndex < this.Units.Count; thisUnitsIndex++)
{
var thisUnitsListValue = this.Units[thisUnitsIndex];
thisUnitsListValue?.Free();
thisUnitsListValue = null;
}
}
this.Units.Clear();
}
}
}
public partial class UnitSubMessage : IPoolable
{
public void Free()
{
Pool<UnitSubMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.Hp = 0;
this.Position?.Free();
this.Position = null;
this.UnitId = 0;
}
}
}
public partial class PointSubMessage : IPoolable
{
public void Free()
{
Pool<PointSubMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.X = 0;
this.Y = 0;
}
}
}
public void Free()
{
Pool<ServerCurrentStateTransferMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
if (this.Doors != null)
{
for (var thisDoorsIndex = 0; thisDoorsIndex < this.Doors.Count; thisDoorsIndex++)
{
var thisDoorsListValue = this.Doors[thisDoorsIndex];
thisDoorsListValue?.Free();
thisDoorsListValue = null;
}
}
this.Doors.Clear();
this.Exit?.Free();
this.Exit = null;
if (this.Map != null)
{
for (var thisMapIndex = 0; thisMapIndex < this.Map.Count; thisMapIndex++)
{
var thisMapListValue = this.Map[thisMapIndex];
thisMapListValue = 0;
}
}
this.Map.Clear();
if (this.Players != null)
{
for (var thisPlayersIndex = 0; thisPlayersIndex < this.Players.Count; thisPlayersIndex++)
{
var thisPlayersListValue = this.Players[thisPlayersIndex];
thisPlayersListValue?.Free();
thisPlayersListValue = null;
}
}
this.Players.Clear();
}
}
}
}
namespace PixelRPG.Base.TransferMessages
{
public partial class ServerGameStartedTransferMessage : IPoolableTransferMessage
{
public void Free()
{
Pool<ServerGameStartedTransferMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.Height = 0;
this.Width = 0;
}
}
}
}
namespace PixelRPG.Base.TransferMessages
{
public partial class ServerPlayerTurnMadeTransferMessage : IPoolableTransferMessage
{
public void Free()
{
Pool<ServerPlayerTurnMadeTransferMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.PlayerId = 0;
}
}
}
}
namespace PixelRPG.Base.TransferMessages
{
public partial class ServerYouConnectedTransferMessage : IPoolableTransferMessage
{
public partial class UnitSubMessage : IPoolable
{
public void Free()
{
Pool<UnitSubMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.AttackDamage = 0;
this.AttackDistance = 0;
this.AttackFriendlyFire = false;
this.AttackRadius = 0;
this.Hp = 0;
this.MaxHp = 0;
this.MoveRange = 0;
this.UnitId = 0;
this.UnitType = 0;
this.VisionRange = 0;
}
}
}
public void Free()
{
Pool<ServerYouConnectedTransferMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
this.PlayerId = 0;
if (this.UnitsData != null)
{
for (var thisUnitsDataIndex = 0; thisUnitsDataIndex < this.UnitsData.Count; thisUnitsDataIndex++)
{
var thisUnitsDataListValue = this.UnitsData[thisUnitsDataIndex];
thisUnitsDataListValue?.Free();
thisUnitsDataListValue = null;
}
}
this.UnitsData.Clear();
}
}
}
}
namespace PixelRPG.Base.TransferMessages
{
public partial class ServerYourTurnTransferMessage : IPoolableTransferMessage
{
public void Free()
{
Pool<ServerYourTurnTransferMessage>.Free(this);
}
public void Reset()
{
if (this != null)
{
}
}
}
}

