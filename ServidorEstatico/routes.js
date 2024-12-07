    /**
     * Analizar url de la solicitud y dirigirla al controlador correspondiente
     */


    import { animeController } from "./controllers/animeController.js"

    export const router = (req, res) => {
        // Obtener la URL de la solicitud
    const url = req.url

    // Dividir la URL en partes y filtrar los vacíos, luego eliminar los parámetros de la URL (query string)
    const urlParts = url.split('/').filter(part => !!part).map(part => part.split('?')[0])


    let payloadBruto = '' // @todo generar payload desde evento data

 // Recibir los datos del cuerpo de la solicitud
    req.on('data', chunk => {
        payloadBruto += chunk
    })

    req.on('end', () => {
        /**
         * /public
         */
        if(urlParts[0] != 'api') {
        publicController(req, res, urlParts)
        } 
        /**
         * Ruta para anime en la API
         * Si la URL es '/api/anime', se invoca el controlador de anime.
         */

        else if (urlParts[0] == 'api' && urlParts[1] == 'anime') {
        animeController(req, res, payloadBruto, urlParts)
        }
        /**
         * Si no se encuentra ninguna coincidencia para la ruta
         * Devolvemos un error 404 (No encontrado)
         */
        else {
        res.writeHead(404, 'Not Found', { "content-type": "text/plain" })
        res.end('No encontrado')
        }
    })
    }