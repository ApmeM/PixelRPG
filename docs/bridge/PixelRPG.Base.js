/**
 * @version 1.0.0
 * @author ApmeM
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.6.0
 */
Bridge.assembly("PixelRPG.Base", function ($asm, globals) {
    "use strict";

    Bridge.define("PixelRPG.Base.Assets.UnitAnimation", {
        props: {
            Idle: null,
            Run: null,
            Attack: null,
            Die: null
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent", {
        inherits: [LocomotorECS.Component],
        props: {
            AIBot: null
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.BrainAI.EntitySystems.AIUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var ai = entity.GetComponent(PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent);
                ai.AIBot.BrainAI$AI$IAITurn$Tick();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.ITransferMessageParser", {
        $kind: "interface"
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            Message: null,
            Response: null
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.Components.LocalClientComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            ServerEntity: null,
            Identifier: null
        },
        ctors: {
            init: function () {
                this.Identifier = new System.Guid();
                this.Identifier = System.Guid.Empty;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.Components.LocalServerComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            Request: null,
            Response: null,
            PendingConnections: null,
            ClientToPlayerId: null,
            PlayerIdToClient: null,
            Clients: null
        },
        ctors: {
            init: function () {
                this.Request = new (System.Collections.Generic.Dictionary$2(System.Guid,System.Collections.Generic.List$1(System.String)))();
                this.Response = new (System.Collections.Generic.Dictionary$2(System.Guid,System.Collections.Generic.List$1(System.String)))();
                this.PendingConnections = new (System.Collections.Generic.List$1(System.Guid)).ctor();
                this.ClientToPlayerId = new (System.Collections.Generic.Dictionary$2(System.Guid,System.Int32))();
                this.PlayerIdToClient = new (System.Collections.Generic.Dictionary$2(System.Int32,System.Guid))();
                this.Clients = new (System.Collections.Generic.List$1(System.Guid)).ctor();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.Components.NetworkClientComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            Client: null,
            RecievingTask: null,
            RecievingBuffer: null
        },
        props: {
            ServerAddress: null
        },
        ctors: {
            init: function () {
                this.RecievingBuffer = new System.ArraySegment();
                this.RecievingBuffer = new System.ArraySegment(System.Array.init(2048, 0, System.Byte));
            },
            ctor: function (serverAddress) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.ServerAddress = serverAddress;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.Components.NetworkServerComponent", {
        inherits: [LocomotorECS.Component],
        props: {
            Ip: null,
            Port: 0
        },
        ctors: {
            ctor: function (ip, port) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.Ip = ip;
                this.Port = port;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.Components.ServerComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            ConnectedPlayers: 0,
            Request: null,
            Response: null
        },
        ctors: {
            init: function () {
                this.Request = new (System.Collections.Generic.Dictionary$2(System.Int32,System.Collections.Generic.List$1(System.Object)))();
                this.Response = new (System.Collections.Generic.Dictionary$2(System.Int32,System.Collections.Generic.List$1(System.Object)))();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1", function (T) { return {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function (matcher) {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, matcher.All([PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var client = entity.GetComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent);
                if (client.Response == null || !Bridge.referenceEquals(Bridge.getType(client.Response), T)) {
                    return;
                }

                var message = Bridge.cast(Bridge.unbox(client.Response, T), T);
                this.DoAction$2(message, entity, gameTime);
            }
        }
    }; });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientSendHandlerSystem$1", function (T) { return {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function (matcher) {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, matcher.All([PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var client = entity.GetComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent);

                var data = this.PrepareSendData(entity, gameTime);

                if (data != null) {
                    client.Message = data;
                }
            }
        }
    }; });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.LocalClientCommunicatorSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        fields: {
            scene: null,
            parsers: null
        },
        ctors: {
            ctor: function (scene, parsers) {
                if (parsers === void 0) { parsers = []; }

                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.ClientServer.Components.LocalClientComponent, PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent]));
                this.scene = scene;
                this.parsers = parsers;
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var localClient = entity.GetComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.LocalClientComponent);
                var client = entity.GetComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent);
                var serverEntity = this.scene.FindEntity(localClient.ServerEntity);
                var localServer = serverEntity.GetComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.LocalServerComponent);

                if (System.Guid.op_Equality(localClient.Identifier, System.Guid.Empty)) {
                    localClient.Identifier = System.Guid.NewGuid();
                    localServer.PendingConnections.add(localClient.Identifier);
                    return;
                }

                if (client.Message != null) {
                    var parser = PixelRPG.Base.AdditionalStuff.ClientServer.ParserUtils.FindWriter(client.Message, this.parsers);
                    var data = parser.PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$Write(client.Message);
                    localServer.Request.get(localClient.Identifier).add(data);
                    client.Message = null;
                }

                var response = localServer.Response.get(localClient.Identifier);
                client.Response = null;
                if (response.Count !== 0) {
                    var parser1 = PixelRPG.Base.AdditionalStuff.ClientServer.ParserUtils.FindReader(response.getItem(0), this.parsers);
                    var transferMessage = parser1.PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$Read(response.getItem(0));
                    client.Response = transferMessage;
                    localServer.Response.get(localClient.Identifier).removeAt(0);
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.LocalServerCommunicatorSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        fields: {
            parsers: null
        },
        ctors: {
            ctor: function (parsers) {
                if (parsers === void 0) { parsers = []; }

                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.ClientServer.Components.LocalServerComponent, PixelRPG.Base.AdditionalStuff.ClientServer.Components.ServerComponent]));
                this.parsers = parsers;
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var localServer = entity.GetComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.LocalServerComponent);
                var server = entity.GetComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.ServerComponent);

                if (localServer.PendingConnections.Count > 0) {
                    for (var i = 0; i < localServer.PendingConnections.Count; i = (i + 1) | 0) {
                        server.ConnectedPlayers = (server.ConnectedPlayers + 1) | 0;
                        var tcpClient = localServer.PendingConnections.getItem(i);
                        localServer.Clients.add(tcpClient);
                        localServer.PlayerIdToClient.set(server.ConnectedPlayers, tcpClient);
                        localServer.ClientToPlayerId.set(tcpClient, server.ConnectedPlayers);
                        server.Request.set(localServer.ClientToPlayerId.get(tcpClient), new (System.Collections.Generic.List$1(System.Object)).ctor());
                        server.Response.set(localServer.ClientToPlayerId.get(tcpClient), new (System.Collections.Generic.List$1(System.Object)).ctor());
                        localServer.Request.set(tcpClient, new (System.Collections.Generic.List$1(System.String)).ctor());
                        localServer.Response.set(tcpClient, new (System.Collections.Generic.List$1(System.String)).ctor());
                    }
                    localServer.PendingConnections.clear();
                }

                for (var i1 = 0; i1 < localServer.Clients.Count; i1 = (i1 + 1) | 0) {
                    var client = localServer.Clients.getItem(i1);
                    var id = localServer.ClientToPlayerId.get(client);
                    if (localServer.Request.containsKey(client) && localServer.Request.get(client).Count > 0) {
                        var data = localServer.Request.get(client);
                        for (var j = 0; j < data.Count; j = (j + 1) | 0) {
                            var parser = PixelRPG.Base.AdditionalStuff.ClientServer.ParserUtils.FindReader(data.getItem(j), this.parsers);
                            var transferMessage = parser.PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$Read(data.getItem(j));
                            server.Request.get(id).add(transferMessage);
                        }
                        data.clear();
                    }

                    if (server.Response.containsKey(id) && server.Response.get(id).Count > 0) {
                        var transferMessages = server.Response.get(id);
                        for (var j1 = 0; j1 < transferMessages.Count; j1 = (j1 + 1) | 0) {
                            var parser1 = PixelRPG.Base.AdditionalStuff.ClientServer.ParserUtils.FindWriter(transferMessages.getItem(j1), this.parsers);
                            var data1 = parser1.PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$Write(transferMessages.getItem(j1));
                            localServer.Response.get(client).add(data1);
                        }
                        transferMessages.clear();
                    }
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.NetworkClientCommunicatorSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        fields: {
            ms: null,
            reader: null,
            parsers: null
        },
        ctors: {
            ctor: function (parsers) {
                if (parsers === void 0) { parsers = []; }

                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.ClientServer.Components.NetworkClientComponent, PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent]));
                this.ms = new System.IO.MemoryStream.ctor();
                this.reader = new System.IO.StreamReader.$ctor3(this.ms, System.Text.Encoding.UTF8);
                this.parsers = parsers;
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var networkClient = entity.GetComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.NetworkClientComponent);
                var client = entity.GetComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent);

                if (networkClient.Client == null) {
                    networkClient.Client = new System.Net.WebSockets.ClientWebSocket();
                    networkClient.Client.connectAsync(networkClient.ServerAddress, System.Threading.CancellationToken.none);
                }

                if (networkClient.Client.getState() !== "open") {
                    return;
                }

                if (client.Message != null) {
                    var transferModel = client.Message;
                    var parser = PixelRPG.Base.AdditionalStuff.ClientServer.ParserUtils.FindWriter(transferModel, this.parsers);
                    var data = parser.PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$Write(transferModel);
                    networkClient.Client.sendAsync(new System.ArraySegment(System.Text.Encoding.UTF8.GetBytes$2(data)), "text", true, System.Threading.CancellationToken.none);
                    client.Message = null;
                    return;
                }

                client.Response = null;

                if (networkClient.RecievingTask == null) {
                    networkClient.RecievingTask = networkClient.Client.receiveAsync(networkClient.RecievingBuffer, System.Threading.CancellationToken.none);
                }

                if (networkClient.RecievingTask.isCompleted()) {
                    var result = networkClient.RecievingTask.getResult();
                    networkClient.RecievingTask = null;
                    this.ms.Seek(System.Int64(0), 0);
                    this.ms.SetLength(System.Int64(0));
                    this.ms.Write(networkClient.RecievingBuffer.getArray(), networkClient.RecievingBuffer.getOffset(), result.getCount());

                    while (!result.getEndOfMessage()) {
                        result = networkClient.Client.receiveAsync(networkClient.RecievingBuffer, System.Threading.CancellationToken.none).getResult();
                        this.ms.Write(networkClient.RecievingBuffer.getArray(), networkClient.RecievingBuffer.getOffset(), result.getCount());
                    }
                    ;


                    this.ms.Seek(System.Int64(0), 0);
                    var data1 = this.reader.ReadToEnd();

                    var parser1 = PixelRPG.Base.AdditionalStuff.ClientServer.ParserUtils.FindReader(data1, this.parsers);
                    client.Response = parser1.PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$Read(data1);
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.NetworkServerCommunicatorSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        statics: {
            methods: {
                GetDecodedData: function (buffer, length) {
                    var b = buffer[System.Array.index(1, buffer)];
                    var dataLength = 0;
                    var totalLength = 0;
                    var keyIndex = 0;

                    if (((b - 128) | 0) <= 125) {
                        dataLength = (b - 128) | 0;
                        keyIndex = 2;
                        totalLength = (dataLength + 6) | 0;
                    }

                    if (((b - 128) | 0) === 126) {
                        dataLength = System.BitConverter.toInt16(System.Array.init([buffer[System.Array.index(3, buffer)], buffer[System.Array.index(2, buffer)]], System.Byte), 0);
                        keyIndex = 4;
                        totalLength = (dataLength + 8) | 0;
                    }

                    if (((b - 128) | 0) === 127) {
                        dataLength = System.Int64.clip32(System.BitConverter.toInt64(System.Array.init([buffer[System.Array.index(9, buffer)], buffer[System.Array.index(8, buffer)], buffer[System.Array.index(7, buffer)], buffer[System.Array.index(6, buffer)], buffer[System.Array.index(5, buffer)], buffer[System.Array.index(4, buffer)], buffer[System.Array.index(3, buffer)], buffer[System.Array.index(2, buffer)]], System.Byte), 0));
                        keyIndex = 10;
                        totalLength = (dataLength + 14) | 0;
                    }

                    if (totalLength > length) {
                        throw new System.Exception("The buffer length is small than the data length");
                    }

                    var key = System.Array.init([buffer[System.Array.index(keyIndex, buffer)], buffer[System.Array.index(((keyIndex + 1) | 0), buffer)], buffer[System.Array.index(((keyIndex + 2) | 0), buffer)], buffer[System.Array.index(((keyIndex + 3) | 0), buffer)]], System.Byte);

                    var dataIndex = (keyIndex + 4) | 0;
                    var count = 0;
                    for (var i = dataIndex; i < totalLength; i = (i + 1) | 0) {
                        buffer[System.Array.index(i, buffer)] = (buffer[System.Array.index(i, buffer)] ^ key[System.Array.index(count % 4, key)]) & 255;
                        count = (count + 1) | 0;
                    }

                    var retBytes = System.Array.init(dataLength, 0, System.Byte);

                    System.Array.copy(buffer, dataIndex, retBytes, 0, dataLength);

                    return retBytes;
                },
                GetFrameFromBytes: function (bytesRaw) {
                    var response;
                    var frame = System.Array.init(10, 0, System.Byte);

                    var indexStartRawData = -1;
                    var length = bytesRaw.length;

                    frame[System.Array.index(0, frame)] = 129;
                    if (length <= 125) {
                        frame[System.Array.index(1, frame)] = length & 255;
                        indexStartRawData = 2;
                    } else if (length >= 126 && length <= 65535) {
                        frame[System.Array.index(1, frame)] = 126;
                        frame[System.Array.index(2, frame)] = (length >> 8 & 255) & 255;
                        frame[System.Array.index(3, frame)] = (length & 255) & 255;
                        indexStartRawData = 4;
                    } else {
                        frame[System.Array.index(1, frame)] = 127;
                        frame[System.Array.index(2, frame)] = (length >> 56 & 255) & 255;
                        frame[System.Array.index(3, frame)] = (length >> 48 & 255) & 255;
                        frame[System.Array.index(4, frame)] = (length >> 40 & 255) & 255;
                        frame[System.Array.index(5, frame)] = (length >> 32 & 255) & 255;
                        frame[System.Array.index(6, frame)] = (length >> 24 & 255) & 255;
                        frame[System.Array.index(7, frame)] = (length >> 16 & 255) & 255;
                        frame[System.Array.index(8, frame)] = (length >> 8 & 255) & 255;
                        frame[System.Array.index(9, frame)] = (length & 255) & 255;

                        indexStartRawData = 10;
                    }

                    response = System.Array.init(((indexStartRawData + length) | 0), 0, System.Byte);

                    var i, reponseIdx = 0;

                    //Add the frame bytes to the reponse
                    for (i = 0; i < indexStartRawData; i = (i + 1) | 0) {
                        response[System.Array.index(reponseIdx, response)] = frame[System.Array.index(i, frame)];
                        reponseIdx = (reponseIdx + 1) | 0;
                    }

                    //Add the data bytes to the response
                    for (i = 0; i < length; i = (i + 1) | 0) {
                        response[System.Array.index(reponseIdx, response)] = bytesRaw[System.Array.index(i, bytesRaw)];
                        reponseIdx = (reponseIdx + 1) | 0;
                    }

                    return response;
                }
            }
        },
        fields: {
            parsers: null
        },
        ctors: {
            ctor: function (parsers) {
                if (parsers === void 0) { parsers = []; }

                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.ClientServer.Components.NetworkServerComponent, PixelRPG.Base.AdditionalStuff.ClientServer.Components.ServerComponent]));
                this.parsers = parsers;
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        fields: {
            handlers: null
        },
        ctors: {
            ctor: function (handlers) {
                if (handlers === void 0) { handlers = []; }

                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.ClientServer.Components.ServerComponent]));
                this.handlers = System.Linq.Enumerable.from(handlers).toDictionary($asm.$.PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem.f1, null, Function, PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem.IHandler);
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                var $t;
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var server = entity.GetComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.ServerComponent);
                $t = Bridge.getEnumerator(server.Request);
                try {
                    while ($t.moveNext()) {
                        var req = $t.Current;
                        if (!server.Response.containsKey(req.key)) {
                            server.Response.set(req.key, new (System.Collections.Generic.List$1(System.Object)).ctor());
                        }

                        for (var i = 0; i < req.value.Count; i = (i + 1) | 0) {
                            this.handlers.get(Bridge.getType(req.value.getItem(i))).PixelRPG$Base$AdditionalStuff$ClientServer$EntitySystems$ServerReceiveHandlerSystem$IHandler$Handle(server, req.key, req.value.getItem(i));
                        }

                        req.value.clear();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    Bridge.ns("PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem", $asm.$);

    Bridge.apply($asm.$.PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem, {
        f1: function (a) {
            return a.PixelRPG$Base$AdditionalStuff$ClientServer$EntitySystems$ServerReceiveHandlerSystem$IHandler$MessageType;
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem.IHandler", {
        $kind: "nested interface"
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.ParserUtils", {
        statics: {
            methods: {
                FindWriter: function (transferModel, parsers) {
                    for (var j = 0; j < parsers.length; j = (j + 1) | 0) {
                        if (parsers[System.Array.index(j, parsers)].PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$IsWritable(transferModel)) {
                            return parsers[System.Array.index(j, parsers)];
                        }
                    }

                    return null;
                },
                FindReader: function (data, parsers) {
                    for (var j = 0; j < parsers.length; j = (j + 1) | 0) {
                        if (parsers[System.Array.index(j, parsers)].PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$IsReadable(data)) {
                            return parsers[System.Array.index(j, parsers)];
                        }
                    }

                    return null;
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Common.Components.CameraShakeComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            Camera: null,
            ShakeDegredation: 0,
            ShakeDirection: null,
            ShakeIntensity: 0,
            ShakeOffset: null
        },
        ctors: {
            init: function () {
                this.ShakeDirection = new Microsoft.Xna.Framework.Vector2();
                this.ShakeOffset = new Microsoft.Xna.Framework.Vector2();
                this.ShakeDegredation = 0.95;
            },
            ctor: function (camera) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.Camera = camera;
            }
        },
        methods: {
            /**
             * if the shake is already running this will overwrite the current values only if shakeIntensity &gt; the current
                 shakeIntensity.
                 if the shake is not currently active it will be started.
             *
             * @instance
             * @public
             * @this PixelRPG.Base.AdditionalStuff.Common.Components.CameraShakeComponent
             * @memberof PixelRPG.Base.AdditionalStuff.Common.Components.CameraShakeComponent
             * @param   {number}                             shakeIntensity      how much should we shake it
             * @param   {number}                             shakeDegredation    higher values cause faster degradation
             * @param   {Microsoft.Xna.Framework.Vector2}    shakeDirection      Vector3.zero will result in a shake on just the x/y axis. any other values will result in the passed
                 in shakeDirection * intensity being the offset the camera is moved
             * @return  {void}
             */
            Shake: function (shakeIntensity, shakeDegredation, shakeDirection) {
                if (shakeIntensity === void 0) { shakeIntensity = 15.0; }
                if (shakeDegredation === void 0) { shakeDegredation = 0.9; }
                if (shakeDirection === void 0) { shakeDirection = new Microsoft.Xna.Framework.Vector2(); }
                this.Enabled = true;
                if (this.ShakeIntensity >= shakeIntensity) {
                    return;
                }

                this.ShakeDirection = shakeDirection.$clone();
                this.ShakeIntensity = shakeIntensity;
                if (shakeDegredation < 0.0 || shakeDegredation >= 1.0) {
                    shakeDegredation = 0.95;
                }

                this.ShakeDegredation = shakeDegredation;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            AffectsIntensity: false,
            /**
             * this value is multiplied by the calculated value
             *
             * @instance
             * @public
             * @memberof PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent
             * @default 1.0
             * @type number
             */
            Amplitude: 0,
            ColorChannel: 0,
            /**
             * cycles per second
             *
             * @instance
             * @public
             * @memberof PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent
             * @default 0.5
             * @type number
             */
            Frequency: 0,
            /**
             * This value is added to the final result. 0 - 1 range.
             *
             * @instance
             * @public
             * @memberof PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent
             * @default 0.0
             * @type number
             */
            Offset: 0,
            OriginalColor: null,
            /**
             * start point in wave function. 0 - 1 range.
             *
             * @instance
             * @public
             * @memberof PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent
             * @default 0.0
             * @type number
             */
            Phase: 0,
            WaveFunction: 0
        },
        ctors: {
            init: function () {
                this.AffectsIntensity = true;
                this.Amplitude = 1.0;
                this.ColorChannel = PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.ColorChannels.All;
                this.Frequency = 0.5;
                this.Offset = 0.0;
                this.Phase = 0.0;
                this.WaveFunction = PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.WaveFunctions.Sin;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.ColorChannels", {
        $kind: "nested enum",
        statics: {
            fields: {
                None: 0,
                All: 1,
                Red: 2,
                Green: 3,
                Blue: 4
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.WaveFunctions", {
        $kind: "nested enum",
        statics: {
            fields: {
                Sin: 0,
                Triangle: 1,
                Square: 2,
                SawTooth: 3,
                InvertedSawTooth: 4,
                Random: 5
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Common.Components.FollowCameraComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            DesiredPosition: null,
            /**
             * how fast the camera closes the distance to the target position
             *
             * @instance
             * @public
             * @memberof PixelRPG.Base.AdditionalStuff.Common.Components.FollowCameraComponent
             * @default 0.2
             * @type number
             */
            FollowLerp: 0
        },
        props: {
            Camera: null
        },
        ctors: {
            init: function () {
                this.DesiredPosition = new Microsoft.Xna.Framework.Vector2();
                this.FollowLerp = 0.2;
            },
            ctor: function (camera) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.Camera = camera;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Common.Components.FollowCursorComponent", {
        inherits: [LocomotorECS.Component]
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Common.EntitySystems.CameraShakeUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.Common.Components.CameraShakeComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var shake = entity.GetComponent(PixelRPG.Base.AdditionalStuff.Common.Components.CameraShakeComponent);

                if (!shake.Enabled) {
                    return;
                }

                if (Math.abs(shake.ShakeIntensity) > 0.0) {
                    shake.ShakeOffset = shake.ShakeDirection.$clone();
                    if (shake.ShakeOffset.X !== 0.0 || shake.ShakeOffset.Y !== 0.0) {
                        shake.ShakeOffset.Normalize();
                    } else {
                        shake.ShakeOffset.X = shake.ShakeOffset.X + FateRandom.Fate.GlobalFate.NextFloat() - 0.5;
                        shake.ShakeOffset.Y = shake.ShakeOffset.Y + FateRandom.Fate.GlobalFate.NextFloat() - 0.5;
                    }

                    // ToDo: this needs to be multiplied by camera zoom so that less shake gets applied when zoomed in
                    shake.ShakeOffset = Microsoft.Xna.Framework.Vector2.op_Multiply$1(shake.ShakeOffset.$clone(), shake.ShakeIntensity);
                    shake.ShakeIntensity *= -shake.ShakeDegredation;
                    if (Math.abs(shake.ShakeIntensity) <= 0.01) {
                        shake.ShakeIntensity = 0.0;
                        shake.Enabled = false;
                    }
                }

                shake.Camera.Position = Microsoft.Xna.Framework.Vector2.op_Addition(shake.Camera.Position.$clone(), shake.ShakeOffset.$clone());
            }
        }
    });

    /** @namespace PixelRPG.Base.AdditionalStuff.Common.EntitySystems */

    /**
     * Takes a ColorComponent and cycles the color using different wave forms. 
         A specific color channel can be affected or all of them.
         Useful for making flickering lights and adding atmosphere.
     *
     * @public
     * @class PixelRPG.Base.AdditionalStuff.Common.EntitySystems.ColorCyclerUpdateSystem
     * @augments LocomotorECS.EntityProcessingSystem
     */
    Bridge.define("PixelRPG.Base.AdditionalStuff.Common.EntitySystems.ColorCyclerUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.ColorComponent, PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                var $t;
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var color = entity.GetComponent(SpineEngine.ECS.Components.ColorComponent);
                var colorCycler = entity.GetComponent(PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent);
                colorCycler.OriginalColor = ($t = colorCycler.OriginalColor, $t != null ? $t : color.Color);

                var newColor = new Microsoft.Xna.Framework.Color();
                switch (colorCycler.ColorChannel) {
                    case PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.ColorChannels.All: 
                        newColor = Microsoft.Xna.Framework.Color.op_Multiply(System.Nullable.getValue(colorCycler.OriginalColor).$clone(), this.EvaluateWaveFunction(gameTime.getTotalSeconds(), colorCycler));
                        break;
                    case PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.ColorChannels.Red: 
                        newColor = new Microsoft.Xna.Framework.Color.$ctor7(Bridge.Int.clip32(System.Nullable.getValue(colorCycler.OriginalColor).R * this.EvaluateWaveFunction(gameTime.getTotalSeconds(), colorCycler)), System.Nullable.getValue(colorCycler.OriginalColor).G, System.Nullable.getValue(colorCycler.OriginalColor).B, System.Nullable.getValue(colorCycler.OriginalColor).A);
                        break;
                    case PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.ColorChannels.Green: 
                        newColor = new Microsoft.Xna.Framework.Color.$ctor7(System.Nullable.getValue(colorCycler.OriginalColor).R, Bridge.Int.clip32(System.Nullable.getValue(colorCycler.OriginalColor).G * this.EvaluateWaveFunction(gameTime.getTotalSeconds(), colorCycler)), System.Nullable.getValue(colorCycler.OriginalColor).B, System.Nullable.getValue(colorCycler.OriginalColor).A);
                        break;
                    case PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.ColorChannels.Blue: 
                        newColor = new Microsoft.Xna.Framework.Color.$ctor7(System.Nullable.getValue(colorCycler.OriginalColor).R, System.Nullable.getValue(colorCycler.OriginalColor).G, Bridge.Int.clip32(System.Nullable.getValue(colorCycler.OriginalColor).B * this.EvaluateWaveFunction(gameTime.getTotalSeconds(), colorCycler)), System.Nullable.getValue(colorCycler.OriginalColor).A);
                        break;
                    default: 
                        newColor = color.Color.$clone();
                        break;
                }

                if (colorCycler.AffectsIntensity) {
                    newColor.A = Bridge.Int.clipu8(System.Nullable.getValue(colorCycler.OriginalColor).A * this.EvaluateWaveFunction(gameTime.getTotalSeconds(), colorCycler));
                } else {
                    newColor.A = System.Nullable.getValue(colorCycler.OriginalColor).A;
                }

                color.Color = newColor.$clone();
            },
            EvaluateWaveFunction: function (secondsPassed, colorCycler) {
                var t = (secondsPassed + colorCycler.Phase) * colorCycler.Frequency;
                t = t - SpineEngine.Maths.Mathf.Floor(t); // normalized value (0..1)
                var y = 1.0;

                switch (colorCycler.WaveFunction) {
                    case PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.WaveFunctions.Sin: 
                        y = SpineEngine.Maths.Mathf.Sin(1.0 * t * Microsoft.Xna.Framework.MathHelper.Pi);
                        break;
                    case PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.WaveFunctions.Triangle: 
                        if (t < 0.5) {
                            y = 4.0 * t - 1.0;
                        } else {
                            y = -4.0 * t + 3.0;
                        }
                        break;
                    case PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.WaveFunctions.Square: 
                        if (t < 0.5) {
                            y = 1.0;
                        } else {
                            y = -1.0;
                        }
                        break;
                    case PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.WaveFunctions.SawTooth: 
                        y = t;
                        break;
                    case PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.WaveFunctions.InvertedSawTooth: 
                        y = 1.0 - t;
                        break;
                    case PixelRPG.Base.AdditionalStuff.Common.Components.ColorCyclerComponent.WaveFunctions.Random: 
                        y = 1.0 - FateRandom.Fate.GlobalFate.NextFloat() * 2.0;
                        break;
                }

                return y * colorCycler.Amplitude + colorCycler.Offset;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Common.EntitySystems.FollowCameraUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.Common.Components.FollowCameraComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var follow = entity.GetComponent(PixelRPG.Base.AdditionalStuff.Common.Components.FollowCameraComponent);

                this.UpdateFollow(entity);

                follow.Camera.Position = Microsoft.Xna.Framework.Vector2.Lerp(follow.Camera.Position.$clone(), follow.DesiredPosition.$clone(), follow.FollowLerp);

                follow.Camera.Position = new Microsoft.Xna.Framework.Vector2.$ctor2(Bridge.Math.round(follow.Camera.Position.X, 0, 6), Bridge.Math.round(follow.Camera.Position.Y, 0, 6));
            },
            UpdateFollow: function (entity) {
                var follow = entity.GetComponent(PixelRPG.Base.AdditionalStuff.Common.Components.FollowCameraComponent);

                follow.DesiredPosition.X = (follow.DesiredPosition.Y = 0, 0);

                var transform = SpineEngine.Maths.TransformationUtils.GetTransformation(entity);

                follow.DesiredPosition.X = transform.Position.X;
                follow.DesiredPosition.Y = transform.Position.Y;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Common.EntitySystems.FollowCursorUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        fields: {
            scene: null
        },
        ctors: {
            ctor: function (scene) {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.Common.Components.FollowCursorComponent]));
                this.scene = scene;
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var pos = entity.GetOrCreateComponent(SpineEngine.ECS.Components.PositionComponent);
                var mouse = entity.GetOrCreateComponent(SpineEngine.ECS.Components.InputMouseComponent);
                var touch = entity.GetOrCreateComponent(SpineEngine.ECS.Components.InputTouchComponent);

                if (System.Linq.Enumerable.from(touch.CurrentTouches).any()) {
                    pos.Position = touch.GetScaledPosition(System.Linq.Enumerable.from(touch.CurrentTouches).first().Position.$clone());
                } else {
                    pos.Position = mouse.MousePosition.$clone();
                }

                pos.Position = this.scene.Camera.ScreenToWorldPoint$1(pos.Position.$clone());
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ContentPaths", {
        statics: {
            fields: {
                content: null
            },
            ctors: {
                init: function () {
                    this.content = "Content";
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ContentPaths.Effects", {
        $kind: "nested class",
        statics: {
            fields: {
                bevels: null,
                bloomCombine: null,
                bloomExtract: null,
                crosshatch: null,
                deferredLighting: null,
                deferredSprite: null,
                dissolve: null,
                dots: null,
                forwardLighting: null,
                gaussianBlur: null,
                grayscale: null,
                heatDistortion: null,
                invert: null,
                letterbox: null,
                multiTexture: null,
                multiTextureOverlay: null,
                noise: null,
                paletteCycler: null,
                pixelGlitch: null,
                polygonLight: null,
                reflection: null,
                scanlines: null,
                sepia: null,
                spriteAlphaTest: null,
                spriteBlinkEffect: null,
                spriteLightMultiply: null,
                spriteLines: null,
                squares: null,
                textureWipe: null,
                twist: null,
                vignette: null,
                wind: null
            },
            ctors: {
                init: function () {
                    this.bevels = "effects/Bevels";
                    this.bloomCombine = "effects/BloomCombine";
                    this.bloomExtract = "effects/BloomExtract";
                    this.crosshatch = "effects/Crosshatch";
                    this.deferredLighting = "effects/DeferredLighting";
                    this.deferredSprite = "effects/DeferredSprite";
                    this.dissolve = "effects/Dissolve";
                    this.dots = "effects/Dots";
                    this.forwardLighting = "effects/ForwardLighting";
                    this.gaussianBlur = "effects/GaussianBlur";
                    this.grayscale = "effects/Grayscale";
                    this.heatDistortion = "effects/HeatDistortion";
                    this.invert = "effects/Invert";
                    this.letterbox = "effects/Letterbox";
                    this.multiTexture = "effects/MultiTexture";
                    this.multiTextureOverlay = "effects/MultiTextureOverlay";
                    this.noise = "effects/Noise";
                    this.paletteCycler = "effects/PaletteCycler";
                    this.pixelGlitch = "effects/PixelGlitch";
                    this.polygonLight = "effects/PolygonLight";
                    this.reflection = "effects/Reflection";
                    this.scanlines = "effects/Scanlines";
                    this.sepia = "effects/Sepia";
                    this.spriteAlphaTest = "effects/SpriteAlphaTest";
                    this.spriteBlinkEffect = "effects/SpriteBlinkEffect";
                    this.spriteLightMultiply = "effects/SpriteLightMultiply";
                    this.spriteLines = "effects/SpriteLines";
                    this.squares = "effects/Squares";
                    this.textureWipe = "effects/TextureWipe";
                    this.twist = "effects/Twist";
                    this.vignette = "effects/Vignette";
                    this.wind = "effects/Wind";
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ContentPaths.Textures", {
        $kind: "nested class",
        statics: {
            fields: {
                heatDistortionNoise: null
            },
            ctors: {
                init: function () {
                    this.heatDistortionNoise = "textures/heatDistortionNoise";
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ContentPaths.Textures.TextureWipeTransition", {
        $kind: "nested class",
        statics: {
            fields: {
                angular: null,
                crissCross: null,
                diagonalDistort: null,
                horizontal: null,
                noise: null,
                pokemon: null,
                sawTooth: null,
                spiral: null,
                wink: null
            },
            ctors: {
                init: function () {
                    this.angular = "textures/textureWipeTransition/angular";
                    this.crissCross = "textures/textureWipeTransition/crissCross";
                    this.diagonalDistort = "textures/textureWipeTransition/diagonalDistort";
                    this.horizontal = "textures/textureWipeTransition/horizontal";
                    this.noise = "textures/textureWipeTransition/noise";
                    this.pokemon = "textures/textureWipeTransition/pokemon";
                    this.sawTooth = "textures/textureWipeTransition/sawTooth";
                    this.spiral = "textures/textureWipeTransition/spiral";
                    this.wink = "textures/textureWipeTransition/wink";
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.BevelsEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Bevels";
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.BloomCombineEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/BloomCombine";
                }
            }
        },
        fields: {
            baseIntensityParam: null,
            baseMapParam: null,
            baseSaturationParam: null,
            bloomIntensityParam: null,
            bloomSaturationParam: null
        },
        props: {
            BloomIntensity: {
                get: function () {
                    return this.bloomIntensityParam.GetValueSingle();
                },
                set: function (value) {
                    this.bloomIntensityParam.SetValue$12(value);
                }
            },
            BaseIntensity: {
                get: function () {
                    return this.baseIntensityParam.GetValueSingle();
                },
                set: function (value) {
                    this.baseIntensityParam.SetValue$12(value);
                }
            },
            BloomSaturation: {
                get: function () {
                    return this.bloomSaturationParam.GetValueSingle();
                },
                set: function (value) {
                    this.bloomSaturationParam.SetValue$12(value);
                }
            },
            BaseSaturation: {
                get: function () {
                    return this.baseSaturationParam.GetValueSingle();
                },
                set: function (value) {
                    this.baseSaturationParam.SetValue$12(value);
                }
            },
            BaseMap: {
                get: function () {
                    return this.baseMapParam.GetValueTexture2D();
                },
                set: function (value) {
                    this.baseMapParam.SetValue(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.bloomIntensityParam = this.Parameters.getItem$1("_bloomIntensity");
                this.baseIntensityParam = this.Parameters.getItem$1("_baseIntensity");
                this.bloomSaturationParam = this.Parameters.getItem$1("_bloomSaturation");
                this.baseSaturationParam = this.Parameters.getItem$1("_baseSaturation");
                this.baseMapParam = this.Parameters.getItem$1("_baseMap");
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.BloomExtractEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/BloomExtract";
                }
            }
        },
        fields: {
            bloomThresholdParam: null
        },
        props: {
            BloomThreshold: {
                get: function () {
                    return this.bloomThresholdParam.GetValueSingle();
                },
                set: function (value) {
                    this.bloomThresholdParam.SetValue$12(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.bloomThresholdParam = this.Parameters.getItem$1("_bloomThreshold");
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.CrosshatchEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Crosshatch";
                }
            }
        },
        fields: {
            crosshatchSizeParam: null
        },
        props: {
            CrosshatchSize: {
                get: function () {
                    return this.crosshatchSizeParam.GetValueInt32();
                },
                set: function (value) {
                    if (!SpineEngine.Maths.Mathf.IsEven(value)) {
                        value = (value + 1) | 0;
                    }

                    this.crosshatchSizeParam.SetValue$11(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.crosshatchSizeParam = this.Parameters.getItem$1("crossHatchSize");
                this.CrosshatchSize = 16;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.DeferredLightingEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/DeferredLighting";
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.DeferredSpriteEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/DeferredSprite";
                }
            }
        },
        fields: {
            alphaAsSelfIlluminationParam: null,
            alphaCutoffParam: null,
            normalMapParam: null,
            selfIlluminationPowerParam: null
        },
        props: {
            AlphaCutoff: {
                get: function () {
                    return this.alphaCutoffParam.GetValueSingle();
                },
                set: function (value) {
                    this.alphaCutoffParam.SetValue$12(value);
                }
            },
            NormalMap: {
                get: function () {
                    return this.normalMapParam.GetValueTexture2D();
                },
                set: function (value) {
                    this.normalMapParam.SetValue(value);
                }
            },
            UseNormalAlphaChannelForSelfIllumination: {
                get: function () {
                    return this.alphaAsSelfIlluminationParam.GetValueSingle() === 1.0;
                },
                set: function (value) {
                    this.alphaAsSelfIlluminationParam.SetValue$12(value ? 1.0 : 0.0);
                }
            },
            SelfIlluminationPower: {
                get: function () {
                    return this.selfIlluminationPowerParam.GetValueSingle();
                },
                set: function (value) {
                    this.selfIlluminationPowerParam.SetValue$12(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.normalMapParam = this.Parameters.getItem$1("_normalMap");
                this.alphaCutoffParam = this.Parameters.getItem$1("_alphaCutoff");
                this.alphaAsSelfIlluminationParam = this.Parameters.getItem$1("_alphaAsSelfIllumination");
                this.selfIlluminationPowerParam = this.Parameters.getItem$1("_selfIlluminationPower");

                this.AlphaCutoff = 0.3;
                this.SelfIlluminationPower = 1;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.DissolveEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Dissolve";
                }
            }
        },
        fields: {
            dissolveTexParam: null,
            dissolveThresholdColorParam: null,
            dissolveThresholdParam: null,
            progressParam: null
        },
        props: {
            Progress: {
                get: function () {
                    return this.progressParam.GetValueSingle();
                },
                set: function (value) {
                    this.progressParam.SetValue$12(value);
                }
            },
            DissolveThreshold: {
                get: function () {
                    return this.dissolveThresholdParam.GetValueSingle();
                },
                set: function (value) {
                    this.dissolveThresholdParam.SetValue$12(value);
                }
            },
            DissolveThresholdColor: {
                get: function () {
                    return new Microsoft.Xna.Framework.Color.$ctor4(this.dissolveThresholdColorParam.GetValueVector4());
                },
                set: function (value) {
                    this.dissolveThresholdColorParam.SetValue$8(value.ToVector4());
                }
            },
            DissolveTexture: {
                get: function () {
                    return this.dissolveTexParam.GetValueTexture2D();
                },
                set: function (value) {
                    this.dissolveTexParam.SetValue(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.progressParam = this.Parameters.getItem$1("_progress");
                this.dissolveThresholdParam = this.Parameters.getItem$1("_dissolveThreshold");
                this.dissolveThresholdColorParam = this.Parameters.getItem$1("_dissolveThresholdColor");
                this.dissolveTexParam = this.Parameters.getItem$1("_dissolveTex");

                this.Progress = 0;
                this.DissolveThreshold = 0.1;
                this.DissolveThresholdColor = Microsoft.Xna.Framework.Color.Red.$clone();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.DotsEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Dots";
                }
            }
        },
        fields: {
            angleParam: null,
            scaleParam: null
        },
        props: {
            Scale: {
                get: function () {
                    return this.scaleParam.GetValueSingle();
                },
                set: function (value) {
                    this.scaleParam.SetValue$12(value);
                }
            },
            Angle: {
                get: function () {
                    return this.angleParam.GetValueSingle();
                },
                set: function (value) {
                    this.angleParam.SetValue$12(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.scaleParam = this.Parameters.getItem$1("scale");
                this.angleParam = this.Parameters.getItem$1("angle");

                this.Scale = 0.5;
                this.Angle = 0.5;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.ForwardLightingEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/ForwardLighting";
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/GaussianBlur";
                }
            }
        },
        fields: {
            blurOffsetsParam: null,
            blurWeightsParam: null,
            horizontalSampleOffsets: null,
            sampleCount: 0,
            sampleWeights: null,
            verticalSampleOffsets: null,
            blurAmount: 0,
            horizontalBlurDelta: 0,
            verticalBlurDelta: 0
        },
        props: {
            BlurAmount: {
                get: function () {
                    return this.blurAmount;
                },
                set: function (value) {
                    if (this.blurAmount === value) {
                        return;
                    }

                    if (value === 0) {
                        value = 0.001;
                    }

                    this.blurAmount = value;
                    this.CalculateSampleWeights();
                }
            },
            HorizontalBlurDelta: {
                get: function () {
                    return this.horizontalBlurDelta;
                },
                set: function (value) {
                    if (value === this.horizontalBlurDelta) {
                        return;
                    }

                    this.horizontalBlurDelta = value;
                    this.SetBlurEffectParameters(this.horizontalBlurDelta, 0, this.horizontalSampleOffsets);
                }
            },
            VerticalBlurDelta: {
                get: function () {
                    return this.verticalBlurDelta;
                },
                set: function (value) {
                    if (value === this.verticalBlurDelta) {
                        return;
                    }

                    this.verticalBlurDelta = value;
                    this.SetBlurEffectParameters(0, this.verticalBlurDelta, this.verticalSampleOffsets);
                }
            }
        },
        ctors: {
            init: function () {
                this.blurAmount = 2.0;
            },
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.blurWeightsParam = this.Parameters.getItem$1("_sampleWeights");
                this.blurOffsetsParam = this.Parameters.getItem$1("_sampleOffsets");

                this.sampleCount = this.blurWeightsParam.Elements.Count;

                this.sampleWeights = System.Array.init(this.sampleCount, 0, System.Single);
                this.verticalSampleOffsets = System.Array.init(this.sampleCount, function (){
                    return new Microsoft.Xna.Framework.Vector2();
                }, Microsoft.Xna.Framework.Vector2);
                this.horizontalSampleOffsets = System.Array.init(this.sampleCount, function (){
                    return new Microsoft.Xna.Framework.Vector2();
                }, Microsoft.Xna.Framework.Vector2);

                this.verticalSampleOffsets[System.Array.index(0, this.verticalSampleOffsets)] = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                this.horizontalSampleOffsets[System.Array.index(0, this.horizontalSampleOffsets)] = Microsoft.Xna.Framework.Vector2.Zero.$clone();

                this.CalculateSampleWeights();
            }
        },
        methods: {
            PrepareForHorizontalBlur: function () {
                this.blurOffsetsParam.SetValue$5(this.horizontalSampleOffsets);
            },
            PrepareForVerticalBlur: function () {
                this.blurOffsetsParam.SetValue$5(this.verticalSampleOffsets);
            },
            SetBlurEffectParameters: function (dx, dy, offsets) {
                for (var i = 0; i < ((Bridge.Int.div(this.sampleCount, 2)) | 0); i = (i + 1) | 0) {
                    var sampleOffset = Bridge.Int.mul(i, 2) + 1.5;

                    var delta = Microsoft.Xna.Framework.Vector2.op_Multiply$1(new Microsoft.Xna.Framework.Vector2.$ctor2(dx, dy), sampleOffset);

                    offsets[System.Array.index(((Bridge.Int.mul(i, 2) + 1) | 0), offsets)] = delta.$clone();
                    offsets[System.Array.index(((Bridge.Int.mul(i, 2) + 2) | 0), offsets)] = Microsoft.Xna.Framework.Vector2.op_UnaryNegation(delta.$clone());
                }
            },
            CalculateSampleWeights: function () {
                this.sampleWeights[System.Array.index(0, this.sampleWeights)] = this.ComputeGaussian(0);

                var totalWeights = this.sampleWeights[System.Array.index(0, this.sampleWeights)];

                for (var i = 0; i < ((Bridge.Int.div(this.sampleCount, 2)) | 0); i = (i + 1) | 0) {
                    var weight = this.ComputeGaussian(((i + 1) | 0));

                    this.sampleWeights[System.Array.index(((Bridge.Int.mul(i, 2) + 1) | 0), this.sampleWeights)] = weight;
                    this.sampleWeights[System.Array.index(((Bridge.Int.mul(i, 2) + 2) | 0), this.sampleWeights)] = weight;

                    totalWeights += weight * 2;
                }

                for (var i1 = 0; i1 < this.sampleWeights.length; i1 = (i1 + 1) | 0) {
                    this.sampleWeights[System.Array.index(i1, this.sampleWeights)] /= totalWeights;
                }

                this.blurWeightsParam.SetValue$13(this.sampleWeights);
            },
            ComputeGaussian: function (n) {
                return 1.0 / Math.sqrt(6.2831853071795862 * this.blurAmount) * Math.exp(-(n * n) / (2 * this.blurAmount * this.blurAmount));
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.GrayscaleEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Grayscale";
                }
            }
        },
        ctors: {
            ctor: function (cloneSource) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, cloneSource);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.HeatDistortionEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/HeatDistortion";
                }
            }
        },
        props: {
            DistortionFactor: {
                get: function () {
                    return this.Parameters.getItem$1("_distortionFactor").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_distortionFactor").SetValue$12(value);
                }
            },
            RiseFactor: {
                get: function () {
                    return this.Parameters.getItem$1("_riseFactor").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_riseFactor").SetValue$12(value);
                }
            },
            Time: {
                get: function () {
                    return this.Parameters.getItem$1("_time").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_time").SetValue$12(value);
                }
            },
            DistortionTexture: {
                get: function () {
                    return this.Parameters.getItem$1("_distortionTexture").GetValueTexture2D();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_distortionTexture").SetValue(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.InvertEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Invert";
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.LetterboxEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Letterbox";
                }
            }
        },
        props: {
            Color: {
                get: function () {
                    return new Microsoft.Xna.Framework.Color.$ctor4(this.Parameters.getItem$1("_color").GetValueVector4());
                },
                set: function (value) {
                    this.Parameters.getItem$1("_color").SetValue$8(value.ToVector4());
                }
            },
            LetterboxSize: {
                get: function () {
                    return this.Parameters.getItem$1("_letterboxSize").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_letterboxSize").SetValue$12(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.MultiTextureEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/MultiTexture";
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.MultiTextureOverlayEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/MultiTextureOverlay";
                }
            }
        },
        props: {
            SecondTexture: {
                get: function () {
                    return this.Parameters.getItem$1("_secondTexture").GetValueTexture2D();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_secondTexture").SetValue(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.NoiseEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Noise";
                }
            }
        },
        fields: {
            noiseParam: null
        },
        props: {
            Noise: {
                get: function () {
                    return this.noiseParam.GetValueSingle();
                },
                set: function (value) {
                    this.noiseParam.SetValue$12(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.noiseParam = this.Parameters.getItem$1("noise");
                this.Noise = 1;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.PaletteCyclerEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/PaletteCycler";
                }
            }
        },
        fields: {
            cycleSpeedParam: null,
            paletteTextureParam: null,
            timeParam: null
        },
        props: {
            PaletteTexture: {
                get: function () {
                    return this.paletteTextureParam.GetValueTexture2D();
                },
                set: function (value) {
                    this.paletteTextureParam.SetValue(value);
                }
            },
            CycleSpeed: {
                get: function () {
                    return this.cycleSpeedParam.GetValueSingle();
                },
                set: function (value) {
                    this.cycleSpeedParam.SetValue$12(value);
                }
            },
            Time: {
                get: function () {
                    return this.timeParam.GetValueSingle();
                },
                set: function (value) {
                    this.timeParam.SetValue$12(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.paletteTextureParam = this.Parameters.getItem$1("_paletteTexture");
                this.cycleSpeedParam = this.Parameters.getItem$1("_cycleSpeed");
                this.timeParam = this.Parameters.getItem$1("_time");
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.PixelGlitchEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/PixelGlitch";
                }
            }
        },
        props: {
            VerticalSize: {
                get: function () {
                    return this.Parameters.getItem$1("_verticalSize").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_verticalSize").SetValue$12(value);
                }
            },
            HorizontalOffset: {
                get: function () {
                    return this.Parameters.getItem$1("_horizontalOffset").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_horizontalOffset").SetValue$12(value);
                }
            },
            ScreenSize: {
                get: function () {
                    return this.Parameters.getItem$1("_screenSize").GetValueVector2();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_screenSize").SetValue$4(value.$clone());
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.PolygonLightEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/PolygonLight";
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.ReflectionEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Reflection";
                }
            }
        },
        fields: {
            matrixTransformParam: null,
            normalMagnitudeParam: null,
            normalMapParam: null,
            reflectionIntensityParam: null,
            renderTextureParam: null
        },
        props: {
            ReflectionIntensity: {
                get: function () {
                    return this.reflectionIntensityParam.GetValueSingle();
                },
                set: function (value) {
                    this.reflectionIntensityParam.SetValue$12(value);
                }
            },
            NormalMagnitude: {
                get: function () {
                    return this.normalMagnitudeParam.GetValueSingle();
                },
                set: function (value) {
                    this.normalMagnitudeParam.SetValue$12(value);
                }
            },
            NormalMap: {
                get: function () {
                    return this.normalMapParam.GetValueTexture2D();
                },
                set: function (value) {
                    this.normalMapParam.SetValue(value);
                }
            },
            RenderTexture: {
                get: function () {
                    return this.renderTextureParam.GetValueTexture2D();
                },
                set: function (value) {
                    this.renderTextureParam.SetValue(value);
                }
            },
            MatrixTransform: {
                get: function () {
                    return this.matrixTransformParam.GetValueMatrix();
                },
                set: function (value) {
                    this.matrixTransformParam.SetValue$1(value.$clone());
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.reflectionIntensityParam = this.Parameters.getItem$1("_reflectionIntensity");
                this.renderTextureParam = this.Parameters.getItem$1("_renderTexture");
                this.normalMapParam = this.Parameters.getItem$1("_normalMap");
                this.matrixTransformParam = this.Parameters.getItem$1("_matrixTransform");
                this.normalMagnitudeParam = this.Parameters.getItem$1("_normalMagnitude");

                this.ReflectionIntensity = 0.4;
                this.NormalMagnitude = 0.05;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.ScanlinesEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Scanlines";
                }
            }
        },
        fields: {
            attenuationParam: null,
            linesFactorParam: null
        },
        props: {
            Attenuation: {
                get: function () {
                    return this.attenuationParam.GetValueSingle();
                },
                set: function (value) {
                    this.attenuationParam.SetValue$12(value);
                }
            },
            LinesFactor: {
                get: function () {
                    return this.linesFactorParam.GetValueSingle();
                },
                set: function (value) {
                    this.linesFactorParam.SetValue$12(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.attenuationParam = this.Parameters.getItem$1("_attenuation");
                this.linesFactorParam = this.Parameters.getItem$1("_linesFactor");

                this.Attenuation = 0.04;
                this.LinesFactor = 800.0;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.SepiaEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Sepia";
                }
            }
        },
        fields: {
            sepiaToneParam: null
        },
        props: {
            SepiaTone: {
                get: function () {
                    return this.sepiaToneParam.GetValueVector3();
                },
                set: function (value) {
                    this.sepiaToneParam.SetValue$6(value.$clone());
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.sepiaToneParam = this.Parameters.getItem$1("_sepiaTone");
                this.SepiaTone = new Microsoft.Xna.Framework.Vector3.$ctor3(1.2, 1.0, 0.8);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.SpriteAlphaTestEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/SpriteAlphaTest";
                }
            }
        },
        fields: {
            alphaTestParam: null,
            compareFunction: 0,
            referenceAlpha: 0
        },
        props: {
            ReferenceAlpha: {
                get: function () {
                    return this.referenceAlpha;
                },
                set: function (value) {
                    if (this.referenceAlpha === value) {
                        return;
                    }

                    this.referenceAlpha = value;
                    this.UpdateEffectParameter();
                }
            },
            CompareFunction: {
                get: function () {
                    return this.compareFunction;
                },
                set: function (value) {
                    if (this.compareFunction === value) {
                        return;
                    }

                    this.compareFunction = value;
                    this.UpdateEffectParameter();
                }
            }
        },
        ctors: {
            init: function () {
                this.compareFunction = PixelRPG.Base.AdditionalStuff.Effects.SpriteAlphaTestEffect.AlphaTestCompareFunction.Greater;
                this.referenceAlpha = 0.5;
            },
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.alphaTestParam = this.Parameters.getItem$1("_alphaTest");
                this.UpdateEffectParameter();
            }
        },
        methods: {
            UpdateEffectParameter: function () {
                var value = new Microsoft.Xna.Framework.Vector3.ctor();

                value.X = this.referenceAlpha;

                switch (this.compareFunction) {
                    case PixelRPG.Base.AdditionalStuff.Effects.SpriteAlphaTestEffect.AlphaTestCompareFunction.Greater: 
                        value.Y = -1;
                        value.Z = 1;
                        break;
                    case PixelRPG.Base.AdditionalStuff.Effects.SpriteAlphaTestEffect.AlphaTestCompareFunction.LessThan: 
                        value.Y = 1;
                        value.Z = -1;
                        break;
                    case PixelRPG.Base.AdditionalStuff.Effects.SpriteAlphaTestEffect.AlphaTestCompareFunction.Always: 
                        value.Y = 1;
                        value.Z = 1;
                        break;
                    case PixelRPG.Base.AdditionalStuff.Effects.SpriteAlphaTestEffect.AlphaTestCompareFunction.Never: 
                        value.Y = -1;
                        value.Z = -1;
                        break;
                }

                this.alphaTestParam.SetValue$6(value.$clone());
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.SpriteAlphaTestEffect.AlphaTestCompareFunction", {
        $kind: "nested enum",
        statics: {
            fields: {
                Greater: 0,
                LessThan: 1,
                Always: 2,
                Never: 3
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.SpriteBlinkEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/SpriteBlinkEffect";
                }
            }
        },
        fields: {
            blinkColorParam: null
        },
        props: {
            BlinkColor: {
                get: function () {
                    return new Microsoft.Xna.Framework.Color.$ctor4(this.blinkColorParam.GetValueVector4());
                },
                set: function (value) {
                    this.blinkColorParam.SetValue$8(value.ToVector4());
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.blinkColorParam = this.Parameters.getItem$1("_blinkColor");

                this.BlinkColor = Microsoft.Xna.Framework.Color.TransparentBlack.$clone();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.SpriteLightMultiplyEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/SpriteLightMultiply";
                }
            }
        },
        props: {
            LightTexture: {
                get: function () {
                    return this.Parameters.getItem$1("_lightTexture").GetValueTexture2D();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_lightTexture").SetValue(value);
                }
            },
            MultiplicativeFactor: {
                get: function () {
                    return this.Parameters.getItem$1("_multiplicativeFactor").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_multiplicativeFactor").SetValue$12(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.SpriteLinesEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/SpriteLines";
                }
            }
        },
        fields: {
            lineColorParam: null,
            lineSizeParam: null
        },
        props: {
            LineColor: {
                get: function () {
                    return new Microsoft.Xna.Framework.Color.$ctor4(this.lineColorParam.GetValueVector4());
                },
                set: function (value) {
                    this.lineColorParam.SetValue$8(value.ToVector4());
                }
            },
            LineSize: {
                get: function () {
                    return this.lineSizeParam.GetValueSingle();
                },
                set: function (value) {
                    this.lineSizeParam.SetValue$12(value);
                }
            },
            IsVertical: {
                get: function () {
                    return Bridge.referenceEquals(this.CurrentTechnique, this.Techniques.getItem$1("VerticalLines"));
                },
                set: function (value) {
                    this.CurrentTechnique = this.Techniques.getItem$1(value ? "VerticalLines:" : "HorizontalLines");
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.lineColorParam = this.Parameters.getItem$1("_lineColor");
                this.lineSizeParam = this.Parameters.getItem$1("_lineSize");

                this.LineColor = Microsoft.Xna.Framework.Color.Red.$clone();
                this.LineSize = 5.0;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.SquaresEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect,SpineEngine.Graphics.Transitions.IProgressEffect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Squares";
                }
            }
        },
        props: {
            Color: {
                get: function () {
                    return new Microsoft.Xna.Framework.Color.$ctor4(this.Parameters.getItem$1("_color").GetValueVector4());
                },
                set: function (value) {
                    this.Parameters.getItem$1("_color").SetValue$8(value.ToVector4());
                }
            },
            Smoothness: {
                get: function () {
                    return this.Parameters.getItem$1("_smoothness").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_smoothness").SetValue$12(value);
                }
            },
            Size: {
                get: function () {
                    return this.Parameters.getItem$1("_size").GetValueVector2();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_size").SetValue$4(value.$clone());
                }
            },
            Progress: {
                get: function () {
                    return this.Parameters.getItem$1("_progress").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_progress").SetValue$12(value);
                }
            }
        },
        alias: ["Progress", "SpineEngine$Graphics$Transitions$IProgressEffect$Progress"],
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.Color = Microsoft.Xna.Framework.Color.Black.$clone();
                this.Smoothness = 0.5;
                this.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(30, 30);
                this.Progress = 0;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.TextureWipeEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect,SpineEngine.Graphics.Transitions.IProgressEffect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/TextureWipe";
                }
            }
        },
        props: {
            Opacity: {
                get: function () {
                    return this.Parameters.getItem$1("_opacity").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_opacity").SetValue$12(value);
                }
            },
            Color: {
                get: function () {
                    return new Microsoft.Xna.Framework.Color.$ctor4(this.Parameters.getItem$1("_color").GetValueVector4());
                },
                set: function (value) {
                    this.Parameters.getItem$1("_color").SetValue$8(value.ToVector4());
                }
            },
            Texture: {
                get: function () {
                    return this.Parameters.getItem$1("_transitionTex").GetValueTexture2D();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_transitionTex").SetValue(value);
                }
            },
            Progress: {
                get: function () {
                    return this.Parameters.getItem$1("_progress").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_progress").SetValue$12(value);
                }
            }
        },
        alias: ["Progress", "SpineEngine$Graphics$Transitions$IProgressEffect$Progress"],
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.TwistEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Twist";
                }
            }
        },
        fields: {
            angleParam: null,
            offsetParam: null,
            radiusParam: null
        },
        props: {
            Radius: {
                get: function () {
                    return this.radiusParam.GetValueSingle();
                },
                set: function (value) {
                    this.radiusParam.SetValue$12(value);
                }
            },
            Angle: {
                get: function () {
                    return this.angleParam.GetValueSingle();
                },
                set: function (value) {
                    this.angleParam.SetValue$12(value);
                }
            },
            Offset: {
                get: function () {
                    return this.offsetParam.GetValueVector2();
                },
                set: function (value) {
                    this.offsetParam.SetValue$4(value.$clone());
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
                this.radiusParam = this.Parameters.getItem$1("radius");
                this.angleParam = this.Parameters.getItem$1("angle");
                this.offsetParam = this.Parameters.getItem$1("offset");

                this.Radius = 0.5;
                this.Angle = 5.0;
                this.Offset = Microsoft.Xna.Framework.Vector2.op_Division$1(Microsoft.Xna.Framework.Vector2.One.$clone(), 2);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.VignetteEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Vignette";
                }
            }
        },
        props: {
            Power: {
                get: function () {
                    return this.Parameters.getItem$1("_power").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_power").SetValue$12(value);
                }
            },
            Radius: {
                get: function () {
                    return this.Parameters.getItem$1("_radius").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_radius").SetValue$12(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.WindEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect,SpineEngine.Graphics.Transitions.IProgressEffect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "effects/Wind";
                }
            }
        },
        props: {
            Segments: {
                get: function () {
                    return this.Parameters.getItem$1("_windSegments").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_windSegments").SetValue$12(value);
                }
            },
            Size: {
                get: function () {
                    return this.Parameters.getItem$1("_size").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_size").SetValue$12(value);
                }
            },
            Progress: {
                get: function () {
                    return this.Parameters.getItem$1("_progress").GetValueSingle();
                },
                set: function (value) {
                    this.Parameters.getItem$1("_progress").SetValue$12(value);
                }
            }
        },
        alias: ["Progress", "SpineEngine$Graphics$Transitions$IProgressEffect$Progress"],
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, effect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components.TextComponent", {
        inherits: [LocomotorECS.Component],
        props: {
            Text: null,
            Label: null
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components.UIComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            GameTime: null,
            MouseProvider: null
        },
        props: {
            UserInterface: null
        },
        ctors: {
            init: function () {
                this.GameTime = new Microsoft.Xna.Framework.GameTime.ctor();
                this.MouseProvider = new PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ResolutionMouseProvider();
                this.UserInterface = new FaceUI.UserInterface();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.FaceUI.ECS.EntitySystems.TextUIUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components.TextComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                var $t, $t1, $t2, $t3;
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var ui = entity.GetOrCreateComponent(PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components.UIComponent);
                var text = entity.GetComponent(PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components.TextComponent);
                var scale = ($t = (($t1 = entity.GetComponent(SpineEngine.ECS.Components.ScaleComponent)) != null ? $t1.Scale : null), $t != null ? $t : Microsoft.Xna.Framework.Vector2.One);
                var color = ($t2 = (($t3 = entity.GetComponent(SpineEngine.ECS.Components.ColorComponent)) != null ? $t3.Color : null), $t2 != null ? $t2 : Microsoft.Xna.Framework.Color.White);

                ui.UserInterface.ShowCursor = false;

                if (text.Label == null) {
                    text.Label = new FaceUI.Entities.Label.$ctor1(text.Text);
                    ui.UserInterface.AddEntity(text.Label);
                }

                text.Label.FillColor = color.$clone();
                text.Label.Text = text.Text;
                text.Label.Scale = scale.X;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.FaceUI.ECS.EntitySystems.UIUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem,SpineEngine.ECS.IScreenResolutionChangedListener],
        fields: {
            spriteBatchWrapper: null,
            totalTime: null
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                this.totalTime = new System.TimeSpan();
                this.spriteBatchWrapper = new PixelRPG.Base.AdditionalStuff.FaceUI.Utils.MeshBatchWrapper();
                this.totalTime = System.TimeSpan.zero;
            },
            ctor: function (content) {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components.UIComponent]));
                FaceUI.UserInterface.Initialize(content, FaceUI.BuiltinThemes.hd);
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                var $t, $t1;
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var ui = entity.GetComponent(PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components.UIComponent);
                var scale = ($t = (($t1 = entity.GetComponent(SpineEngine.ECS.Components.ScaleComponent)) != null ? $t1.Scale : null), $t != null ? $t : Microsoft.Xna.Framework.Vector2.One);
                var mouse = entity.GetOrCreateComponent(SpineEngine.ECS.Components.InputMouseComponent);
                var touch = entity.GetOrCreateComponent(SpineEngine.ECS.Components.InputTouchComponent);
                var finalRender = entity.GetOrCreateComponent(SpineEngine.ECS.Components.FinalRenderComponent);

                this.totalTime = System.TimeSpan.add(this.totalTime, gameTime);

                FaceUI.UserInterface.Active = ui.UserInterface;
                ui.UserInterface.MouseInputProvider = ui.MouseProvider;

                ui.MouseProvider._oldMouseState = ui.MouseProvider._newMouseState.$clone();
                if (touch.IsConnected) {
                    if (System.Linq.Enumerable.from(touch.CurrentTouches).any()) {
                        var touchPosition = touch.GetScaledPosition(touch.CurrentTouches.getItem(0).$clone().Position.$clone());
                        ui.MouseProvider._newMouseState.X = touchPosition.X;
                        ui.MouseProvider._newMouseState.Y = touchPosition.Y;
                        ui.MouseProvider._newMouseState.LeftButton = Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                    } else {
                        ui.MouseProvider._newMouseState.X = ui.MouseProvider._oldMouseState.X;
                        ui.MouseProvider._newMouseState.Y = ui.MouseProvider._oldMouseState.Y;
                        ui.MouseProvider._newMouseState.LeftButton = Microsoft.Xna.Framework.Input.ButtonState.Released;
                    }

                    ui.MouseProvider._newMouseState.RightButton = Microsoft.Xna.Framework.Input.ButtonState.Released;
                    ui.MouseProvider._newMouseState.MiddleButton = Microsoft.Xna.Framework.Input.ButtonState.Released;
                    ui.MouseProvider._newMouseState.ScrollWheelValue = 0;
                } else {
                    ui.MouseProvider._newMouseState.X = mouse.ScaledMousePosition.X;
                    ui.MouseProvider._newMouseState.Y = mouse.ScaledMousePosition.Y;
                    ui.MouseProvider._newMouseState.LeftButton = mouse.CurrentMouseState.LeftButton;
                    ui.MouseProvider._newMouseState.RightButton = mouse.CurrentMouseState.RightButton;
                    ui.MouseProvider._newMouseState.MiddleButton = mouse.CurrentMouseState.MiddleButton;
                    ui.MouseProvider._newMouseState.ScrollWheelValue = mouse.CurrentMouseState.ScrollWheelValue;
                }

                ui.UserInterface.GlobalScale = scale.X;
                ui.GameTime.TotalGameTime = this.totalTime;
                ui.GameTime.ElapsedGameTime = gameTime;
                ui.UserInterface.Update(ui.GameTime);
                this.spriteBatchWrapper.MeshBatch = finalRender.Batch;
                this.spriteBatchWrapper.MeshBatch.Clear();
                ui.UserInterface.Draw(this.spriteBatchWrapper);
            },
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                Bridge.cast(this.spriteBatchWrapper.GraphicsDevice, PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ScreenGraphicDeviceWrapper).ViewRectangle = sceneRenderTarget.$clone();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources", {
        statics: {
            methods: {
                GetEnumerator: function (content, theme) {
                    var $step = 0,
                        $jumpFromFinally,
                        $returnValue,
                        root,
                        $t,
                        cursor,
                        cursorName,
                        $t1,
                        skin,
                        skinName,
                        $t2,
                        skin1,
                        skinName1,
                        $t3,
                        style,
                        $t4,
                        skin2,
                        skinName2,
                        $async_e;

                    var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                switch ($step) {
                                    case 0: {
                                        root = "FaceUI/themes/" + (theme || "") + "/";

                                            content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (root || "") + "textures/horizontal_line");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 1;
                                            return true;
                                    }
                                    case 1: {
                                        content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (root || "") + "textures/white_texture");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 2;
                                            return true;
                                    }
                                    case 2: {
                                        content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (root || "") + "textures/icons/background");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 3;
                                            return true;
                                    }
                                    case 3: {
                                        content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (root || "") + "textures/scrollbar");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 4;
                                            return true;
                                    }
                                    case 4: {
                                        content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (root || "") + "textures/scrollbar_mark");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 5;
                                            return true;
                                    }
                                    case 5: {
                                        content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (root || "") + "textures/arrow_down");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 6;
                                            return true;
                                    }
                                    case 6: {
                                        content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (root || "") + "textures/arrow_up");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 7;
                                            return true;
                                    }
                                    case 7: {
                                        content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (root || "") + "textures/progressbar");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 8;
                                            return true;
                                    }
                                    case 8: {
                                        content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (root || "") + "textures/progressbar_fill");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 9;
                                            return true;
                                    }
                                    case 9: {
                                        $t = Bridge.getEnumerator(System.Enum.getValues(FaceUI.CursorType));
                                            try {
                                                while ($t.moveNext()) {
                                                    cursor = Bridge.cast($t.Current, FaceUI.CursorType);
                                                    cursorName = System.Enum.getName(FaceUI.CursorType, Bridge.box(cursor, FaceUI.CursorType, System.Enum.toStringFn(FaceUI.CursorType))).toLowerCase();
                                                    content.Load(FaceUI.DataTypes.CursorTextureData, (root || "") + "textures/cursor_" + (cursorName || "") + "_md");
                                                }
                                            } finally {
                                                if (Bridge.is($t, System.IDisposable)) {
                                                    $t.System$IDisposable$Dispose();
                                                }
                                            }

                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 10;
                                            return true;
                                    }
                                    case 10: {
                                        $t1 = Bridge.getEnumerator(System.Enum.getValues(FaceUI.Entities.PanelSkin));
                                            try {
                                                while ($t1.moveNext()) {
                                                    skin = Bridge.cast($t1.Current, FaceUI.Entities.PanelSkin);
                                                    if (skin === FaceUI.Entities.PanelSkin.None) {
                                                        continue;
                                                    }
                                                    skinName = System.Enum.toString(FaceUI.Entities.PanelSkin, skin).toLowerCase();
                                                    content.Load(FaceUI.DataTypes.TextureData, (root || "") + "textures/panel_" + (skinName || "") + "_md");
                                                }
                                            } finally {
                                                if (Bridge.is($t1, System.IDisposable)) {
                                                    $t1.System$IDisposable$Dispose();
                                                }
                                            }
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 11;
                                            return true;
                                    }
                                    case 11: {
                                        content.Load(FaceUI.DataTypes.TextureData, (root || "") + "textures/scrollbar_md");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 12;
                                            return true;
                                    }
                                    case 12: {
                                        $t2 = Bridge.getEnumerator(System.Enum.getValues(FaceUI.Entities.SliderSkin));
                                            try {
                                                while ($t2.moveNext()) {
                                                    skin1 = Bridge.cast($t2.Current, FaceUI.Entities.SliderSkin);
                                                    skinName1 = System.Enum.toString(FaceUI.Entities.SliderSkin, skin1).toLowerCase();
                                                    content.Load(FaceUI.DataTypes.TextureData, (root || "") + "textures/slider_" + (skinName1 || "") + "_md");
                                                }
                                            } finally {
                                                if (Bridge.is($t2, System.IDisposable)) {
                                                    $t2.System$IDisposable$Dispose();
                                                }
                                            }
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 13;
                                            return true;
                                    }
                                    case 13: {
                                        $t3 = Bridge.getEnumerator(System.Enum.getValues(FaceUI.Entities.FontStyle));
                                            try {
                                                while ($t3.moveNext()) {
                                                    style = Bridge.cast($t3.Current, FaceUI.Entities.FontStyle);
                                                    content.Load(Microsoft.Xna.Framework.Graphics.SpriteFont, (root || "") + "fonts/" + (System.Enum.toString(FaceUI.Entities.FontStyle, style) || ""));
                                                }
                                            } finally {
                                                if (Bridge.is($t3, System.IDisposable)) {
                                                    $t3.System$IDisposable$Dispose();
                                                }
                                            }
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 14;
                                            return true;
                                    }
                                    case 14: {
                                        $t4 = Bridge.getEnumerator(System.Enum.getValues(FaceUI.Entities.ButtonSkin));
                                            try {
                                                while ($t4.moveNext()) {
                                                    skin2 = Bridge.cast($t4.Current, FaceUI.Entities.ButtonSkin);
                                                    skinName2 = System.Enum.toString(FaceUI.Entities.ButtonSkin, skin2).toLowerCase();
                                                    content.Load(FaceUI.DataTypes.TextureData, (root || "") + "textures/button_" + (skinName2 || "") + "_md");
                                                }
                                            } finally {
                                                if (Bridge.is($t4, System.IDisposable)) {
                                                    $t4.System$IDisposable$Dispose();
                                                }
                                            }
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 15;
                                            return true;
                                    }
                                    case 15: {
                                        content.Load(FaceUI.DataTypes.TextureData, (root || "") + "textures/progressbar_md");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 16;
                                            return true;
                                    }
                                    case 16: {
                                        content.Load(Microsoft.Xna.Framework.Graphics.Effect, (root || "") + "effects/disabled");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 17;
                                            return true;
                                    }
                                    case 17: {
                                        content.Load(Microsoft.Xna.Framework.Graphics.Effect, (root || "") + "effects/silhouette");
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 18;
                                            return true;
                                    }
                                    case 18: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Entity, "DefaultStyle"), "Entity", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 19;
                                            return true;
                                    }
                                    case 19: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Paragraph, "DefaultStyle"), "Paragraph", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 20;
                                            return true;
                                    }
                                    case 20: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Button, "DefaultStyle"), "Button", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 21;
                                            return true;
                                    }
                                    case 21: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Button, "DefaultParagraphStyle"), "ButtonParagraph", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 22;
                                            return true;
                                    }
                                    case 22: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.CheckBox, "DefaultStyle"), "CheckBox", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 23;
                                            return true;
                                    }
                                    case 23: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.CheckBox, "DefaultParagraphStyle"), "CheckBoxParagraph", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 24;
                                            return true;
                                    }
                                    case 24: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.ColoredRectangle, "DefaultStyle"), "ColoredRectangle", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 25;
                                            return true;
                                    }
                                    case 25: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.DropDown, "DefaultStyle"), "DropDown", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 26;
                                            return true;
                                    }
                                    case 26: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.DropDown, "DefaultParagraphStyle"), "DropDownParagraph", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 27;
                                            return true;
                                    }
                                    case 27: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.DropDown, "DefaultSelectedParagraphStyle"), "DropDownSelectedParagraph", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 28;
                                            return true;
                                    }
                                    case 28: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Header, "DefaultStyle"), "Header", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 29;
                                            return true;
                                    }
                                    case 29: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.HorizontalLine, "DefaultStyle"), "HorizontalLine", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 30;
                                            return true;
                                    }
                                    case 30: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Icon, "DefaultStyle"), "Icon", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 31;
                                            return true;
                                    }
                                    case 31: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Image, "DefaultStyle"), "Image", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 32;
                                            return true;
                                    }
                                    case 32: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Label, "DefaultStyle"), "Label", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 33;
                                            return true;
                                    }
                                    case 33: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Panel, "DefaultStyle"), "Panel", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 34;
                                            return true;
                                    }
                                    case 34: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.ProgressBar, "DefaultStyle"), "ProgressBar", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 35;
                                            return true;
                                    }
                                    case 35: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.ProgressBar, "DefaultFillStyle"), "ProgressBarFill", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 36;
                                            return true;
                                    }
                                    case 36: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.RadioButton, "DefaultStyle"), "RadioButton", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 37;
                                            return true;
                                    }
                                    case 37: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.RadioButton, "DefaultParagraphStyle"), "RadioButtonParagraph", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 38;
                                            return true;
                                    }
                                    case 38: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.SelectList, "DefaultStyle"), "SelectList", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 39;
                                            return true;
                                    }
                                    case 39: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.SelectList, "DefaultParagraphStyle"), "SelectListParagraph", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 40;
                                            return true;
                                    }
                                    case 40: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Slider, "DefaultStyle"), "Slider", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 41;
                                            return true;
                                    }
                                    case 41: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.TextInput, "DefaultStyle"), "TextInput", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 42;
                                            return true;
                                    }
                                    case 42: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.TextInput, "DefaultParagraphStyle"), "TextInputParagraph", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 43;
                                            return true;
                                    }
                                    case 43: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.TextInput, "DefaultPlaceholderStyle"), "TextInputPlaceholder", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 44;
                                            return true;
                                    }
                                    case 44: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.VerticalScrollbar, "DefaultStyle"), "VerticalScrollbar", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 45;
                                            return true;
                                    }
                                    case 45: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.PanelTabs, "DefaultButtonStyle"), "PanelTabsButton", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 46;
                                            return true;
                                    }
                                    case 46: {
                                        PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.PanelTabs, "DefaultButtonParagraphStyle"), "PanelTabsButtonParagraph", root, content);
                                            $enumerator.current = Bridge.box(0, System.Int32);
                                            $step = 47;
                                            return true;
                                    }
                                    case 47: {

                                    }
                                    default: {
                                        return false;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            throw $async_e;
                        }
                    }));
                    return $enumerator;
                },
                LoadDefaultStyles: function (sheet, entityName, themeRoot, content) {
                    var stylesheetBase = (themeRoot || "") + "styles/" + (entityName || "");
                    content.Load(FaceUI.DataTypes.DefaultStylesList, stylesheetBase);
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.FaceUI.Utils.MeshBatchWrapper", {
        inherits: [FaceUI.Utils.ISpriteBatchWrapper],
        fields: {
            glyphsCache: null
        },
        props: {
            MeshBatch: null,
            GraphicsDevice: null
        },
        alias: [
            "Begin", "FaceUI$Utils$ISpriteBatchWrapper$Begin",
            "End", "FaceUI$Utils$ISpriteBatchWrapper$End",
            "Draw", "FaceUI$Utils$ISpriteBatchWrapper$Draw",
            "Draw$1", "FaceUI$Utils$ISpriteBatchWrapper$Draw$1",
            "DrawString", "FaceUI$Utils$ISpriteBatchWrapper$DrawString",
            "GraphicsDevice", "FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice"
        ],
        ctors: {
            init: function () {
                this.glyphsCache = new (System.Collections.Generic.Dictionary$2(Microsoft.Xna.Framework.Graphics.SpriteFont,System.Collections.Generic.Dictionary$2(System.Char,Microsoft.Xna.Framework.Graphics.SpriteFont.Glyph)))();
                this.GraphicsDevice = new PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ScreenGraphicDeviceWrapper();
            }
        },
        methods: {
            Begin: function (sortMode, blendState, samplerState, depthStencilState, rasterizerState, effect, transformMatrix) {
                if (sortMode === void 0) { sortMode = 0; }
                if (blendState === void 0) { blendState = null; }
                if (samplerState === void 0) { samplerState = null; }
                if (depthStencilState === void 0) { depthStencilState = null; }
                if (rasterizerState === void 0) { rasterizerState = null; }
                if (effect === void 0) { effect = null; }
                if (transformMatrix === void 0) { transformMatrix = null; }
            },
            End: function () { },
            Draw: function (texture, destRect, color) {
                this.MeshBatch.Draw(texture, SpineEngine.Maths.RectangleF.op_Implicit$1(destRect.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(texture.Bounds.$clone()), color.$clone());
            },
            Draw$1: function (texture, destRect, srcRect, color) {
                this.MeshBatch.Draw(texture, SpineEngine.Maths.RectangleF.op_Implicit$1(destRect.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(srcRect.$clone()), color.$clone());
            },
            DrawString: function (spriteFont, text, position, color, rotation, origin, scalef, effects, layerDepth) {
                var scale = new Microsoft.Xna.Framework.Vector2.$ctor1(scalef);

                var flipAdjustment = Microsoft.Xna.Framework.Vector2.Zero.$clone();

                var flippedVert = (effects & Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipVertically) === Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipVertically;
                var flippedHorz = (effects & Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipHorizontally) === Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipHorizontally;

                if (flippedVert || flippedHorz) {
                    var size = spriteFont.MeasureString(text);

                    if (flippedHorz) {
                        origin.X *= -1;
                        flipAdjustment.X = -size.X;
                    }

                    if (flippedVert) {
                        origin.Y *= -1;
                        flipAdjustment.Y = spriteFont.LineSpacing - size.Y;
                    }
                }

                var transformation = { v : Microsoft.Xna.Framework.Matrix.Identity.$clone() };
                var cos = 0, sin = 0;
                if (rotation === 0) {
                    transformation.v.M11 = (flippedHorz ? -scale.X : scale.X);
                    transformation.v.M22 = (flippedVert ? -scale.Y : scale.Y);
                    transformation.v.M41 = ((flipAdjustment.X - origin.X) * transformation.v.M11) + position.X;
                    transformation.v.M42 = ((flipAdjustment.Y - origin.Y) * transformation.v.M22) + position.Y;
                } else {
                    cos = Math.cos(rotation);
                    sin = Math.sin(rotation);
                    transformation.v.M11 = (flippedHorz ? -scale.X : scale.X) * cos;
                    transformation.v.M12 = (flippedHorz ? -scale.X : scale.X) * sin;
                    transformation.v.M21 = (flippedVert ? -scale.Y : scale.Y) * (-sin);
                    transformation.v.M22 = (flippedVert ? -scale.Y : scale.Y) * cos;
                    transformation.v.M41 = (((flipAdjustment.X - origin.X) * transformation.v.M11) + (flipAdjustment.Y - origin.Y) * transformation.v.M21) + position.X;
                    transformation.v.M42 = (((flipAdjustment.X - origin.X) * transformation.v.M12) + (flipAdjustment.Y - origin.Y) * transformation.v.M22) + position.Y;
                }

                var offset = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                var firstGlyphOfLine = true;

                if (!this.glyphsCache.containsKey(spriteFont)) {
                    this.glyphsCache.set(spriteFont, spriteFont.GetGlyphs());
                }

                var pGlyphs = this.glyphsCache.get(spriteFont);

                for (var i = 0; i < text.length; i = (i + 1) | 0) {
                    var c = text.charCodeAt(i);

                    if (c === 13) {
                        continue;
                    }

                    if (c === 10) {
                        offset.X = 0;
                        offset.Y += spriteFont.LineSpacing;
                        firstGlyphOfLine = true;
                        continue;
                    }

                    var pCurrentGlyph = pGlyphs.get(c).$clone();

                    // The first character on a line might have a negative left side bearing.
                    // In this scenario, SpriteBatch/SpriteFont normally offset the text to the right,
                    //  so that text does not hang off the left side of its rectangle.
                    if (firstGlyphOfLine) {
                        offset.X = Math.max(pCurrentGlyph.LeftSideBearing, 0);
                        firstGlyphOfLine = false;
                    } else {
                        offset.X += spriteFont.Spacing + pCurrentGlyph.LeftSideBearing;
                    }

                    var p = { v : offset.$clone() };

                    if (flippedHorz) {
                        p.v.X += pCurrentGlyph.BoundsInTexture.Width;
                    }
                    p.v.X += pCurrentGlyph.Cropping.X;

                    if (flippedVert) {
                        p.v.Y += (pCurrentGlyph.BoundsInTexture.Height - spriteFont.LineSpacing) | 0;
                    }
                    p.v.Y += pCurrentGlyph.Cropping.Y;

                    Microsoft.Xna.Framework.Vector2.Transform$2(p, transformation, p);

                    //if ((effects & SpriteEffects.FlipVertically) != 0)
                    //{
                    //    var temp = _texCoordBR.Y;
                    //    _texCoordBR.Y = _texCoordTL.Y;
                    //    _texCoordTL.Y = temp;
                    //}
                    //if ((effects & SpriteEffects.FlipHorizontally) != 0)
                    //{
                    //    var temp = _texCoordBR.X;
                    //    _texCoordBR.X = _texCoordTL.X;
                    //    _texCoordTL.X = temp;
                    //}

                    this.Draw$1(spriteFont.Texture, SpineEngine.Maths.RectangleF.op_Implicit(new SpineEngine.Maths.RectangleF.$ctor2(p.v.X, p.v.Y, pCurrentGlyph.BoundsInTexture.Width * scale.X, pCurrentGlyph.BoundsInTexture.Height * scale.Y)), SpineEngine.Maths.RectangleF.op_Implicit(new SpineEngine.Maths.RectangleF.$ctor2(pCurrentGlyph.BoundsInTexture.X, pCurrentGlyph.BoundsInTexture.Y, (((((pCurrentGlyph.BoundsInTexture.X + pCurrentGlyph.BoundsInTexture.Width) | 0)) - pCurrentGlyph.BoundsInTexture.X) | 0), (((((pCurrentGlyph.BoundsInTexture.Y + pCurrentGlyph.BoundsInTexture.Height) | 0)) - pCurrentGlyph.BoundsInTexture.Y) | 0))), color.$clone());

                    offset.X += pCurrentGlyph.Width + pCurrentGlyph.RightSideBearing;
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ResolutionMouseProvider", {
        inherits: [FaceUI.IMouseInput],
        fields: {
            _newMouseState: null,
            _oldMouseState: null,
            _newMousePos: null,
            _oldMousePos: null
        },
        props: {
            MouseWheel: 0,
            MouseWheelChange: 0,
            MousePosition: {
                get: function () {
                    return this._newMousePos.$clone();
                }
            },
            MousePositionDiff: {
                get: function () {
                    return Microsoft.Xna.Framework.Vector2.op_Subtraction(this._newMousePos.$clone(), this._oldMousePos.$clone());
                }
            }
        },
        alias: [
            "MouseWheel", "FaceUI$IMouseInput$MouseWheel",
            "MouseWheelChange", "FaceUI$IMouseInput$MouseWheelChange",
            "Update", "FaceUI$IMouseInput$Update",
            "UpdateMousePosition", "FaceUI$IMouseInput$UpdateMousePosition",
            "TransformMousePosition", "FaceUI$IMouseInput$TransformMousePosition",
            "MousePosition", "FaceUI$IMouseInput$MousePosition",
            "MousePositionDiff", "FaceUI$IMouseInput$MousePositionDiff",
            "MouseButtonDown", "FaceUI$IMouseInput$MouseButtonDown",
            "AnyMouseButtonDown", "FaceUI$IMouseInput$AnyMouseButtonDown",
            "MouseButtonReleased", "FaceUI$IMouseInput$MouseButtonReleased",
            "AnyMouseButtonReleased", "FaceUI$IMouseInput$AnyMouseButtonReleased",
            "MouseButtonPressed", "FaceUI$IMouseInput$MouseButtonPressed",
            "AnyMouseButtonPressed", "FaceUI$IMouseInput$AnyMouseButtonPressed",
            "MouseButtonClick", "FaceUI$IMouseInput$MouseButtonClick",
            "AnyMouseButtonClicked", "FaceUI$IMouseInput$AnyMouseButtonClicked"
        ],
        ctors: {
            init: function () {
                this._newMouseState = new PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ResolutionMouseProvider.State();
                this._oldMouseState = new PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ResolutionMouseProvider.State();
                this._newMousePos = new Microsoft.Xna.Framework.Vector2();
                this._oldMousePos = new Microsoft.Xna.Framework.Vector2();
            }
        },
        methods: {
            Update: function (gameTime) {
                // get mouse position
                this._oldMousePos = this._newMousePos.$clone();
                this._newMousePos = new Microsoft.Xna.Framework.Vector2.$ctor2(this._newMouseState.X, this._newMouseState.Y);

                // get mouse wheel state
                var prevMouseWheel = this.MouseWheel;
                this.MouseWheel = this._newMouseState.ScrollWheelValue;
                this.MouseWheelChange = Bridge.Int.sign(this.MouseWheel - prevMouseWheel);
            },
            UpdateMousePosition: function (pos) {
                // move mouse position back to center
                Microsoft.Xna.Framework.Input.Mouse.SetPosition(Bridge.Int.clip32(pos.X), Bridge.Int.clip32(pos.Y));
                this._newMousePos = (this._oldMousePos = pos.$clone());
            },
            TransformMousePosition: function (transform) {
                var newMousePos = this._newMousePos.$clone();
                if (System.Nullable.liftne(Microsoft.Xna.Framework.Matrix.op_Inequality, System.Nullable.lift1("$clone", transform), null)) {
                    return Microsoft.Xna.Framework.Vector2.op_Subtraction(Microsoft.Xna.Framework.Vector2.Transform(newMousePos.$clone(), System.Nullable.getValue(transform).$clone()), new Microsoft.Xna.Framework.Vector2.$ctor2(System.Nullable.getValue(transform).Translation.X, System.Nullable.getValue(transform).Translation.Y));
                }
                return newMousePos.$clone();
            },
            MouseButtonDown: function (button) {
                if (button === void 0) { button = 0; }
                return this.GetMouseButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
            },
            AnyMouseButtonDown: function () {
                return this.MouseButtonDown(FaceUI.MouseButton.Left) || this.MouseButtonDown(FaceUI.MouseButton.Right) || this.MouseButtonDown(FaceUI.MouseButton.Middle);
            },
            MouseButtonReleased: function (button) {
                if (button === void 0) { button = 0; }
                return this.GetMouseButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Released && this.GetMousePreviousButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
            },
            AnyMouseButtonReleased: function () {
                return this.MouseButtonReleased(FaceUI.MouseButton.Left) || this.MouseButtonReleased(FaceUI.MouseButton.Right) || this.MouseButtonReleased(FaceUI.MouseButton.Middle);
            },
            MouseButtonPressed: function (button) {
                if (button === void 0) { button = 0; }
                return this.GetMouseButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Pressed && this.GetMousePreviousButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Released;
            },
            AnyMouseButtonPressed: function () {
                return this.MouseButtonPressed(FaceUI.MouseButton.Left) || this.MouseButtonPressed(FaceUI.MouseButton.Right) || this.MouseButtonPressed(FaceUI.MouseButton.Middle);
            },
            MouseButtonClick: function (button) {
                if (button === void 0) { button = 0; }
                return this.GetMouseButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Released && this.GetMousePreviousButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
            },
            AnyMouseButtonClicked: function () {
                return this.MouseButtonClick(FaceUI.MouseButton.Left) || this.MouseButtonClick(FaceUI.MouseButton.Right) || this.MouseButtonClick(FaceUI.MouseButton.Middle);
            },
            GetMouseButtonState: function (button) {
                if (button === void 0) { button = 0; }
                switch (button) {
                    case FaceUI.MouseButton.Left: 
                        return this._newMouseState.LeftButton;
                    case FaceUI.MouseButton.Right: 
                        return this._newMouseState.RightButton;
                    case FaceUI.MouseButton.Middle: 
                        return this._newMouseState.MiddleButton;
                }
                return Microsoft.Xna.Framework.Input.ButtonState.Released;
            },
            GetMousePreviousButtonState: function (button) {
                if (button === void 0) { button = 0; }
                switch (button) {
                    case FaceUI.MouseButton.Left: 
                        return this._oldMouseState.LeftButton;
                    case FaceUI.MouseButton.Right: 
                        return this._oldMouseState.RightButton;
                    case FaceUI.MouseButton.Middle: 
                        return this._oldMouseState.MiddleButton;
                }
                return Microsoft.Xna.Framework.Input.ButtonState.Released;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ResolutionMouseProvider.State", {
        $kind: "nested struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ResolutionMouseProvider.State(); }
            }
        },
        props: {
            X: 0,
            Y: 0,
            LeftButton: 0,
            RightButton: 0,
            MiddleButton: 0,
            ScrollWheelValue: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            getHashCode: function () {
                var h = Bridge.addHash([1952543928, this.X, this.Y, this.LeftButton, this.RightButton, this.MiddleButton, this.ScrollWheelValue]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ResolutionMouseProvider.State)) {
                    return false;
                }
                return Bridge.equals(this.X, o.X) && Bridge.equals(this.Y, o.Y) && Bridge.equals(this.LeftButton, o.LeftButton) && Bridge.equals(this.RightButton, o.RightButton) && Bridge.equals(this.MiddleButton, o.MiddleButton) && Bridge.equals(this.ScrollWheelValue, o.ScrollWheelValue);
            },
            $clone: function (to) {
                var s = to || new PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ResolutionMouseProvider.State();
                s.X = this.X;
                s.Y = this.Y;
                s.LeftButton = this.LeftButton;
                s.RightButton = this.RightButton;
                s.MiddleButton = this.MiddleButton;
                s.ScrollWheelValue = this.ScrollWheelValue;
                return s;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.FaceUI.Utils.ScreenGraphicDeviceWrapper", {
        inherits: [FaceUI.Utils.GraphicDeviceWrapper],
        props: {
            ViewRectangle: null,
            Viewport: {
                get: function () {
                    return this.ViewRectangle.$clone();
                }
            },
            GraphicsDevice: null,
            PresentationParameters: null
        },
        ctors: {
            init: function () {
                this.ViewRectangle = new Microsoft.Xna.Framework.Rectangle();
            }
        },
        methods: {
            Clear: function (color) {

            },
            SetRenderTarget: function (target) {

            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Materials.MaterialDefaults", {
        statics: {
            methods: {
                StencilWrite: function (stencilRef) {
                    var $t, $t1;
                    if (stencilRef === void 0) { stencilRef = 1; }
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.DepthStencilState = ($t1 = new Microsoft.Xna.Framework.Graphics.DepthStencilState.ctor(), $t1.StencilEnable = true, $t1.StencilFunction = Microsoft.Xna.Framework.Graphics.CompareFunction.Always, $t1.StencilPass = Microsoft.Xna.Framework.Graphics.StencilOperation.Replace, $t1.ReferenceStencil = stencilRef, $t1.DepthBufferEnable = false, $t1), $t);
                },
                StencilRead: function (stencilRef) {
                    var $t, $t1;
                    if (stencilRef === void 0) { stencilRef = 1; }
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.DepthStencilState = ($t1 = new Microsoft.Xna.Framework.Graphics.DepthStencilState.ctor(), $t1.StencilEnable = true, $t1.StencilFunction = Microsoft.Xna.Framework.Graphics.CompareFunction.Equal, $t1.StencilPass = Microsoft.Xna.Framework.Graphics.StencilOperation.Keep, $t1.ReferenceStencil = stencilRef, $t1.DepthBufferEnable = false, $t1), $t);
                },
                BlendDarken: function () {
                    var $t, $t1;
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = ($t1 = new Microsoft.Xna.Framework.Graphics.BlendState.ctor(), $t1.ColorSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.ColorDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.ColorBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.Min, $t1.AlphaSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.AlphaDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.AlphaBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.Min, $t1), $t);
                },
                BlendLighten: function () {
                    var $t, $t1;
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = ($t1 = new Microsoft.Xna.Framework.Graphics.BlendState.ctor(), $t1.ColorSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.ColorDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.ColorBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.Max, $t1.AlphaSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.AlphaDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.AlphaBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.Max, $t1), $t);
                },
                BlendScreen: function () {
                    var $t, $t1;
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = ($t1 = new Microsoft.Xna.Framework.Graphics.BlendState.ctor(), $t1.ColorSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.InverseDestinationColor, $t1.ColorDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.ColorBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.Add, $t1), $t);
                },
                BlendMultiply: function () {
                    var $t, $t1;
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = ($t1 = new Microsoft.Xna.Framework.Graphics.BlendState.ctor(), $t1.ColorSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.DestinationColor, $t1.ColorDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.Zero, $t1.ColorBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.Add, $t1.AlphaSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.DestinationAlpha, $t1.AlphaDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.Zero, $t1.AlphaBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.Add, $t1), $t);
                },
                BlendMultiply2X: function () {
                    var $t, $t1;
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = ($t1 = new Microsoft.Xna.Framework.Graphics.BlendState.ctor(), $t1.ColorSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.DestinationColor, $t1.ColorDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.SourceColor, $t1.ColorBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.Add, $t1), $t);
                },
                BlendLinearDodge: function () {
                    var $t, $t1;
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = ($t1 = new Microsoft.Xna.Framework.Graphics.BlendState.ctor(), $t1.ColorSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.ColorDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.ColorBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.Add, $t1), $t);
                },
                BlendLinearBurn: function () {
                    var $t, $t1;
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = ($t1 = new Microsoft.Xna.Framework.Graphics.BlendState.ctor(), $t1.ColorSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.ColorDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.ColorBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.ReverseSubtract, $t1), $t);
                },
                BlendDifference: function () {
                    var $t, $t1;
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = ($t1 = new Microsoft.Xna.Framework.Graphics.BlendState.ctor(), $t1.ColorSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.InverseDestinationColor, $t1.ColorDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.InverseSourceColor, $t1.ColorBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.Add, $t1), $t);
                },
                BlendSubtractive: function () {
                    var $t, $t1;
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = ($t1 = new Microsoft.Xna.Framework.Graphics.BlendState.ctor(), $t1.ColorSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.SourceAlpha, $t1.ColorDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.ColorBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.ReverseSubtract, $t1.AlphaSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.SourceAlpha, $t1.AlphaDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.AlphaBlendFunction = Microsoft.Xna.Framework.Graphics.BlendFunction.ReverseSubtract, $t1), $t);
                },
                BlendAdditive: function () {
                    var $t, $t1;
                    return ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = ($t1 = new Microsoft.Xna.Framework.Graphics.BlendState.ctor(), $t1.ColorSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.SourceAlpha, $t1.ColorDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1.AlphaSourceBlend = Microsoft.Xna.Framework.Graphics.Blend.SourceAlpha, $t1.AlphaDestinationBlend = Microsoft.Xna.Framework.Graphics.Blend.One, $t1), $t);
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor,SpineEngine.ECS.IScreenResolutionChangedListener],
        fields: {
            bloomCombineEffect: null,
            bloomExtractEffect: null,
            gaussianBlurEffect: null,
            renderTarget1: null,
            renderTarget2: null,
            renderTargetScale: 0,
            scene: null,
            sceneRenderTarget: null,
            settings: null
        },
        props: {
            Settings: {
                get: function () {
                    return this.settings;
                },
                set: function (value) {
                    this.SetBloomSettings(value);
                }
            },
            RenderTargetScale: {
                get: function () {
                    return this.renderTargetScale;
                },
                set: function (value) {
                    if (this.renderTargetScale === value) {
                        return;
                    }

                    this.renderTargetScale = value;
                    this.UpdateBlurEffectDeltas();
                }
            }
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                this.sceneRenderTarget = new Microsoft.Xna.Framework.Rectangle();
                this.renderTargetScale = 1.0;
            },
            ctor: function (executionOrder) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor.ctor.call(this, executionOrder);
                this.settings = PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.BloomSettings.PresetSettings[System.Array.index(3, PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.BloomSettings.PresetSettings)];
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                this.sceneRenderTarget = sceneRenderTarget.$clone();
                this.UpdateBlurEffectDeltas();
            },
            OnAddedToScene: function (scene) {
                this.scene = scene;
                this.bloomExtractEffect = this.scene.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.BloomExtractEffect, PixelRPG.Base.AdditionalStuff.Effects.BloomExtractEffect.EffectAssetName);
                this.bloomCombineEffect = this.scene.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.BloomCombineEffect, PixelRPG.Base.AdditionalStuff.Effects.BloomCombineEffect.EffectAssetName);
                this.gaussianBlurEffect = this.scene.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect, PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect.EffectAssetName);

                this.SetBloomSettings(this.settings);
            },
            SetBloomSettings: function (settings) {
                this.settings = settings;

                this.bloomExtractEffect.BloomThreshold = this.settings.Threshold;

                this.bloomCombineEffect.BloomIntensity = this.settings.Intensity;
                this.bloomCombineEffect.BaseIntensity = this.settings.BaseIntensity;
                this.bloomCombineEffect.BloomSaturation = this.settings.Saturation;
                this.bloomCombineEffect.BaseSaturation = this.settings.BaseSaturation;

                this.gaussianBlurEffect.BlurAmount = this.settings.BlurAmount;
            },
            UpdateBlurEffectDeltas: function () {
                if (this.sceneRenderTarget.Width === 0 || this.sceneRenderTarget.Height === 0) {
                    return;
                }

                this.gaussianBlurEffect.HorizontalBlurDelta = 1.0 / (this.sceneRenderTarget.Width * this.renderTargetScale);
                this.gaussianBlurEffect.VerticalBlurDelta = 1.0 / (this.sceneRenderTarget.Height * this.renderTargetScale);

                this.renderTarget1 != null ? this.renderTarget1.Dispose() : null;
                this.renderTarget1 = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(SpineEngine.Core.Instance.GraphicsDevice, Bridge.Int.clip32(this.sceneRenderTarget.Width * this.renderTargetScale), Bridge.Int.clip32(this.sceneRenderTarget.Height * this.renderTargetScale), false, SpineEngine.Core.Instance.Screen.BackBufferFormat, Microsoft.Xna.Framework.Graphics.DepthFormat.None, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.PreserveContents);
                this.renderTarget2 != null ? this.renderTarget2.Dispose() : null;
                this.renderTarget2 = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(SpineEngine.Core.Instance.GraphicsDevice, Bridge.Int.clip32(this.sceneRenderTarget.Width * this.renderTargetScale), Bridge.Int.clip32(this.sceneRenderTarget.Height * this.renderTargetScale), false, SpineEngine.Core.Instance.Screen.BackBufferFormat, Microsoft.Xna.Framework.Graphics.DepthFormat.None, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.PreserveContents);
            },
            Render: function (source, destination) {
                this.DrawFullScreenQuad(source, this.renderTarget1, this.bloomExtractEffect);

                this.gaussianBlurEffect.PrepareForHorizontalBlur();
                this.DrawFullScreenQuad(this.renderTarget1, this.renderTarget2, this.gaussianBlurEffect);

                this.gaussianBlurEffect.PrepareForVerticalBlur();
                this.DrawFullScreenQuad(this.renderTarget2, this.renderTarget1, this.gaussianBlurEffect);

                SpineEngine.Core.Instance.GraphicsDevice.SamplerStates.setItem(1, Microsoft.Xna.Framework.Graphics.SamplerState.LinearClamp);
                this.bloomCombineEffect.BaseMap = source;
                this.DrawFullScreenQuad(this.renderTarget1, destination, this.bloomCombineEffect);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.BloomSettings", {
        $kind: "nested class",
        statics: {
            fields: {
                PresetSettings: null
            },
            ctors: {
                init: function () {
                    this.PresetSettings = System.Array.init([
                        new PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.BloomSettings(0.1, 0.6, 2.0, 1.0, 1, 0), 
                        new PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.BloomSettings(0, 3, 1, 1, 1, 1), 
                        new PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.BloomSettings(0.5, 8, 2, 1, 0, 1), 
                        new PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.BloomSettings(0.25, 8, 1.3, 1, 1, 0), 
                        new PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.BloomSettings(0, 2, 1, 0.1, 1, 1), 
                        new PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.BloomSettings(0.5, 2, 1, 1, 1, 1)
                    ], PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.BloomSettings);
                }
            }
        },
        fields: {
            BaseIntensity: 0,
            BaseSaturation: 0,
            BlurAmount: 0,
            Intensity: 0,
            Saturation: 0,
            Threshold: 0
        },
        ctors: {
            ctor: function (bloomThreshold, blurAmount, bloomIntensity, baseIntensity, bloomSaturation, baseSaturation) {
                this.$initialize();
                this.Threshold = bloomThreshold;
                this.BlurAmount = blurAmount;
                this.Intensity = bloomIntensity;
                this.BaseIntensity = baseIntensity;
                this.Saturation = bloomSaturation;
                this.BaseSaturation = baseSaturation;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Scenes.LoadingData", {
        props: {
            Count: 0,
            Enumerator: null
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1", function (T) { return {
        inherits: [SpineEngine.ECS.Scene],
        ctors: {
            ctor: function (loadings, width, height) {
                this.$initialize();
                SpineEngine.ECS.Scene.ctor.call(this);
                this.SetDesignResolution(width, height, SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy.None);
                SpineEngine.Core.Instance.Screen.SetSize(width, height);
                this.AddRenderer(SpineEngine.Graphics.Renderers.DefaultRenderer, new SpineEngine.Graphics.Renderers.DefaultRenderer());

                var progress = this.CreateEntity("progress");
                var progressComponent = progress.AddComponent(PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.ProgressComponent(T));
                progressComponent.Loadings = loadings;
                progressComponent.TotalItems = System.Linq.Enumerable.from(loadings).sum($asm.$.PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.f1);

                this.AddEntitySystem(new (PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.ProgressUpdateSystem(T))());
                this.AddEntitySystem(new (PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.ProgressMeshGeneratorSystem(T))());
            }
        }
    }; });

    Bridge.ns("PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1", $asm.$);

    Bridge.apply($asm.$.PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1, {
        f1: function (a) {
            return a.Count;
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.ProgressComponent", function (T) { return {
        inherits: [LocomotorECS.Component],
        $kind: "nested class",
        fields: {
            CurrentLoading: 0,
            Loadings: null,
            TotalItems: 0,
            CurrentItem: 0
        }
    }; });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.ProgressMeshGeneratorSystem", function (T) { return {
        inherits: [LocomotorECS.EntityProcessingSystem],
        $kind: "nested class",
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.ProgressComponent(T)]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var progress = entity.GetComponent(PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.ProgressComponent(T));
                var finalRender = entity.GetOrCreateComponent(SpineEngine.ECS.Components.FinalRenderComponent);

                finalRender.Batch.Clear();

                if (progress.TotalItems === 0) {
                    return;
                }

                finalRender.Batch.Draw(SpineEngine.Graphics.Graphic.PixelTexture, new SpineEngine.Maths.RectangleF.$ctor2(99, ((SpineEngine.Core.Instance.Screen.Height - 101) | 0), ((SpineEngine.Core.Instance.Screen.Width - 198) | 0), 52), SpineEngine.Maths.RectangleF.op_Implicit$1(SpineEngine.Graphics.Graphic.PixelTexture.Bounds.$clone()), Microsoft.Xna.Framework.Color.Black.$clone());

                finalRender.Batch.Draw(SpineEngine.Graphics.Graphic.PixelTexture, new SpineEngine.Maths.RectangleF.$ctor2(100, ((SpineEngine.Core.Instance.Screen.Height - 100) | 0), progress.CurrentItem * (SpineEngine.Core.Instance.Screen.Width - 200.0) / progress.TotalItems, 50), SpineEngine.Maths.RectangleF.op_Implicit$1(SpineEngine.Graphics.Graphic.PixelTexture.Bounds.$clone()), Microsoft.Xna.Framework.Color.White.$clone());
            }
        }
    }; });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.ProgressUpdateSystem", function (T) { return {
        inherits: [LocomotorECS.EntityProcessingSystem],
        $kind: "nested class",
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.ProgressComponent(T)]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var progress = entity.GetComponent(PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1.ProgressComponent(T));
                if (progress.Loadings.Count < progress.CurrentLoading) {
                    return;
                }

                if (progress.Loadings.Count === progress.CurrentLoading) {
                    progress.CurrentLoading = (progress.CurrentLoading + 1) | 0;
                    SpineEngine.Core.Instance.SwitchScene(Bridge.createInstance(T));
                    return;
                }

                var enumerator = progress.Loadings.getItem(progress.CurrentLoading).Enumerator;
                if (!enumerator.System$Collections$IEnumerator$moveNext()) {
                    progress.CurrentLoading = (progress.CurrentLoading + 1) | 0;
                    return;
                }

                progress.CurrentItem = (progress.CurrentItem + 1) | 0;
            }
        }
    }; });

    Bridge.define("PixelRPG.Base.AdditionalStuff.SceneTransitions.CinematicLetterboxTransition", {
        inherits: [SpineEngine.Graphics.Transitions.SceneTransition],
        fields: {
            tmpContentManager: null
        },
        props: {
            Duration: 0,
            Color: {
                get: function () {
                    return Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.LetterboxEffect).Color.$clone();
                },
                set: function (value) {
                    Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.LetterboxEffect).Color = value.$clone();
                }
            },
            LetterboxSize: {
                get: function () {
                    return Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.LetterboxEffect).LetterboxSize;
                },
                set: function (value) {
                    Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.LetterboxEffect).LetterboxSize = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.tmpContentManager = new SpineEngine.XnaManagers.GlobalContentManager();
                this.Duration = 2;
            },
            ctor: function () {
                this.$initialize();
                SpineEngine.Graphics.Transitions.SceneTransition.ctor.call(this);
                this.Effect = this.tmpContentManager.Load(PixelRPG.Base.AdditionalStuff.Effects.LetterboxEffect, PixelRPG.Base.AdditionalStuff.Effects.LetterboxEffect.EffectAssetName);
            }
        },
        methods: {
            OnBeginTransition: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    startAt,
                    elapsed,
                    elapsed1,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    startAt = System.DateTime.getNow();
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    if ( (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds() < this.Duration / 2 ) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 2: {
                                    elapsed = (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds();
                                        this.LetterboxSize = SpineEngine.Maths.Easing.Lerps.Ease$8(SpineEngine.Maths.Easing.EaseType.ExpoIn, 0, this.PreviousSceneRender.Bounds.Height, elapsed, this.Duration / 2);
                                        $enumerator.current = null;
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    
                                        $step = 1;
                                        continue;
                                }
                                case 4: {
                                    this.SetNextScene();

                                        startAt = System.DateTime.getNow();
                                    $step = 5;
                                    continue;
                                }
                                case 5: {
                                    if ( (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds() < this.Duration / 2 ) {
                                            $step = 6;
                                            continue;
                                        } 
                                        $step = 8;
                                        continue;
                                }
                                case 6: {
                                    elapsed1 = (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds();
                                        this.LetterboxSize = SpineEngine.Maths.Easing.Lerps.Ease$8(SpineEngine.Maths.Easing.EaseType.ExpoOut, this.PreviousSceneRender.Bounds.Height, 0, elapsed1, this.Duration / 2);
                                        $enumerator.current = null;
                                        $step = 7;
                                        return true;
                                }
                                case 7: {
                                    
                                        $step = 5;
                                        continue;
                                }
                                case 8: {
                                    this.TransitionComplete();

                                        // cleanup
                                        this.tmpContentManager.Unload();

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.SceneTransitions.FadeTransition", {
        inherits: [SpineEngine.Graphics.Transitions.SceneTransition],
        fields: {
            DelayBeforeFadeInDuration: 0,
            FadeEaseType: 0,
            FadeInDuration: 0,
            FadeOutDuration: 0,
            FadeToColor: null,
            fromColor: null,
            toColor: null,
            color: null
        },
        ctors: {
            init: function () {
                this.FadeToColor = new Microsoft.Xna.Framework.Color();
                this.fromColor = new Microsoft.Xna.Framework.Color();
                this.toColor = new Microsoft.Xna.Framework.Color();
                this.color = new Microsoft.Xna.Framework.Color();
                this.DelayBeforeFadeInDuration = 0.2;
                this.FadeEaseType = SpineEngine.Maths.Easing.EaseType.Linear;
                this.FadeInDuration = 0.8;
                this.FadeOutDuration = 0.8;
                this.FadeToColor = Microsoft.Xna.Framework.Color.Black.$clone();
                this.fromColor = Microsoft.Xna.Framework.Color.White.$clone();
                this.toColor = Microsoft.Xna.Framework.Color.Transparent.$clone();
            }
        },
        methods: {
            OnBeginTransition: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    startAt,
                    elapsed,
                    elapsed1,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    startAt = System.DateTime.getNow();
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    if ( (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds() < this.FadeOutDuration ) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 2: {
                                    elapsed = (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds();
                                        this.color = SpineEngine.Maths.Easing.Lerps.Ease$1(this.FadeEaseType, Bridge.ref(this, "fromColor"), Bridge.ref(this, "toColor"), elapsed, this.FadeOutDuration);

                                        $enumerator.current = null;
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    
                                        $step = 1;
                                        continue;
                                }
                                case 4: {
                                    this.SetNextScene();

                                        $enumerator.current = SpineEngine.GlobalManagers.Coroutines.DefaultCoroutines.Wait(this.DelayBeforeFadeInDuration);
                                        $step = 5;
                                        return true;
                                }
                                case 5: {
                                    startAt = System.DateTime.getNow();
                                    $step = 6;
                                    continue;
                                }
                                case 6: {
                                    if ( (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds() < this.FadeInDuration ) {
                                            $step = 7;
                                            continue;
                                        } 
                                        $step = 9;
                                        continue;
                                }
                                case 7: {
                                    elapsed1 = (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds();
                                        this.color = SpineEngine.Maths.Easing.Lerps.Ease$1(SpineEngine.Maths.Easing.EaseHelper.OppositeEaseType(this.FadeEaseType), Bridge.ref(this, "toColor"), Bridge.ref(this, "fromColor"), elapsed1, this.FadeInDuration);

                                        $enumerator.current = null;
                                        $step = 8;
                                        return true;
                                }
                                case 8: {
                                    
                                        $step = 6;
                                        continue;
                                }
                                case 9: {
                                    this.TransitionComplete();

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            Render: function () {
                this.Batch.Clear();
                this.Batch.Draw(this.PreviousSceneRender, SpineEngine.Maths.RectangleF.op_Implicit$1(this.PreviousSceneRender.Bounds.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(this.PreviousSceneRender.Bounds.$clone()), this.color.$clone(), 0);

                this.Material.Effect = this.Effect;

                SpineEngine.Graphics.Graphic.Draw(null, Microsoft.Xna.Framework.Color.Black.$clone(), this.Batch, this.Material);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.SceneTransitions.SquaresTransition", {
        inherits: [SpineEngine.Graphics.Transitions.SceneTransition],
        fields: {
            tmpContentManager: null,
            DelayBeforeSquaresInDuration: 0,
            EaseType: 0,
            SquaresInDuration: 0,
            SquaresOutDuration: 0
        },
        props: {
            SquareColor: {
                set: function (value) {
                    Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.SquaresEffect).Color = value.$clone();
                }
            },
            Smoothness: {
                set: function (value) {
                    Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.SquaresEffect).Smoothness = value;
                }
            },
            Size: {
                set: function (value) {
                    Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.SquaresEffect).Size = value.$clone();
                }
            }
        },
        ctors: {
            init: function () {
                this.tmpContentManager = new SpineEngine.XnaManagers.GlobalContentManager();
                this.DelayBeforeSquaresInDuration = 0;
                this.EaseType = SpineEngine.Maths.Easing.EaseType.QuartOut;
                this.SquaresInDuration = 0.6;
                this.SquaresOutDuration = 0.6;
            },
            ctor: function () {
                this.$initialize();
                SpineEngine.Graphics.Transitions.SceneTransition.ctor.call(this);
                this.Effect = this.tmpContentManager.Load(PixelRPG.Base.AdditionalStuff.Effects.SquaresEffect, PixelRPG.Base.AdditionalStuff.Effects.SquaresEffect.EffectAssetName);
                this.SquareColor = Microsoft.Xna.Framework.Color.Black.$clone();
                this.Smoothness = 0.5;

                var aspectRatio = SpineEngine.Core.Instance.Screen.Width / SpineEngine.Core.Instance.Screen.Height;
                this.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(30, 30 / aspectRatio);
            }
        },
        methods: {
            OnBeginTransition: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = this.TickEffectProgressProperty(Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.SquaresEffect), this.SquaresInDuration, this.EaseType);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    this.SetNextScene();

                                        $enumerator.current = SpineEngine.GlobalManagers.Coroutines.DefaultCoroutines.Wait(this.DelayBeforeSquaresInDuration);
                                        $step = 2;
                                        return true;
                                }
                                case 2: {
                                    $enumerator.current = this.TickEffectProgressProperty(Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.SquaresEffect), this.SquaresOutDuration, SpineEngine.Maths.Easing.EaseHelper.OppositeEaseType(this.EaseType), true);
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    this.TransitionComplete();

                                        // cleanup
                                        this.Effect.Dispose();
                                        this.tmpContentManager.Unload();

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            }
        }
    });

    /** @namespace PixelRPG.Base.AdditionalStuff.SceneTransitions */

    /**
     * Uses a texture (TransitionTexture) to control a wipe animation. The blue channel of the texture determines if color
         is shown or the previous scenes render. Sample textures are based on: https://www.youtube.com/watch?v=LnAoD7hgDxw
     *
     * @public
     * @class PixelRPG.Base.AdditionalStuff.SceneTransitions.TextureWipeTransition
     * @augments SpineEngine.Graphics.Transitions.SceneTransition
     */
    Bridge.define("PixelRPG.Base.AdditionalStuff.SceneTransitions.TextureWipeTransition", {
        inherits: [SpineEngine.Graphics.Transitions.SceneTransition],
        fields: {
            tmpContentManager: null,
            Duration: 0,
            EaseType: 0
        },
        props: {
            Opacity: {
                set: function (value) {
                    Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.TextureWipeEffect).Opacity = value;
                }
            },
            WipeColor: {
                set: function (value) {
                    Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.TextureWipeEffect).Color = value.$clone();
                }
            },
            TransitionTexture: {
                set: function (value) {
                    Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.TextureWipeEffect).Texture = value;
                }
            },
            UseRedGreenChannelsForDistortion: {
                set: function (value) {
                    this.Effect.CurrentTechnique = this.Effect.Techniques.getItem$1(value ? "TextureWipeWithDistort" : "TextureWipe");
                }
            }
        },
        ctors: {
            init: function () {
                this.tmpContentManager = new SpineEngine.XnaManagers.GlobalContentManager();
                this.Duration = 1.0;
                this.EaseType = SpineEngine.Maths.Easing.EaseType.Linear;
            },
            /**
             * Examples for textures can be found here:
                 ContentPaths.Textures.TextureWipeTransition.*
             *
             * @instance
             * @public
             * @this PixelRPG.Base.AdditionalStuff.SceneTransitions.TextureWipeTransition
             * @memberof PixelRPG.Base.AdditionalStuff.SceneTransitions.TextureWipeTransition
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    transitionTexture
             * @return  {void}
             */
            ctor: function (transitionTexture) {
                this.$initialize();
                SpineEngine.Graphics.Transitions.SceneTransition.ctor.call(this);
                this.Effect = this.tmpContentManager.Load(PixelRPG.Base.AdditionalStuff.Effects.TextureWipeEffect, PixelRPG.Base.AdditionalStuff.Effects.TextureWipeEffect.EffectAssetName);
                this.Opacity = 1.0;
                this.WipeColor = Microsoft.Xna.Framework.Color.Black.$clone();
                this.TransitionTexture = transitionTexture;
            }
        },
        methods: {
            OnBeginTransition: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = this.TickEffectProgressProperty(Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.TextureWipeEffect), this.Duration, this.EaseType);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    this.SetNextScene();

                                        this.TransitionComplete();

                                        this.tmpContentManager.Unload();

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition", {
        inherits: [SpineEngine.Graphics.Transitions.SceneTransition],
        fields: {
            destinationRect: null,
            Duration: 0,
            finalRenderRect: null,
            TransitionEaseType: 0
        },
        ctors: {
            init: function () {
                this.destinationRect = new Microsoft.Xna.Framework.Rectangle();
                this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle();
                this.Duration = 1.0;
                this.TransitionEaseType = SpineEngine.Maths.Easing.EaseType.QuartIn;
            },
            ctor: function (transitionType) {
                if (transitionType === void 0) { transitionType = 0; }

                this.$initialize();
                SpineEngine.Graphics.Transitions.SceneTransition.ctor.call(this);
                this.destinationRect = this.PreviousSceneRender.Bounds.$clone();

                switch (transitionType) {
                    case PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType.ZoomOut: 
                        this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(((Bridge.Int.div(SpineEngine.Core.Instance.Screen.Width, 2)) | 0), ((Bridge.Int.div(SpineEngine.Core.Instance.Screen.Height, 2)) | 0), 0, 0);
                        break;
                    case PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType.ZoomIn: 
                        this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(Bridge.Int.mul(((-SpineEngine.Core.Instance.Screen.Width) | 0), 5), Bridge.Int.mul(((-SpineEngine.Core.Instance.Screen.Height) | 0), 5), Bridge.Int.mul(this.destinationRect.Width, 10), Bridge.Int.mul(this.destinationRect.Height, 10));
                        break;
                    case PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType.SlideRight: 
                        this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(SpineEngine.Core.Instance.Screen.Width, 0, this.destinationRect.Width, this.destinationRect.Height);
                        break;
                    case PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType.SlideLeft: 
                        this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(((-SpineEngine.Core.Instance.Screen.Width) | 0), 0, this.destinationRect.Width, this.destinationRect.Height);
                        break;
                    case PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType.SlideUp: 
                        this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(0, ((-SpineEngine.Core.Instance.Screen.Height) | 0), this.destinationRect.Width, this.destinationRect.Height);
                        break;
                    case PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType.SlideDown: 
                        this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(0, SpineEngine.Core.Instance.Screen.Height, this.destinationRect.Width, this.destinationRect.Height);
                        break;
                    case PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType.SlideBottomRight: 
                        this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(SpineEngine.Core.Instance.Screen.Width, SpineEngine.Core.Instance.Screen.Height, this.destinationRect.Width, this.destinationRect.Height);
                        break;
                    case PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType.SlideBottomLeft: 
                        this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(((-SpineEngine.Core.Instance.Screen.Width) | 0), SpineEngine.Core.Instance.Screen.Height, this.destinationRect.Width, this.destinationRect.Height);
                        break;
                    case PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType.SlideTopRight: 
                        this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(SpineEngine.Core.Instance.Screen.Width, ((-SpineEngine.Core.Instance.Screen.Height) | 0), this.destinationRect.Width, this.destinationRect.Height);
                        break;
                    case PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType.SlideTopLeft: 
                        this.finalRenderRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(((-SpineEngine.Core.Instance.Screen.Width) | 0), ((-SpineEngine.Core.Instance.Screen.Height) | 0), this.destinationRect.Width, this.destinationRect.Height);
                        break;
                }
            }
        },
        methods: {
            OnBeginTransition: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    startAt,
                    elapsed,
                    elapsed1,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = null;
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    startAt = System.DateTime.getNow();
                                    $step = 2;
                                    continue;
                                }
                                case 2: {
                                    if ( (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds() < this.Duration ) {
                                            $step = 3;
                                            continue;
                                        } 
                                        $step = 5;
                                        continue;
                                }
                                case 3: {
                                    elapsed = (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds();
                                        this.destinationRect = SpineEngine.Maths.Easing.Lerps.Ease$3(this.TransitionEaseType, this.PreviousSceneRender.Bounds.$clone(), this.finalRenderRect.$clone(), elapsed, this.Duration);

                                        $enumerator.current = null;
                                        $step = 4;
                                        return true;
                                }
                                case 4: {
                                    
                                        $step = 2;
                                        continue;
                                }
                                case 5: {
                                    this.SetNextScene();

                                        startAt = System.DateTime.getNow();
                                    $step = 6;
                                    continue;
                                }
                                case 6: {
                                    if ( (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds() < this.Duration ) {
                                            $step = 7;
                                            continue;
                                        } 
                                        $step = 9;
                                        continue;
                                }
                                case 7: {
                                    elapsed1 = (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds();
                                        this.destinationRect = SpineEngine.Maths.Easing.Lerps.Ease$3(this.TransitionEaseType, this.finalRenderRect.$clone(), this.PreviousSceneRender.Bounds.$clone(), elapsed1, this.Duration);

                                        $enumerator.current = null;
                                        $step = 8;
                                        return true;
                                }
                                case 8: {
                                    
                                        $step = 6;
                                        continue;
                                }
                                case 9: {
                                    this.TransitionComplete();

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            Render: function () {
                this.Batch.Clear();
                this.Batch.Draw(this.PreviousSceneRender, SpineEngine.Maths.RectangleF.op_Implicit$1(this.destinationRect.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(this.PreviousSceneRender.Bounds.$clone()), Microsoft.Xna.Framework.Color.White.$clone(), 0);
                this.Material.Effect = this.Effect;

                SpineEngine.Graphics.Graphic.Draw(null, Microsoft.Xna.Framework.Color.Black.$clone(), this.Batch, this.Material);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.SceneTransitions.TransformTransition.TransformTransitionType", {
        $kind: "nested enum",
        statics: {
            fields: {
                ZoomOut: 0,
                ZoomIn: 1,
                SlideRight: 2,
                SlideLeft: 3,
                SlideUp: 4,
                SlideDown: 5,
                SlideBottomRight: 6,
                SlideBottomLeft: 7,
                SlideTopRight: 8,
                SlideTopLeft: 9
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.SceneTransitions.WindTransition", {
        inherits: [SpineEngine.Graphics.Transitions.SceneTransition],
        fields: {
            tmpContentManager: null,
            Duration: 0,
            EaseType: 0
        },
        props: {
            WindSegments: {
                set: function (value) {
                    Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.WindEffect).Segments = value;
                }
            },
            Size: {
                set: function (value) {
                    Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.WindEffect).Size = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.tmpContentManager = new SpineEngine.XnaManagers.GlobalContentManager();
                this.Duration = 1.0;
                this.EaseType = SpineEngine.Maths.Easing.EaseType.QuartOut;
            },
            ctor: function () {
                this.$initialize();
                SpineEngine.Graphics.Transitions.SceneTransition.ctor.call(this);
                this.Effect = this.tmpContentManager.Load(PixelRPG.Base.AdditionalStuff.Effects.WindEffect, PixelRPG.Base.AdditionalStuff.Effects.WindEffect.EffectAssetName);
                this.Size = 0.3;
                this.WindSegments = 100;
            }
        },
        methods: {
            OnBeginTransition: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = this.TickEffectProgressProperty(Bridge.cast(this.Effect, PixelRPG.Base.AdditionalStuff.Effects.WindEffect), this.Duration, this.EaseType);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    this.SetNextScene();

                                        this.TransitionComplete();

                                        this.tmpContentManager.Unload();

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components.TiledMapComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            LayerIndicesToRender: null
        },
        props: {
            TiledMap: null
        },
        ctors: {
            ctor: function (tiledMap) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.TiledMap = tiledMap;
            }
        },
        methods: {
            SetLayerToRender: function (layerName) {
                this.LayerIndicesToRender = System.Array.init(1, 0, System.Int32);
                this.LayerIndicesToRender[System.Array.index(0, this.LayerIndicesToRender)] = this.TiledMap.GetLayerIndex(layerName);
            },
            SetLayersToRender: function (layerNames) {
                if (layerNames === void 0) { layerNames = []; }
                this.LayerIndicesToRender = System.Array.init(layerNames.length, 0, System.Int32);

                for (var i = 0; i < layerNames.length; i = (i + 1) | 0) {
                    this.LayerIndicesToRender[System.Array.index(i, this.LayerIndicesToRender)] = this.TiledMap.GetLayerIndex(layerNames[System.Array.index(i, layerNames)]);
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.ECS.EntitySystems.TiledMapMeshGeneratorSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        fields: {
            scene: null
        },
        ctors: {
            ctor: function (scene) {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components.TiledMapComponent]));
                this.scene = scene;
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                var $t, $t1;
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var map = entity.GetComponent(PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components.TiledMapComponent);
                var depth = ($t = (($t1 = entity.GetComponent(SpineEngine.ECS.Components.DepthLayerComponent)) != null ? $t1.Depth : null), $t != null ? $t : 0);

                var finalRender = entity.GetComponent(SpineEngine.ECS.Components.FinalRenderComponent);
                if (finalRender == null) {
                    finalRender = entity.AddComponent(SpineEngine.ECS.Components.FinalRenderComponent);
                }
                finalRender.Batch.Clear();

                var transformMatrix = SpineEngine.Maths.TransformationUtils.GetTransformation(entity).LocalTransformMatrix.$clone();
                this.Draw(map, depth, finalRender.Batch, transformMatrix.$clone());
            },
            Draw: function (map, layerDepth, batch, transformMatrix) {
                if (map.TiledMap.Orientation !== PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledMapOrientation.Orthogonal) {
                    throw new System.NotImplementedException.ctor();
                }

                for (var i = 0; i < map.TiledMap.Layers.Count; i = (i + 1) | 0) {
                    if (!map.TiledMap.Layers.getItem(i).Visible || (map.LayerIndicesToRender != null && !System.Array.contains(map.LayerIndicesToRender, i, System.Int32))) {
                        continue;
                    }

                    var layer = Bridge.cast(map.TiledMap.Layers.getItem(i), PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileLayer);
                    for (var y = 0; y < layer.Height; y = (y + 1) | 0) {
                        for (var x = 0; x < layer.Width; x = (x + 1) | 0) {
                            var tile = { v : layer.GetTile(x, y) };
                            if (tile.v == null) {
                                continue;
                            }

                            if (tile.v.TileSet == null || tile.v.TileSetTile == null || tile.v.OldId !== tile.v.Id) {
                                tile.v.OldId = tile.v.Id;
                                tile.v.TileSet = System.Linq.Enumerable.from(map.TiledMap.TileSets).first((function ($me, tile) {
                                        return function (a) {
                                            return System.Linq.Enumerable.from(a.Tiles).any(function (b) {
                                                    return ((b.Id + a.FirstGid) | 0) === tile.v.Id;
                                                });
                                        };
                                    })(this, tile));
                                tile.v.TileSetTile = System.Linq.Enumerable.from(tile.v.TileSet.Tiles).first((function ($me, tile) {
                                        return function (b) {
                                            return ((b.Id + tile.v.TileSet.FirstGid) | 0) === tile.v.Id;
                                        };
                                    })(this, tile));
                                tile.v.RenderTileSetTile = tile.v.TileSetTile;
                                tile.v.CurrentFrame = 0;
                                tile.v.ElapsedTime = 0;
                            }

                            // for the y position, we need to take into account if the tile is larger than the tileHeight and shift. Tiled uses
                            // a bottom-left coordinate system and MonoGame a top-left
                            var tx = Bridge.Int.mul(x, map.TiledMap.TileWidth);
                            var ty = Bridge.Int.mul(y, map.TiledMap.TileHeight);
                            var rotation = 0.0;

                            var spriteEffects = Microsoft.Xna.Framework.Graphics.SpriteEffects.None;
                            if (tile.v.FlippedHorizonally) {
                                spriteEffects |= Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipHorizontally;
                            }
                            if (tile.v.FlippedVertically) {
                                spriteEffects |= Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipVertically;
                            }
                            if (tile.v.FlippedDiagonally) {
                                if (tile.v.FlippedHorizonally && tile.v.FlippedVertically) {
                                    spriteEffects ^= Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipVertically;
                                    rotation = Microsoft.Xna.Framework.MathHelper.PiOver2;
                                    tx = (tx + (((map.TiledMap.TileHeight + (((tile.v.RenderTileSetTile.SourceRect.Height - map.TiledMap.TileHeight) | 0))) | 0))) | 0;
                                    ty = (ty - (((tile.v.RenderTileSetTile.SourceRect.Width - map.TiledMap.TileWidth) | 0))) | 0;
                                } else if (tile.v.FlippedHorizonally) {
                                    spriteEffects ^= Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipVertically;
                                    rotation = -1.57079637;
                                    ty = (ty + map.TiledMap.TileHeight) | 0;
                                } else if (tile.v.FlippedVertically) {
                                    spriteEffects ^= Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipHorizontally;
                                    rotation = Microsoft.Xna.Framework.MathHelper.PiOver2;
                                    tx = (tx + (((map.TiledMap.TileWidth + (((tile.v.RenderTileSetTile.SourceRect.Height - map.TiledMap.TileHeight) | 0))) | 0))) | 0;
                                    ty = (ty + (((map.TiledMap.TileWidth - tile.v.RenderTileSetTile.SourceRect.Width) | 0))) | 0;
                                } else {
                                    spriteEffects ^= Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipHorizontally;
                                    rotation = -1.57079637;
                                    ty = (ty + map.TiledMap.TileHeight) | 0;
                                }
                            }

                            // if we had no rotations (diagonal flipping) shift our y-coord to account for any non-tileSized tiles to account for
                            // Tiled being bottom-left origin
                            if (rotation === 0) {
                                ty = (ty + (((map.TiledMap.TileHeight - tile.v.RenderTileSetTile.SourceRect.Height) | 0))) | 0;
                            }

                            var destRect = tile.v.RenderTileSetTile.SourceRect.$clone();
                            destRect.Location = new Microsoft.Xna.Framework.Point.$ctor2(0, 0);

                            var meshItem = batch.Draw(tile.v.TileSet.ImageTexture, SpineEngine.Maths.RectangleF.op_Implicit$1(destRect.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(tile.v.RenderTileSetTile.SourceRect.$clone()), Microsoft.Xna.Framework.Color.White.$clone(), layerDepth);
                            meshItem.RotateMesh$1(rotation);
                            meshItem.ApplyEffectToMesh(spriteEffects);
                            meshItem.MoveMesh(new Microsoft.Xna.Framework.Vector3.$ctor3(tx + layer.Offset.X, ty + layer.Offset.Y, 0));
                            meshItem.ApplyTransformMesh(transformMatrix.$clone());
                        }
                    }
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.ECS.EntitySystems.TiledMapUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components.TiledMapComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                var $t;
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var map = entity.GetComponent(PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components.TiledMapComponent);

                for (var i = 0; i < map.TiledMap.Layers.Count; i = (i + 1) | 0) {
                    var layer = Bridge.cast(map.TiledMap.Layers.getItem(i), PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileLayer);
                    for (var j = 0; j < layer.Tiles.length; j = (j + 1) | 0) {
                        var tile = layer.Tiles[System.Array.index(j, layer.Tiles)];

                        if ((tile != null && ($t = tile.TileSetTile) != null ? $t.AnimationFrames : null) == null || tile.TileSet == null) {
                            continue;
                        }

                        tile.ElapsedTime += gameTime.getMilliseconds();

                        if (!(tile.ElapsedTime > tile.TileSetTile.AnimationFrames.getItem(tile.CurrentFrame).Duration)) {
                            continue;
                        }

                        tile.CurrentFrame = SpineEngine.Maths.Mathf.IncrementWithWrap(tile.CurrentFrame, tile.TileSetTile.AnimationFrames.Count);
                        tile.ElapsedTime = 0;
                        var tileId = { v : tile.TileSetTile.AnimationFrames.getItem(tile.CurrentFrame).TileId };

                        tile.RenderTileSetTile = System.Linq.Enumerable.from(tile.TileSet.Tiles).first((function ($me, tileId) {
                                return function (a) {
                                    return a.Id === tileId.v;
                                };
                            })(this, tileId));
                    }
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledLayer", {
        fields: {
            Offset: null,
            Name: null,
            Properties: null,
            Visible: false,
            Opacity: 0
        },
        ctors: {
            init: function () {
                this.Offset = new Microsoft.Xna.Framework.Vector2();
                this.Properties = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();
                this.Visible = true;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledLayerType", {
        $kind: "enum",
        statics: {
            fields: {
                Tile: 0,
                Image: 1
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledMap", {
        fields: {
            FirstGid: 0,
            Width: 0,
            Height: 0,
            TileWidth: 0,
            TileHeight: 0,
            BackgroundColor: null,
            RenderOrder: 0,
            Orientation: 0,
            Properties: null,
            Layers: null,
            ObjectGroups: null,
            TileSets: null
        },
        ctors: {
            init: function () {
                this.Properties = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();
                this.Layers = new (System.Collections.Generic.List$1(PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledLayer)).ctor();
                this.ObjectGroups = new (System.Collections.Generic.List$1(PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledObjectGroup)).ctor();
                this.TileSets = new (System.Collections.Generic.List$1(PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSet)).ctor();
            }
        },
        methods: {
            GetLayerIndex: function (name) {
                for (var i = 0; i < this.Layers.Count; i = (i + 1) | 0) {
                    if (Bridge.referenceEquals(this.Layers.getItem(i).Name, name)) {
                        return i;
                    }
                }

                throw new System.Exception("could not find the layer: " + (name || ""));
            },
            GetLayer: function (name) {
                for (var i = 0; i < this.Layers.Count; i = (i + 1) | 0) {
                    if (Bridge.referenceEquals(this.Layers.getItem(i).Name, name)) {
                        return this.Layers.getItem(i);
                    }
                }
                return null;
            },
            GetObjectGroup: function (name) {
                for (var i = 0; i < this.ObjectGroups.Count; i = (i + 1) | 0) {
                    if (Bridge.referenceEquals(this.ObjectGroups.getItem(i).Name, name)) {
                        return this.ObjectGroups.getItem(i);
                    }
                }
                return null;
            },
            WorldToTilePosition: function (pos, clampToTilemapBounds) {
                if (clampToTilemapBounds === void 0) { clampToTilemapBounds = true; }
                return new Microsoft.Xna.Framework.Point.$ctor2(this.WorldToTilePositionX(pos.X, clampToTilemapBounds), this.WorldToTilePositionY(pos.Y, clampToTilemapBounds));
            },
            WorldToTilePositionX: function (x, clampToTilemapBounds) {
                if (clampToTilemapBounds === void 0) { clampToTilemapBounds = true; }
                var tileX = SpineEngine.Maths.Mathf.FastFloorToInt(x / this.TileWidth);
                if (!clampToTilemapBounds) {
                    return tileX;
                }
                return SpineEngine.Maths.Mathf.Clamp(tileX, 0, ((this.Width - 1) | 0));
            },
            WorldToTilePositionY: function (y, clampToTilemapBounds) {
                if (clampToTilemapBounds === void 0) { clampToTilemapBounds = true; }
                var tileY = SpineEngine.Maths.Mathf.FastFloorToInt(y / this.TileHeight);
                if (!clampToTilemapBounds) {
                    return tileY;
                }
                return SpineEngine.Maths.Mathf.Clamp(tileY, 0, ((this.Height - 1) | 0));
            },
            TileToWorldPositionX: function (x) {
                return Bridge.Int.mul(x, this.TileWidth);
            },
            TileToWorldPositionY: function (y) {
                return Bridge.Int.mul(y, this.TileHeight);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledMapOrientation", {
        $kind: "enum",
        statics: {
            fields: {
                Orthogonal: 1,
                Isometric: 2,
                Staggered: 3
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledObject", {
        fields: {
            Id: 0,
            Name: null,
            Type: null,
            X: 0,
            Y: 0,
            Width: 0,
            Height: 0,
            Rotation: 0,
            Gid: 0,
            Visible: false,
            TiledObjectType: 0,
            ObjectType: null,
            PolyPoints: null,
            Properties: null
        },
        ctors: {
            init: function () {
                this.PolyPoints = new (System.Collections.Generic.List$1(Microsoft.Xna.Framework.Vector2)).ctor();
                this.Properties = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledObject.TiledObjectTypes", {
        $kind: "nested enum",
        statics: {
            fields: {
                None: 0,
                Ellipse: 1,
                Image: 2,
                Polygon: 3,
                Polyline: 4
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledObjectGroup", {
        fields: {
            Name: null,
            Color: null,
            Opacity: 0,
            Visible: false,
            Properties: null,
            Objects: null
        },
        ctors: {
            init: function () {
                this.Color = new Microsoft.Xna.Framework.Color();
                this.Properties = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();
            }
        },
        methods: {
            ObjectWithName: function (name) {
                for (var i = 0; i < this.Objects.Count; i = (i + 1) | 0) {
                    if (Bridge.referenceEquals(this.Objects.getItem(i).Name, name)) {
                        return this.Objects.getItem(i);
                    }
                }
                return null;
            },
            ObjectsWithName: function (name) {
                var list = new (System.Collections.Generic.List$1(PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledObject)).ctor();
                for (var i = 0; i < this.Objects.Count; i = (i + 1) | 0) {
                    if (Bridge.referenceEquals(this.Objects.getItem(i).Name, name)) {
                        list.add(this.Objects.getItem(i));
                    }
                }
                return list;
            },
            ObjectsWithType: function (type) {
                var list = new (System.Collections.Generic.List$1(PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledObject)).ctor();
                for (var i = 0; i < this.Objects.Count; i = (i + 1) | 0) {
                    if (Bridge.referenceEquals(this.Objects.getItem(i).Type, type)) {
                        list.add(this.Objects.getItem(i));
                    }
                }
                return list;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledRenderOrder", {
        $kind: "enum",
        statics: {
            fields: {
                RightDown: 0,
                RightUp: 1,
                LeftDown: 2,
                LeftUp: 3
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTile", {
        fields: {
            Id: 0,
            FlippedHorizonally: false,
            FlippedVertically: false,
            FlippedDiagonally: false,
            OldId: 0,
            RenderTileSetTile: null,
            ElapsedTime: 0,
            CurrentFrame: 0
        },
        props: {
            TileSet: null,
            TileSetTile: null
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSet", {
        statics: {
            methods: {
                Build: function (imageWidth, imageHeight, tileWidth, tileHeight, spacing, margin, columns) {
                    var $t;
                    if (spacing === void 0) { spacing = 2; }
                    if (margin === void 0) { margin = 2; }
                    if (columns === void 0) { columns = 2; }
                    var tileSet = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSet();
                    tileSet.Spacing = spacing;
                    tileSet.Margin = margin;

                    var id = 0;
                    for (var y = margin; y < ((imageHeight - margin) | 0); y = (y + (((tileHeight + spacing) | 0))) | 0) {
                        var column = 0;

                        for (var x = margin; x < ((imageWidth - margin) | 0); x = (x + (((tileWidth + spacing) | 0))) | 0) {
                            tileSet.Tiles.add(($t = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSetTile(), $t.Id = id, $t.SourceRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(x, y, tileWidth, tileHeight), $t));
                            id = (id + 1) | 0;

                            if (((column = (column + 1) | 0)) >= columns) {
                                break;
                            }
                        }
                    }

                    return tileSet;
                }
            }
        },
        fields: {
            Spacing: 0,
            Margin: 0,
            Properties: null,
            Tiles: null,
            FirstGid: 0,
            Image: null,
            ImageTexture: null
        },
        ctors: {
            init: function () {
                this.Properties = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();
                this.Tiles = new (System.Collections.Generic.List$1(PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSetTile)).ctor();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSetAnimationFrame", {
        fields: {
            TileId: 0,
            Duration: 0
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSetTile", {
        fields: {
            Id: 0,
            AnimationFrames: null,
            Properties: null,
            SourceRect: null
        },
        ctors: {
            init: function () {
                this.SourceRect = new Microsoft.Xna.Framework.Rectangle();
                this.Properties = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TurnBase.Components.ApplyTurnComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            TurnsData: null,
            TurnApplied: false
        },
        ctors: {
            init: function () {
                this.TurnsData = new (System.Collections.Generic.List$1(PixelRPG.Base.AdditionalStuff.TurnBase.ITurnData)).ctor();
                this.TurnApplied = true;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TurnBase.Components.PlayerSwitcherComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            Players: null,
            SwitchType: 0,
            CurrentPlayer: 0,
            WaitingForTurnApply: false
        },
        ctors: {
            ctor: function (switchType, players) {
                if (players === void 0) { players = []; }

                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.SwitchType = switchType;
                this.Players = players;

                this.Players[System.Array.index(0, this.Players)].TurnMade = false;
                for (var i = 1; i < this.Players.length; i = (i + 1) | 0) {
                    this.Players[System.Array.index(i, this.Players)].TurnMade = this.SwitchType === PixelRPG.Base.AdditionalStuff.TurnBase.Components.PlayerSwitcherComponent.PlayerSwitchType.OneByOne;
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TurnBase.Components.PlayerSwitcherComponent.PlayerSwitchType", {
        $kind: "nested enum",
        statics: {
            fields: {
                /**
                 * Next turn made become available after previous turn applied
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 0
                 * @type number
                 */
                OneByOne: 0,
                /**
                 * Next turn for all players become available when last player turn was applied
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 1
                 * @type number
                 */
                AllAtOnce: 1
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TurnBase.Components.PlayerTurnComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            TurnData: null,
            TurnMade: false
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TurnBase.EntitySystems.TurnSelectorUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.TurnBase.Components.ApplyTurnComponent, PixelRPG.Base.AdditionalStuff.TurnBase.Components.PlayerSwitcherComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var applyTurn = entity.GetComponent(PixelRPG.Base.AdditionalStuff.TurnBase.Components.ApplyTurnComponent);
                if (!applyTurn.TurnApplied) {
                    // Previously selected turn was not applied to game state by game specified logic.
                    return;
                }

                var switcher = entity.GetComponent(PixelRPG.Base.AdditionalStuff.TurnBase.Components.PlayerSwitcherComponent);
                if (switcher.WaitingForTurnApply) {
                    switcher.WaitingForTurnApply = false;
                    applyTurn.TurnsData.clear();

                    switch (switcher.SwitchType) {
                        case PixelRPG.Base.AdditionalStuff.TurnBase.Components.PlayerSwitcherComponent.PlayerSwitchType.OneByOne: 
                            switcher.Players[System.Array.index(switcher.CurrentPlayer, switcher.Players)].TurnMade = false;
                            break;
                        case PixelRPG.Base.AdditionalStuff.TurnBase.Components.PlayerSwitcherComponent.PlayerSwitchType.AllAtOnce: 
                            for (var i = 0; i < switcher.Players.length; i = (i + 1) | 0) {
                                switcher.Players[System.Array.index(i, switcher.Players)].TurnMade = false;
                            }
                            break;
                    }
                }

                var playerTurn = switcher.Players[System.Array.index(switcher.CurrentPlayer, switcher.Players)];
                if (!playerTurn.TurnMade) {
                    return;
                }

                switch (switcher.SwitchType) {
                    case PixelRPG.Base.AdditionalStuff.TurnBase.Components.PlayerSwitcherComponent.PlayerSwitchType.OneByOne: 
                        applyTurn.TurnApplied = false;
                        switcher.WaitingForTurnApply = true;
                        break;
                    case PixelRPG.Base.AdditionalStuff.TurnBase.Components.PlayerSwitcherComponent.PlayerSwitchType.AllAtOnce: 
                        if (switcher.CurrentPlayer === ((switcher.Players.length - 1) | 0)) {
                            applyTurn.TurnApplied = false;
                            switcher.WaitingForTurnApply = true;
                        }
                        break;
                }

                applyTurn.TurnsData.add(playerTurn.TurnData);
                switcher.CurrentPlayer = (((switcher.CurrentPlayer + 1) | 0)) % switcher.Players.length;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TurnBase.ITurnData", {
        $kind: "interface"
    });

    Bridge.define("PixelRPG.Base.Assets.ItemSprite", {
        fields: {
            Sprite: null
        },
        ctors: {
            ctor: function (content, itemType) {
                this.$initialize();
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.items);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

                this.Sprite = frames.getItem(itemType);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.ItemSpriteSheet", {
        $kind: "enum",
        statics: {
            fields: {
                WEAPON: 5,
                ARMOR: 6,
                RING: 7,
                SMTH: 127,
                SKELETON_KEY: 8,
                IRON_KEY: 9,
                GOLDEN_KEY: 10,
                SHORT_SWORD: 2,
                KNUCKLEDUSTER: 16,
                QUARTERSTAFF: 17,
                MACE: 18,
                DAGGER: 19,
                SWORD: 20,
                LONG_SWORD: 21,
                BATTLE_AXE: 22,
                WAR_HAMMER: 23,
                SPEAR: 29,
                GLAIVE: 30,
                SHURIKEN: 15,
                DART: 31,
                BOOMERANG: 106,
                TOMAHAWK: 107,
                INCENDIARY_DART: 108,
                CURARE_DART: 109,
                JAVELIN: 110,
                ARMOR_CLOTH: 24,
                ARMOR_LEATHER: 25,
                ARMOR_MAIL: 26,
                ARMOR_SCALE: 27,
                ARMOR_PLATE: 28,
                ARMOR_ROGUE: 96,
                ARMOR_WARRIOR: 97,
                ARMOR_MAGE: 98,
                ARMOR_HUNTRESS: 99,
                WAND_MAGIC_MISSILE: 3,
                WAND_HOLLY: 48,
                WAND_YEW: 49,
                WAND_EBONY: 50,
                WAND_CHERRY: 51,
                WAND_TEAK: 52,
                WAND_ROWAN: 53,
                WAND_WILLOW: 54,
                WAND_MAHOGANY: 55,
                WAND_BAMBOO: 68,
                WAND_PURPLEHEART: 69,
                WAND_OAK: 70,
                WAND_BIRCH: 71,
                RING_DIAMOND: 32,
                RING_OPAL: 33,
                RING_GARNET: 34,
                RING_RUBY: 35,
                RING_AMETHYST: 36,
                RING_TOPAZ: 37,
                RING_ONYX: 38,
                RING_TOURMALINE: 39,
                RING_EMERALD: 72,
                RING_SAPPHIRE: 73,
                RING_QUARTZ: 74,
                RING_AGATE: 75,
                POTION_TURQUOISE: 56,
                POTION_CRIMSON: 57,
                POTION_AZURE: 58,
                POTION_JADE: 59,
                POTION_GOLDEN: 60,
                POTION_MAGENTA: 61,
                POTION_CHARCOAL: 62,
                POTION_IVORY: 63,
                POTION_AMBER: 64,
                POTION_BISTRE: 65,
                POTION_INDIGO: 66,
                POTION_SILVER: 67,
                SCROLL_KAUNAN: 40,
                SCROLL_SOWILO: 41,
                SCROLL_LAGUZ: 42,
                SCROLL_YNGVI: 43,
                SCROLL_GYFU: 44,
                SCROLL_RAIDO: 45,
                SCROLL_ISAZ: 46,
                SCROLL_MANNAZ: 47,
                SCROLL_NAUDIZ: 76,
                SCROLL_BERKANAN: 77,
                SCROLL_ODAL: 78,
                SCROLL_TIWAZ: 79,
                SCROLL_WIPE_OUT: 117,
                SEED_FIREBLOOM: 88,
                SEED_ICECAP: 89,
                SEED_SORROWMOSS: 90,
                SEED_DREAMWEED: 91,
                SEED_SUNGRASS: 92,
                SEED_EARTHROOT: 93,
                SEED_FADELEAF: 94,
                SEED_ROTBERRY: 95,
                ROSE: 100,
                PICKAXE: 101,
                ORE: 102,
                SKULL: 103,
                PHANTOM: 118,
                DUST: 121,
                TOKEN: 122,
                BONES: 0,
                CHEST: 11,
                LOCKED_CHEST: 12,
                TOMB: 13,
                CRYSTAL_CHEST: 105,
                HIDDEN: 119,
                RATION: 4,
                PASTY: 112,
                MEAT: 113,
                STEAK: 114,
                OVERPRICED: 115,
                CARPACCIO: 116,
                POUCH: 83,
                HOLDER: 104,
                HOLSTER: 111,
                KEYRING: 126,
                SPARK_UPGRADE: 117,
                SPARK_ENCHANT: 118,
                ANKH: 1,
                GOLD: 14,
                STYLUS: 80,
                DEWDROP: 81,
                MASTERY: 82,
                TORCH: 84,
                BEACON: 85,
                KIT: 86,
                AMULET: 87,
                VIAL: 120,
                WEIGHT: 123,
                BOMB: 124,
                HONEYPOT: 125
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitState", {
        $kind: "enum",
        statics: {
            fields: {
                Idle: 0,
                Run: 1
            }
        }
    });

    Bridge.define("PixelRPG.Base.Components.GameStateComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            Map: null,
            Players: null,
            Exit: null,
            MaxPlayersCount: 0,
            MovedPlayers: 0
        },
        ctors: {
            init: function () {
                this.Exit = new Microsoft.Xna.Framework.Point();
                this.Players = new (System.Collections.Generic.Dictionary$2(System.Int32,PixelRPG.Base.Components.GameStateComponent.Player))();
            }
        }
    });

    Bridge.define("PixelRPG.Base.Components.GameStateComponent.Player", {
        $kind: "nested class",
        fields: {
            PlayerId: 0,
            Units: null
        }
    });

    Bridge.define("PixelRPG.Base.Components.GameStateComponent.Unit", {
        $kind: "nested class",
        fields: {
            UnitId: 0,
            Position: null
        },
        ctors: {
            init: function () {
                this.Position = new Microsoft.Xna.Framework.Point();
            }
        }
    });

    Bridge.define("PixelRPG.Base.Components.UnitComponent", {
        inherits: [LocomotorECS.Component],
        props: {
            UnitAnimations: null,
            State: 0
        }
    });

    Bridge.define("PixelRPG.Base.Components.VisiblePlayerComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            MapEntityName: null,
            KnownPlayers: null
        },
        ctors: {
            init: function () {
                this.KnownPlayers = new (System.Collections.Generic.List$1(LocomotorECS.Entity)).ctor();
            },
            ctor: function (mapEntityName) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.MapEntityName = mapEntityName;
            }
        }
    });

    Bridge.define("PixelRPG.Base.ContentPaths", {
        statics: {
            fields: {
                content: null
            },
            ctors: {
                init: function () {
                    this.content = "Content";
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.ContentPaths.Assets", {
        $kind: "nested class",
        statics: {
            fields: {
                amulet: null,
                arcs1: null,
                arcs2: null,
                avatars: null,
                badges: null,
                banners: null,
                buffs: null,
                chrome: null,
                dashboard: null,
                effects: null,
                exp_bar: null,
                fireball: null,
                font15x: null,
                font1x: null,
                font25x: null,
                font2x: null,
                font3x: null,
                hp_bar: null,
                icons: null,
                items: null,
                large_buffs: null,
                locked_badge: null,
                plants: null,
                shadow: null,
                specks: null,
                spell_icons: null,
                status_pane: null,
                surface: null,
                template: null,
                test: null,
                tiles0: null,
                tiles1: null,
                tiles2: null,
                tiles3: null,
                tiles4: null,
                tileSetLayer1: null,
                tileSetWater1: null,
                toolbar: null,
                water0: null,
                water1: null,
                water2: null,
                water3: null,
                water4: null
            },
            ctors: {
                init: function () {
                    this.amulet = "assets/amulet";
                    this.arcs1 = "assets/arcs1";
                    this.arcs2 = "assets/arcs2";
                    this.avatars = "assets/avatars";
                    this.badges = "assets/badges";
                    this.banners = "assets/banners";
                    this.buffs = "assets/buffs";
                    this.chrome = "assets/chrome";
                    this.dashboard = "assets/dashboard";
                    this.effects = "assets/effects";
                    this.exp_bar = "assets/exp_bar";
                    this.fireball = "assets/fireball";
                    this.font15x = "assets/font15x";
                    this.font1x = "assets/font1x";
                    this.font25x = "assets/font25x";
                    this.font2x = "assets/font2x";
                    this.font3x = "assets/font3x";
                    this.hp_bar = "assets/hp_bar";
                    this.icons = "assets/icons";
                    this.items = "assets/items";
                    this.large_buffs = "assets/large_buffs";
                    this.locked_badge = "assets/locked_badge";
                    this.plants = "assets/plants";
                    this.shadow = "assets/shadow";
                    this.specks = "assets/specks";
                    this.spell_icons = "assets/spell_icons";
                    this.status_pane = "assets/status_pane";
                    this.surface = "assets/surface";
                    this.template = "assets/template";
                    this.test = "assets/test";
                    this.tiles0 = "assets/tiles0";
                    this.tiles1 = "assets/tiles1";
                    this.tiles2 = "assets/tiles2";
                    this.tiles3 = "assets/tiles3";
                    this.tiles4 = "assets/tiles4";
                    this.tileSetLayer1 = "assets/tileSetLayer1";
                    this.tileSetWater1 = "assets/tileSetWater1";
                    this.toolbar = "assets/toolbar";
                    this.water0 = "assets/water0";
                    this.water1 = "assets/water1";
                    this.water2 = "assets/water2";
                    this.water3 = "assets/water3";
                    this.water4 = "assets/water4";
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.ContentPaths.Assets.Characters", {
        $kind: "nested class",
        statics: {
            fields: {
                mage: null,
                ranger: null,
                rogue: null,
                warrior: null
            },
            ctors: {
                init: function () {
                    this.mage = "assets/characters/mage";
                    this.ranger = "assets/characters/ranger";
                    this.rogue = "assets/characters/rogue";
                    this.warrior = "assets/characters/warrior";
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.ContentPaths.Assets.Enemy", {
        $kind: "nested class",
        statics: {
            fields: {
                bat: null,
                bee: null,
                brute: null,
                burning_fist: null,
                crab: null,
                dm300: null,
                elemental: null,
                eye: null,
                gnoll: null,
                golem: null,
                goo: null,
                king: null,
                larva: null,
                mimic: null,
                monk: null,
                pet: null,
                piranha: null,
                rat: null,
                ratking: null,
                rotting_fist: null,
                scorpio: null,
                shaman: null,
                skeleton: null,
                spinner: null,
                statue: null,
                succubus: null,
                swarm: null,
                tengu: null,
                thief: null,
                undead: null,
                warlock: null,
                wraith: null,
                yog: null
            },
            ctors: {
                init: function () {
                    this.bat = "assets/enemy/bat";
                    this.bee = "assets/enemy/bee";
                    this.brute = "assets/enemy/brute";
                    this.burning_fist = "assets/enemy/burning_fist";
                    this.crab = "assets/enemy/crab";
                    this.dm300 = "assets/enemy/dm300";
                    this.elemental = "assets/enemy/elemental";
                    this.eye = "assets/enemy/eye";
                    this.gnoll = "assets/enemy/gnoll";
                    this.golem = "assets/enemy/golem";
                    this.goo = "assets/enemy/goo";
                    this.king = "assets/enemy/king";
                    this.larva = "assets/enemy/larva";
                    this.mimic = "assets/enemy/mimic";
                    this.monk = "assets/enemy/monk";
                    this.pet = "assets/enemy/pet";
                    this.piranha = "assets/enemy/piranha";
                    this.rat = "assets/enemy/rat";
                    this.ratking = "assets/enemy/ratking";
                    this.rotting_fist = "assets/enemy/rotting_fist";
                    this.scorpio = "assets/enemy/scorpio";
                    this.shaman = "assets/enemy/shaman";
                    this.skeleton = "assets/enemy/skeleton";
                    this.spinner = "assets/enemy/spinner";
                    this.statue = "assets/enemy/statue";
                    this.succubus = "assets/enemy/succubus";
                    this.swarm = "assets/enemy/swarm";
                    this.tengu = "assets/enemy/tengu";
                    this.thief = "assets/enemy/thief";
                    this.undead = "assets/enemy/undead";
                    this.warlock = "assets/enemy/warlock";
                    this.wraith = "assets/enemy/wraith";
                    this.yog = "assets/enemy/yog";
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.ContentPaths.Assets.Neutral", {
        $kind: "nested class",
        statics: {
            fields: {
                blacksmith: null,
                demon: null,
                ghost: null,
                sheep: null,
                shopkeeper: null,
                wandmaker: null
            },
            ctors: {
                init: function () {
                    this.blacksmith = "assets/neutral/blacksmith";
                    this.demon = "assets/neutral/demon";
                    this.ghost = "assets/neutral/ghost";
                    this.sheep = "assets/neutral/sheep";
                    this.shopkeeper = "assets/neutral/shopkeeper";
                    this.wandmaker = "assets/neutral/wandmaker";
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.ContentPaths.Assets.Sounds", {
        $kind: "nested class",
        statics: {
            fields: {
                snd_alert: null,
                snd_badge: null,
                snd_beacon: null,
                snd_bee: null,
                snd_blast: null,
                snd_bones: null,
                snd_boss: null,
                snd_burning: null,
                snd_challenge: null,
                snd_charms: null,
                snd_click: null,
                snd_cursed: null,
                snd_death: null,
                snd_degrade: null,
                snd_descend: null,
                snd_dewdrop: null,
                snd_door_open: null,
                snd_drink: null,
                snd_eat: null,
                snd_evoke: null,
                snd_falling: null,
                snd_game: null,
                snd_ghost: null,
                snd_gold: null,
                snd_hit: null,
                snd_item: null,
                snd_levelup: null,
                snd_lightning: null,
                snd_lullaby: null,
                snd_mastery: null,
                snd_meld: null,
                snd_mimic: null,
                snd_miss: null,
                snd_plant: null,
                snd_puff: null,
                snd_ray: null,
                snd_read: null,
                snd_rocks: null,
                snd_secret: null,
                snd_shatter: null,
                snd_step: null,
                snd_surface: null,
                snd_teleport: null,
                snd_theme: null,
                snd_tomb: null,
                snd_trap: null,
                snd_unlock: null,
                snd_water: null,
                snd_zap: null
            },
            ctors: {
                init: function () {
                    this.snd_alert = "assets/sounds/snd_alert";
                    this.snd_badge = "assets/sounds/snd_badge";
                    this.snd_beacon = "assets/sounds/snd_beacon";
                    this.snd_bee = "assets/sounds/snd_bee";
                    this.snd_blast = "assets/sounds/snd_blast";
                    this.snd_bones = "assets/sounds/snd_bones";
                    this.snd_boss = "assets/sounds/snd_boss";
                    this.snd_burning = "assets/sounds/snd_burning";
                    this.snd_challenge = "assets/sounds/snd_challenge";
                    this.snd_charms = "assets/sounds/snd_charms";
                    this.snd_click = "assets/sounds/snd_click";
                    this.snd_cursed = "assets/sounds/snd_cursed";
                    this.snd_death = "assets/sounds/snd_death";
                    this.snd_degrade = "assets/sounds/snd_degrade";
                    this.snd_descend = "assets/sounds/snd_descend";
                    this.snd_dewdrop = "assets/sounds/snd_dewdrop";
                    this.snd_door_open = "assets/sounds/snd_door_open";
                    this.snd_drink = "assets/sounds/snd_drink";
                    this.snd_eat = "assets/sounds/snd_eat";
                    this.snd_evoke = "assets/sounds/snd_evoke";
                    this.snd_falling = "assets/sounds/snd_falling";
                    this.snd_game = "assets/sounds/snd_game";
                    this.snd_ghost = "assets/sounds/snd_ghost";
                    this.snd_gold = "assets/sounds/snd_gold";
                    this.snd_hit = "assets/sounds/snd_hit";
                    this.snd_item = "assets/sounds/snd_item";
                    this.snd_levelup = "assets/sounds/snd_levelup";
                    this.snd_lightning = "assets/sounds/snd_lightning";
                    this.snd_lullaby = "assets/sounds/snd_lullaby";
                    this.snd_mastery = "assets/sounds/snd_mastery";
                    this.snd_meld = "assets/sounds/snd_meld";
                    this.snd_mimic = "assets/sounds/snd_mimic";
                    this.snd_miss = "assets/sounds/snd_miss";
                    this.snd_plant = "assets/sounds/snd_plant";
                    this.snd_puff = "assets/sounds/snd_puff";
                    this.snd_ray = "assets/sounds/snd_ray";
                    this.snd_read = "assets/sounds/snd_read";
                    this.snd_rocks = "assets/sounds/snd_rocks";
                    this.snd_secret = "assets/sounds/snd_secret";
                    this.snd_shatter = "assets/sounds/snd_shatter";
                    this.snd_step = "assets/sounds/snd_step";
                    this.snd_surface = "assets/sounds/snd_surface";
                    this.snd_teleport = "assets/sounds/snd_teleport";
                    this.snd_theme = "assets/sounds/snd_theme";
                    this.snd_tomb = "assets/sounds/snd_tomb";
                    this.snd_trap = "assets/sounds/snd_trap";
                    this.snd_unlock = "assets/sounds/snd_unlock";
                    this.snd_water = "assets/sounds/snd_water";
                    this.snd_zap = "assets/sounds/snd_zap";
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.CharSpriteUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.Components.UnitComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var animation = entity.GetOrCreateComponent(SpineEngine.ECS.Components.AnimationSpriteComponent);
                var charSprites = entity.GetComponent(PixelRPG.Base.Components.UnitComponent);

                if (animation.IsPlaying) {
                    return;
                }

                switch (charSprites.State) {
                    case PixelRPG.Base.Assets.UnitState.Idle: 
                        animation.Animation = charSprites.UnitAnimations.Idle;
                        break;
                    case PixelRPG.Base.Assets.UnitState.Run: 
                        animation.Animation = charSprites.UnitAnimations.Run;
                        break;
                }

                animation.IsPlaying = true;
            },
            OnMatchedEntityAdded: function (entity) {
                LocomotorECS.EntityProcessingSystem.prototype.OnMatchedEntityAdded.call(this, entity);
                var charSprites = entity.GetComponent(PixelRPG.Base.Components.UnitComponent);
                var animation = entity.GetOrCreateComponent(SpineEngine.ECS.Components.AnimationSpriteComponent);
                var sprite = entity.GetOrCreateComponent(SpineEngine.ECS.Components.SpriteComponent);
                animation.Animation = charSprites.UnitAnimations.Idle;
                animation.IsPlaying = true;
                sprite.Drawable = animation.Animation.Frames.getItem(animation.StartFrame);
            }
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.ServerLogic", {
        statics: {
            methods: {
                BuildCurrentStateForPlayer: function (gameState, player) {
                    var $t;
                    var width = System.Array.getLength(gameState.Map.Regions, 0);
                    var height = System.Array.getLength(gameState.Map.Regions, 1);
                    var regions = System.Array.create(null, null, System.Nullable$1(System.Int32), width, height);
                    for (var x = 0; x < width; x = (x + 1) | 0) {
                        for (var y = 0; y < height; y = (y + 1) | 0) {
                            regions.set([x, y], PixelRPG.Base.EntitySystems.ServerLogic.IsVisible(player, gameState.Exit.X, gameState.Exit.Y, x, y) ? gameState.Map.Regions.get([x, y]) : null);
                        }
                    }

                    return ($t = new PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage(), $t.Players = System.Linq.Enumerable.from(gameState.Players.getValues()).select(function (a) {
                            var $t1;
                            return ($t1 = new PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Player(), $t1.PlayerId = a.PlayerId, $t1.Units = System.Linq.Enumerable.from(a.Units).where(function (b) {
                                    return PixelRPG.Base.EntitySystems.ServerLogic.IsVisible(player, gameState.Exit.X, gameState.Exit.Y, b.Position.X, b.Position.Y);
                                }).select($asm.$.PixelRPG.Base.EntitySystems.ServerLogic.f1).toList(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Unit), $t1);
                        }).toList(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Player), $t.Exit = PixelRPG.Base.EntitySystems.ServerLogic.IsVisible(player, gameState.Exit.X, gameState.Exit.Y, gameState.Exit.X, gameState.Exit.Y) ? new PixelRPG.Base.TransferMessages.PointTransferMessage.$ctor1(gameState.Exit.X, gameState.Exit.Y) : null, $t.Map = regions, $t.Doors = System.Linq.Enumerable.from(gameState.Map.Junctions).where(function (a) {
                            return PixelRPG.Base.EntitySystems.ServerLogic.IsVisible(player, gameState.Exit.X, gameState.Exit.Y, a.X, a.Y);
                        }).select($asm.$.PixelRPG.Base.EntitySystems.ServerLogic.f2).toList(PixelRPG.Base.TransferMessages.PointTransferMessage), $t);
                },
                IsVisible: function (fromPlayer, exitX, exitY, x, y) {
                    for (var i = 0; i < fromPlayer.Units.Count; i = (i + 1) | 0) {
                        if (fromPlayer.Units.getItem(i).Position.X === exitX && fromPlayer.Units.getItem(i).Position.Y === exitY) {
                            return true;
                        }

                        if (((Math.abs(((x - fromPlayer.Units.getItem(i).Position.X) | 0)) + Math.abs(((y - fromPlayer.Units.getItem(i).Position.Y) | 0))) | 0) < 7) {
                            return true;
                        }
                    }
                    return false;
                },
                StartNewGame: function (gameState) {
                    var $t, $t1;
                    gameState.Map = new MazeGenerators.RoomMazeGenerator().Generate(($t = new MazeGenerators.RoomMazeGenerator.Settings(71, 41), $t.ExtraConnectorChance = 5, $t.WindingPercent = 50, $t));
                    for (var x = 0; x < System.Array.getLength(gameState.Map.Regions, 0); x = (x + 1) | 0) {
                        for (var y = 0; y < System.Array.getLength(gameState.Map.Regions, 1); y = (y + 1) | 0) {
                            gameState.Map.Regions.set([x, y], gameState.Map.Regions.get([x, y]) == null ? PixelRPG.Base.Screens.GameSceneConfig.WallRegionValue : PixelRPG.Base.Screens.GameSceneConfig.PathRegionValue);
                        }
                    }

                    gameState.Players = gameState.Players || new (System.Collections.Generic.Dictionary$2(System.Int32,PixelRPG.Base.Components.GameStateComponent.Player))();
                    var roomIdx = 0;
                    $t = Bridge.getEnumerator(gameState.Players);
                    try {
                        while ($t.moveNext()) {
                            var player = $t.Current;
                            var room = gameState.Map.Rooms.getItem(roomIdx).$clone();
                            roomIdx = (roomIdx + 1) | 0;
                            if (player.value.Units == null) {
                                player.value.Units = $asm.$.PixelRPG.Base.EntitySystems.ServerLogic.f3(new (System.Collections.Generic.List$1(PixelRPG.Base.Components.GameStateComponent.Unit)).ctor());
                            }

                            player.value.Units.getItem(0).Position = new Microsoft.Xna.Framework.Point.$ctor2(((((room.X + ((Bridge.Int.div(room.Width, 2)) | 0)) | 0) - 1) | 0), ((room.Y + ((Bridge.Int.div(room.Height, 2)) | 0)) | 0));
                            player.value.Units.getItem(1).Position = new Microsoft.Xna.Framework.Point.$ctor2(((((room.X + ((Bridge.Int.div(room.Width, 2)) | 0)) | 0) + 1) | 0), ((room.Y + ((Bridge.Int.div(room.Height, 2)) | 0)) | 0));
                            player.value.Units.getItem(2).Position = new Microsoft.Xna.Framework.Point.$ctor2(((room.X + ((Bridge.Int.div(room.Width, 2)) | 0)) | 0), ((((room.Y + ((Bridge.Int.div(room.Height, 2)) | 0)) | 0) - 1) | 0));
                            player.value.Units.getItem(3).Position = new Microsoft.Xna.Framework.Point.$ctor2(((room.X + ((Bridge.Int.div(room.Width, 2)) | 0)) | 0), ((((room.Y + ((Bridge.Int.div(room.Height, 2)) | 0)) | 0) + 1) | 0));
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    gameState.Exit = new Microsoft.Xna.Framework.Point.$ctor2(((gameState.Map.Rooms.getItem(((gameState.Map.Rooms.Count - 1) | 0)).$clone().X + ((Bridge.Int.div(gameState.Map.Rooms.getItem(((gameState.Map.Rooms.Count - 1) | 0)).$clone().Width, 2)) | 0)) | 0), ((gameState.Map.Rooms.getItem(((gameState.Map.Rooms.Count - 1) | 0)).$clone().Y + ((Bridge.Int.div(gameState.Map.Rooms.getItem(((gameState.Map.Rooms.Count - 1) | 0)).$clone().Height, 2)) | 0)) | 0));

                    return ($t1 = new PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage(), $t1.Width = System.Array.getLength(gameState.Map.Regions, 0), $t1.Height = System.Array.getLength(gameState.Map.Regions, 1), $t1);
                }
            }
        }
    });

    Bridge.ns("PixelRPG.Base.EntitySystems.ServerLogic", $asm.$);

    Bridge.apply($asm.$.PixelRPG.Base.EntitySystems.ServerLogic, {
        f1: function (b) {
            var $t2;
            return ($t2 = new PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Unit(), $t2.UnitId = b.UnitId, $t2.Position = new PixelRPG.Base.TransferMessages.PointTransferMessage.$ctor1(b.Position.X, b.Position.Y), $t2);
        },
        f2: function (a) {
            return new PixelRPG.Base.TransferMessages.PointTransferMessage.$ctor1(a.X, a.Y);
        },
        f3: function (_o1) {
            var $t1;
            _o1.add(($t1 = new PixelRPG.Base.Components.GameStateComponent.Unit(), $t1.UnitId = 1, $t1));
            _o1.add(($t1 = new PixelRPG.Base.Components.GameStateComponent.Unit(), $t1.UnitId = 2, $t1));
            _o1.add(($t1 = new PixelRPG.Base.Components.GameStateComponent.Unit(), $t1.UnitId = 3, $t1));
            _o1.add(($t1 = new PixelRPG.Base.Components.GameStateComponent.Unit(), $t1.UnitId = 4, $t1));
            return _o1;
        }
    });

    /** @namespace PixelRPG.Base */

    /**
     * This is the main type for your game.
     *
     * @public
     * @class PixelRPG.Base.Game1
     * @augments SpineEngine.Core
     */
    Bridge.define("PixelRPG.Base.Game1", {
        inherits: [SpineEngine.Core],
        ctors: {
            ctor: function () {
                this.$initialize();
                SpineEngine.Core.ctor.call(this, 650, 800);
                this.Window.AllowUserResizing = true;
                this.IsMouseVisible = true;
            }
        },
        methods: {
            Initialize: function () {
                SpineEngine.Core.prototype.Initialize.call(this);
                SpineEngine.Core.Instance.SwitchScene(new (PixelRPG.Base.AdditionalStuff.Scenes.LoadingScene$1(PixelRPG.Base.Screens.BasicScene))(Bridge.fn.bind(this, $asm.$.PixelRPG.Base.Game1.f1)(new (System.Collections.Generic.List$1(PixelRPG.Base.AdditionalStuff.Scenes.LoadingData)).ctor()), 1200, 600));
            },
            GetEnumerator: function (content) {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    content.Load(PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledMap, PixelRPG.Base.ContentPaths.Assets.template);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Characters.warrior);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 2;
                                        return true;
                                }
                                case 2: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Characters.mage);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Characters.ranger);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 4;
                                        return true;
                                }
                                case 4: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Characters.rogue);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 5;
                                        return true;
                                }
                                case 5: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.tiles0);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 6;
                                        return true;
                                }
                                case 6: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.tiles1);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 7;
                                        return true;
                                }
                                case 7: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.tiles2);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 8;
                                        return true;
                                }
                                case 8: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.tiles3);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 9;
                                        return true;
                                }
                                case 9: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.tiles4);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 10;
                                        return true;
                                }
                                case 10: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.water0);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 11;
                                        return true;
                                }
                                case 11: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.water1);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 12;
                                        return true;
                                }
                                case 12: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.water2);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 13;
                                        return true;
                                }
                                case 13: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.water3);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 14;
                                        return true;
                                }
                                case 14: {
                                    content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.water4);
                                        $enumerator.current = Bridge.box(0, System.Int32);
                                        $step = 15;
                                        return true;
                                }
                                case 15: {

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            }
        }
    });

    Bridge.ns("PixelRPG.Base.Game1", $asm.$);

    Bridge.apply($asm.$.PixelRPG.Base.Game1, {
        f1: function (_o1) {
            var $t;
            _o1.add(($t = new PixelRPG.Base.AdditionalStuff.Scenes.LoadingData(), $t.Count = 15, $t.Enumerator = this.GetEnumerator(this.Content), $t));
            _o1.add(($t = new PixelRPG.Base.AdditionalStuff.Scenes.LoadingData(), $t.Count = 47, $t.Enumerator = PixelRPG.Base.AdditionalStuff.FaceUI.Utils.GeonBitUIResources.GetEnumerator(this.Content, "hd"), $t));
            return _o1;
        }
    });

    Bridge.define("PixelRPG.Base.Screens.BasicScene", {
        inherits: [SpineEngine.ECS.Scene],
        ctors: {
            ctor: function () {
                var $t;
                this.$initialize();
                SpineEngine.ECS.Scene.ctor.call(this);
                this.SetDesignResolution(1280, 720, SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy.None);
                SpineEngine.Core.Instance.Screen.SetSize(1280, 720);

                this.AddRenderer(SpineEngine.Graphics.Renderers.DefaultRenderer, new SpineEngine.Graphics.Renderers.DefaultRenderer());

                this.AddEntitySystem(new PixelRPG.Base.AdditionalStuff.FaceUI.ECS.EntitySystems.UIUpdateSystem(SpineEngine.Core.Instance.Content));

                var uiEntity = this.CreateEntity("UI");
                var ui = uiEntity.AddComponent(PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components.UIComponent);
                ui.UserInterface.ShowCursor = false;

                var panel = new FaceUI.Entities.Panel.$ctor1(new Microsoft.Xna.Framework.Vector2.$ctor2(500, 500));
                panel.AddChild(new FaceUI.Entities.Label.$ctor1("Server"));
                panel.AddChild(new FaceUI.Entities.Label.$ctor1("Total Players"));
                var totalPlayersCount = ($t = new FaceUI.Entities.TextInput.ctor(), $t.Value = "4", $t);
                panel.AddChild(totalPlayersCount);
                panel.AddChild(new FaceUI.Entities.Button.$ctor1("Start")).OnClick = function (b) {
                    var $t1;
                    SpineEngine.Core.Instance.SwitchScene(new PixelRPG.Base.Screens.GameScene(($t1 = new PixelRPG.Base.Screens.GameSceneConfig(), $t1.IsServer = true, $t1.ClientsCount = System.Int32.parse(totalPlayersCount.Value), $t1.TotalPlayers = System.Int32.parse(totalPlayersCount.Value), $t1)));
                };

                panel.AddChild(new FaceUI.Entities.Label.$ctor1("Client"));
                panel.AddChild(new FaceUI.Entities.Label.$ctor1("Network Players"));
                var networkPlayersCount = ($t = new FaceUI.Entities.TextInput.ctor(), $t.Value = "1", $t);
                panel.AddChild(networkPlayersCount);
                panel.AddChild(new FaceUI.Entities.Button.$ctor1("Start")).OnClick = function (b) {
                    var $t1;
                    SpineEngine.Core.Instance.SwitchScene(new PixelRPG.Base.Screens.GameScene(($t1 = new PixelRPG.Base.Screens.GameSceneConfig(), $t1.IsServer = false, $t1.ClientsCount = System.Int32.parse(networkPlayersCount.Value), $t1)));
                };

                ui.UserInterface.AddEntity(panel);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Screens.GameScene", {
        inherits: [SpineEngine.ECS.Scene],
        ctors: {
            ctor: function (config) {
                var $t;
                this.$initialize();
                SpineEngine.ECS.Scene.ctor.call(this);
                this.SetDesignResolution(1280, 720, SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy.None);
                SpineEngine.Core.Instance.Screen.SetSize(1280, 720);

                this.AddRenderer(SpineEngine.Graphics.Renderers.DefaultRenderer, new SpineEngine.Graphics.Renderers.DefaultRenderer());

                var parsers = System.Array.init([new PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessageParser(), new PixelRPG.Base.TransferMessages.ClientConnectTransferMessageParser(), new PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessageParser(), new PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessageParser(), new PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessageParser(), new PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessageParser(), new PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessageParser(), new PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessageParser()], PixelRPG.Base.AdditionalStuff.ClientServer.ITransferMessageParser);

                var map = this.CreateEntity("Map");
                map.AddComponent$1(PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components.TiledMapComponent, new PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components.TiledMapComponent(SpineEngine.Core.Instance.Content.Load(PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledMap, PixelRPG.Base.ContentPaths.Assets.template)));

                this.AddEntitySystem(new PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem([new PixelRPG.Base.EntitySystems.ServerReceiveClientConnectHandler(), new PixelRPG.Base.EntitySystems.ServerRecieveClientTurnDoneHandler()]));
                this.AddEntitySystem(new PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.LocalServerCommunicatorSystem(parsers));
                this.AddEntitySystem(new PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.NetworkServerCommunicatorSystem(parsers));
                this.AddEntitySystem(new PixelRPG.Base.EntitySystems.ClientReceiveServerGameStartedVisibleSystem(this));
                this.AddEntitySystem(new PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.LocalClientCommunicatorSystem(this, parsers));
                this.AddEntitySystem(new PixelRPG.Base.EntitySystems.ClientReceiveServerGameStartedAISystem());
                this.AddEntitySystem(new PixelRPG.Base.EntitySystems.ClientRecieveServerYourTurnAISystem());
                this.AddEntitySystem(new PixelRPG.Base.EntitySystems.ClientRecieveServerYouConnectedAISystem());
                this.AddEntitySystem(new PixelRPG.Base.EntitySystems.ClientSendClientTurnDoneAISystem());
                this.AddEntitySystem(new PixelRPG.Base.EntitySystems.ClientReceiveServerCurrentStateAISystem());
                this.AddEntitySystem(new PixelRPG.Base.EntitySystems.ClientReceiveServerCurrentStateVisibleSystem(this));
                this.AddEntitySystem(new PixelRPG.Base.AdditionalStuff.BrainAI.EntitySystems.AIUpdateSystem());
                this.AddEntitySystem(new PixelRPG.Base.AdditionalStuff.TiledMap.ECS.EntitySystems.TiledMapUpdateSystem());
                this.AddEntitySystem(new PixelRPG.Base.AdditionalStuff.TiledMap.ECS.EntitySystems.TiledMapMeshGeneratorSystem(this));
                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.AnimationSpriteUpdateSystem());
                this.AddEntitySystem(new PixelRPG.Base.EntitySystems.CharSpriteUpdateSystem());
                this.AddEntitySystem(new PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.NetworkClientCommunicatorSystem(parsers));

                if (config.IsServer) {
                    var server = this.CreateEntity("Server");
                    server.AddComponent(PixelRPG.Base.Components.GameStateComponent).MaxPlayersCount = config.TotalPlayers;
                    server.AddComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.ServerComponent);
                    server.AddComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.LocalServerComponent);
                    server.AddComponent$1(PixelRPG.Base.AdditionalStuff.ClientServer.Components.NetworkServerComponent, new PixelRPG.Base.AdditionalStuff.ClientServer.Components.NetworkServerComponent("127.0.0.1", 8085));

                    for (var i = 0; i < config.ClientsCount; i = (i + 1) | 0) {
                        var player = this.CreateEntity();
                        player.AddComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent).Message = ($t = new PixelRPG.Base.TransferMessages.ClientConnectTransferMessage(), $t.PlayerName = System.String.format("Player {0}", [Bridge.box(i, System.Int32)]), $t);
                        player.AddComponent(PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent).AIBot = new PixelRPG.Base.Screens.SimpleAI();
                        if (i === 0) {
                            player.AddComponent$1(PixelRPG.Base.Components.VisiblePlayerComponent, new PixelRPG.Base.Components.VisiblePlayerComponent(map.Name));
                        }
                        {
                            player.AddComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.LocalClientComponent).ServerEntity = server.Name;
                        }
                    }
                } else {
                    for (var i1 = 0; i1 < config.ClientsCount; i1 = (i1 + 1) | 0) {
                        var player1 = this.CreateEntity();
                        player1.AddComponent(PixelRPG.Base.AdditionalStuff.ClientServer.Components.ClientComponent).Message = ($t = new PixelRPG.Base.TransferMessages.ClientConnectTransferMessage(), $t.PlayerName = System.String.format("Player {0}", [Bridge.box(i1, System.Int32)]), $t);
                        player1.AddComponent$1(PixelRPG.Base.AdditionalStuff.ClientServer.Components.NetworkClientComponent, new PixelRPG.Base.AdditionalStuff.ClientServer.Components.NetworkClientComponent(new System.Uri("ws://127.0.0.1:8085")));
                        player1.AddComponent(PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent).AIBot = new PixelRPG.Base.Screens.SimpleAI();

                        if (i1 === 0) {
                            player1.AddComponent$1(PixelRPG.Base.Components.VisiblePlayerComponent, new PixelRPG.Base.Components.VisiblePlayerComponent(map.Name));
                        }
                    }
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.Screens.GameSceneConfig", {
        statics: {
            fields: {
                WallRegionValue: null,
                PathRegionValue: null,
                UnknownRegionValue: null
            },
            ctors: {
                init: function () {
                    this.WallRegionValue = 1;
                    this.PathRegionValue = 0;
                }
            }
        },
        fields: {
            IsServer: false,
            ClientsCount: 0,
            TotalPlayers: 0
        },
        ctors: {
            init: function () {
                this.ClientsCount = 1;
                this.TotalPlayers = 2;
            }
        }
    });

    Bridge.define("PixelRPG.Base.Screens.SimpleAI", {
        inherits: [BrainAI.AI.IAITurn],
        fields: {
            MePlayerId: 0,
            Regions: null,
            Players: null,
            Exit: null,
            SearchPoint: null,
            Pathfinding: null,
            NeedAction: false,
            NextTurn: null
        },
        alias: ["Tick", "BrainAI$AI$IAITurn$Tick"],
        ctors: {
            init: function () {
                this.SearchPoint = new (System.Collections.Generic.Dictionary$2(System.Int32,System.Nullable$1(PixelRPG.Base.TransferMessages.PointTransferMessage)))();
            }
        },
        methods: {
            Tick: function () {
                var $t;
                if (!this.NeedAction) {
                    return;
                }

                var me = this.FindMe();

                this.NextTurn = new (System.Collections.Generic.Dictionary$2(System.Int32,PixelRPG.Base.TransferMessages.PointTransferMessage))();

                for (var i = 0; i < me.Units.Count; i = (i + 1) | 0) {
                    if (!this.SearchPoint.containsKey(me.Units.getItem(i).UnitId) || System.Nullable.lift1("$clone", this.SearchPoint.get(me.Units.getItem(i).UnitId)) == null || (System.Nullable.getValue(System.Nullable.lift1("$clone", this.SearchPoint.get(me.Units.getItem(i).UnitId))).X === me.Units.getItem(i).Position.X && System.Nullable.getValue(System.Nullable.lift1("$clone", this.SearchPoint.get(me.Units.getItem(i).UnitId))).Y === me.Units.getItem(i).Position.Y)) {
                        this.SearchPoint.set(me.Units.getItem(i).UnitId, new PixelRPG.Base.TransferMessages.PointTransferMessage.$ctor1(FateRandom.Fate.GlobalFate.NextInt(System.Array.getLength(this.Regions, 0)), FateRandom.Fate.GlobalFate.NextInt(System.Array.getLength(this.Regions, 1))));
                    }

                    var pathToGo = ($t = this.Exit, $t != null ? $t : System.Nullable.getValue(System.Nullable.lift1("$clone", this.SearchPoint.get(me.Units.getItem(i).UnitId))));

                    var path = BrainAI.Pathfinding.AStar.AStarPathfinder.Search$1(BrainAI.Pathfinding.Point, this.Pathfinding, new BrainAI.Pathfinding.Point.$ctor1(me.Units.getItem(i).Position.X, me.Units.getItem(i).Position.Y), new BrainAI.Pathfinding.Point.$ctor1(pathToGo.X, pathToGo.Y));

                    if (path == null || path.Count < 2) {
                        this.SearchPoint.set(me.Units.getItem(i).UnitId, null);
                        continue;
                    }

                    for (var j = 0; j < me.Units.Count; j = (j + 1) | 0) {
                        if (me.Units.getItem(j).Position.X === path.getItem(1).$clone().X && me.Units.getItem(j).Position.Y === path.getItem(1).$clone().Y) {
                            this.SearchPoint.set(me.Units.getItem(i).UnitId, null);
                        }
                    }

                    this.NextTurn.set(me.Units.getItem(i).UnitId, new PixelRPG.Base.TransferMessages.PointTransferMessage.$ctor1(path.getItem(1).$clone().X, path.getItem(1).$clone().Y));
                }

                this.NeedAction = false;
            },
            FindMe: function () {
                for (var i = 0; i < this.Players.Count; i = (i + 1) | 0) {
                    if (this.Players.getItem(i).PlayerId === this.MePlayerId) {
                        return this.Players.getItem(i);
                    }
                }

                return null;
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.PointTransferMessage", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new PixelRPG.Base.TransferMessages.PointTransferMessage(); }
            }
        },
        fields: {
            X: 0,
            Y: 0
        },
        ctors: {
            $ctor1: function (x, y) {
                this.$initialize();
                this.X = x;
                this.Y = y;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            toString: function () {
                return System.String.format("{0} x {1}", Bridge.box(this.X, System.Int32), Bridge.box(this.Y, System.Int32));
            },
            getHashCode: function () {
                var h = Bridge.addHash([8825792023, this.X, this.Y]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, PixelRPG.Base.TransferMessages.PointTransferMessage)) {
                    return false;
                }
                return Bridge.equals(this.X, o.X) && Bridge.equals(this.Y, o.Y);
            },
            $clone: function (to) {
                var s = to || new PixelRPG.Base.TransferMessages.PointTransferMessage();
                s.X = this.X;
                s.Y = this.Y;
                return s;
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage", {
        fields: {
            PlayerName: null,
            PlayerId: 0,
            CurrentCount: 0,
            WaitingCount: 0
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Player", {
        $kind: "nested class",
        fields: {
            PlayerId: 0,
            Units: null
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Unit", {
        $kind: "nested class",
        fields: {
            UnitId: 0,
            Position: null
        },
        ctors: {
            init: function () {
                this.Position = new PixelRPG.Base.TransferMessages.PointTransferMessage();
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessage", {
        fields: {
            PlayerId: 0
        }
    });

    Bridge.define("BanditSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);

                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.thief);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 13);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [21, 21, 21, 22, 21, 21, 21, 21, 2]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [21, 21, 23, 24, 24, 25]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [31, 32, 33]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [25, 27, 28, 29, 30]);
            }
        }
    });

    Bridge.define("BatSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.bat);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 15, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3, 0, 1]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [4, 5, 6]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.BinaryTransferMessageParser$1", function (T) { return {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.ITransferMessageParser],
        fields: {
            ms: null,
            reader: null,
            writer: null
        },
        alias: [
            "IsReadable", "PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$IsReadable",
            "IsWritable", "PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$IsWritable",
            "Write", "PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$Write",
            "Read", "PixelRPG$Base$AdditionalStuff$ClientServer$ITransferMessageParser$Read"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this.ms = new System.IO.MemoryStream.ctor();
                this.reader = new System.IO.BinaryReader.ctor(this.ms);
                this.writer = new System.IO.BinaryWriter.$ctor1(this.ms);
            }
        },
        methods: {
            IsReadable: function (data) {
                var baseData = System.Convert.fromBase64String(data);
                this.ms.Seek(System.Int64(0), 0);
                this.ms.SetLength(System.Int64(0));
                this.ms.Write(baseData, 0, baseData.length);
                this.ms.Seek(System.Int64(0), 0);
                return this.reader.ReadInt32() === this.Identifier;
            },
            IsWritable: function (transferModel) {
                return Bridge.is(transferModel, T);
            },
            Write: function (transferModel) {
                this.ms.Seek(System.Int64(0), 0);
                this.ms.SetLength(System.Int64(0));
                this.writer.Write$10(this.Identifier);
                this.InternalWrite(Bridge.cast(Bridge.unbox(transferModel, T), T), this.writer);
                this.writer.Flush();
                this.ms.Seek(System.Int64(0), 0);
                return System.Convert.toBase64String(this.ms.ToArray(), null, null, null);
            },
            Read: function (data) {
                var baseData = System.Convert.fromBase64String(data);
                this.ms.Seek(System.Int64(0), 0);
                this.ms.SetLength(System.Int64(0));
                this.ms.Write(baseData, 0, baseData.length);
                this.ms.Seek(System.Int64(0), 0);
                this.reader.ReadInt32();
                return this.InternalRead(this.reader);
            }
        }
    }; });

    Bridge.define("PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem.Handler$1", function (TMessage) { return {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem.IHandler],
        $kind: "nested class",
        props: {
            MessageType: {
                get: function () {
                    return TMessage;
                }
            }
        },
        alias: [
            "MessageType", "PixelRPG$Base$AdditionalStuff$ClientServer$EntitySystems$ServerReceiveHandlerSystem$IHandler$MessageType",
            "Handle", "PixelRPG$Base$AdditionalStuff$ClientServer$EntitySystems$ServerReceiveHandlerSystem$IHandler$Handle"
        ],
        methods: {
            Handle: function (server, connectionKey, message) {
                this.Handle$1(server, connectionKey, Bridge.cast(Bridge.unbox(message, TMessage), TMessage));
            }
        }
    }; });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Effects.WaterReflectionEffect", {
        inherits: [PixelRPG.Base.AdditionalStuff.Effects.ReflectionEffect],
        fields: {
            firstDisplacementSpeedParam: null,
            perspectiveCorrectionIntensityParam: null,
            screenSpaceVerticalOffsetParam: null,
            secondDisplacementScaleParam: null,
            secondDisplacementSpeedParam: null,
            sparkleColorParam: null,
            sparkleIntensityParam: null,
            timeParam: null
        },
        props: {
            SparkleIntensity: {
                get: function () {
                    return this.sparkleIntensityParam.GetValueSingle();
                },
                set: function (value) {
                    this.sparkleIntensityParam.SetValue$12(value);
                }
            },
            SparkleColor: {
                get: function () {
                    return new Microsoft.Xna.Framework.Color.$ctor3(this.sparkleColorParam.GetValueVector3());
                },
                set: function (value) {
                    this.sparkleColorParam.SetValue$6(value.ToVector3());
                }
            },
            ScreenSpaceVerticalOffset: {
                get: function () {
                    return this.screenSpaceVerticalOffsetParam.GetValueSingle();
                },
                set: function (value) {
                    this.screenSpaceVerticalOffsetParam.SetValue$12(value);
                }
            },
            PerspectiveCorrectionIntensity: {
                get: function () {
                    return this.perspectiveCorrectionIntensityParam.GetValueSingle();
                },
                set: function (value) {
                    this.perspectiveCorrectionIntensityParam.SetValue$12(value);
                }
            },
            FirstDisplacementSpeed: {
                get: function () {
                    return this.firstDisplacementSpeedParam.GetValueSingle();
                },
                set: function (value) {
                    this.firstDisplacementSpeedParam.SetValue$12(value);
                }
            },
            SecondDisplacementSpeed: {
                get: function () {
                    return this.secondDisplacementSpeedParam.GetValueSingle();
                },
                set: function (value) {
                    this.secondDisplacementSpeedParam.SetValue$12(value);
                }
            },
            SecondDisplacementScale: {
                get: function () {
                    return this.secondDisplacementScaleParam.GetValueSingle();
                },
                set: function (value) {
                    this.secondDisplacementScaleParam.SetValue$12(value);
                }
            },
            Time: {
                get: function () {
                    return this.timeParam.GetValueSingle();
                },
                set: function (value) {
                    this.timeParam.SetValue$12(value);
                }
            }
        },
        ctors: {
            ctor: function (effect) {
                this.$initialize();
                PixelRPG.Base.AdditionalStuff.Effects.ReflectionEffect.ctor.call(this, effect);
                this.CurrentTechnique = this.Techniques.getItem$1("WaterReflectionTechnique");

                this.timeParam = this.Parameters.getItem$1("_time");
                this.sparkleIntensityParam = this.Parameters.getItem$1("_sparkleIntensity");
                this.sparkleColorParam = this.Parameters.getItem$1("_sparkleColor");
                this.screenSpaceVerticalOffsetParam = this.Parameters.getItem$1("_screenSpaceVerticalOffset");
                this.perspectiveCorrectionIntensityParam = this.Parameters.getItem$1("_perspectiveCorrectionIntensity");
                this.firstDisplacementSpeedParam = this.Parameters.getItem$1("_firstDisplacementSpeed");
                this.secondDisplacementSpeedParam = this.Parameters.getItem$1("_secondDisplacementSpeed");
                this.secondDisplacementScaleParam = this.Parameters.getItem$1("_secondDisplacementScale");

                this.SparkleIntensity = 0.015;
                this.SparkleColor = Microsoft.Xna.Framework.Color.White.$clone();
                this.PerspectiveCorrectionIntensity = 0.3;
                this.FirstDisplacementSpeed = 0.06;
                this.SecondDisplacementSpeed = 0.02;
                this.SecondDisplacementScale = 3.0;
                this.ReflectionIntensity = 0.85;
                this.NormalMagnitude = 0.03;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Materials.PaletteCyclerMaterial", {
        inherits: [SpineEngine.Graphics.Materials.Material$1(PixelRPG.Base.AdditionalStuff.Effects.PaletteCyclerEffect)],
        ctors: {
            ctor: function () {
                this.$initialize();
                SpineEngine.Graphics.Materials.Material$1(PixelRPG.Base.AdditionalStuff.Effects.PaletteCyclerEffect).$ctor1.call(this, SpineEngine.Core.Instance.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.PaletteCyclerEffect, PixelRPG.Base.AdditionalStuff.Effects.PaletteCyclerEffect.EffectAssetName));
            }
        },
        methods: {
            Update: function (gameTime) {
                SpineEngine.Graphics.Materials.Material$1(PixelRPG.Base.AdditionalStuff.Effects.PaletteCyclerEffect).prototype.Update.call(this, gameTime);
                this.TypedEffect.Time = gameTime.getTotalSeconds();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Materials.ReflectionMaterial", {
        inherits: [SpineEngine.Graphics.Materials.Material$1(PixelRPG.Base.AdditionalStuff.Effects.ReflectionEffect)],
        fields: {
            renderTarget: null,
            RenderTexture: null
        },
        ctors: {
            ctor: function (reflectionRenderer) {
                this.$initialize();
                SpineEngine.Graphics.Materials.Material$1(PixelRPG.Base.AdditionalStuff.Effects.ReflectionEffect).$ctor1.call(this, SpineEngine.Core.Instance.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.ReflectionEffect, PixelRPG.Base.AdditionalStuff.Effects.ReflectionEffect.EffectAssetName));
                this.RenderTexture = reflectionRenderer.RenderTexture;
            }
        },
        methods: {
            OnPreRender: function (camera, entity) {
                SpineEngine.Graphics.Materials.Material$1(PixelRPG.Base.AdditionalStuff.Effects.ReflectionEffect).prototype.OnPreRender.call(this, camera, entity);
                if (this.renderTarget == null || !Bridge.referenceEquals(this.renderTarget, this.RenderTexture.RenderTarget)) {
                    this.renderTarget = this.RenderTexture.RenderTarget;
                    this.TypedEffect.RenderTexture = this.RenderTexture.RenderTarget;
                }

                this.TypedEffect.MatrixTransform = camera.ViewProjectionMatrix.$clone();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.GaussianBlurRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect),SpineEngine.ECS.IScreenResolutionChangedListener],
        fields: {
            renderTarget: null,
            renderTargetScale: 0,
            sceneRenderTarget: null
        },
        props: {
            RenderTargetScale: {
                get: function () {
                    return this.renderTargetScale;
                },
                set: function (value) {
                    if (this.renderTargetScale === value) {
                        return;
                    }

                    this.renderTargetScale = value;
                    this.UpdateEffectDeltas();
                }
            }
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                this.sceneRenderTarget = new Microsoft.Xna.Framework.Rectangle();
                this.renderTargetScale = 1.0;
            },
            ctor: function (executionOrder) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect).ctor.call(this, executionOrder, SpineEngine.Core.Instance.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect, PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect.EffectAssetName));
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                this.sceneRenderTarget = sceneRenderTarget.$clone();
                this.UpdateEffectDeltas();
            },
            UpdateEffectDeltas: function () {
                if (this.sceneRenderTarget.Width === 0 || this.sceneRenderTarget.Height === 0) {
                    return;
                }

                this.TypedEffect.HorizontalBlurDelta = 1.0 / (this.sceneRenderTarget.Width * this.renderTargetScale);
                this.TypedEffect.VerticalBlurDelta = 1.0 / (this.sceneRenderTarget.Height * this.renderTargetScale);
                this.renderTarget != null ? this.renderTarget.Dispose() : null;
                this.renderTarget = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(SpineEngine.Core.Instance.GraphicsDevice, Bridge.Int.clip32(this.sceneRenderTarget.Width * this.renderTargetScale), Bridge.Int.clip32(this.sceneRenderTarget.Height * this.renderTargetScale), false, SpineEngine.Core.Instance.Screen.BackBufferFormat, Microsoft.Xna.Framework.Graphics.DepthFormat.None, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.PreserveContents);
            },
            Render: function (source, destination) {
                this.TypedEffect.PrepareForHorizontalBlur();
                this.DrawFullScreenQuad(source, this.renderTarget);

                this.TypedEffect.PrepareForVerticalBlur();
                this.DrawFullScreenQuad(this.renderTarget, destination);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.HeatDistortionRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.HeatDistortionEffect)],
        fields: {
            distortionFactor: 0,
            riseFactor: 0,
            elapsed: 0
        },
        props: {
            DistortionFactor: {
                get: function () {
                    return this.distortionFactor;
                },
                set: function (value) {
                    if (this.distortionFactor === value) {
                        return;
                    }

                    this.distortionFactor = value;
                    if (this.TypedEffect != null) {
                        this.TypedEffect.DistortionFactor = this.distortionFactor;
                    }
                }
            },
            RiseFactor: {
                get: function () {
                    return this.riseFactor;
                },
                set: function (value) {
                    if (this.riseFactor === value) {
                        return;
                    }

                    this.riseFactor = value;
                    if (this.TypedEffect != null) {
                        this.TypedEffect.RiseFactor = this.riseFactor;
                    }
                }
            },
            DistortionTexture: {
                set: function (value) {
                    this.TypedEffect.DistortionTexture = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.distortionFactor = 0.005;
                this.riseFactor = 0.15;
            },
            ctor: function (executionOrder) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.HeatDistortionEffect).ctor.call(this, executionOrder);
            }
        },
        methods: {
            OnAddedToScene: function (scene) {
                this.TypedEffect = scene.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.HeatDistortionEffect, PixelRPG.Base.AdditionalStuff.Effects.HeatDistortionEffect.EffectAssetName);

                this.TypedEffect.DistortionFactor = this.distortionFactor;
                this.TypedEffect.RiseFactor = this.riseFactor;

                this.DistortionTexture = scene.Content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.AdditionalStuff.ContentPaths.Textures.heatDistortionNoise);
            },
            Update: function (gameTime) {
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.HeatDistortionEffect).prototype.Update.call(this, gameTime);
                this.elapsed += gameTime.getTotalSeconds();
                this.TypedEffect.Time = this.elapsed;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.PixelBloomRenderProcessor", {
        inherits: [PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor],
        fields: {
            layerRt: null,
            tempRt: null
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            ctor: function (layerRenderTexture, executionOrder) {
                this.$initialize();
                PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.ctor.call(this, executionOrder);
                this.layerRt = layerRenderTexture;
                this.tempRt = new SpineEngine.Graphics.RenderTexture.$ctor3(this.layerRt.RenderTarget.Width, this.layerRt.RenderTarget.Height, Microsoft.Xna.Framework.Graphics.DepthFormat.None);
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.prototype.SceneBackBufferSizeChanged.call(this, realRenderTarget.$clone(), sceneRenderTarget.$clone());

                this.tempRt.Resize(sceneRenderTarget.Width, sceneRenderTarget.Height);
            },
            Render: function (source, destination) {
                PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.prototype.Render.call(this, SpineEngine.Graphics.RenderTexture.op_Implicit(this.layerRt), SpineEngine.Graphics.RenderTexture.op_Implicit(this.tempRt));

                this.Batch.Clear();
                this.Batch.Draw(source, SpineEngine.Maths.RectangleF.op_Implicit$1(destination.Bounds.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(source.Bounds.$clone()), Microsoft.Xna.Framework.Color.White.$clone(), 0);
                this.Batch.Draw(SpineEngine.Graphics.RenderTexture.op_Implicit(this.tempRt), SpineEngine.Maths.RectangleF.op_Implicit$1(destination.Bounds.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(this.tempRt.RenderTarget.Bounds.$clone()), Microsoft.Xna.Framework.Color.White.$clone(), 0);
                this.Batch.Draw(SpineEngine.Graphics.RenderTexture.op_Implicit(this.layerRt), SpineEngine.Maths.RectangleF.op_Implicit$1(destination.Bounds.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(this.layerRt.RenderTarget.Bounds.$clone()), Microsoft.Xna.Framework.Color.White.$clone(), 0);

                this.Material.BlendState = Microsoft.Xna.Framework.Graphics.BlendState.AlphaBlend;
                this.Material.SamplerState = this.SamplerState;
                this.Material.DepthStencilState = Microsoft.Xna.Framework.Graphics.DepthStencilState.None;

                SpineEngine.Graphics.Graphic.Draw(destination, Microsoft.Xna.Framework.Color.Black.$clone(), this.Batch, this.Material);
            },
            Unload: function () {
                PixelRPG.Base.AdditionalStuff.RenderProcessors.BloomRenderProcessor.prototype.Unload.call(this);

                this.tempRt.Dispose();
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.PixelGlitchRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.PixelGlitchEffect),SpineEngine.ECS.IScreenResolutionChangedListener],
        fields: {
            horizontalOffset: 0,
            verticalSize: 0
        },
        props: {
            VerticalSize: {
                get: function () {
                    return this.verticalSize;
                },
                set: function (value) {
                    if (this.verticalSize === value) {
                        return;
                    }

                    this.verticalSize = value;
                    if (this.TypedEffect != null) {
                        this.TypedEffect.VerticalSize = this.verticalSize;
                    }
                }
            },
            HorizontalOffset: {
                get: function () {
                    return this.horizontalOffset;
                },
                set: function (value) {
                    if (this.horizontalOffset === value) {
                        return;
                    }

                    this.horizontalOffset = value;
                    if (this.TypedEffect != null) {
                        this.TypedEffect.HorizontalOffset = this.horizontalOffset;
                    }
                }
            }
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                this.horizontalOffset = 10.0;
                this.verticalSize = 5.0;
            },
            ctor: function (executionOrder) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.PixelGlitchEffect).ctor.call(this, executionOrder);
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                this.TypedEffect.ScreenSize = new Microsoft.Xna.Framework.Vector2.$ctor2(sceneRenderTarget.Width, sceneRenderTarget.Height);
            },
            OnAddedToScene: function (scene) {
                this.TypedEffect = scene.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.PixelGlitchEffect, PixelRPG.Base.AdditionalStuff.Effects.PixelGlitchEffect.EffectAssetName);
                this.TypedEffect.VerticalSize = this.verticalSize;
                this.TypedEffect.HorizontalOffset = this.horizontalOffset;
                this.TypedEffect.ScreenSize = new Microsoft.Xna.Framework.Vector2.$ctor2(SpineEngine.Core.Instance.Screen.Width, SpineEngine.Core.Instance.Screen.Height);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.PixelMosaicRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.MultiTextureOverlayEffect),SpineEngine.ECS.IScreenResolutionChangedListener],
        fields: {
            CellColor: null,
            lastMosaicScale: 0,
            mosaicRenderTex: null,
            mosaicTexture: null,
            tmpMaterial: null
        },
        props: {
            Scene: null
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                var $t;
                this.CellColor = new Microsoft.Xna.Framework.Color();
                this.CellColor = new Microsoft.Xna.Framework.Color.$ctor10(8421504);
                this.lastMosaicScale = -1;
                this.tmpMaterial = ($t = new SpineEngine.Graphics.Materials.Material(), $t.SamplerState = Microsoft.Xna.Framework.Graphics.SamplerState.PointWrap, $t);
            },
            ctor: function (executionOrder) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.MultiTextureOverlayEffect).ctor.call(this, executionOrder);
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                var screenWidth = realRenderTarget.Width;
                var screenHeight = realRenderTarget.Height;

                var screenAspectRatio = screenWidth / screenHeight;
                var designSize = this.Scene.DesignResolutionSize.$clone();

                var pixelPerfectScale = 1;
                if (designSize.X / designSize.Y > screenAspectRatio) {
                    pixelPerfectScale = (Bridge.Int.div(screenWidth, designSize.X)) | 0;
                } else {
                    pixelPerfectScale = (Bridge.Int.div(screenHeight, designSize.Y)) | 0;
                }

                if (pixelPerfectScale === 0) {
                    pixelPerfectScale = 1;
                }

                if (this.lastMosaicScale !== pixelPerfectScale) {
                    this.CreateMosaicTexture(Bridge.Int.mul(50, pixelPerfectScale));
                    this.lastMosaicScale = pixelPerfectScale;
                }

                this.mosaicRenderTex != null ? this.mosaicRenderTex.Dispose() : null;
                this.mosaicRenderTex = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(SpineEngine.Core.Instance.GraphicsDevice, Bridge.Int.mul(sceneRenderTarget.Width, pixelPerfectScale), Bridge.Int.mul(sceneRenderTarget.Height, pixelPerfectScale), false, SpineEngine.Core.Instance.Screen.BackBufferFormat, Microsoft.Xna.Framework.Graphics.DepthFormat.None, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.PreserveContents);

                this.Batch.Clear();
                this.Batch.Draw(this.mosaicTexture, SpineEngine.Maths.RectangleF.op_Implicit$1(this.mosaicRenderTex.Bounds.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(this.mosaicRenderTex.Bounds.$clone()), Microsoft.Xna.Framework.Color.White.$clone(), 0);

                SpineEngine.Graphics.Graphic.Draw(this.mosaicRenderTex, Microsoft.Xna.Framework.Color.Black.$clone(), this.Batch, this.tmpMaterial);

                this.TypedEffect.SecondTexture = this.mosaicRenderTex;
            },
            OnAddedToScene: function (scene) {
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.MultiTextureOverlayEffect).prototype.OnAddedToScene.call(this, scene);
                this.Scene = scene;
                this.Effect = this.Scene.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.MultiTextureOverlayEffect, PixelRPG.Base.AdditionalStuff.Effects.MultiTextureOverlayEffect.EffectAssetName);
            },
            CreateMosaicTexture: function (size) {
                this.mosaicTexture != null ? this.mosaicTexture.Dispose() : null;

                this.mosaicTexture = new Microsoft.Xna.Framework.Graphics.Texture2D.ctor(SpineEngine.Core.Instance.GraphicsDevice, size, size);
                var colors = System.Array.init(Bridge.Int.mul(size, size), 0, System.UInt32);

                for (var i = 0; i < colors.length; i = (i + 1) | 0) {
                    colors[System.Array.index(i, colors)] = this.CellColor.PackedValue;
                }

                colors[System.Array.index(0, colors)] = 4294967295;
                colors[System.Array.index(((Bridge.Int.mul(size, size) - 1) | 0), colors)] = 4278190080;

                for (var x = 1; x < ((size - 1) | 0); x = (x + 1) | 0) {
                    colors[System.Array.index(Bridge.Int.mul(x, size), colors)] = 4292927712;
                    colors[System.Array.index(((Bridge.Int.mul(x, size) + 1) | 0), colors)] = 4294967295;
                    colors[System.Array.index(((((Bridge.Int.mul(x, size) + size) | 0) - 1) | 0), colors)] = 4278190080;
                }

                for (var y = 1; y < ((size - 1) | 0); y = (y + 1) | 0) {
                    colors[System.Array.index(y, colors)] = 4294967295;
                    colors[System.Array.index(((Bridge.Int.mul((((size - 1) | 0)), size) + y) | 0), colors)] = 4278190080;
                }

                this.mosaicTexture.SetData(System.UInt32, colors);
            },
            Unload: function () {
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.MultiTextureOverlayEffect).prototype.Unload.call(this);
                this.mosaicTexture.Dispose();
                this.mosaicRenderTex.Dispose();
            }
        }
    });

    /** @namespace PixelRPG.Base.AdditionalStuff.RenderProcessors */

    /**
     * post processor to assist with making blended poly lights. Usage is as follows:
         - render all sprite lights with a separate Renderer to a RenderTarget. The clear color of the Renderer is your ambient light color.
         - render all normal objects in standard fashion
         - add this PostProcessor with the RenderTarget from your lights Renderer
     *
     * @public
     * @class PixelRPG.Base.AdditionalStuff.RenderProcessors.PolyLightRenderProcessor
     * @augments SpineEngine.Graphics.RenderProcessors.RenderProcessor$1
     * @implements  SpineEngine.ECS.IScreenResolutionChangedListener
     */
    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.PolyLightRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.SpriteLightMultiplyEffect),SpineEngine.ECS.IScreenResolutionChangedListener],
        fields: {
            lightsRenderTexture: null,
            blurEffect: null,
            blurEnabled: false,
            blurRenderTargetScale: 0,
            multiplicativeFactor: 0,
            renderTarget: null,
            scene: null,
            sceneRenderTarget: null
        },
        props: {
            MultiplicativeFactor: {
                get: function () {
                    return this.multiplicativeFactor;
                },
                set: function (value) {
                    if (this.TypedEffect != null) {
                        this.TypedEffect.MultiplicativeFactor = value;
                    }

                    this.multiplicativeFactor = value;
                }
            },
            EnableBlur: {
                get: function () {
                    return this.blurEnabled;
                },
                set: function (value) {
                    if (value === this.blurEnabled) {
                        return;
                    }

                    this.blurEnabled = value;
                    if (!this.blurEnabled || this.blurEffect != null || this.scene == null) {
                        return;
                    }

                    this.blurEffect = SpineEngine.Core.Instance.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect, PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect.EffectAssetName);
                    this.UpdateBlurEffectDeltas();
                }
            },
            BlurRenderTargetScale: {
                get: function () {
                    return this.blurRenderTargetScale;
                },
                set: function (value) {
                    if (this.blurRenderTargetScale !== value) {
                        this.blurRenderTargetScale = value;
                        if (this.blurEffect != null) {
                            this.UpdateBlurEffectDeltas();
                        }
                    }
                }
            },
            BlurAmount: {
                get: function () {
                    var $t;
                    return ($t = (this.blurEffect != null ? this.blurEffect.BlurAmount : null), $t != null ? $t : -1);
                },
                set: function (value) {
                    if (this.blurEffect != null) {
                        this.blurEffect.BlurAmount = value;
                    }
                }
            }
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                this.sceneRenderTarget = new Microsoft.Xna.Framework.Rectangle();
                this.blurRenderTargetScale = 0.5;
                this.multiplicativeFactor = 1.0;
            },
            ctor: function (executionOrder, lightsRenderTexture) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.SpriteLightMultiplyEffect).ctor.call(this, executionOrder);
                this.lightsRenderTexture = lightsRenderTexture;
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                this.sceneRenderTarget = sceneRenderTarget.$clone();
                this.TypedEffect.LightTexture = SpineEngine.Graphics.RenderTexture.op_Implicit(this.lightsRenderTexture);

                if (this.blurEnabled) {
                    this.UpdateBlurEffectDeltas();
                }
            },
            UpdateBlurEffectDeltas: function () {
                if (this.sceneRenderTarget.Width === 0 || this.sceneRenderTarget.Height === 0) {
                    return;
                }

                this.blurEffect.HorizontalBlurDelta = 1.0 / (this.sceneRenderTarget.Width * this.blurRenderTargetScale);
                this.blurEffect.VerticalBlurDelta = 1.0 / (this.sceneRenderTarget.Height * this.blurRenderTargetScale);

                this.renderTarget != null ? this.renderTarget.Dispose() : null;
                this.renderTarget = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(SpineEngine.Core.Instance.GraphicsDevice, Bridge.Int.clip32(this.sceneRenderTarget.Width * this.blurRenderTargetScale), Bridge.Int.clip32(this.sceneRenderTarget.Height * this.blurRenderTargetScale), false, SpineEngine.Core.Instance.Screen.BackBufferFormat, Microsoft.Xna.Framework.Graphics.DepthFormat.None, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.PreserveContents);
            },
            OnAddedToScene: function (scene) {
                this.scene = scene;
                this.TypedEffect = this.scene.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.SpriteLightMultiplyEffect, PixelRPG.Base.AdditionalStuff.Effects.SpriteLightMultiplyEffect.EffectAssetName);
                this.TypedEffect.LightTexture = SpineEngine.Graphics.RenderTexture.op_Implicit(this.lightsRenderTexture);
                this.TypedEffect.MultiplicativeFactor = this.multiplicativeFactor;

                if (this.blurEnabled) {
                    this.blurEffect = SpineEngine.Core.Instance.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect, PixelRPG.Base.AdditionalStuff.Effects.GaussianBlurEffect.EffectAssetName);
                }
            },
            Render: function (source, destination) {
                if (this.blurEnabled) {
                    this.blurEffect.PrepareForHorizontalBlur();
                    this.DrawFullScreenQuad(SpineEngine.Graphics.RenderTexture.op_Implicit(this.lightsRenderTexture), this.renderTarget, this.blurEffect);

                    this.blurEffect.PrepareForVerticalBlur();
                    this.DrawFullScreenQuad(this.renderTarget, SpineEngine.Graphics.RenderTexture.op_Implicit(this.lightsRenderTexture), this.blurEffect);
                }

                this.DrawFullScreenQuad(source, destination);
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.ScanlinesRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.ScanlinesEffect)],
        ctors: {
            ctor: function (executionOrder) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.ScanlinesEffect).ctor.call(this, executionOrder, SpineEngine.Core.Instance.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.ScanlinesEffect, PixelRPG.Base.AdditionalStuff.Effects.ScanlinesEffect.EffectAssetName));
            }
        }
    });

    /**
     * post processor to assist with making blended sprite lights. Usage is as follows:
         - render all sprite lights with a separate Renderer to a RenderTarget. The clear color of the Renderer is your ambient light color.
         - render all normal objects in standard fashion
         - add this PostProcessor with the RenderTarget from your lights Renderer
     *
     * @public
     * @class PixelRPG.Base.AdditionalStuff.RenderProcessors.SpriteLightRenderProcessor
     * @augments SpineEngine.Graphics.RenderProcessors.RenderProcessor$1
     * @implements  SpineEngine.ECS.IScreenResolutionChangedListener
     */
    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.SpriteLightRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.SpriteLightMultiplyEffect),SpineEngine.ECS.IScreenResolutionChangedListener],
        fields: {
            lightsRenderTexture: null,
            multiplicativeFactor: 0
        },
        props: {
            MultiplicativeFactor: {
                get: function () {
                    return this.multiplicativeFactor;
                },
                set: function (value) {
                    if (this.TypedEffect != null) {
                        this.TypedEffect.MultiplicativeFactor = value;
                    }

                    this.multiplicativeFactor = value;
                }
            }
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                this.multiplicativeFactor = 1.0;
            },
            ctor: function (executionOrder, lightsRenderTexture) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.SpriteLightMultiplyEffect).ctor.call(this, executionOrder);
                this.lightsRenderTexture = lightsRenderTexture;
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                this.TypedEffect.LightTexture = SpineEngine.Graphics.RenderTexture.op_Implicit(this.lightsRenderTexture);
            },
            OnAddedToScene: function (scene) {
                this.TypedEffect = scene.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.SpriteLightMultiplyEffect, PixelRPG.Base.AdditionalStuff.Effects.SpriteLightMultiplyEffect.EffectAssetName);
                this.TypedEffect.LightTexture = SpineEngine.Graphics.RenderTexture.op_Implicit(this.lightsRenderTexture);
                this.TypedEffect.MultiplicativeFactor = this.multiplicativeFactor;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.RenderProcessors.VignetteRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.VignetteEffect)],
        fields: {
            power: 0,
            radius: 0
        },
        props: {
            Power: {
                get: function () {
                    return this.power;
                },
                set: function (value) {
                    if (this.power === value) {
                        return;
                    }

                    this.power = value;
                    if (this.TypedEffect != null) {
                        this.TypedEffect.Power = this.power;
                    }
                }
            },
            Radius: {
                get: function () {
                    return this.radius;
                },
                set: function (value) {
                    if (this.radius === value) {
                        return;
                    }

                    this.radius = value;
                    if (this.TypedEffect != null) {
                        this.TypedEffect.Radius = this.radius;
                    }
                    ;
                }
            }
        },
        ctors: {
            init: function () {
                this.power = 1.0;
                this.radius = 1.25;
            },
            ctor: function (executionOrder) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor$1(PixelRPG.Base.AdditionalStuff.Effects.VignetteEffect).ctor.call(this, executionOrder);
            }
        },
        methods: {
            OnAddedToScene: function (scene) {
                this.TypedEffect = scene.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.VignetteEffect, PixelRPG.Base.AdditionalStuff.Effects.VignetteEffect.EffectAssetName);

                this.TypedEffect.Power = this.power;
                this.TypedEffect.Radius = this.radius;
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledImageLayer", {
        inherits: [PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledLayer],
        fields: {
            AssetName: null
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileLayer", {
        inherits: [PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledLayer],
        fields: {
            X: 0,
            Y: 0,
            Width: 0,
            Height: 0,
            Tiles: null,
            Color: null
        },
        ctors: {
            init: function () {
                this.Color = new Microsoft.Xna.Framework.Color();
                this.Color = Microsoft.Xna.Framework.Color.White.$clone();
            }
        },
        methods: {
            GetTile: function (x, y) {
                return this.Tiles[System.Array.index(((x + Bridge.Int.mul(y, this.Width)) | 0), this.Tiles)];
            },
            SetTile: function (x, y, tile) {
                this.Tiles[System.Array.index(((x + Bridge.Int.mul(y, this.Width)) | 0), this.Tiles)] = tile;
            },
            RemoveTile$1: function (x, y) {
                this.Tiles[System.Array.index(((x + Bridge.Int.mul(y, this.Width)) | 0), this.Tiles)] = null;
            },
            RemoveTile: function (tile) {
                for (var index = 0; index < this.Tiles.length; index = (index + 1) | 0) {
                    if (Bridge.referenceEquals(tile, this.Tiles[System.Array.index(index, this.Tiles)])) {
                        this.Tiles[System.Array.index(index, this.Tiles)] = null;
                    }
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.TiledMap.PipelineImporter.TiledMapReader", {
        inherits: [Microsoft.Xna.Framework.Content.ContentTypeReader$1(PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledMap)],
        methods: {
            Read$1: function (reader, existingInstance) {
                var result = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledMap();
                result.FirstGid = reader.ReadInt32();
                result.Width = reader.ReadInt32();
                result.Height = reader.ReadInt32();
                result.TileWidth = reader.ReadInt32();
                result.TileHeight = reader.ReadInt32();
                if (reader.ReadBoolean()) {
                    result.BackgroundColor = reader.ReadColor();
                }
                result.RenderOrder = reader.ReadInt32();
                result.Orientation = reader.ReadInt32();
                this.ReadProperties(reader, result.Properties);
                var layerCount = reader.ReadInt32();
                for (var i = 0; i < layerCount; i = (i + 1) | 0) {
                    var layerType = reader.ReadInt32();
                    var layer = null;
                    if (layerType === 1) {
                        var newLayer = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledImageLayer();
                        newLayer.AssetName = reader.ReadString();
                        layer = newLayer;
                    } else if (layerType === 2) {
                        var newLayer1 = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileLayer();
                        newLayer1.X = reader.ReadInt32();
                        newLayer1.Y = reader.ReadInt32();
                        newLayer1.Width = reader.ReadInt32();
                        newLayer1.Height = reader.ReadInt32();
                        newLayer1.Tiles = System.Array.init(reader.ReadInt32(), null, PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTile);

                        for (var j = 0; j < newLayer1.Tiles.length; j = (j + 1) | 0) {
                            if (reader.ReadBoolean()) {
                                newLayer1.Tiles[System.Array.index(j, newLayer1.Tiles)] = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTile();
                                newLayer1.Tiles[System.Array.index(j, newLayer1.Tiles)].Id = reader.ReadInt32();
                                newLayer1.Tiles[System.Array.index(j, newLayer1.Tiles)].FlippedHorizonally = reader.ReadBoolean();
                                newLayer1.Tiles[System.Array.index(j, newLayer1.Tiles)].FlippedVertically = reader.ReadBoolean();
                                newLayer1.Tiles[System.Array.index(j, newLayer1.Tiles)].FlippedDiagonally = reader.ReadBoolean();
                            }
                        }

                        newLayer1.Color = reader.ReadColor();
                        layer = newLayer1;
                    }

                    if (layer == null) {
                        throw new System.NotSupportedException.ctor();
                    }

                    result.Layers.add(layer);
                    layer.Offset = reader.ReadVector2();
                    this.ReadProperties(reader, layer.Properties);
                    layer.Name = reader.ReadString();
                    layer.Visible = reader.ReadBoolean();
                    layer.Opacity = reader.ReadSingle();
                }
                var objectGroupsCount = reader.ReadInt32();
                for (var i1 = 0; i1 < objectGroupsCount; i1 = (i1 + 1) | 0) {
                    var objectGroup = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledObjectGroup();
                    result.ObjectGroups.add(objectGroup);

                    objectGroup.Name = reader.ReadString();
                    objectGroup.Color = reader.ReadColor();
                    objectGroup.Opacity = reader.ReadSingle();
                    objectGroup.Visible = reader.ReadBoolean();
                    this.ReadProperties(reader, objectGroup.Properties);
                    var objectsCount = reader.ReadInt32();
                    for (var j1 = 0; j1 < objectsCount; j1 = (j1 + 1) | 0) {
                        var obj = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledObject();
                        objectGroup.Objects.add(obj);

                        obj.Id = reader.ReadInt32();
                        obj.Name = reader.ReadString();
                        obj.Type = reader.ReadString();
                        obj.X = reader.ReadInt32();
                        obj.Y = reader.ReadInt32();
                        obj.Width = reader.ReadInt32();
                        obj.Height = reader.ReadInt32();
                        obj.Rotation = reader.ReadInt32();
                        obj.Gid = reader.ReadInt32();
                        obj.Visible = reader.ReadBoolean();
                        obj.TiledObjectType = reader.ReadInt32();
                        obj.ObjectType = reader.ReadString();
                        var pointsCount = reader.ReadInt32();
                        for (var k = 0; k < pointsCount; k = (k + 1) | 0) {
                            obj.PolyPoints.add(reader.ReadVector2());
                        }
                        this.ReadProperties(reader, obj.Properties);
                    }
                }

                var tileSetCount = reader.ReadInt32();
                for (var i2 = 0; i2 < tileSetCount; i2 = (i2 + 1) | 0) {
                    var tileSet = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSet();
                    result.TileSets.add(tileSet);
                    tileSet.Spacing = reader.ReadInt32();
                    tileSet.Margin = reader.ReadInt32();
                    this.ReadProperties(reader, tileSet.Properties);

                    var tileCount = reader.ReadInt32();
                    for (var j2 = 0; j2 < tileCount; j2 = (j2 + 1) | 0) {
                        var tile = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSetTile();
                        tileSet.Tiles.add(tile);
                        tile.Id = reader.ReadInt32();
                        if (reader.ReadBoolean()) {
                            var animationFrameCount = reader.ReadInt32();
                            tile.AnimationFrames = new (System.Collections.Generic.List$1(PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSetAnimationFrame)).$ctor2(animationFrameCount);
                            for (var k1 = 0; k1 < animationFrameCount; k1 = (k1 + 1) | 0) {
                                var animationFrame = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileSetAnimationFrame();
                                tile.AnimationFrames.add(animationFrame);

                                animationFrame.TileId = reader.ReadInt32();
                                animationFrame.Duration = reader.ReadSingle();
                            }
                        }

                        this.ReadProperties(reader, tile.Properties);
                        var x = reader.ReadInt32();
                        var y = reader.ReadInt32();
                        var width = reader.ReadInt32();
                        var height = reader.ReadInt32();
                        tile.SourceRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(x, y, width, height);
                    }

                    tileSet.FirstGid = reader.ReadInt32();
                    tileSet.Image = reader.ReadString();
                    tileSet.ImageTexture = reader.ContentManager.Load(Microsoft.Xna.Framework.Graphics.Texture2D, tileSet.Image);
                }

                return result;
            },
            ReadProperties: function (reader, dataProperties) {
                dataProperties.clear();
                var count = reader.ReadInt32();
                for (var i = 0; i < count; i = (i + 1) | 0) {
                    var key = reader.ReadString();
                    var value = reader.ReadString();
                    dataProperties.set(key, value);
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.AcidicSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.scorpio);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 18, 17);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [14, 14, 14, 14, 14, 14, 14, 14, 15, 16, 15, 16, 15, 16]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [19, 20]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [14, 17, 18]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [14, 21, 22, 23, 24]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.AlbinoSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.rat);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [16, 16, 16, 17]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [22, 23, 24, 25, 26]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [18, 19, 20, 21]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [27, 28, 29, 30]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.BeeSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.bee);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 1, 0, 2, 2]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 1, 0, 2, 2]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [3, 4, 5, 6]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [7, 8, 9, 10]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.BlacksmithSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Neutral.blacksmith);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 13, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.BruteSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.brute);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 1, 0, 0, 1, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [4, 5, 6, 7]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3, 0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [8, 9, 10]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.BurningFistSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.burning_fist);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 24, 17);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 5, 6]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 2, 3, 4]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.CrabSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.crab);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 0, 2]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [3, 4, 5, 6]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [7, 8, 9]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [10, 11, 12, 13]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.DM300Sprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.dm300);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 22, 20);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [4, 5, 6]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 8]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.ElementalSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.elemental);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 14);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 2]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 3]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [4, 5, 6]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [7, 8, 9, 10, 11, 12, 13, 12]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.EyeSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.eye);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 18);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 2]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [5, 6]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [4, 3]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [7, 8, 9]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.GhostSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Neutral.ghost);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 14, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.GnollSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.gnoll);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 1, 0, 0, 1, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [4, 5, 6, 7]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3, 0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [8, 9, 10]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.GolemSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.golem);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3, 4, 5]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [6, 7, 8]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [9, 10, 11, 12, 13]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.GooSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.goo);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 20, 14);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [5, 0, 6]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3, 4]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.HeroSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content, heroType, heroLevel) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, heroType);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

                var LevelSize = 21;

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [((0 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((0 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((0 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((1 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((0 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((0 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((1 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((1 + Bridge.Int.mul(heroLevel, LevelSize)) | 0)]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [((2 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((3 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((4 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((5 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((6 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((7 + Bridge.Int.mul(heroLevel, LevelSize)) | 0)]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [((13 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((14 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((15 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((0 + Bridge.Int.mul(heroLevel, LevelSize)) | 0)]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [((8 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((9 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((10 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((11 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((12 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((11 + Bridge.Int.mul(heroLevel, LevelSize)) | 0)]);

                var operate = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [((16 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((17 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((16 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((17 + Bridge.Int.mul(heroLevel, LevelSize)) | 0)]);

                var read = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [((19 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((20 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((20 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((20 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((20 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((20 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((20 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((20 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((20 + Bridge.Int.mul(heroLevel, LevelSize)) | 0), ((19 + Bridge.Int.mul(heroLevel, LevelSize)) | 0)]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.ImpSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);


                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Neutral.demon);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 14);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 2, 3, 0, 1, 2, 3, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 3, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 3, 2, 1, 0, 3, 2, 1, 0]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.KingSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.king);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [3, 4, 5, 6, 7, 8]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [9, 10, 11]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [12, 13, 14, 15]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.LarvaSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);


                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.larva);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 8);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [4, 4, 4, 4, 4, 5, 5]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 2, 3]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [6, 5, 7]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [8]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.MimicSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.mimic);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 1, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 2, 3, 3, 2, 1]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 4, 5, 6]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [7, 8, 9]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.MonkSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.monk);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 15, 14);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [1, 0, 1, 2]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [11, 12, 13, 14, 15, 16]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [3, 4, 3, 4, 5, 6, 5]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [1, 7, 8, 8, 9, 10]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.PiranhaSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.piranha);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 2, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 2, 1]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [3, 4, 5, 6, 7, 8, 9, 10, 11]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [12, 13, 14]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.RatKingSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.ratking);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3, 4, 5, 6]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.RatSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.rat);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [6, 7, 8, 9, 10]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3, 4, 5, 0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [11, 12, 13, 14]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.RottingFistSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.rotting_fist);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 24, 17);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 2, 3, 4]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.ScorpioSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.scorpio);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 18, 17);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2, 1, 2]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [5, 5, 6, 6]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 3, 4]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 7, 8, 9, 10]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.SeniorSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.monk);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 15, 14);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [18, 17, 18, 19]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [28, 29, 30, 31, 32, 33]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [20, 21, 20, 21, 22, 23, 22]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [18, 24, 25, 25, 26, 27]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.ShamanSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.shaman);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 1, 0, 0, 1, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [4, 5, 6, 7]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3, 0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [8, 9, 10]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.SheepSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Neutral.sheep);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.ShieldedSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.brute);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [21, 21, 21, 22, 21, 21, 22, 22]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [25, 26, 27, 28]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [23, 24]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [29, 30, 31]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.ShopkeeperSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Neutral.shopkeeper);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 14, 14);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [1, 1, 1, 1, 1, 0, 0, 0, 0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);
                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);
                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.SkeletonSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.skeleton);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [4, 5, 6, 7, 8, 9]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [14, 15, 16]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [10, 11, 12, 13]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.SpinnerSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.spinner);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 0, 0, 1, 0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 2, 0, 3]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 4, 5, 0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [6, 7, 8, 9]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.StatueSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.statue);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 0, 0, 1, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3, 4, 5, 6, 7]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [8, 9, 10]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [11, 12, 13, 14, 15, 15]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.SuccubusSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.succubus);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [3, 4, 5, 6, 7, 8]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [9, 10, 11]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [12]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.SwarmSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.swarm);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 2, 3, 4, 5]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 2, 3, 4, 5]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [6, 7, 8, 9]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [10, 11, 12, 13, 14]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.TenguSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.tengu);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 14, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [2, 3, 4, 5, 0]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [6, 7, 7, 0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [8, 9, 10, 10, 10, 10, 10, 10]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.ThiefSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.thief);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 13);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 1, 0, 0, 0, 0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 2, 3, 3, 4]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [5, 6, 7, 8, 9]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [10, 11, 12, 0]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.UndeadSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.undead);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 16);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [4, 5, 6, 7, 8, 9]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [14, 15, 16]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [10, 11, 12, 13]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.WandmakerSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Neutral.wandmaker);

                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 14);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);
                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);
                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.WarlockSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.warlock);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 0, 0, 1, 0, 0, 1, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 2, 3, 4]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 5, 6]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 7, 8, 8, 9, 10]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.WraithSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.wraith);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 14, 15);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 2, 3]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 4, 5, 6, 7]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.Assets.UnitAnimations.YogSprite", {
        inherits: [PixelRPG.Base.Assets.UnitAnimation],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                PixelRPG.Base.Assets.UnitAnimation.ctor.call(this);
                var texture = content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, PixelRPG.Base.ContentPaths.Assets.Enemy.yog);
                var frames = SpineEngine.Graphics.Drawable.SubtextureDrawable.SubtexturesFromAtlas(texture, 20, 19);

                this.Idle = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 1, 2, 2, 1, 0, 3, 4, 4, 3, 0, 5, 6, 6, 5]);

                this.Run = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Attack = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0]);

                this.Die = new SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation.$ctor4(frames, [0, 7, 8, 9]);
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage", {
        fields: {
            Players: null,
            Exit: null,
            Map: null,
            Doors: null
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage", {
        fields: {
            Width: 0,
            Height: 0
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage", {
        fields: {
            PlayerId: 0
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage");

    Bridge.define("PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage", {
        fields: {
            NewPosition: null
        }
    });

    Bridge.define("PixelRPG.Base.AdditionalStuff.Materials.WaterReflectionMaterial", {
        inherits: [SpineEngine.Graphics.Materials.Material$1(PixelRPG.Base.AdditionalStuff.Effects.WaterReflectionEffect)],
        fields: {
            renderTarget: null,
            RenderTexture: null
        },
        ctors: {
            ctor: function (reflectionRenderer) {
                this.$initialize();
                SpineEngine.Graphics.Materials.Material$1(PixelRPG.Base.AdditionalStuff.Effects.WaterReflectionEffect).$ctor1.call(this, SpineEngine.Core.Instance.Content.Load(PixelRPG.Base.AdditionalStuff.Effects.WaterReflectionEffect, PixelRPG.Base.AdditionalStuff.Effects.ReflectionEffect.EffectAssetName));
                this.RenderTexture = reflectionRenderer.RenderTexture;
            }
        },
        methods: {
            OnPreRender: function (camera, entity) {
                SpineEngine.Graphics.Materials.Material$1(PixelRPG.Base.AdditionalStuff.Effects.WaterReflectionEffect).prototype.OnPreRender.call(this, camera, entity);
                if (this.renderTarget == null || !Bridge.referenceEquals(this.renderTarget, this.RenderTexture.RenderTarget)) {
                    this.renderTarget = this.RenderTexture.RenderTarget;
                    this.TypedEffect.RenderTexture = this.RenderTexture.RenderTarget;
                }

                this.TypedEffect.MatrixTransform = camera.ViewProjectionMatrix.$clone();
                this.TypedEffect.CurrentTechnique = this.TypedEffect.Techniques.getItem$1("WaterReflectionTechnique");
            },
            Update: function (gameTime) {
                SpineEngine.Graphics.Materials.Material$1(PixelRPG.Base.AdditionalStuff.Effects.WaterReflectionEffect).prototype.Update.call(this, gameTime);
                this.TypedEffect.Time = gameTime.getTotalSeconds();
            }
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.ClientReceiveServerCurrentStateAISystem", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage)],
        ctors: {
            ctor: function () {
                this.$initialize();
                PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage).ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent]));
            }
        },
        methods: {
            DoAction$2: function (message, entity, gameTime) {
                var $t;
                var ai = entity.GetComponent(PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent);
                var simpleAI = Bridge.cast(ai.AIBot, PixelRPG.Base.Screens.SimpleAI);

                simpleAI.Players = message.Players;
                simpleAI.Exit = ($t = simpleAI.Exit, $t != null ? $t : message.Exit);
                for (var x = 0; x < System.Array.getLength(message.Map, 0); x = (x + 1) | 0) {
                    for (var y = 0; y < System.Array.getLength(message.Map, 1); y = (y + 1) | 0) {
                        if (System.Nullable.eq(message.Map.get([x, y]), PixelRPG.Base.Screens.GameSceneConfig.UnknownRegionValue)) {
                            continue;
                        }

                        simpleAI.Regions.set([x, y], message.Map.get([x, y]));
                        if (System.Nullable.eq(message.Map.get([x, y]), PixelRPG.Base.Screens.GameSceneConfig.WallRegionValue)) {
                            simpleAI.Pathfinding.Walls.add(new BrainAI.Pathfinding.Point.$ctor1(x, y));
                        }
                    }
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.ClientReceiveServerCurrentStateVisibleSystem", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage)],
        statics: {
            fields: {
                availableAnimations: null
            },
            ctors: {
                init: function () {
                    this.availableAnimations = $asm.$.PixelRPG.Base.EntitySystems.ClientReceiveServerCurrentStateVisibleSystem.f1(new (System.Collections.Generic.List$1(System.String)).ctor());
                }
            }
        },
        fields: {
            scene: null
        },
        ctors: {
            ctor: function (scene) {
                this.$initialize();
                PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage).ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.Components.VisiblePlayerComponent]));
                this.scene = scene;
            }
        },
        methods: {
            DoAction$2: function (message, entity, gameTime) {
                var $t;
                var visiblePlayer = entity.GetComponent(PixelRPG.Base.Components.VisiblePlayerComponent);

                for (var i = 0; i < visiblePlayer.KnownPlayers.Count; i = (i + 1) | 0) {
                    visiblePlayer.KnownPlayers.getItem(i).Enabled = false;
                }

                for (var i1 = 0; i1 < message.Players.Count; i1 = (i1 + 1) | 0) {
                    for (var j = 0; j < message.Players.getItem(i1).Units.Count; j = (j + 1) | 0) {
                        var entityName = System.String.format("PlayerUnit{0}_{1}", Bridge.box(message.Players.getItem(i1).PlayerId, System.Int32), Bridge.box(message.Players.getItem(i1).Units.getItem(j).UnitId, System.Int32));
                        var playerUnit = this.scene.FindEntity(entityName);
                        if (playerUnit == null) {
                            playerUnit = this.scene.CreateEntity(entityName);
                            playerUnit.AddComponent(SpineEngine.ECS.Components.PositionComponent).Position = new Microsoft.Xna.Framework.Vector2.$ctor2(((Bridge.Int.mul(message.Players.getItem(i1).Units.getItem(j).Position.X, 16) + 8) | 0), ((Bridge.Int.mul(message.Players.getItem(i1).Units.getItem(j).Position.Y, 16) + 8) | 0));
                            playerUnit.AddComponent(PixelRPG.Base.Components.UnitComponent).UnitAnimations = new PixelRPG.Base.Assets.UnitAnimations.HeroSprite(SpineEngine.Core.Instance.Content, FateRandom.Fate.GlobalFate.Choose$3(System.String, PixelRPG.Base.EntitySystems.ClientReceiveServerCurrentStateVisibleSystem.availableAnimations), 6);
                            visiblePlayer.KnownPlayers.add(playerUnit);
                        } else {
                            playerUnit.GetComponent(SpineEngine.ECS.Components.PositionComponent).Position = new Microsoft.Xna.Framework.Vector2.$ctor2(((Bridge.Int.mul(message.Players.getItem(i1).Units.getItem(j).Position.X, 16) + 8) | 0), ((Bridge.Int.mul(message.Players.getItem(i1).Units.getItem(j).Position.Y, 16) + 8) | 0));
                        }

                        playerUnit.Enabled = true;
                    }
                }


                var map = this.scene.FindEntity(visiblePlayer.MapEntityName);
                var tiledMap = map.GetComponent(PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components.TiledMapComponent).TiledMap;

                var maze = Bridge.cast(tiledMap.GetLayer("Maze"), PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileLayer);
                var fog = Bridge.cast(tiledMap.GetLayer("Fog"), PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileLayer);

                for (var x = 0; x < System.Array.getLength(message.Map, 0); x = (x + 1) | 0) {
                    for (var y = 0; y < System.Array.getLength(message.Map, 1); y = (y + 1) | 0) {
                        var fogTile = fog.GetTile(x, y);
                        if (System.Nullable.eq(message.Map.get([x, y]), PixelRPG.Base.Screens.GameSceneConfig.UnknownRegionValue)) {
                            if (fogTile == null) {
                                fogTile = ($t = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTile(), $t.Id = 70, $t);
                                fog.SetTile(x, y, fogTile);
                                continue;
                            }

                            fogTile.Id = 70;
                            continue;
                        }
                        if (fogTile != null) {
                            fogTile.Id = 71;
                        }

                        var currentTile = maze.GetTile(x, y);
                        if (currentTile == null) {
                            currentTile = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTile();
                        }

                        if (System.Nullable.eq(message.Map.get([x, y]), PixelRPG.Base.Screens.GameSceneConfig.WallRegionValue)) {
                            currentTile.Id = 17;
                        } else if (System.Nullable.eq(message.Map.get([x, y]), PixelRPG.Base.Screens.GameSceneConfig.PathRegionValue)) {
                            currentTile.Id = 2;
                        }
                        maze.SetTile(x, y, currentTile);
                    }
                }

                for (var i2 = 0; i2 < message.Doors.Count; i2 = (i2 + 1) | 0) {
                    var junction = message.Doors.getItem(i2).$clone();
                    var tile = maze.GetTile(junction.X, junction.Y);
                    tile.Id = 6;
                }

                if (message.Exit != null) {
                    var currentTile1 = maze.GetTile(System.Nullable.getValue(message.Exit).X, System.Nullable.getValue(message.Exit).Y);
                    if (currentTile1 == null) {
                        currentTile1 = new PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTile();
                        maze.SetTile(System.Nullable.getValue(message.Exit).X, System.Nullable.getValue(message.Exit).Y, currentTile1);
                    }

                    currentTile1.Id = 9;
                }
            }
        }
    });

    Bridge.ns("PixelRPG.Base.EntitySystems.ClientReceiveServerCurrentStateVisibleSystem", $asm.$);

    Bridge.apply($asm.$.PixelRPG.Base.EntitySystems.ClientReceiveServerCurrentStateVisibleSystem, {
        f1: function (_o1) {
            _o1.add(PixelRPG.Base.ContentPaths.Assets.Characters.mage);
            _o1.add(PixelRPG.Base.ContentPaths.Assets.Characters.ranger);
            _o1.add(PixelRPG.Base.ContentPaths.Assets.Characters.rogue);
            _o1.add(PixelRPG.Base.ContentPaths.Assets.Characters.warrior);
            return _o1;
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.ClientReceiveServerGameStartedAISystem", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage)],
        ctors: {
            ctor: function () {
                this.$initialize();
                PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage).ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent]));
            }
        },
        methods: {
            DoAction$2: function (message, entity, gameTime) {
                var ai = entity.GetComponent(PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent);
                var simpleAI = Bridge.cast(ai.AIBot, PixelRPG.Base.Screens.SimpleAI);
                simpleAI.Pathfinding = new BrainAI.Pathfinding.AStar.AstarGridGraph(message.Width, message.Height);
                simpleAI.Regions = System.Array.create(null, null, System.Nullable$1(System.Int32), message.Width, message.Height);
                simpleAI.Exit = null;
            }
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.ClientReceiveServerGameStartedVisibleSystem", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage)],
        fields: {
            scene: null
        },
        ctors: {
            ctor: function (scene) {
                this.$initialize();
                PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage).ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.Components.VisiblePlayerComponent]));
                this.scene = scene;
            }
        },
        methods: {
            DoAction$2: function (message, entity, gameTime) {
                var visiblePlayer = entity.GetComponent(PixelRPG.Base.Components.VisiblePlayerComponent);

                var map = this.scene.FindEntity(visiblePlayer.MapEntityName);
                var tiledMap = map.GetComponent(PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components.TiledMapComponent).TiledMap;

                var maze = Bridge.cast(tiledMap.GetLayer("Maze"), PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileLayer);
                var water = Bridge.cast(tiledMap.GetLayer("Water"), PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileLayer);
                var fog = Bridge.cast(tiledMap.GetLayer("Fog"), PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTileLayer);

                tiledMap.Width = (maze.Width = (water.Width = (fog.Width = message.Width)));
                tiledMap.Height = (maze.Height = (water.Height = (fog.Height = message.Height)));
                tiledMap.ObjectGroups.clear();

                maze.Tiles = System.Array.init(Bridge.Int.mul(maze.Width, maze.Height), null, PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTile);
                water.Tiles = System.Array.init(Bridge.Int.mul(water.Width, water.Height), null, PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTile);
                fog.Tiles = System.Array.init(Bridge.Int.mul(water.Width, water.Height), null, PixelRPG.Base.AdditionalStuff.TiledMap.Models.TiledTile);

                tiledMap.TileSets.getItem(1).ImageTexture = SpineEngine.Core.Instance.Content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, System.String.format("{0}{1}", System.String.trim(PixelRPG.Base.ContentPaths.Assets.water0, [48]), Bridge.box(FateRandom.Fate.GlobalFate.NextInt(5), System.Int32)));
                tiledMap.TileSets.getItem(0).ImageTexture = SpineEngine.Core.Instance.Content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, System.String.format("{0}{1}", System.String.trim(PixelRPG.Base.ContentPaths.Assets.tiles0, [48]), Bridge.box(FateRandom.Fate.GlobalFate.NextInt(5), System.Int32)));
            }
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.ClientRecieveServerYouConnectedAISystem", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage)],
        ctors: {
            ctor: function () {
                this.$initialize();
                PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage).ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent]));
            }
        },
        methods: {
            DoAction$2: function (message, entity, gameTime) {
                var ai = entity.GetComponent(PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent);
                var simpleAI = Bridge.cast(ai.AIBot, PixelRPG.Base.Screens.SimpleAI);
                simpleAI.MePlayerId = message.PlayerId;
            }
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.ClientRecieveServerYourTurnAISystem", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage)],
        ctors: {
            ctor: function () {
                this.$initialize();
                PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientReceiveHandlerSystem$1(PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage).ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent]));
            }
        },
        methods: {
            DoAction$2: function (message, entity, gameTime) {
                var ai = entity.GetComponent(PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent);
                var simpleAI = Bridge.cast(ai.AIBot, PixelRPG.Base.Screens.SimpleAI);
                simpleAI.NeedAction = true;
            }
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.ClientSendClientTurnDoneAISystem", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientSendHandlerSystem$1(PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage)],
        ctors: {
            ctor: function () {
                this.$initialize();
                PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ClientSendHandlerSystem$1(PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage).ctor.call(this, new LocomotorECS.Matching.Matcher().All([PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent]));
            }
        },
        methods: {
            PrepareSendData: function (entity, gameTime) {
                var $t;
                var ai = entity.GetComponent(PixelRPG.Base.AdditionalStuff.BrainAI.Components.AIComponent);
                var simpleAI = Bridge.cast(ai.AIBot, PixelRPG.Base.Screens.SimpleAI);
                if (simpleAI.NextTurn == null) {
                    return null;
                }

                var result = ($t = new PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage(), $t.NewPosition = simpleAI.NextTurn, $t);
                simpleAI.NextTurn = null;
                return result;
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ClientConnectTransferMessage", {
        fields: {
            PlayerName: null
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.ServerRecieveClientTurnDoneHandler", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem.Handler$1(PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage)],
        methods: {
            Handle$1: function (server, connectionKey, message) {
                var $t, $t1, $t2;
                var gameState = server.Entity.GetComponent(PixelRPG.Base.Components.GameStateComponent);

                for (var i = 0; i < gameState.Players.get(connectionKey).Units.Count; i = (i + 1) | 0) {
                    if (!message.NewPosition.containsKey(gameState.Players.get(connectionKey).Units.getItem(i).UnitId)) {
                        continue;
                    }

                    var newPosition = message.NewPosition.get(gameState.Players.get(connectionKey).Units.getItem(i).UnitId).$clone();
                    var canMove = true;
                    if (newPosition.X !== gameState.Exit.X || newPosition.Y !== gameState.Exit.Y) {
                        //foreach (var player in gameState.Players)
                        var player = gameState.Players.get(connectionKey);
                        {
                            for (var j = 0; j < player.Units.Count; j = (j + 1) | 0) {
                                if (player.Units.getItem(j).Position.X === newPosition.X && player.Units.getItem(j).Position.Y === newPosition.Y) {
                                    canMove = false;
                                    break;
                                }
                            }

                            //if (!canMove)
                            //{
                            //    break;
                            //}
                        }
                    }

                    if (canMove) {
                        gameState.Players.get(connectionKey).Units.getItem(i).Position.X = newPosition.X;
                        gameState.Players.get(connectionKey).Units.getItem(i).Position.Y = newPosition.Y;
                    }
                }

                gameState.MovedPlayers = (gameState.MovedPlayers + 1) | 0;

                $t = Bridge.getEnumerator(gameState.Players);
                try {
                    while ($t.moveNext()) {
                        var player1 = $t.Current;
                        var responses = server.Response.get(player1.key);
                        responses.add(($t1 = new PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessage(), $t1.PlayerId = connectionKey, $t1));
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                if (gameState.MovedPlayers === gameState.MaxPlayersCount) {
                    gameState.MovedPlayers = 0;

                    var allAtEnd = true;
                    $t1 = Bridge.getEnumerator(gameState.Players);
                    try {
                        while ($t1.moveNext()) {
                            var player2 = $t1.Current;
                            for (var i1 = 0; i1 < player2.value.Units.Count; i1 = (i1 + 1) | 0) {
                                if (Microsoft.Xna.Framework.Point.op_Inequality(player2.value.Units.getItem(i1).Position.$clone(), gameState.Exit.$clone())) {
                                    allAtEnd = false;
                                }
                            }
                        }
                    } finally {
                        if (Bridge.is($t1, System.IDisposable)) {
                            $t1.System$IDisposable$Dispose();
                        }
                    }

                    var startGameResponse = null;
                    if (allAtEnd) {
                        startGameResponse = PixelRPG.Base.EntitySystems.ServerLogic.StartNewGame(gameState);
                    }

                    $t2 = Bridge.getEnumerator(gameState.Players);
                    try {
                        while ($t2.moveNext()) {
                            var player3 = $t2.Current;
                            var responses1 = server.Response.get(player3.key);
                            if (allAtEnd) {
                                responses1.add(startGameResponse);
                            }

                            responses1.add(PixelRPG.Base.EntitySystems.ServerLogic.BuildCurrentStateForPlayer(gameState, player3.value));
                            responses1.add(new PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage());
                        }
                    } finally {
                        if (Bridge.is($t2, System.IDisposable)) {
                            $t2.System$IDisposable$Dispose();
                        }
                    }
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessageParser", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.BinaryTransferMessageParser$1(PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage)],
        props: {
            Identifier: {
                get: function () {
                    return 2;
                }
            }
        },
        methods: {
            InternalWrite: function (transferModel, writer) {
                var $t;
                writer.Write$10(transferModel.NewPosition.count);
                $t = Bridge.getEnumerator(transferModel.NewPosition);
                try {
                    while ($t.moveNext()) {
                        var pos = $t.Current;
                        writer.Write$10(pos.key);
                        writer.Write$10(pos.value.X);
                        writer.Write$10(pos.value.Y);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            InternalRead: function (reader) {
                var $t;
                var positions = new (System.Collections.Generic.Dictionary$2(System.Int32,PixelRPG.Base.TransferMessages.PointTransferMessage))();
                var count = reader.ReadInt32();
                for (var i = 0; i < count; i = (i + 1) | 0) {
                    var key = reader.ReadInt32();
                    var x = reader.ReadInt32();
                    var y = reader.ReadInt32();
                    positions.set(key, new PixelRPG.Base.TransferMessages.PointTransferMessage.$ctor1(x, y));
                }

                return ($t = new PixelRPG.Base.TransferMessages.ClientTurnDoneTransferMessage(), $t.NewPosition = positions, $t);
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessageParser", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.BinaryTransferMessageParser$1(PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage)],
        props: {
            Identifier: {
                get: function () {
                    return 3;
                }
            }
        },
        methods: {
            InternalWrite: function (transferModel, writer) {
                writer.Write$10(transferModel.PlayerId);
                writer.Write$10(transferModel.CurrentCount);
                writer.Write$10(transferModel.WaitingCount);
                writer.Write(transferModel.PlayerName != null);
                if (transferModel.PlayerName != null) {
                    writer.Write$14(transferModel.PlayerName);
                }
            },
            InternalRead: function (reader) {
                var $t;
                var playerId = reader.ReadInt32();
                var currentCount = reader.ReadInt32();
                var waitingCount = reader.ReadInt32();
                var playerName = null;
                var playerNameExists = reader.ReadBoolean();
                if (playerNameExists) {
                    playerName = reader.ReadString();
                }

                return ($t = new PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage(), $t.PlayerId = playerId, $t.PlayerName = playerName, $t.CurrentCount = currentCount, $t.WaitingCount = waitingCount, $t);
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessageParser", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.BinaryTransferMessageParser$1(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage)],
        props: {
            Identifier: {
                get: function () {
                    return 4;
                }
            }
        },
        methods: {
            InternalWrite: function (transferModel, writer) {
                writer.Write$10(transferModel.Players.Count);
                for (var i = 0; i < transferModel.Players.Count; i = (i + 1) | 0) {
                    writer.Write$10(transferModel.Players.getItem(i).PlayerId);
                    writer.Write$10(transferModel.Players.getItem(i).Units.Count);
                    for (var j = 0; j < transferModel.Players.getItem(i).Units.Count; j = (j + 1) | 0) {
                        writer.Write$10(transferModel.Players.getItem(i).Units.getItem(j).UnitId);
                        writer.Write$10(transferModel.Players.getItem(i).Units.getItem(j).Position.X);
                        writer.Write$10(transferModel.Players.getItem(i).Units.getItem(j).Position.Y);
                    }
                }

                writer.Write(System.Nullable.hasValue(transferModel.Exit));
                if (System.Nullable.hasValue(transferModel.Exit)) {
                    writer.Write$10(System.Nullable.getValue(transferModel.Exit).X);
                    writer.Write$10(System.Nullable.getValue(transferModel.Exit).Y);
                }

                writer.Write$10(System.Array.getLength(transferModel.Map, 0));
                writer.Write$10(System.Array.getLength(transferModel.Map, 1));
                for (var x = 0; x < System.Array.getLength(transferModel.Map, 0); x = (x + 1) | 0) {
                    for (var y = 0; y < System.Array.getLength(transferModel.Map, 1); y = (y + 1) | 0) {
                        writer.Write(System.Nullable.hasValue(transferModel.Map.get([x, y])));
                        if (System.Nullable.hasValue(transferModel.Map.get([x, y]))) {
                            writer.Write$10(System.Nullable.getValue(transferModel.Map.get([x, y])));
                        }
                    }
                }

                writer.Write$10(transferModel.Doors.Count);
                for (var i1 = 0; i1 < transferModel.Doors.Count; i1 = (i1 + 1) | 0) {
                    writer.Write$10(transferModel.Doors.getItem(i1).$clone().X);
                    writer.Write$10(transferModel.Doors.getItem(i1).$clone().Y);
                }
            },
            InternalRead: function (reader) {
                var $t;
                var playersCount = reader.ReadInt32();
                var players = new (System.Collections.Generic.List$1(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Player)).$ctor2(playersCount);

                for (var i = 0; i < playersCount; i = (i + 1) | 0) {
                    var playerId = reader.ReadInt32();
                    var unitsCount = reader.ReadInt32();
                    var units = new (System.Collections.Generic.List$1(PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Unit)).$ctor2(unitsCount);
                    for (var j = 0; j < unitsCount; j = (j + 1) | 0) {
                        var unitId = reader.ReadInt32();
                        var x = reader.ReadInt32();
                        var y = reader.ReadInt32();
                        units.add(($t = new PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Unit(), $t.UnitId = unitId, $t.Position = new PixelRPG.Base.TransferMessages.PointTransferMessage.$ctor1(x, y), $t));
                    }

                    players.add(($t = new PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage.Player(), $t.PlayerId = playerId, $t.Units = units, $t));
                }

                var existExists = reader.ReadBoolean();
                var exit = null;
                if (existExists) {
                    var x1 = reader.ReadInt32();
                    var y1 = reader.ReadInt32();
                    exit = new PixelRPG.Base.TransferMessages.PointTransferMessage.$ctor1(x1, y1);
                }

                var mapWidth = reader.ReadInt32();
                var mapHeight = reader.ReadInt32();
                var regions = System.Array.create(null, null, System.Nullable$1(System.Int32), mapWidth, mapHeight);
                for (var x2 = 0; x2 < mapWidth; x2 = (x2 + 1) | 0) {
                    for (var y2 = 0; y2 < mapHeight; y2 = (y2 + 1) | 0) {
                        var regionExists = reader.ReadBoolean();
                        if (regionExists) {
                            regions.set([x2, y2], reader.ReadInt32());
                        }
                    }
                }

                var junctionsCount = reader.ReadInt32();
                var junctions = new (System.Collections.Generic.List$1(PixelRPG.Base.TransferMessages.PointTransferMessage)).$ctor2(junctionsCount);
                for (var i1 = 0; i1 < junctionsCount; i1 = (i1 + 1) | 0) {
                    var x3 = reader.ReadInt32();
                    var y3 = reader.ReadInt32();
                    junctions.add(new PixelRPG.Base.TransferMessages.PointTransferMessage.$ctor1(x3, y3));
                }

                return ($t = new PixelRPG.Base.TransferMessages.ServerCurrentStateTransferMessage(), $t.Players = players, $t.Exit = System.Nullable.lift1("$clone", exit), $t.Map = regions, $t.Doors = junctions, $t);
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessageParser", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.BinaryTransferMessageParser$1(PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage)],
        props: {
            Identifier: {
                get: function () {
                    return 5;
                }
            }
        },
        methods: {
            InternalWrite: function (transferModel, writer) {
                writer.Write$10(transferModel.Width);
                writer.Write$10(transferModel.Height);
            },
            InternalRead: function (reader) {
                var $t;
                var width = reader.ReadInt32();
                var height = reader.ReadInt32();
                return ($t = new PixelRPG.Base.TransferMessages.ServerGameStartedTransferMessage(), $t.Width = width, $t.Height = height, $t);
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessageParser", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.BinaryTransferMessageParser$1(PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessage)],
        props: {
            Identifier: {
                get: function () {
                    return 6;
                }
            }
        },
        methods: {
            InternalWrite: function (transferModel, writer) {
                writer.Write$10(transferModel.PlayerId);
            },
            InternalRead: function (reader) {
                var $t;
                var playerId = reader.ReadInt32();
                return ($t = new PixelRPG.Base.TransferMessages.ServerPlayerTurnMadeTransferMessage(), $t.PlayerId = playerId, $t);
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessageParser", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.BinaryTransferMessageParser$1(PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage)],
        props: {
            Identifier: {
                get: function () {
                    return 7;
                }
            }
        },
        methods: {
            InternalWrite: function (transferModel, writer) {
                writer.Write$10(transferModel.PlayerId);
            },
            InternalRead: function (reader) {
                var $t;
                var playerId = reader.ReadInt32();
                return ($t = new PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage(), $t.PlayerId = playerId, $t);
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessageParser", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.BinaryTransferMessageParser$1(PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage)],
        props: {
            Identifier: {
                get: function () {
                    return 8;
                }
            }
        },
        methods: {
            InternalWrite: function (transferModel, writer) { },
            InternalRead: function (reader) {
                return new PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage();
            }
        }
    });

    Bridge.define("PixelRPG.Base.EntitySystems.ServerReceiveClientConnectHandler", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems.ServerReceiveHandlerSystem.Handler$1(PixelRPG.Base.TransferMessages.ClientConnectTransferMessage)],
        methods: {
            Handle$1: function (server, connectionKey, message) {
                var $t, $t1;
                var gameState = server.Entity.GetComponent(PixelRPG.Base.Components.GameStateComponent);

                gameState.Players.set(connectionKey, ($t = new PixelRPG.Base.Components.GameStateComponent.Player(), $t.PlayerId = ((connectionKey + 100500) | 0), $t));

                $t = Bridge.getEnumerator(gameState.Players);
                try {
                    while ($t.moveNext()) {
                        var player = $t.Current;
                        var responses = server.Response.get(player.key);
                        responses.add(($t1 = new PixelRPG.Base.TransferMessages.ServerClientConnectedTransferMessage(), $t1.PlayerId = player.key, $t1.PlayerName = message.PlayerName, $t1.WaitingCount = gameState.MaxPlayersCount, $t1.CurrentCount = gameState.Players.count, $t1));

                        if (player.value.PlayerId === gameState.Players.get(connectionKey).PlayerId) {
                            responses.add(($t1 = new PixelRPG.Base.TransferMessages.ServerYouConnectedTransferMessage(), $t1.PlayerId = player.value.PlayerId, $t1));
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                if (gameState.Players.count === gameState.MaxPlayersCount) {
                    var startGameResponse = PixelRPG.Base.EntitySystems.ServerLogic.StartNewGame(gameState);

                    $t1 = Bridge.getEnumerator(gameState.Players);
                    try {
                        while ($t1.moveNext()) {
                            var player1 = $t1.Current;
                            var responses1 = server.Response.get(player1.key);
                            responses1.add(startGameResponse);
                            responses1.add(PixelRPG.Base.EntitySystems.ServerLogic.BuildCurrentStateForPlayer(gameState, player1.value));
                            responses1.add(new PixelRPG.Base.TransferMessages.ServerYourTurnTransferMessage());
                        }
                    } finally {
                        if (Bridge.is($t1, System.IDisposable)) {
                            $t1.System$IDisposable$Dispose();
                        }
                    }
                }
            }
        }
    });

    Bridge.define("PixelRPG.Base.TransferMessages.ClientConnectTransferMessageParser", {
        inherits: [PixelRPG.Base.AdditionalStuff.ClientServer.BinaryTransferMessageParser$1(PixelRPG.Base.TransferMessages.ClientConnectTransferMessage)],
        props: {
            Identifier: {
                get: function () {
                    return 1;
                }
            }
        },
        methods: {
            InternalWrite: function (transferModel, writer) {
                writer.Write(transferModel.PlayerName != null);
                if (transferModel.PlayerName != null) {
                    writer.Write$14(transferModel.PlayerName);
                }
            },
            InternalRead: function (reader) {
                var $t;
                var playerNameExists = reader.ReadBoolean();
                var playerName = null;
                if (playerNameExists) {
                    playerName = reader.ReadString();
                }

                return ($t = new PixelRPG.Base.TransferMessages.ClientConnectTransferMessage(), $t.PlayerName = playerName, $t);
            }
        }
    });
});
