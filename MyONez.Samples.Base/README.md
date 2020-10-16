#Samples
==========

Samples show how to work with the various subsystems and features available in project.

# Setup

In order to get them running happily you need to do the following:

- clone the repo and ensure the subrepository is also updated
- open .sln and build that first.

To run samples on android device you will also need to install android sdk

## Auto Generating Content Paths
Samples includes a T4 template that will generate a static `ContentPaths` class for you that contains the names of all of the files processed by the Pipeline Tool. 
This lets you change code like the following:

```csharp
// before using the ContentPathGenerator you have strings to represent your content
var tex = content.Load<Texture2D>( "Textures/Scene1/blueBird" );

// after using the ContentPathGenerator you will have compile-tile safety for your content
var tex = content.Load<Texture2D>( ContentPaths.Textures.Scene1.blueBird" );
```

The big advantage to using it is that you will never have a reference to content that doesnt actually exist in your project. You get compile-time checking of all your content. Setup is as follows:

- copy the ContentPathGenerator.tt file into the root of your project (you could place it elsewhere and then modify the `sourceFolder` variable in the file.
- in the properites pane for the file set the "Custom Tool" to "TextTemplatingFileGenerator"
- right click the file and choose Tools -> Process T4 Template to generate the Content class

# Assets License

Unless otherwise noted, the assets in the Samples repo project are not MIT licensed. 
They should not be used in any project. Most are of unknown copyright/origin so assume they are all off limits and use them only for your own personal amusement.
