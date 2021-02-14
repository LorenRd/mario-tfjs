![Logo](/media/Logo.png)

# Mario TFJS - ¡Play Super Mario Bros with your camera!

This is a project carried for the Machine Learning Engineering subject of the Master's Degree in 
IT, Data and Cloud at the University of Seville.

![Demo](/media/Demo.gif)


## Authors

[Andrés Martínez](https://github.com/amg98) & [Lorenzo Rondán](https://github.com/LorenRd)

## Objetives

The aim of this project is to realise an image classifier using 2 methods, pretrained MobileNet model and a custom on fly trained model classifier.

The pre-trained MobileNet detects the gestures that we indicate using the camera, the detections made will serve as an input device for a video game. In this case, we have selected the classic Super Mario Bros. level 1-1. The available actions are the following:

- Forward
- Backwards
- Jump

Each of these actions are the possible classes of the image classifier.

## Deployment

The project is deployed using Firebase. It can be tested both on PC and mobile through this link: https://mario-tfjs.web.app/
