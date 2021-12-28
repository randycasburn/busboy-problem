# Busboy does not reliably parse file from FormData

This application showcases an issue where Busboy does not reliably parse a file from `FormData()`. This is especially true as the file size grows larger - meaning that there is an increased probability that the issue occurs when dealing with larger files. Therefore, I have attached a couple of files of varying size in the **files** folder. These files can be sent to the server through the front-end application. Note that the back-end server must be started before a file can be submitted.

## Available files

| Name                             | Size   | Comment                |
| -------------------------------- | ------ | ---------------------- |
| Boards of Canada - Olson         | 4.42MB | Works most of the time |
| Boards of Canada - Kid For Today | 38.1MB | Fails most of the time |

## Install the required dependencies

Navigate to the **backend** folder and run `npm install` to install the required dependencies

## Start the server

Navigate to the **backend** folder and run `npm start`
