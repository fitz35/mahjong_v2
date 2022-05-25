
import { compareForSuiteSort } from "../../model/pieces/Combinaison";
import { Piece } from "../../model/pieces/Piece";
import { Famille } from "../../model/pieces/types";
import {sort} from "../../model/utils/sort"

function compare(elt1 : number, elt2 : number) : number {
    if(elt1 > elt2) return 1;
    else if(elt1 === elt2) return 0;
    else return -1;
}

describe('Test the sort algorithme with number', () => {
    it("should run without error on empty array", () =>{
        const toSort : number[] = [];
        sort<number>(toSort, compare);
        expect(toSort).toStrictEqual([]);
    });
    it("should run without error on array with 1 element", () =>{
        const toSort : number[] = [1];
        sort<number>(toSort, compare);
        expect(toSort).toStrictEqual([1]);
    });
    it("should run without error on array with 2 element", () =>{
        const toSort : number[] = [2, 1];
        sort<number>(toSort, compare);
        expect(toSort).toStrictEqual([1, 2]);
    });
    it("should run without error on array with 3 element", () =>{
        const toSort : number[] = [2, 1, 3];
        sort<number>(toSort, compare);
        expect(toSort).toStrictEqual([1, 2, 3]);
    });
    it("should run without error on array with 3 element with same elt", () =>{
        const toSort : number[] = [2, 1, 2];
        sort<number>(toSort, compare);
        expect(toSort).toStrictEqual([1, 2, 2]);
    });

    it("should run without error on array with 10 element with same elt", () =>{
        const toSort : number[] = [2, 1, 2, 45, 0, 46, 80, 40, 40, 40];
        sort<number>(toSort, compare);
        expect(toSort).toStrictEqual([0, 1, 2, 2, 40, 40, 40, 45, 46, 80]);
    });
});

describe('Test the sort algorithme with piece', () => {
    it("should sort correctly 3 character element", () => {
        const toTest = [new Piece("1", Famille.Caractere), new Piece("3", Famille.Caractere), new Piece("2", Famille.Caractere)];
        sort<Piece>(toTest, compareForSuiteSort);
        expect(JSON.stringify(toTest)).toBe(JSON.stringify([new Piece("1", Famille.Caractere), new Piece("2", Famille.Caractere), new Piece("3", Famille.Caractere)]));
    });

});