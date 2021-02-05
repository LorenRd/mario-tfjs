# Mario TFJS - ¡Juega a Super Mario Bros con tu cámara!

Este es un proyecto realizado para la asignatura de Machine Learning Engineering del máster en 
Gestión TI, Datos y Cloud de la Universidad de Sevilla.

## Autores

Andrés Martínez y Lorenzo Roldán

## Objetivos

El objetivo de este proyecto es realizar un clasificador de imágenes usando 2 métodos: usando el modelo
preentrenado de MobileNet y realizar "transfer learning" para que sea capaz de detectar los gestos
que indiquemos usando la cámara, y mediante un modelo preentrenado usando TensorFlow en local.

Las detecciones realizadas servirán de dispositivo de entrada para un videojuego. En este caso,
hemos seleccionado el clásico nivel 1-1 de Super Mario Bros. Las acciones disponibles son las siguientes:

- Avanzar
- Retroceder
- Saltar
- Quedarse quieto

Cada una de estas acciones son las posibles clases del clasificador de imágenes.

## Despliegue

El proyecto se encuentra desplegado en Firebase. Se puede probar tanto en PC como en móvil a través
de este enlace: https://mario-tfjs.web.app/
