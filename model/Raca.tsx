export class Raca {
    public id : string;
    public raca : string;

    constructor(obj?: Partial<Raca>) {
        if (obj) {
            this.id = obj.id
            this.raca = obj.raca
        }
    }

    toFirestore() {
        const raca =  {
            id : this.id,
            raca : this.raca,
         }
         return raca
    }

        toString() {
            const Objeto = `{
                "id": "${this.id}",
                "raca": "${this.raca}",
            }`
            return Objeto

    }

};