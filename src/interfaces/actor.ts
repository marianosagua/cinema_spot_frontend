export interface Actor {
    id:          number;
    first_name:  string;
    last_name:   string;
    age:         number;
    nationality: Nationality;
}

export enum Nationality {
    Australiano = "Australiano",
    Británico = "Británico",
    Canadiense = "Canadiense",
    Estadounidense = "Estadounidense",
}
