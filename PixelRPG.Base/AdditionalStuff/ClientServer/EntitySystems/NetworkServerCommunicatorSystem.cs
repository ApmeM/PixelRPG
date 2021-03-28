﻿namespace PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems
{
    using System.Collections.Generic;

    using LocomotorECS;
    using LocomotorECS.Matching;

#if !Bridge
    using System.Net.Sockets;
    using System.Net;
#endif

    using PixelRPG.Base.AdditionalStuff.ClientServer;
    using System.Text;
    using System.Text.RegularExpressions;
    using System;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;

    public class NetworkServerCommunicatorSystem : EntityProcessingSystem
    {
        private readonly ITransferMessageParser[] parsers;

        public NetworkServerCommunicatorSystem(ITransferMessageParser[] parsers = null) : base(new Matcher().All(typeof(NetworkServerComponent), typeof(ServerComponent)))
        {
            this.parsers = parsers;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
#if Bridge
            System.Diagnostics.Debug.WriteLine("Network server is not available for web version.");
#else
            var networkServer = entity.GetComponent<NetworkServerComponent>();
            var server = entity.GetComponent<ServerComponent>();

            if (networkServer.Listener == null)
            {
                networkServer.Listener = new TcpListener(IPAddress.Parse(networkServer.Ip), networkServer.Port);
                networkServer.Listener.Start();
            }

            if (networkServer.ConnectResult == null)
            {
                networkServer.ConnectResult = networkServer.Listener.BeginAcceptTcpClient((a) => { }, null);
            }

            if (networkServer.ConnectResult.IsCompleted)
            {
                server.ConnectedPlayers++;
                var tcpClient = networkServer.Listener.EndAcceptTcpClient(networkServer.ConnectResult);
                networkServer.Clients.Add(tcpClient);
                networkServer.ConnectionKeyToClient[server.ConnectedPlayers] = tcpClient;
                networkServer.ClientToConnectionKey[tcpClient] = server.ConnectedPlayers;
                server.Request[networkServer.ClientToConnectionKey[tcpClient]] = new Queue<ITransferMessage>();
                server.Response[networkServer.ClientToConnectionKey[tcpClient]] = new Queue<ITransferMessage>();
                networkServer.ConnectResult = null;
            }

            for (var i = 0; i < networkServer.Clients.Count; i++)
            {
                var tcpClient = networkServer.Clients[i];
                var connectionKey = networkServer.ClientToConnectionKey[tcpClient];
                if (tcpClient.Available > 0)
                {
                    byte[] bytes = new byte[tcpClient.Available];
                    tcpClient.GetStream().Read(bytes, 0, tcpClient.Available);
                    string data = Encoding.UTF8.GetString(bytes);

                    if (Regex.IsMatch(data, "^GET", RegexOptions.IgnoreCase))
                    {
                        // 1. Obtain the value of the "Sec-WebSocket-Key" request header without any leading or trailing whitespace
                        // 2. Concatenate it with "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" (a special GUID specified by RFC 6455)
                        // 3. Compute SHA-1 and Base64 hash of the new value
                        // 4. Write the hash back as the value of "Sec-WebSocket-Accept" response header in an HTTP response
                        string swk = Regex.Match(data, "Sec-WebSocket-Key: (.*)").Groups[1].Value.Trim();
                        string swka = swk + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                        byte[] swkaSha1 = System.Security.Cryptography.SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(swka));
                        string swkaSha1Base64 = Convert.ToBase64String(swkaSha1);

                        var value = "HTTP/1.1 101 Switching Protocols\r\n" +
                                                    "Connection: Upgrade\r\n" +
                                                    "Upgrade: websocket\r\n" +
                                                    "Sec-WebSocket-Accept: " + swkaSha1Base64 + "\r\n\r\n";
                        byte[] responseBytes = Encoding.UTF8.GetBytes(value);
                        tcpClient.GetStream().Write(responseBytes, 0, value.Length);
                        continue;
                    }

                    data = Encoding.UTF8.GetString(GetDecodedData(bytes, bytes.Length));
                    var parser = TransferMessageParserUtils.FindReader(data, parsers);
                    var transferMessage = parser.Read(data);
                    server.Request[connectionKey].Enqueue(transferMessage);
                    System.Diagnostics.Debug.WriteLine($"Network Server <- ({connectionKey}.{transferMessage}): {data}");
                    continue;
                }

                var response = server.Response[connectionKey];
                if (response.Count > 0)
                {
                    var transferMessage = response.Dequeue();
                    var parser = TransferMessageParserUtils.FindWriter(transferMessage, parsers);
                    var data = parser.Write(transferMessage);
                    System.Diagnostics.Debug.WriteLine($"Network Server -> ({connectionKey}.{transferMessage}): {data}");
                    (transferMessage as IPoolableTransferMessage)?.Free();
                    byte[] frame = GetFrameFromBytes(Encoding.UTF8.GetBytes(data));

                    tcpClient.GetStream().Write(frame, 0, frame.Length);
                    tcpClient.GetStream().Flush();
                    return;
                }
            }
#endif
        }


        public static byte[] GetDecodedData(byte[] buffer, int length)
        {
            var b = buffer[1];
            var dataLength = 0;
            var totalLength = 0;
            var keyIndex = 0;

            if (b - 128 <= 125)
            {
                dataLength = b - 128;
                keyIndex = 2;
                totalLength = dataLength + 6;
            }

            if (b - 128 == 126)
            {
                dataLength = BitConverter.ToInt16(new byte[] { buffer[3], buffer[2] }, 0);
                keyIndex = 4;
                totalLength = dataLength + 8;
            }

            if (b - 128 == 127)
            {
                dataLength = (int)BitConverter.ToInt64(new byte[] { buffer[9], buffer[8], buffer[7], buffer[6], buffer[5], buffer[4], buffer[3], buffer[2] }, 0);
                keyIndex = 10;
                totalLength = dataLength + 14;
            }

            if (totalLength > length)
                throw new Exception("The buffer length is small than the data length");

            var key = new byte[] { buffer[keyIndex], buffer[keyIndex + 1], buffer[keyIndex + 2], buffer[keyIndex + 3] };

            var dataIndex = keyIndex + 4;
            var count = 0;
            for (var i = dataIndex; i < totalLength; i++)
            {
                buffer[i] = (byte)(buffer[i] ^ key[count % 4]);
                count++;
            }

            var retBytes = new byte[dataLength];

            Array.Copy(buffer, dataIndex, retBytes, 0, dataLength);

            return retBytes;
        }

        public static byte[] GetFrameFromBytes(byte[] bytesRaw)
        {
            byte[] response;
            var frame = new byte[10];

            var indexStartRawData = -1;
            var length = bytesRaw.Length;

            frame[0] = 128 + 1;
            if (length <= 125)
            {
                frame[1] = (byte)length;
                indexStartRawData = 2;
            }
            else if (length >= 126 && length <= 65535)
            {
                frame[1] = 126;
                frame[2] = (byte)(length >> 8 & 255);
                frame[3] = (byte)(length & 255);
                indexStartRawData = 4;
            }
            else
            {
                frame[1] = 127;
                frame[2] = (byte)(length >> 56 & 255);
                frame[3] = (byte)(length >> 48 & 255);
                frame[4] = (byte)(length >> 40 & 255);
                frame[5] = (byte)(length >> 32 & 255);
                frame[6] = (byte)(length >> 24 & 255);
                frame[7] = (byte)(length >> 16 & 255);
                frame[8] = (byte)(length >> 8 & 255);
                frame[9] = (byte)(length & 255);

                indexStartRawData = 10;
            }

            response = new byte[indexStartRawData + length];

            int i, reponseIdx = 0;

            //Add the frame bytes to the reponse
            for (i = 0; i < indexStartRawData; i++)
            {
                response[reponseIdx] = frame[i];
                reponseIdx++;
            }

            //Add the data bytes to the response
            for (i = 0; i < length; i++)
            {
                response[reponseIdx] = bytesRaw[i];
                reponseIdx++;
            }

            return response;
        }
    }
}
