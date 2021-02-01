
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

using SpineEngine.ECS.EntitySystems.Animation;
using SpineEngine.Graphics.Drawable;

using PixelRPG.Base;
using PixelRPG.Base.Assets;
using PixelRPG.Base.Assets.UnitAnimations;

public class BanditSprite : UnitAnimation {
    
    public BanditSprite(ContentManager content) {

        var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.thief);
        var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 13);

        this.Idle = new SpriteAnimation(frames, 21, 21, 21, 22, 21, 21, 21, 21, 2);

        this.Run = new SpriteAnimation(frames, 21, 21, 23, 24, 24, 25);

        this.Attack = new SpriteAnimation(frames, 31, 32, 33);

        this.Die = new SpriteAnimation(frames, 25, 27, 28, 29, 30);
    }
}
