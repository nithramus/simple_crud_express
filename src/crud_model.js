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

    async getItems(whereParams) {
        try {
            const items = await this.knex(this.table)
                .where(whereParams);
            return items;
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