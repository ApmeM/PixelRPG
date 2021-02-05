using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

using SpineEngine.ECS.EntitySystems.Animation;
using SpineEngine.Graphics.Drawable;

using PixelRPG.Base;
using PixelRPG.Base.Assets;
using PixelRPG.Base.Assets.UnitAnimations;

public class BatSprite : UnitAnimation {
    
    public BatSprite(ContentManager content)
    {
        var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.bat);
        var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 15, 15);

        this.Idle = new SpriteAnimation(frames, 0, 1);

        this.Run = new SpriteAnimation(frames, 0, 1);

        this.Attack = new SpriteAnimation(frames, 2, 3, 0, 1);

        this.Die = new SpriteAnimation(frames, 4, 5, 6);
    }
}
