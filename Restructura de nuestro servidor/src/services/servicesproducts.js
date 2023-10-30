import { Router } from 'express';
import { usersModel } from '../dao/models/usermodels.js';
import { productsModel } from '../dao/models/productsmodels.js';
import passport from 'passport';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

class products {

    async create(title, description, price, thumbnail, code, stock, status, category){

        const produ = await productsModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
        }); 

        return produ; 

    }

    async getallproducts(){
        const getprod = await productsModel.find().lean(); 

        return getprod; 
    }

    async getproducts(limit){

        const getprod = await productsModel.find({}).limit(limit).exec().lean();
        return getprod; 


    }


}

export default products;