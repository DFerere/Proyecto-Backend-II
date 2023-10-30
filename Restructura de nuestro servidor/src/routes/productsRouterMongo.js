import { Router, response } from 'express';

import ProductManagerMongo from '../controllers/mongo/productsManagerMongo.js';

const router = Router();


const productosMongo = new ProductManagerMongo();


 /*View de productos catalogo paginaciçion*/
router.get("/catalog", async (req, res) => {
   
    const objectsession  = req.session;
    console.log("este es req session"); 
    console.log(req.session.email);
    

    res.render("ViewsProducts", { objectsession }); 
})

router.get("/failurelogin", async (req, res) => { 

    res.send("Sorry :( credenciales incorrectas"); 
})

router.get("/current", async (req, res) => {
   
    const objectsession  = req.session;
    console.log("este es req session"); 
    console.log(req.session.email);

    res.send(objectsession); 
})


/*Paginación*/
router.get('/', async (req, res) => { //trae lista de productos con param limit, page, query y sort

    var page = req.query.page;
    var limit = req.query.limit;
    var query = req.query.query; 
    var queryvalue = req.query.queryvalue;
    var sortvalue = req.query.sortvalue; 


    parseInt(page);
    parseInt(limit);
    parseInt(sortvalue);
    console.log(page); 
    console.log(query);
    console.log(queryvalue);  
    console.log("Entre a GET de numero de Paginas"); 


    if(!sortvalue){
        sortvalue = 1; 
    }

    if (!page && !limit && !query) {
        const pageconst = 1;
        const limitconst = 10;
        const query = {}; 
        const response = await productosMongo.getpageProducts(query, pageconst, limitconst, sortvalue);
        return response; 

        return res.send(response); //Habilitar si usa Postman
    } 

    if (page && !limit && !query) {
 
        const limitconst = 10; 
        const query = {};
        const response = await productosMongo.getpageProducts(query, page, limitconst, sortvalue);
        return res.send(response);
    } 

    if (!page && limit && !query) {
        const pageconst = 1; 
        const query = {};
        const response = await productosMongo.getpageProducts(query, pageconst, limit, sortvalue);
        return res.send(response);
    } 

    if (!page && !limit && query) {
        const pageconst = 1;
        const limitconst = 10;
        const queryobject = {category : queryvalue}; 
        console.log(queryobject); 
        const response = await productosMongo.getpageProducts(queryobject, pageconst, limitconst, sortvalue);
        return res.send(response);
    } 

    if (page && limit && !query) { 
        const query = {};
        const response = await productosMongo.getpageProducts(query, page, limit, sortvalue);
        return res.send(response);
    }

    if (!page && limit && query) {
        const pageconst = 1;
        const queryobject = {category : queryvalue};
        const response = await productosMongo.getpageProducts(queryobject, pageconst, limit, sortvalue);
        return res.send(response);
    }

    if (page && !limit && query) {

        const limitconst = 10; 

        const queryobject = {category : queryvalue};
        const response = await productosMongo.getpageProducts(queryobject, page, limitconst, sortvalue);
        return res.send(response);
    } else {
 
        const queryobject = {category : queryvalue};

        const response = await productosMongo.getpageProducts(queryobject, page, limit, sortvalue);
        return res.send(response);
    }

})

export default router; 
