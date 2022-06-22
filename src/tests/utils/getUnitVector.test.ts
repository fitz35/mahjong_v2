import { getUnitVectorTowardAnOther } from "../../gameEngine/core/dataUtils";


describe("getUnitVector", () => {

    it("should return a unit vector positif for y", () => {
        const vector1 = {x: 1, y: 1};
        const vector2 = {x: 1, y: 2};
        const result = getUnitVectorTowardAnOther(vector1, vector2);
        expect(result).toStrictEqual({x : 0, y : 1});
    });

    it("should return a unit vector negatif for y", () => {
        const vector1 = {x: 1, y: 2};
        const vector2 = {x: 1, y: 1};
        const result = getUnitVectorTowardAnOther(vector1, vector2);
        expect(result).toStrictEqual({x : 0, y : -1});
    });

    it("should return a unit vector negatif for y and x", () => {
        const vector1 = {x: 2, y: 1};
        const vector2 = {x: 1, y: 1};
        const result = getUnitVectorTowardAnOther(vector1, vector2);
        expect(result).toStrictEqual({x : -1, y : 0});
    });

});