const express = require('express');
const crudModel = require('./crud_model.js');
const verifUtils = require('./verification_utils');


class Crud {
    constructor(knexConfig, road, listRoads, listParams, adminRules, accessRules) {
        this.knex = knexConfig;
        this.road = road;
        this.listRoads = listRoads;
        this.accessRules = accessRules;
        this.listParams = listParams;
        this.adminRules = adminRules;
        this.router = express.Router();
        this.crudModel = new crudModel(knexConfig, road);   
        this.setRoad();
    }

    setRoad() {
        let baseRoute = '';
        this.listRoads.forEach(road => {
            baseRoute += `/${road}/:${road}Id`
        });
        this.accessRules.forEach((rule) => {
            this.router.use(rule);
        });
        console.log(baseRoute);
        this.router.post(`${baseRoute}/${this.road}`, (req,res) => this.addItem(req, res));
        this.router.get(`${baseRoute}/${this.road}/:${this.road}Id`, (req, res) => this.getItem(req, res));
        this.router.get(`${baseRoute}/${this.road}s`, (req, res) => this.getItems(req, res));
        this.adminRules.forEach((rule) => {
            this.router.use(rule);
        });
        this.router.put(`${baseRoute}/${this.road}/:${this.road}Id`, (req, res) => this.updateItem(req, res));
        this.router.delete(`${baseRoute}/${this.road}/:${this.road}Id`, (req, res) => this.deleteItem(req, res));
    }

    async addItem(req, res) {
        const itemParams = verifUtils.verifParameters(req.body, this.listParams);
        this.listRoads.forEach(road => {
            itemParams[`${road}_id`] = req.params[`${road}Id`];
        })
        const itemId = await this.crudModel.addItem(itemParams);
        const item = await this.crudModel.getItem({ id: itemId });
        await this.renderResponse(item, res);
    }

    async getItem(req, res) {
        const whereParams = {
            id: req.params[`${this.road}Id`]
        }
        this.listRoads.forEach(road => {
            whereParams[`${road}_id`] = req.params[`${road}Id`]
        });
        const item = await this.crudModel.getItem(whereParams);
        await this.renderResponse(item, res);
    }

    async getItems(req, res) {
        let whereParams = {};
        this.listRoads.forEach(road => {
            whereParams[`${road}_id`] = req.params[`${road}Id`]
        })
        const items = await this.crudModel.getItems(whereParams)
        await this.renderResponse(items, res);
    }


    async updateItem(req, res) {
        const whereParams = {
            id: req.params[`${this.road}Id`]
        }
        this.listRoads.forEach(road => {
            whereParams[`${road}_id`] = req.params[`${road}Id`]
        })
        this.listRoads.forEach(road => {
            whereParams[`${road}_id`] = req.params[`${road}Id`]
        });
        const updateParams = verifUtils.updateVerifParameters(req.body, this.listParams);
        await this.crudModel.updateItem(whereParams, updateParams);
        const item = await this.crudModel.getItem(whereParams);
        await this.renderResponse(item, res);
    }

    async deleteItem(req, res) {
        const whereParams = {
            id: req.params[`${this.road}Id`]
        }
        this.listRoads.forEach(road => {
            whereParams[`${road}_id`] = req.params[`${road}Id`]
        })
        await this.crudModel.deleteItem(whereParams);
        const item = await this.crudModel.getItem(whereParams);
        await this.renderResponse(item, res);
    }

    async renderResponse(data, res) {
        await res.send({ status: 200, data });
    }

}

module.exports = Crud;