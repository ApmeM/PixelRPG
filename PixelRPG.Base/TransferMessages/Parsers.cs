using System;
using System.IO;
using System.Collections.Generic;
namespace PixelRPG.Base.AdditionalStuff.ClientServer
{
public class ClientConnectTransferMessageParser : BinaryTransferMessageParser<PixelRPG.Base.TransferMessages.ClientConnectTransferMessage>
{
protected override int Identifier => 1;
protected override void InternalWrite(PixelRPG.Base.TransferMessages.ClientConnectTransferMessage transferModel, BinaryWriter writer)
{
writer.Write(transferModel != null);
if (transferModel != null)
{
writer.Write(transferModel.PlayerName != null);
if (transferModel.PlayerName != null)
{
writer.Write(transferModel.PlayerName);
}
writer.Write(transferModel.UnitsData != null);
if (transferModel.UnitsData != null)
{
writer.Write(transferModel.UnitsData.Count);
for (var transferModelUnitsDataIndex = 0; transferModelUnitsDataIndex < transferModel.UnitsData.Count; transferModelUnitsDataIndex++)
{
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex] != null);
if (transferModel.UnitsData[transferModelUnitsDataIndex] != null)
{
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].Skills != null);
if (transferModel.UnitsData[transferModelUnitsDataIndex].Skills != null)
{
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].Skills.Count);
for (var transferModelUnitsDatatransferModelUnitsDataIndexSkillsIndex = 0; transferModelUnitsDatatransferModelUnitsDataIndexSkillsIndex < transferModel.UnitsData[transferModelUnitsDataIndex].Skills.Count; transferModelUnitsDatatransferModelUnitsDataIndexSkillsIndex++)
{
writer.Write((int)transferModel.UnitsData[transferModelUnitsDataIndex].Skills[transferModelUnitsDatatransferModelUnitsDataIndexSkillsIndex]);
}
}
writer.Write((int)transferModel.UnitsData[transferModelUnitsDataIndex].UnitType);
}
}
}
}
}
protected override PixelRPG.Base.TransferMessages.ClientConnectTransferMessage InternalRead(BinaryReader reader)
{
PixelRPG.Base.TransferMessages.ClientConnectTransferMessage transferModel = null;
if (reader.ReadBoolean())
{
transferModel = PixelRPG.Base.TransferMessages.ClientConnectTransferMessage.Create();
if (reader.ReadBoolean())
{
transferModel.PlayerName = reader.ReadString();
}
if (reader.ReadBoolean())
{
var transferModelUnitsDataCount = reader.ReadInt32();
transferModel.UnitsData.Clear();
for (var transferModelUnitsDataIndex = 0; transferModelUnitsDataIndex < transferModelUnitsDataCount; transferModelUnitsDataIndex++)
{
PixelRPG.Base.TransferMessages.ClientConnectTransferMessage.UnitSubMessage transferModelUnitsDataValue = default(PixelRPG.Base.TransferMessages.ClientConnectTransferMessage.UnitSubMessage);
if (reader.ReadBoolean())
{
transferModelUnitsDataValue = PixelRPG.Base.TransferMessages.ClientConnectTransferMessage.UnitSubMessage.Create();
if (reader.ReadBoolean())
{
var transferModelUnitsDataValueSkillsCount = reader.ReadInt32();
transferModelUnitsDataValue.Skills.Clear();
for (var transferModelUnitsDataValueSkillsIndex = 0; transferModelUnitsDataValueSkillsIndex < transferModelUnitsDataValueSkillsCount; transferModelUnitsDataValueSkillsIndex++)
{
PixelRPG.Base.Components.GameState.UnitUtils.Skill transferModelUnitsDataValueSkillsValue = default(PixelRPG.Base.Components.GameState.UnitUtils.Skill);
transferModelUnitsDataValueSkillsValue = (PixelRPG.Base.Components.GameState.UnitUtils.Skill)reader.ReadInt32();
transferModelUnitsDataValue.Skills.Add(transferModelUnitsDataValueSkillsValue);
}
}
transferModelUnitsDataValue.UnitType = (PixelRPG.Base.Components.GameState.UnitUtils.UnitType)reader.ReadInt32();
}
transferModel.UnitsData.Add(transferModelUnitsDataValue);
}
}
}
return transferModel;
}
}
public class ClientTurnDoneTransferMessageParser : BinaryTransferMessageParser<PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage>
{
protected override int Identifier => 2;
protected override void InternalWrite(PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage transferModel, BinaryWriter writer)
{
writer.Write(transferModel != null);
if (transferModel != null)
{
writer.Write(transferModel.UnitActions != null);
if (transferModel.UnitActions != null)
{
writer.Write(transferModel.UnitActions.Count);
foreach (var transferModelUnitActionsKVP in transferModel.UnitActions)
{
writer.Write(transferModelUnitActionsKVP.Key);
writer.Write(transferModelUnitActionsKVP.Value != null);
if (transferModelUnitActionsKVP.Value != null)
{
writer.Write(transferModelUnitActionsKVP.Value.AttackDirection != null);
if (transferModelUnitActionsKVP.Value.AttackDirection != null)
{
writer.Write(transferModelUnitActionsKVP.Value.AttackDirection.X);
writer.Write(transferModelUnitActionsKVP.Value.AttackDirection.Y);
}
writer.Write(transferModelUnitActionsKVP.Value.NewPosition != null);
if (transferModelUnitActionsKVP.Value.NewPosition != null)
{
writer.Write(transferModelUnitActionsKVP.Value.NewPosition.X);
writer.Write(transferModelUnitActionsKVP.Value.NewPosition.Y);
}
}
}
}
}
}
protected override PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage InternalRead(BinaryReader reader)
{
PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage transferModel = null;
if (reader.ReadBoolean())
{
transferModel = PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage.Create();
if (reader.ReadBoolean())
{
var transferModelUnitActionsCount = reader.ReadInt32();
transferModel.UnitActions.Clear();
for (var transferModelUnitActionsIndex = 0; transferModelUnitActionsIndex < transferModelUnitActionsCount; transferModelUnitActionsIndex++)
{
System.Int32 transferModelUnitActionsKey = default(System.Int32);
PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage.UnitActionSubMessage transferModelUnitActionsValue = default(PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage.UnitActionSubMessage);
transferModelUnitActionsKey = reader.ReadInt32();
if (reader.ReadBoolean())
{
transferModelUnitActionsValue = PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage.UnitActionSubMessage.Create();
if (reader.ReadBoolean())
{
transferModelUnitActionsValue.AttackDirection = PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage.PointSubMessage.Create();
transferModelUnitActionsValue.AttackDirection.X = reader.ReadInt32();
transferModelUnitActionsValue.AttackDirection.Y = reader.ReadInt32();
}
if (reader.ReadBoolean())
{
transferModelUnitActionsValue.NewPosition = PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage.PointSubMessage.Create();
transferModelUnitActionsValue.NewPosition.X = reader.ReadInt32();
transferModelUnitActionsValue.NewPosition.Y = reader.ReadInt32();
}
}
transferModel.UnitActions[transferModelUnitActionsKey] = transferModelUnitActionsValue;
}
}
}
return transferModel;
}
}
public class ServerClientConnectedTransferMessageParser : BinaryTransferMessageParser<PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage>
{
protected override int Identifier => 3;
protected override void InternalWrite(PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage transferModel, BinaryWriter writer)
{
writer.Write(transferModel != null);
if (transferModel != null)
{
writer.Write(transferModel.CurrentCount);
writer.Write(transferModel.PlayerId);
writer.Write(transferModel.PlayerName != null);
if (transferModel.PlayerName != null)
{
writer.Write(transferModel.PlayerName);
}
writer.Write(transferModel.Units != null);
if (transferModel.Units != null)
{
writer.Write(transferModel.Units.Count);
for (var transferModelUnitsIndex = 0; transferModelUnitsIndex < transferModel.Units.Count; transferModelUnitsIndex++)
{
writer.Write(transferModel.Units[transferModelUnitsIndex] != null);
if (transferModel.Units[transferModelUnitsIndex] != null)
{
writer.Write(transferModel.Units[transferModelUnitsIndex].UnitId);
writer.Write((int)transferModel.Units[transferModelUnitsIndex].UnitType);
}
}
}
writer.Write(transferModel.WaitingCount);
}
}
protected override PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage InternalRead(BinaryReader reader)
{
PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage transferModel = null;
if (reader.ReadBoolean())
{
transferModel = PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage.Create();
transferModel.CurrentCount = reader.ReadInt32();
transferModel.PlayerId = reader.ReadInt32();
if (reader.ReadBoolean())
{
transferModel.PlayerName = reader.ReadString();
}
if (reader.ReadBoolean())
{
var transferModelUnitsCount = reader.ReadInt32();
transferModel.Units.Clear();
for (var transferModelUnitsIndex = 0; transferModelUnitsIndex < transferModelUnitsCount; transferModelUnitsIndex++)
{
PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage.UnitSubMessage transferModelUnitsValue = default(PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage.UnitSubMessage);
if (reader.ReadBoolean())
{
transferModelUnitsValue = PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage.UnitSubMessage.Create();
transferModelUnitsValue.UnitId = reader.ReadInt32();
transferModelUnitsValue.UnitType = (PixelRPG.Base.Components.GameState.UnitUtils.UnitType)reader.ReadInt32();
}
transferModel.Units.Add(transferModelUnitsValue);
}
}
transferModel.WaitingCount = reader.ReadInt32();
}
return transferModel;
}
}
public class ServerCurrentStateTransferMessageParser : BinaryTransferMessageParser<PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage>
{
protected override int Identifier => 4;
protected override void InternalWrite(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage transferModel, BinaryWriter writer)
{
writer.Write(transferModel != null);
if (transferModel != null)
{
writer.Write(transferModel.Doors != null);
if (transferModel.Doors != null)
{
writer.Write(transferModel.Doors.Count);
for (var transferModelDoorsIndex = 0; transferModelDoorsIndex < transferModel.Doors.Count; transferModelDoorsIndex++)
{
writer.Write(transferModel.Doors[transferModelDoorsIndex] != null);
if (transferModel.Doors[transferModelDoorsIndex] != null)
{
writer.Write(transferModel.Doors[transferModelDoorsIndex].X);
writer.Write(transferModel.Doors[transferModelDoorsIndex].Y);
}
}
}
writer.Write(transferModel.Exit != null);
if (transferModel.Exit != null)
{
writer.Write(transferModel.Exit.X);
writer.Write(transferModel.Exit.Y);
}
writer.Write(transferModel.Map != null);
if (transferModel.Map != null)
{
writer.Write(transferModel.Map.Count);
for (var transferModelMapIndex = 0; transferModelMapIndex < transferModel.Map.Count; transferModelMapIndex++)
{
writer.Write(transferModel.Map[transferModelMapIndex] != null);
if (transferModel.Map[transferModelMapIndex] != null)
{
writer.Write(transferModel.Map[transferModelMapIndex].Value);
}
}
}
writer.Write(transferModel.Players != null);
if (transferModel.Players != null)
{
writer.Write(transferModel.Players.Count);
for (var transferModelPlayersIndex = 0; transferModelPlayersIndex < transferModel.Players.Count; transferModelPlayersIndex++)
{
writer.Write(transferModel.Players[transferModelPlayersIndex] != null);
if (transferModel.Players[transferModelPlayersIndex] != null)
{
writer.Write(transferModel.Players[transferModelPlayersIndex].LevelScore);
writer.Write(transferModel.Players[transferModelPlayersIndex].PlayerId);
writer.Write(transferModel.Players[transferModelPlayersIndex].TotalScore);
writer.Write(transferModel.Players[transferModelPlayersIndex].Units != null);
if (transferModel.Players[transferModelPlayersIndex].Units != null)
{
writer.Write(transferModel.Players[transferModelPlayersIndex].Units.Count);
for (var transferModelPlayerstransferModelPlayersIndexUnitsIndex = 0; transferModelPlayerstransferModelPlayersIndexUnitsIndex < transferModel.Players[transferModelPlayersIndex].Units.Count; transferModelPlayerstransferModelPlayersIndexUnitsIndex++)
{
writer.Write(transferModel.Players[transferModelPlayersIndex].Units[transferModelPlayerstransferModelPlayersIndexUnitsIndex] != null);
if (transferModel.Players[transferModelPlayersIndex].Units[transferModelPlayerstransferModelPlayersIndexUnitsIndex] != null)
{
writer.Write(transferModel.Players[transferModelPlayersIndex].Units[transferModelPlayerstransferModelPlayersIndexUnitsIndex].Hp);
writer.Write(transferModel.Players[transferModelPlayersIndex].Units[transferModelPlayerstransferModelPlayersIndexUnitsIndex].Position != null);
if (transferModel.Players[transferModelPlayersIndex].Units[transferModelPlayerstransferModelPlayersIndexUnitsIndex].Position != null)
{
writer.Write(transferModel.Players[transferModelPlayersIndex].Units[transferModelPlayerstransferModelPlayersIndexUnitsIndex].Position.X);
writer.Write(transferModel.Players[transferModelPlayersIndex].Units[transferModelPlayerstransferModelPlayersIndexUnitsIndex].Position.Y);
}
writer.Write(transferModel.Players[transferModelPlayersIndex].Units[transferModelPlayerstransferModelPlayersIndexUnitsIndex].UnitId);
}
}
}
}
}
}
}
}
protected override PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage InternalRead(BinaryReader reader)
{
PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage transferModel = null;
if (reader.ReadBoolean())
{
transferModel = PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Create();
if (reader.ReadBoolean())
{
var transferModelDoorsCount = reader.ReadInt32();
transferModel.Doors.Clear();
for (var transferModelDoorsIndex = 0; transferModelDoorsIndex < transferModelDoorsCount; transferModelDoorsIndex++)
{
PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.PointSubMessage transferModelDoorsValue = default(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.PointSubMessage);
if (reader.ReadBoolean())
{
transferModelDoorsValue = PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.PointSubMessage.Create();
transferModelDoorsValue.X = reader.ReadInt32();
transferModelDoorsValue.Y = reader.ReadInt32();
}
transferModel.Doors.Add(transferModelDoorsValue);
}
}
if (reader.ReadBoolean())
{
transferModel.Exit = PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.PointSubMessage.Create();
transferModel.Exit.X = reader.ReadInt32();
transferModel.Exit.Y = reader.ReadInt32();
}
if (reader.ReadBoolean())
{
var transferModelMapCount = reader.ReadInt32();
transferModel.Map.Clear();
for (var transferModelMapIndex = 0; transferModelMapIndex < transferModelMapCount; transferModelMapIndex++)
{
System.Nullable<System.Int32> transferModelMapValue = default(System.Nullable<System.Int32>);
if (reader.ReadBoolean())
{
transferModelMapValue = reader.ReadInt32();
}
transferModel.Map.Add(transferModelMapValue);
}
}
if (reader.ReadBoolean())
{
var transferModelPlayersCount = reader.ReadInt32();
transferModel.Players.Clear();
for (var transferModelPlayersIndex = 0; transferModelPlayersIndex < transferModelPlayersCount; transferModelPlayersIndex++)
{
PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.PlayerSubMessage transferModelPlayersValue = default(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.PlayerSubMessage);
if (reader.ReadBoolean())
{
transferModelPlayersValue = PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.PlayerSubMessage.Create();
transferModelPlayersValue.LevelScore = reader.ReadInt32();
transferModelPlayersValue.PlayerId = reader.ReadInt32();
transferModelPlayersValue.TotalScore = reader.ReadInt32();
if (reader.ReadBoolean())
{
var transferModelPlayersValueUnitsCount = reader.ReadInt32();
transferModelPlayersValue.Units.Clear();
for (var transferModelPlayersValueUnitsIndex = 0; transferModelPlayersValueUnitsIndex < transferModelPlayersValueUnitsCount; transferModelPlayersValueUnitsIndex++)
{
PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.UnitSubMessage transferModelPlayersValueUnitsValue = default(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.UnitSubMessage);
if (reader.ReadBoolean())
{
transferModelPlayersValueUnitsValue = PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.UnitSubMessage.Create();
transferModelPlayersValueUnitsValue.Hp = reader.ReadInt32();
if (reader.ReadBoolean())
{
transferModelPlayersValueUnitsValue.Position = PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.PointSubMessage.Create();
transferModelPlayersValueUnitsValue.Position.X = reader.ReadInt32();
transferModelPlayersValueUnitsValue.Position.Y = reader.ReadInt32();
}
transferModelPlayersValueUnitsValue.UnitId = reader.ReadInt32();
}
transferModelPlayersValue.Units.Add(transferModelPlayersValueUnitsValue);
}
}
}
transferModel.Players.Add(transferModelPlayersValue);
}
}
}
return transferModel;
}
}
public class ServerGameStartedTransferMessageParser : BinaryTransferMessageParser<PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage>
{
protected override int Identifier => 5;
protected override void InternalWrite(PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage transferModel, BinaryWriter writer)
{
writer.Write(transferModel != null);
if (transferModel != null)
{
writer.Write(transferModel.Height);
writer.Write(transferModel.Width);
}
}
protected override PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage InternalRead(BinaryReader reader)
{
PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage transferModel = null;
if (reader.ReadBoolean())
{
transferModel = PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage.Create();
transferModel.Height = reader.ReadInt32();
transferModel.Width = reader.ReadInt32();
}
return transferModel;
}
}
public class ServerPlayerTurnMadeTransferMessageParser : BinaryTransferMessageParser<PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessage>
{
protected override int Identifier => 6;
protected override void InternalWrite(PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessage transferModel, BinaryWriter writer)
{
writer.Write(transferModel != null);
if (transferModel != null)
{
writer.Write(transferModel.PlayerId);
}
}
protected override PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessage InternalRead(BinaryReader reader)
{
PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessage transferModel = null;
if (reader.ReadBoolean())
{
transferModel = PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessage.Create();
transferModel.PlayerId = reader.ReadInt32();
}
return transferModel;
}
}
public class ServerYouConnectedTransferMessageParser : BinaryTransferMessageParser<PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage>
{
protected override int Identifier => 7;
protected override void InternalWrite(PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage transferModel, BinaryWriter writer)
{
writer.Write(transferModel != null);
if (transferModel != null)
{
writer.Write(transferModel.PlayerId);
writer.Write(transferModel.UnitsData != null);
if (transferModel.UnitsData != null)
{
writer.Write(transferModel.UnitsData.Count);
for (var transferModelUnitsDataIndex = 0; transferModelUnitsDataIndex < transferModel.UnitsData.Count; transferModelUnitsDataIndex++)
{
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex] != null);
if (transferModel.UnitsData[transferModelUnitsDataIndex] != null)
{
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].AttackDamage);
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].AttackDistance);
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].AttackFriendlyFire);
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].AttackRadius);
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].Hp);
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].MaxHp);
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].MoveRange);
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].UnitId);
writer.Write((int)transferModel.UnitsData[transferModelUnitsDataIndex].UnitType);
writer.Write(transferModel.UnitsData[transferModelUnitsDataIndex].VisionRange);
}
}
}
}
}
protected override PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage InternalRead(BinaryReader reader)
{
PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage transferModel = null;
if (reader.ReadBoolean())
{
transferModel = PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage.Create();
transferModel.PlayerId = reader.ReadInt32();
if (reader.ReadBoolean())
{
var transferModelUnitsDataCount = reader.ReadInt32();
transferModel.UnitsData.Clear();
for (var transferModelUnitsDataIndex = 0; transferModelUnitsDataIndex < transferModelUnitsDataCount; transferModelUnitsDataIndex++)
{
PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage.UnitSubMessage transferModelUnitsDataValue = default(PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage.UnitSubMessage);
if (reader.ReadBoolean())
{
transferModelUnitsDataValue = PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage.UnitSubMessage.Create();
transferModelUnitsDataValue.AttackDamage = reader.ReadInt32();
transferModelUnitsDataValue.AttackDistance = reader.ReadInt32();
transferModelUnitsDataValue.AttackFriendlyFire = reader.ReadBoolean();
transferModelUnitsDataValue.AttackRadius = reader.ReadInt32();
transferModelUnitsDataValue.Hp = reader.ReadInt32();
transferModelUnitsDataValue.MaxHp = reader.ReadInt32();
transferModelUnitsDataValue.MoveRange = reader.ReadInt32();
transferModelUnitsDataValue.UnitId = reader.ReadInt32();
transferModelUnitsDataValue.UnitType = (PixelRPG.Base.Components.GameState.UnitUtils.UnitType)reader.ReadInt32();
transferModelUnitsDataValue.VisionRange = reader.ReadInt32();
}
transferModel.UnitsData.Add(transferModelUnitsDataValue);
}
}
}
return transferModel;
}
}
public class ServerYourTurnTransferMessageParser : BinaryTransferMessageParser<PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage>
{
protected override int Identifier => 8;
protected override void InternalWrite(PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage transferModel, BinaryWriter writer)
{
writer.Write(transferModel != null);
if (transferModel != null)
{
}
}
protected override PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage InternalRead(BinaryReader reader)
{
PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage transferModel = null;
if (reader.ReadBoolean())
{
transferModel = PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage.Create();
}
return transferModel;
}
}
public static partial class TransferMessageParserUtils
{
static TransferMessageParserUtils()
{
AvailableParsers = new ITransferMessageParser[]
{
new ClientConnectTransferMessageParser(),
new ClientTurnDoneTransferMessageParser(),
new ServerClientConnectedTransferMessageParser(),
new ServerCurrentStateTransferMessageParser(),
new ServerGameStartedTransferMessageParser(),
new ServerPlayerTurnMadeTransferMessageParser(),
new ServerYouConnectedTransferMessageParser(),
new ServerYourTurnTransferMessageParser(),
};
}
}
}

