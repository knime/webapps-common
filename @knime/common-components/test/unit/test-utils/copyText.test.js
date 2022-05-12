import { copyText } from '~/util/copyText';


describe('copyText', () => {
    beforeAll(() => {
        document.execCommand = jest.fn();
    });

    it('copies text', () => {
        const text = '/bla/foo/clap';
        copyText(text);
        expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
});
