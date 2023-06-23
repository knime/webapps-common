/* eslint-disable vitest/max-nested-describe */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines */
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from 'vuex';

import * as vuexModule from 'vuex';


import ImageRenderer from '../ImageRenderer.vue';


describe('ImageRenderer.vue', () => {
    let props, context;

    const getUiExtResourceLocation = vi.fn(({ resourceInfo }) => resourceInfo.baseUrl + resourceInfo.path);

    beforeEach(() => {
        props = { baseUrl: 'baseUrl', path: 'path' };
        const store = createStore({
            modules: {
                api: {
                    getters: {
                        uiExtResourceLocation:
                            () => getUiExtResourceLocation
                    },
                    namespaced: true
                }
            }
        });

        vi.spyOn(vuexModule, 'useStore').mockReturnValue(store);

        context = {
            props,
            global: {
                mocks: {
                    $store: store
                }
            }
        };
    });

    it('sets url', () => {
        const wrapper = mount(ImageRenderer, context);
        const resourceInfo = {
            baseUrl: props.baseUrl,
            path: props.path
        };
        expect(getUiExtResourceLocation).toHaveBeenCalledWith({ resourceInfo });
        expect(wrapper.find('img').attributes().src).toBe(
            getUiExtResourceLocation({ resourceInfo })
        );
    });

    it('sets width and height if provided', () => {
        props.width = 10;
        props.height = 20;
        const wrapper = mount(ImageRenderer, context);
        const resourceInfo = {
            baseUrl: props.baseUrl,
            path: props.path
        };
        expect(wrapper.find('img').attributes().src).toBe(
            `${getUiExtResourceLocation({ resourceInfo })}?w=${props.width}&h=${props.height}`
        );
    });

    it('does not update src if desired', async () => {
        props.width = 10;
        props.height = 20;
        props.update = false;
        const resourceInfo = {
            baseUrl: props.baseUrl,
            path: props.path
        };
        const wrapper = mount(ImageRenderer, context);
        const initialSrc = `${getUiExtResourceLocation({ resourceInfo })}?w=${props.width}&h=${props.height}`;
        expect(wrapper.find('img').attributes().src).toBe(initialSrc);

        const newProps = {
            width: 123,
            height: 123
        };
        await wrapper.setProps(newProps);
        expect(wrapper.find('img').attributes().src).toBe(initialSrc);
        
        await wrapper.setProps({
            update: true
        });
        expect(wrapper.find('img').attributes().src).toBe(
            `${getUiExtResourceLocation({ resourceInfo })}?w=${newProps.width}&h=${newProps.height}`
        );
    });
});
