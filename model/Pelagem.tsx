export class Pelagem {
    public id : string;
    public pelagem : string;

    constructor(obj?: Partial<Pelagem>) {
        if (obj) {
            this.id = obj.id
            this.pelagem = obj.pelagem
        }
    }

    toFirestore() {
        const pelagem =  {
            id : this.id,
            pelagem : this.pelagem,
         }
         return pelagem
    }

        toString() {
            const Objeto = `{
                "id": "${this.id}",
                "pelagem": "${this.pelagem}",
            }`
            return Objeto

    }

};