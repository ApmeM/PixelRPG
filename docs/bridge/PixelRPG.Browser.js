/**
 * @version 1.0.0
 * @author PixelRPG.Browser
 * @compiler Bridge.NET 17.6.0
 */
Bridge.assembly("PixelRPG.Browser", function ($asm, globals) {
    "use strict";

    Bridge.define("PixelRPG.Browser.App", {
        main: function Main () {
            var canvas = document.createElement("canvas");
            canvas.width = 800;
            canvas.height = 480;
            canvas.id = "monogamecanvas";
            document.body.appendChild(canvas);

            document.body.appendChild(document.createElement("br"));

            var can = document.createElement("canvas");
            can.width = 800;
            can.height = 1024;
            document.body.appendChild(can);

            PixelRPG.Browser.App.game = new PixelRPG.Base.Game1();
            PixelRPG.Browser.App.game.Run();
        },
        statics: {
            fields: {
                game: null
            }
        }
    });
});
