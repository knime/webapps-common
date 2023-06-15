/* eslint-disable vitest/max-nested-describe */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines */
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';


import ImageRenderer from '../ImageRenderer.vue';


describe('ImageRenderer.vue', () => {
    let props;

    beforeEach(() => {
        props = { url: 'testUrl' };
    });

    it('sets url', () => {
        const wrapper = mount(ImageRenderer, { props });
        expect(wrapper.find('img').attributes().src).toBe(props.url);
    });

    it('sets width and height if provided', () => {
        props.width = 10;
        props.height = 20;
        const wrapper = mount(ImageRenderer, { props });
        expect(wrapper.find('img').attributes().src).toBe(`${props.url}?w=${props.width}&h=${props.height}`);
    });
});
