class CrudModel {
    constructor(knex, table) {
        this.knex = knex;
        this.table = table + 's';
    }

    async addItem(item) {
        try {
            const itemId = await knex(this.table)
                .insert(item)
                .returning('id');
            return id;
        }
        catch (err) {
            console.log(err);
            throw new Error("Internal Error");
        }
    }
}