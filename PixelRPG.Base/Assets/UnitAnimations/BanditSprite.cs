
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

using MyONez.ECS.EntitySystems.Animation;
using MyONez.Graphics.Drawable;

using PixelRPG.Base;
using PixelRPG.Base.Assets;
using PixelRPG.Base.Assets.UnitAnimations;

public class BanditSprite : CharSprite {
    
    public BanditSprite(ContentManager content) {

        var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.thief);
        var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 13);

        this.idle = new SpriteAnimation(frames, 21, 21, 21, 22, 21, 21, 21, 21, 2);

        this.run = new SpriteAnimation(frames, 21, 21, 23, 24, 24, 25);

        this.attack = new SpriteAnimation(frames, 31, 32, 33);

        this.die = new SpriteAnimation(frames, 25, 27, 28, 29, 30);
    }
}
