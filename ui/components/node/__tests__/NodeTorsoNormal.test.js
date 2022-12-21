import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import NodeTorsoNormal from '../NodeTorsoNormal.vue';
import * as nodeColors from '../../../colors/nodeColors.mjs';

describe('NodeTorsoNormal.vue', () => {
    let doShallowMount = props => shallowMount(NodeTorsoNormal, { props });

    it('sets background color', () => {
        let wrapper = doShallowMount({
            type: 'Manipulator'
        });
        expect(wrapper.find('.bg').attributes().fill).toBe(nodeColors.Manipulator);
    });

    const nodeTypeCases = Object.entries(nodeColors);

    it.each(nodeTypeCases)('renders node category "%s" as color "%s"', (type, color) => {
        let wrapper = doShallowMount({
            type
        });
        let bgs = wrapper.findAll('.bg');
        expect(bgs.length).toBe(1);
        expect(bgs[0].attributes().fill).toBe(color);
    });

    it('renders plain components', () => {
        let wrapper = doShallowMount({
            isComponent: true
        });
        let bgs = wrapper.findAll('.bg');
        expect(bgs.length).toBe(1);
        expect(bgs[0].attributes().fill).toBe(nodeColors.Component);
        expect(wrapper.find('image').exists()).toBeFalsy();
    });

    it('renders typed components', () => {
        let wrapper = doShallowMount({
            type: 'Learner',
            isComponent: true
        });
        let bgs = wrapper.findAll('.bg');
        expect(bgs.length).toBe(2);
        expect(bgs[0].attributes().fill).toBe(nodeColors.Component);
        expect(bgs[1].attributes().fill).toBe(nodeColors.Learner);
    });

    it('renders icon', () => {
        let wrapper = doShallowMount({
            type: 'Learner',
            kind: 'node',
            icon: 'data:image/0000'
        });

        const nodeIcon = wrapper.find('image');
        expect(nodeIcon.attributes('xlink:href')).toBe('data:image/0000');
    });

    it('uses the correct background and path', () => {
        let wrapper = shallowMount(NodeTorsoNormal, {
            props: {
                type: 'Predictor',
                isComponent: false
            }
        });

        expect(wrapper.findAll('path').length).toBe(1);

        expect(wrapper.find('path').attributes('fill')).toBe(nodeColors.Predictor);
        expect(wrapper.find('path').attributes('d')).toBe('M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0l26.3,0C30.7,0,32,1.3' +
            ',32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H2.8C1.3,32,0,30.7,0,29.2z');

        wrapper = shallowMount(NodeTorsoNormal, {
            props: {
                type: 'ScopeEnd',
                isComponent: false
            }
        });
        expect(wrapper.find('path').attributes('fill')).toBe(nodeColors.ScopeEnd);
        expect(wrapper.find('path').attributes('d')).toBe(
            'M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H4L0,16.1L4,0l25.2,0C30.7,0,32,1.3,32,2.8z'
        );
    });
});
