MyONez aims to be a lightweight 2D framework that sits on top of MonoGame. It provides a solid base for you to build a 2D game on. Some of the many features it includes are:

- Scene/Entity/Component system with Component render layer tracking and optional entity systems (an implementation that operates on a group of entities that share a specific set of components)
- efficient coroutines for breaking up large tasks across multiple frames or animation timing (Core.startCoroutine)
- extensible rendering system. Add/remove renderers and post processors as needed. Renderables are sorted by render layer first then layer depth for maximum flexibility out of the box.
- tween system. Tween any int/float/Vector/quaternion/color/rectangle field or property.
- sprites with sprite animations
- scheduler for delayed and repeating tasks
- per-scene content managers. Load your scene-specific content then forget about it. We will unload it for you when you change scenes.
- customizable Scene transition system with several built in transitions
- [tons more stuff](MyONez.Samples.Base/Samples.md)


Systems
==========

- [Core](MyONez/Core.md)
- [Rendering](MyONez/Graphics/README.md)
- [Scene Transitions](MyONez/Graphics/Transitions/README.md)
- [Samples](MyONez.Samples.Base/Samples.md)


Setup
==========
### Install as a submodule:

- create a `Monogame Cross Platform Desktop Project`
- clone or download this repository
- add the `MyONez/MyONez.csproj` project to your solution and add a reference to it in your main project
- make your main Game class (`Game1.cs` in a default project) subclass `MyONez.Core`
- add <MonoGameContentReference Include="..\MyONez\Content\Content.mgcb" Link="Content\BaseContent.mgcb" /> reference to have your project.

Credits
==========

- [**Nez**](https://github.com/prime31/Nez) - ![GitHub stars](https://img.shields.io/github/stars/prime31/Nez.svg) - 2D game engine.
