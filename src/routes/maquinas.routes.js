import express from "express"; // importo la libreria express
import { maquinasServices } from "../services/maquinas.service.js"; // importo los servicios necesarios
const router = express.Router(); // creo el objeto de routeo

// Importa las funciones necesarias de los SDKs que necesitas
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import multer from 'multer';

import dotenv from 'dotenv';
// Configura dotenv
dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Configuración de multer
const storageMulter = multer.memoryStorage();
const upload = multer({ storage: storageMulter });

// endpoint necesario para la creacion de una maquina en la base de datos
// por ahora, solo quiero hacer un subidor de archivos a firebase, que me retorne la url de la foto
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const filename = Date.now() + '-' + req.file.originalname;

        // Referencia al bucket de almacenamiento
        const storageRef = ref(storage, filename);

        // Subir el archivo al bucket
        await uploadBytes(storageRef, fileBuffer);

        // Obtener la URL del archivo recién subido
        const url = await getDownloadURL(storageRef);

        const maquinaACrear = await maquinasServices.addMaquina(req.body, url);
        console.log("maquina: ", maquinaACrear)

        return res.json(maquinaACrear);
    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json({ error: 'Error al subir el archivo a Firebase' });
    }
});


// endpoint para obtener todas las maquinas activas
router.get('/', async (req, res, next) => {
    try {
        const rdo = await maquinasServices.getAll();
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint para obtener una maquina segun su id
router.get('/maquina/:id', async (req, res, next) => {
    try {
        const rdo = await maquinasServices.getMaquinaById(req.params.id);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint para obtener 0 a N maquinas, funcion de 0 o mas filtros
router.post('/byFilters', async (req, res, next) => {
    try {
        const rdo = await maquinasServices.getMaquinasByFilters(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint de la desactivacion de un usuario del sistema
router.delete('/delete/:id', async (req, res, next) => {
    try {
        const rdo = await maquinasServices.deleteMachine(req.params.id);
        return res.json(rdo);
    } catch (error) {
        next(error)
    }
})

// endpoint de la reactivacion de un usuario en el sistema
router.put('/activate/:id', async (req, res, next) => {
    try {
        const rdo = await maquinasServices.activateMachine(req.params.id);
        return res.json(rdo);
    } catch (error) {
        next(error)
    }
})

// endpont para actualizar los datos de la maquina: nombre, marca, peso
router.put('/update', async (req, res, next) => {
    try {
        const rdo = await maquinasServices.updateMachine(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})



const maquinasRouter = { router }
export { maquinasRouter }