import { Raca } from "./Raca";
import { Pelagem } from "./Pelagem";

export class Macaco {
    public id : string;
    public nome : string;
    public sexo: string;
    public datanascimento: string;
    public raca : Raca;
    public pelagem : Pelagem;
    public urlfoto : string;
    
    constructor(obj?: Partial<Macaco>) {
        if (obj) {
            this.id = obj.id
            this.nome = obj.nome
            this.raca = obj.raca
            this.pelagem = obj.pelagem
            this.sexo = obj.sexo
            this.datanascimento = obj.datanascimento
            this.urlfoto = obj.urlfoto
         }
    }

    toFirestore() {
        const cachorro =  {
                    id : this.id,
                    nome : this.nome,
                    raca : this.raca,
                    pelagem: this.pelagem,
                    sexo : this.sexo,
                    datanascimento : this.datanascimento,
                    urlfoto : this.urlfoto
         }
         return cachorro
    }

   
    toString() {
        const Objeto = `{
            "id": "${this.id}",
            "nome": "${this.nome}",
            "raca": "${this.raca}",
            "pelagem: "${this.pelagem}",
            "sexo": "${this.sexo}",
            "datanascimento": "${this.datanascimento}",  
            "urlfoto": "${this.urlfoto}"  
        }`
        return Objeto
    }
};