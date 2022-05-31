import { compareSet } from "../../model/utils/setUtils";
import {ModificateurCombi} from "../../model/dataModel/dataUtils";

// test the compareSet function 
describe("Test compareSet", () => {
    it("should return true if the two sets are equal", () => {
        let set1 = new Set<number>();
        set1.add(1);
        set1.add(2);
        set1.add(3);
        let set2 = new Set<number>();
        set2.add(1);
        set2.add(2);
        set2.add(3);
        expect(compareSet(set1, set2)).toBe(true);
    });
    it("should return false if the two sets are not equal", () => {
        let set1 = new Set<number>();
        set1.add(1);
        set1.add(2);
        set1.add(3);
        let set2 = new Set<number>();
        set2.add(1);
        set2.add(2);
        set2.add(4);
        expect(compareSet(set1, set2)).toBe(false);
    });
    it("should return true for every set", () =>{
        // genere 15 sets of different sizes and compare them
        for(let i = 0; i < 15; i++){
            let set1 = new Set<number>();
            let set2 = new Set<number>();
            for(let j = 0; j < i; j++){
                set1.add(j);
            }
            for(let j = i - 1; j >= 0; j--){
                set2.add(j);
            }
            expect(compareSet(set1, set2)).toBe(true);
        }

    });
    it("should return true for array object to", () =>{
        // compare two set of 3 array
        let set1 = new Set<ModificateurCombi>([
            ModificateurCombi.Dominant,
            ModificateurCombi.ExtremNumero,
        ]);
        let set2 = new Set<ModificateurCombi>([
            ModificateurCombi.Dominant,
            ModificateurCombi.ExtremNumero,
        ]);;
        expect(compareSet(set1, set2)).toBe(true);
        
    });
    

});