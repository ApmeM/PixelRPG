#Core
==========
The root class is the Core class which is a subclass of the Game class. 
Your Game class should subclass Core. 
Core provides access to all the important subsystems via static fields and methods for easy access.


## Graphics
Core will create an instance of the Graphics class (available via Graphics.instance) for you at startup. that have methods to draw your images. 


## Scene
When you set Core.Scene to a new Scene, Core will finish rendering the current Scene and then start rendering the new Scene. 


# Global Managers
Core lets you add a global manager object that will have an update method called every frame before Scene.Update occurs. 
Any of your systems that should persist Scene changes can be put here. 
Core has several of it's own systems setup as global managers as well including: scheduler, coroutine manager and tween manager. 
You can register/unregister your global managers via `Core.Instance.AddGlobalManager` and `Core.Instance.RemoveGlobalManager`.

## TimerGlobalManager
The TimerGlobalManager is a simple helper that lets you pass in an Action that can be called once or repeately with or without a delay. 
The **Core.Instance.GetGlobalManager<TimerGlobalManager>()** method provides access to the TimerGlobalManager. 
When you call **Schedule** you get back an Timer object that has a **Stop** method that can be used to stop the timer from firing again. 
Timers are automatically cached and reused so fire up as many as you need.


## CoroutineGlobalManager
The CoroutineGlobalManager lets you pass in an IEnumerator which is then ticked each frame allowing you to break long running tasks up into smaller ones. 
The entry point for starting a coroutine is **Core.Instance.GetGlobalManager<CoroutineGlobalManager>().StartCoroutine()** which returns an Coroutine object with a single method: **Stop**. 
The execution of a coroutine can be paused at any point using the yield statement. 
You can yield a call to `DefaultCoroutines.Wait(N)` which will delay execution for N seconds or you can yield a call to **Core.Instance.GetGlobalManager<CoroutineGlobalManager>().StartCoroutine()** to pause until another coroutine completes.
