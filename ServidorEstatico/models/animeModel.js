    //Grabamos o leemos datos relativos con el archivo anime.json

    import {
        createFile,     // Función para crear un archivo
        deleteFile,     // Función para eliminar un archivo
        updateFile,     // Función para actualizar un archivo
        readFile,       // Función para leer un archivo
        fileExists,     // Función para verificar si un archivo existe
        listAll,        // Función para listar todos los archivos de una carpeta
    } from "../lib/data.js";
    
    export class AnimeModel {
        static folder = '.data/' // Carpeta donde se almacenan los archivos .json a trabajar
        static fileName = 'anime.json' // Nombre del archivo a trabajar
    
         // Lee el archivo JSON y obtiene los datos de los anime
        static async getAll() {
        let manga = await readFile(AnimeModel.folder, AnimeModel.fileName)
    
        return manga // Retorna los datos leídos desde el archivo
        }
    
        // Busca un anime por ID
        static async getById(id) {
        let manga = await AnimeModel.getAll()
    
        return manga[id] // Retorna el anime con el ID solicitado
        }
    
        // Actualiza el archivo `anime.json` con los nuevos datos que se ingren con la misma estructura
        static async createAndUpdateAnime(manga) {
        try {
            await updateFile(AnimeModel.folder, AnimeModel.fileName, manga)
            return true // Retorna true si la actualización fue exitosa
        } catch (error) {
            console.error(error)
            return false // Retorna false en caso de error
        }
        }
    }