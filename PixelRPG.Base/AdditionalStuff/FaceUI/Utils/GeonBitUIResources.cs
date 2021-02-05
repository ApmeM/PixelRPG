namespace PixelRPG.Base.AdditionalStuff.FaceUI.Utils
{
    using System;
    using System.Collections;

    using global::FaceUI;
    using global::FaceUI.DataTypes;
    using global::FaceUI.Entities;

    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    public class GeonBitUIResources
    {
        public static IEnumerator GetEnumerator(ContentManager content, string theme)
        {
            var root = "FaceUI/themes/" + theme + "/";

            content.Load<Texture2D>(root + "textures/horizontal_line");
            yield return 0;
            content.Load<Texture2D>(root + "textures/white_texture");
            yield return 0;
            content.Load<Texture2D>(root + "textures/icons/background");
            yield return 0;
            content.Load<Texture2D>(root + "textures/scrollbar");
            yield return 0;
            content.Load<Texture2D>(root + "textures/scrollbar_mark");
            yield return 0;
            content.Load<Texture2D>(root + "textures/arrow_down");
            yield return 0;
            content.Load<Texture2D>(root + "textures/arrow_up");
            yield return 0;
            content.Load<Texture2D>(root + "textures/progressbar");
            yield return 0;
            content.Load<Texture2D>(root + "textures/progressbar_fill");
            yield return 0;

            foreach (CursorType cursor in Enum.GetValues(typeof(CursorType)))
            {
                string cursorName = Enum.GetName(typeof(CursorType), cursor).ToLower();
                content.Load<CursorTextureData>(root + "textures/cursor_" + cursorName + "_md");
            }

            yield return 0;

            foreach (PanelSkin skin in Enum.GetValues(typeof(PanelSkin)))
            {
                if (skin == PanelSkin.None)
                {
                    continue;
                }
                string skinName = skin.ToString().ToLower();
                content.Load<TextureData>(root + "textures/panel_" + skinName + "_md");
            }
            yield return 0;
            content.Load<TextureData>(root + "textures/scrollbar_md");
            yield return 0;
            foreach (SliderSkin skin in Enum.GetValues(typeof(SliderSkin)))
            {
                string skinName = skin.ToString().ToLower();
                content.Load<TextureData>(root + "textures/slider_" + skinName + "_md");
            }
            yield return 0;
            foreach (FontStyle style in Enum.GetValues(typeof(FontStyle)))
            {
                content.Load<SpriteFont>(root + "fonts/" + style.ToString());
            }
            yield return 0;
            foreach (ButtonSkin skin in Enum.GetValues(typeof(ButtonSkin)))
            {
                string skinName = skin.ToString().ToLower();
                content.Load<TextureData>(root + "textures/button_" + skinName + "_md");
            }
            yield return 0;
            content.Load<TextureData>(root + "textures/progressbar_md");
            yield return 0;
            content.Load<Effect>(root + "effects/disabled");
            yield return 0;
            content.Load<Effect>(root + "effects/silhouette");
            yield return 0;
            LoadDefaultStyles(ref Entity.DefaultStyle, "Entity", root, content);
            yield return 0;
            LoadDefaultStyles(ref Paragraph.DefaultStyle, "Paragraph", root, content);
            yield return 0;
            LoadDefaultStyles(ref Button.DefaultStyle, "Button", root, content);
            yield return 0;
            LoadDefaultStyles(ref Button.DefaultParagraphStyle, "ButtonParagraph", root, content);
            yield return 0;
            LoadDefaultStyles(ref CheckBox.DefaultStyle, "CheckBox", root, content);
            yield return 0;
            LoadDefaultStyles(ref CheckBox.DefaultParagraphStyle, "CheckBoxParagraph", root, content);
            yield return 0;
            LoadDefaultStyles(ref ColoredRectangle.DefaultStyle, "ColoredRectangle", root, content);
            yield return 0;
            LoadDefaultStyles(ref DropDown.DefaultStyle, "DropDown", root, content);
            yield return 0;
            LoadDefaultStyles(ref DropDown.DefaultParagraphStyle, "DropDownParagraph", root, content);
            yield return 0;
            LoadDefaultStyles(ref DropDown.DefaultSelectedParagraphStyle, "DropDownSelectedParagraph", root, content);
            yield return 0;
            LoadDefaultStyles(ref Header.DefaultStyle, "Header", root, content);
            yield return 0;
            LoadDefaultStyles(ref HorizontalLine.DefaultStyle, "HorizontalLine", root, content);
            yield return 0;
            LoadDefaultStyles(ref Icon.DefaultStyle, "Icon", root, content);
            yield return 0;
            LoadDefaultStyles(ref Image.DefaultStyle, "Image", root, content);
            yield return 0;
            LoadDefaultStyles(ref Label.DefaultStyle, "Label", root, content);
            yield return 0;
            LoadDefaultStyles(ref Panel.DefaultStyle, "Panel", root, content);
            yield return 0;
            LoadDefaultStyles(ref ProgressBar.DefaultStyle, "ProgressBar", root, content);
            yield return 0;
            LoadDefaultStyles(ref ProgressBar.DefaultFillStyle, "ProgressBarFill", root, content);
            yield return 0;
            LoadDefaultStyles(ref RadioButton.DefaultStyle, "RadioButton", root, content);
            yield return 0;
            LoadDefaultStyles(ref RadioButton.DefaultParagraphStyle, "RadioButtonParagraph", root, content);
            yield return 0;
            LoadDefaultStyles(ref SelectList.DefaultStyle, "SelectList", root, content);
            yield return 0;
            LoadDefaultStyles(ref SelectList.DefaultParagraphStyle, "SelectListParagraph", root, content);
            yield return 0;
            LoadDefaultStyles(ref Slider.DefaultStyle, "Slider", root, content);
            yield return 0;
            LoadDefaultStyles(ref TextInput.DefaultStyle, "TextInput", root, content);
            yield return 0;
            LoadDefaultStyles(ref TextInput.DefaultParagraphStyle, "TextInputParagraph", root, content);
            yield return 0;
            LoadDefaultStyles(ref TextInput.DefaultPlaceholderStyle, "TextInputPlaceholder", root, content);
            yield return 0;
            LoadDefaultStyles(ref VerticalScrollbar.DefaultStyle, "VerticalScrollbar", root, content);
            yield return 0;
            LoadDefaultStyles(ref PanelTabs.DefaultButtonStyle, "PanelTabsButton", root, content);
            yield return 0;
            LoadDefaultStyles(ref PanelTabs.DefaultButtonParagraphStyle, "PanelTabsButtonParagraph", root, content);
            yield return 0;
        }
        
        private static void LoadDefaultStyles(ref StyleSheet sheet, string entityName, string themeRoot, ContentManager content)
        {
            string stylesheetBase = themeRoot + "styles/" + entityName;
            content.Load<DefaultStylesList>(stylesheetBase);
        }
    }
}