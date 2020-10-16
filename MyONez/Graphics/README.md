#Rendering
==========

First and foremost with regard to rendering is the type of filtering used for your textures. 
Core has several subsystems (such as Renderers, Scenes and RenderProcessors) that all need to know how you want your textures to look. 
Everything is configurable on a per object basis but you will want to set a default as well so you don't have to bother changing the SamplerState all over the place. 
`Graphic.DefaultSamplerState` should be set before you create your first Scene. 
It defaults to `SamplerState.PointClamp` which is good for pixel art. 
If you are using high-def art then make sure you set it to `SamplerState.LinearClamp` so you don't get ugly results.

The Core rendering setup was designed to be really easy to get up and running but at the same time flexible so that advanced users can do whatever they need to out of the box. 
The basic gist of how the rendering system works revolves around the `Renderer` class. 
You add one or more Renderers to your Scene (`AddRenderer` and `RemoveRenderer` methods) and each of your Renderers will be called in after all EntitySystems have had their update method called. 
All rendering is done into a RenderTexture which handled by rendering processors. 
Several default Renderers are provided to get you started and cover the most common setups. 
The included renderers are described below:

- **DefaultRenderer**: renders all renderable entities that is enabled in your scene
- **RenderLayerRenderer**: renders only the entities in your Scene that are on the specified render layers defined by RenderLayerComponent
- **RenderLayerExcludeRenderer**: renders all the entities in your Scene that are not on the specified renderLayers defined by RenderLayerComponent

You are free to subclass Renderer and render things in any way that you want. 
The Renderer class provides a solid, configurable base that lets you customize various attributes as well as render to a `RenderTexture` instead of directly to the framebuffer. 
If you do decide to render to a RenderTexture in most cases you will want to use a RenderProcessor to draw it later. 
It should also be noted that RenderTextures on a Renderer are automatically resized for you when the screen size changes. 
You can change this behavior via the RenderTexture.ResizeBehavior enum.

Sometimes you will want to do some rendering after all RenderProcessors have run. 
For example, in most cases your UI will be rendered without any aditional effects. 
To deal with cases like these a `Renderer` can set the `Renderer.RenderAfterPostProcessors` field. 

## Render Processors
Much like Renderers, you can add one or more RenderProcessors to the Scene via the **AddRenderProcessor** and **RemoveRenderProcessor** methods. 
RenderProcessors are do the actual rendering and collected in a rendering piplen. 
They are sorted in ExecutionOrder.
There are a few predefined render processors that do the actual rendering:

- EntityRendererProcessor Renders all renderable entities. Its ExecutionOrder is -1 so it renders before regular processors, but still lets you add something before it.
- FinalRenderRenderProcessor Renders source into the final render target that can be a screen (or if you use scene transition - then transition target) it always should be the last processor in pipeline.
- RenderProcessor Renders source into destination with applying effect if provided.

One common use case for a custom RenderProcessor is to apply some Effects to the result of previously rendered texture. 

A basic example of a RenderProcessor is a RenderProcessor class.
