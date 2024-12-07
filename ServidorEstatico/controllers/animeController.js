
    import { AnimeModel } from "../models/animeModel.js"
    import * as crypto from 'node:crypto'
    import * as url from "node:url"

    export const animeController = async (req, res, payloadBruto, urlparts) => {
    const queryParams = url.parse(req.url, true);

        // Mostrar todos los animes si no hay parámetros adicionales

    if(req.method == 'GET' && !urlparts[2] && !queryParams.search) {
        try {
        let mangas = await AnimeModel.getAll()
    
        res.writeHead(200, 'OK', { "content-type": "application/json" })
        res.end(JSON.stringify(mangas))
        } catch (err) {
        res.writeHead(500, 'Internal Server Error', { "content-type": "application/json" })
        res.end(JSON.stringify({ message: err.message }))
        }
    }
    /**
     * Buscar animes utilizando el parámetro query de la URL
     * Ejemplo: /api/anime?search=nombre
     */
    else if(req.method == 'GET' && !urlparts[2] && queryParams.search) {
        const  {nombre} = queryParams.query;
        const mangas = await AnimeModel.getAll()

        let ids = Object.keys(mangas)

 // Filtra los animes que coinciden con el nombre
        for(let id of ids) {
        let manga = mangas[id]


        if (!manga.nombre.toLowerCase().includes(nombre.toLocaleLowerCase())) {
            delete mangas[id]

        }
        }

        let remainingKeys = Object.keys(mangas)

// Si no hay animes que coincidan, devuelve un error 404
        if(remainingKeys.length == 0) {
        res.writeHead(404, 'Not Found', { "content-type": "application/json" })
        return res.end(JSON.stringify({ message: 'No se encontraron animes' }))
        } else {
        res.writeHead(200, 'OK', { "content-type": "application/json" })
        return res.end(JSON.stringify(mangas))
        }

    }

    // Mostrar animes por ID
    else if (req.method == 'GET' && urlparts[2] && urlparts.length <= 3 ) {
        let manga = await AnimeModel.getById(urlparts[2])
        console.log(manga);

        if(manga) {
        res.writeHead(200, 'OK', { "content-type": "application/json" })
        res.end(JSON.stringify(manga))
        } else {
        res.writeHead(404, 'Not Found', { "content-type": "application/json" })
        res.end(JSON.stringify({ message: 'Anime no encontrado' }))
        }
    }

    // Crear nuevos anime
    else if(req.method == 'POST' && !urlparts[2]) {
        try {
        let data = JSON.parse(payloadBruto)
        let id = crypto.randomUUID()


        let mangas = await AnimeModel.getAll() 
        mangas[id] = data;

        let status = await AnimeModel.createAndUpdateAnime(mangas)
        if(status) {
            res.writeHead(201, 'Created', { "content-type": "application/json" })
            res.end(JSON.stringify({ message: 'Creado: Anime agregado con exito' }))
        } else {
            res.writeHead(500, 'Internal Server Error', { "content-type": "application/json" })
            res.end(JSON.stringify({message: 'Error interno al crear el anime'}))
        }
        } catch (err) {
        res.writeHead(400, 'Bad Request', { "content-type": "application/json" })
        res.end(JSON.stringify({ message: 'Solicitud mal hecha'}))
        }
    }
    
    // Actualizar un anime existente
    else if ( req.method == 'PUT' && urlparts[2] ) {
        try {
        let mangas = await AnimeModel.getAll()
        let manga = await AnimeModel.getById(urlparts[2])

    // Validación del payload para actualizar (a implementar)

        if(manga) {
            try {
            let payload = JSON.parse(payloadBruto)
            manga = { ...manga, ...payload }
            mangas[urlparts[2]] = manga 
            console.log(manga);

            await AnimeModel.createAndUpdateAnime(mangas)

            res.writeHead(200, 'OK', { "content-type": "application/json" })
            return res.end(JSON.stringify({ message: 'updated', manga }))
            } catch (err) {
            res.writeHead(400, 'Bad Request', { "content-type": "application/json" })
            return res.end(JSON.stringify({ message: 'Payload mal formado' }))
            }
        } else {
            res.writeHead(404, 'Not Found', { "content-type": "application/json" })
            return res.end(JSON.stringify({ message: 'Anime no encontrado' }))
        }
        } catch (err) {
        res.writeHead(100, 'algo', { "content-type": "application/json" })
        return res.end(JSON.stringify({ message: err.message }))
        }
    }

    // Borrado de anime por ID

    else if( req.method == 'DELETE' && urlparts[2] ) {
        let mangas = await AnimeModel.getAll()        
        let ids = Object.keys(mangas)
    // Verifica si el ID existe y lo elimina    
        if(ids.includes(urlparts[2])) {
        delete mangas[urlparts[2]]

        await AnimeModel.createAndUpdateAnime(mangas)

        res.writeHead(200, 'OK', { "content-type": "application/json" })
        return res.end((JSON.stringify({ message: "Delete: Anime eliminado con éxito" })))
        } else {
        res.writeHead(404, 'Not Found', { "content-type": "application/json" })
        return res.end(JSON.stringify({ message: "Anime no encontrado" }))
        }
    }
    }