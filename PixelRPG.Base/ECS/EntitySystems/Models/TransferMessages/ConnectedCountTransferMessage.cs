using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.ECS.EntitySystems.Models.TransferMessages
{
    public class ConnectedCountTransferMessage
    {
        public int CurrentCount;
        public int ExpectedCount;
    }

    public class ConnectedCountTransferMessageParser : TransferMessageParser<ConnectedCountTransferMessage>
    {
        protected override string InternalToData(ConnectedCountTransferMessage transferModel)
        {
            return $"{transferModel.CurrentCount}:{transferModel.ExpectedCount}";
        }

        protected override ConnectedCountTransferMessage InternalToTransferModel(string data)
        {
            var splittedData = data.Split(':');
            return new ConnectedCountTransferMessage
            {
                CurrentCount = int.Parse(splittedData[0]),
                ExpectedCount = int.Parse(splittedData[1])
            };
        }
    }
}
