class CrudModel {
    constructor(knex, table) {
        this.knex = knex;
        this.table = table + 's';
    }

    async addItem(item) {
        try {
            const itemId = await this.knex(this.table)
                .insert(item)
                .returning('id');
            return itemId;
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async getItem(id) {
        try {
            const items = await this.knex(this.table)
                .where(id);
            return items;
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async getItems(whereParams, linkedTable) {
        try {
            const request = this.knex(this.table)
            if (linkedTable) {
                const obj ={};
                obj[`${linkedTable.valueName}`] = linkedTable.value
                request.innerJoin(linkedTable.table, linkedTable.road_item_name, linkedTable.table_item_name)
                .where(obj)
            }
            else {
                request.where(whereParams);
            }
            const items = await request;
            return items;
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async updateItem(whereParams, updateParams) {
        try {
            console.log({updateParams}, {whereParams});
            await this.knex(this.table)
                .where(whereParams)
                .update(updateParams);
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }

    async deleteItem(whereParams) {
        try {
            await this.knex(this.table)
                .where(whereParams)
                .del();
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
}

module.exports = CrudModel;