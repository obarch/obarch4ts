import * as qjson from "./qjson";

test('basic', () => {
    expect(qjson.parse(`[]`)).toEqual([]);
});


