import {DecoderSource} from "./DecoderSource";

test('decodeNull', () => {
    expect(new DecoderSource('null').decodeNull()).toBeTruthy();
    expect(new DecoderSource('nul').decodeNull()).toBeFalsy();
    expect(new DecoderSource('none').decodeNull()).toBeFalsy();
});


