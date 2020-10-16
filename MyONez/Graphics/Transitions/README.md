Scene Transitions
==========
Every game needs transition effects to have a polished look and feel. 
Here transitions can be done between Scenes and also within a Scene. 
There are several built-in transitions and it is easy to make your own, custom transition effects.


## Using Included Transitions
All of the included transitions can be used intra-Scene (within the same Scene) and between two different Scenes. 
Some of them have configuration options that control how the transition occurs. 
Below are a couple examples:

```cs
// loads up a new Scene with a WindTransition. Note that you provide a `Func<Scene>` to provide the Scene to transition to.
Core.Instance.SceneTransition = new WindTransition( () => new YourNextScene() );

// transitions within the current Scene with a SquaresTransition
var transition = new SquaresTransition();
// for intra-Scene transitions we will probably be interested in knowing when the screen is obscured so we can take action
transition.OnTransitionCompleted = onTransitionCompleted;
Core.Instance.SceneTransition = transition;


void onTransitionCompleted()
{
    // move Camera to new location
    // reset Entities
}
```

## Custom Transitions
The real power of transitions comes when creating your own custom transitions that match your games style. 
You can use the included transitions as examples to base yours off of. 
This guide will go over the details, hows and whys of everything as well.

Transitions generally come in two flavors: one part and two part. 
A one part transition will obscure the screen with a render of the previous Scene, load a new Scene and then transition from the old render to the new Scene's render with an effect 
(for example, slide the old render off the screen). 
A two part transition will first perform a transition effect, then load the new Scene and then transition to displaying the new Scene 
(for example, fade to black, load new Scene, fade to new Scene). 
Either way, the process is very similar.

- subclass `SceneTransition`
- if you are using an `Effect` load it up in the constructor so it is ready to use
- `Render` is called every frame so that you can control the final render output. You can use the `IsNewSceneLoaded` flag for two part transitions to determine if you are on part one or two.
- override `OnBeginTransition`. This method will compose the bulk of the transition code. It is called in a coroutine so you can yield to control flow:
	- (optional) for two part transitions, you will want to perform your first part (example, fade to black)
	- yield a call to load up the next Scene: `yield return Core.Instance.GetGlobalManager<CoroutineGlobalManager>().StartCoroutine( LoadNextScene() )`. Note that you should do this even for intra-Scene transitions. System will take care of properly setting the `IsNewSceneLoaded` flag even for intra-Scene transitions to make the code for two part transitions the same for both cases.
	- perform your transition (example, fade out the previous Scene render to show the new Scene)
	- call `TransitionComplete` which will end the transition and cleanup the RenderTarget
	- unload any Effects/Textures that you used. Alternatively, you can override `TransitionComplete` and do cleanup there. Just be sure to call base!

The `SceneTransition` class has a handy little helper method that you can use if you are using an Effect for your transition. `TickEffectProgressProperty` lets you yield a call to it in a coroutine and it will set a `_progress` property on your Effect either from 0 - 1 or from 1 - 0. You can use this for both one or two part transitions. See the included transition shaders for examples.

For detailed example see WindTransition.cs in additional content project

