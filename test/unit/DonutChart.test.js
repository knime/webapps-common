import { mount } from '@vue/test-utils';
import { Masala, Yellow, Carrot, Cornflower } from '../../../../../webapps-common/ui/colors/knimeColors';

import DonutChart from '~/components/monitoring/DonutChart.vue';

describe('DonutChart.vue', () => {
    const defaultValue = 3;
    const defaultMaxValue = 10;
    const defaultCircumference = 251.32741;
    const precision = 5;
    
    it('renders with default settings', () => {
        const defaultValues = {
            radius: 50,
            innerRadius: 30,
            backgroundStrokeOffset: 0.5,
            smallLabelFontSize: 20,
            regularLabelFontSize: 30,
            regularLabelMaxValue: 999,
            strokeWidth: 20,
            backgroundStrokeWidth: 19.5,
            r: 40,
            diameter: 100,
            strokeDashOffset: 175.929188,
            transform: 'rotate(-90, 50, 50)'
        };

        const wrapper = mount(DonutChart, { propsData: {
            value: defaultValue,
            maxValue: defaultMaxValue
        } });
        expect(wrapper.exists()).toBe(true);
        // props
        expect(wrapper.vm.radius).toBe(defaultValues.radius);
        expect(wrapper.vm.innerRadius).toBe(defaultValues.innerRadius);
        expect(wrapper.vm.displayValues).toBe(false);
        expect(wrapper.vm.additionalLabel).toBe('');
        expect(wrapper.vm.backgroundColor).toBe(Masala);
        expect(wrapper.vm.wedgeColor).toBe(Yellow);

        // data
        expect(wrapper.vm.backgroundStrokeOffset).toBe(defaultValues.backgroundStrokeOffset);
        expect(wrapper.vm.smallLabelFontSize).toBe(defaultValues.smallLabelFontSize);
        expect(wrapper.vm.regularLabelFontSize).toBe(defaultValues.regularLabelFontSize);
        expect(wrapper.vm.regularLabelMaxValue).toBe(defaultValues.regularLabelMaxValue);

        // computed
        expect(wrapper.vm.clippedValue).toBe(defaultValue);
        expect(wrapper.vm.strokeWidth).toBe(defaultValues.strokeWidth);
        expect(wrapper.vm.backgroundStrokeWidth).toBe(defaultValues.backgroundStrokeWidth);
        expect(wrapper.vm.r).toBe(defaultValues.r);
        expect(wrapper.vm.diameter).toBe(defaultValues.diameter);
        expect(wrapper.vm.circumference).toBeCloseTo(defaultCircumference, precision);
        expect(wrapper.vm.strokeDashOffset).toBeCloseTo(defaultValues.strokeDashOffset, precision);
        expect(wrapper.vm.transformWedge).toBe(defaultValues.transform);
        expect(wrapper.vm.displayLabel).toBe(false);
        expect(wrapper.vm.maxValueString).toBe(String(defaultMaxValue));

        // template
        expect(wrapper.find('svg').exists()).toBe(true);
        let bgCircle = wrapper.find('circle.background-circle');
        expect(bgCircle.exists()).toBe(true);
        expect(bgCircle.attributes('cx')).toBe(String(defaultValues.radius));
        expect(bgCircle.attributes('cy')).toBe(String(defaultValues.radius));
        expect(bgCircle.attributes('r')).toBe(String(defaultValues.r));
        expect(bgCircle.attributes('stroke')).toBe(Masala);
        expect(bgCircle.attributes('stroke-width')).toBe(String(defaultValues.backgroundStrokeWidth));
        let wedge = wrapper.find('circle.value-wedge');
        expect(wedge.exists()).toBe(true);
        expect(wedge.attributes('cx')).toBe(String(defaultValues.radius));
        expect(wedge.attributes('cy')).toBe(String(defaultValues.radius));
        expect(wedge.attributes('r')).toBe(String(defaultValues.r));
        expect(wedge.attributes('stroke')).toBe(Yellow);
        expect(wedge.attributes('stroke-width')).toBe(String(defaultValues.strokeWidth));
        expect(Number(wedge.attributes('stroke-dasharray')))
            .toBeCloseTo(defaultCircumference, precision);
        expect(Number(wedge.attributes('stroke-dashoffset')))
            .toBeCloseTo(defaultValues.strokeDashOffset, precision);
        expect(wedge.attributes('transform')).toBe(defaultValues.transform);
        expect(wrapper.find('div.value-label').exists()).toBe(false);
        expect(wrapper.find('div.additional-label').exists()).toBe(false);
    });

    it('sets radius', () => {
        const radius = 100;
        let expectedWidth = '200';
        let expectedR = '65';
        
        const wrapper = mount(DonutChart, { propsData: {
            value: defaultValue,
            maxValue: defaultMaxValue,
            radius
        } });
        expect(wrapper.vm.radius).toBe(radius);
        let svg = wrapper.find('svg');
        expect(svg.exists()).toBe(true);
        expect(svg.attributes('width')).toBe(expectedWidth);
        let bgCircle = wrapper.find('circle.background-circle');
        expect(bgCircle.exists()).toBe(true);
        expect(bgCircle.attributes('r')).toBe(expectedR);
        let wedge = wrapper.find('circle.value-wedge');
        expect(wedge.exists()).toBe(true);
        expect(wedge.attributes('r')).toBe(expectedR);
    });

    it('sets inner radius', () => {
        const innerRadius = 40;
        let expectedWidth = '100';
        let expectedR = '45';
        
        const wrapper = mount(DonutChart, { propsData: {
            value: defaultValue,
            maxValue: defaultMaxValue,
            innerRadius
        } });
        expect(wrapper.vm.innerRadius).toBe(innerRadius);
        let svg = wrapper.find('svg');
        expect(svg.exists()).toBe(true);
        expect(svg.attributes('width')).toBe(expectedWidth);
        let bgCircle = wrapper.find('circle.background-circle');
        expect(bgCircle.exists()).toBe(true);
        expect(bgCircle.attributes('r')).toBe(expectedR);
        let wedge = wrapper.find('circle.value-wedge');
        expect(wedge.exists()).toBe(true);
        expect(wedge.attributes('r')).toBe(expectedR);
    });

    it('displays value labels', () => {
        const wrapper = mount(DonutChart, { propsData: {
            value: defaultValue,
            maxValue: defaultMaxValue,
            displayValues: true
        } });

        expect(wrapper.vm.displayValues).toBe(true);
        expect(wrapper.vm.displayLabel).toBe(false);
        expect(wrapper.find('svg').exists()).toBe(true);
        let label = wrapper.find('div.value-label');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('3 / 10');
        expect(label.attributes('style')).toContain('font-size: 30px');
        expect(wrapper.find('div.additional-label').exists()).toBe(false);
    });

    it('displays small labels for large values', () => {
        let wrapper = mount(DonutChart, { propsData: {
            value: defaultValue,
            maxValue: 1023,
            displayValues: true
        } });
        expect(wrapper.vm.displayValues).toBe(true);
        expect(wrapper.vm.displayLabel).toBe(false);
        let label = wrapper.find('div.value-label');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('3 / 1023');
        expect(label.attributes('style')).toContain('font-size: 20px');

        wrapper = mount(DonutChart, { propsData: {
            value: 1021,
            maxValue: 1023,
            displayValues: true
        } });
        expect(wrapper.vm.displayValues).toBe(true);
        expect(wrapper.vm.displayLabel).toBe(false);
        label = wrapper.find('div.value-label');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('1021 / 1023');
        expect(label.attributes('style')).toContain('font-size: 20px');
    });

    it('does not display a label when values are not shown', () => {
        let wrapper = mount(DonutChart, { propsData: {
            value: defaultValue,
            maxValue: defaultMaxValue,
            displayValues: false,
            additionalLabel: '007'
        } });
        expect(wrapper.vm.displayValues).toBe(false);
        expect(wrapper.find('div.value-label').exists()).toBe(false);
        expect(wrapper.vm.displayLabel).toBe(false);
        expect(wrapper.find('div.additional-label').exists()).toBe(false);
    });

    it('displays an additional label', () => {
        const wrapper = mount(DonutChart, { propsData: {
            value: defaultValue,
            maxValue: defaultMaxValue,
            displayValues: true,
            additionalLabel: '007'
        } });
        expect(wrapper.vm.displayValues).toBe(true);
        expect(wrapper.vm.displayLabel).toBe(true);
        let label = wrapper.find('div.value-label');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('3 / 10');
        let additionalLabel = wrapper.find('div.additional-label');
        expect(additionalLabel.exists()).toBe(true);
        expect(additionalLabel.text()).toBe('007');
    });

    it('sets colors', () => {
        const wrapper = mount(DonutChart, { propsData: {
            value: defaultValue,
            maxValue: defaultMaxValue,
            backgroundColor: Cornflower,
            wedgeColor: Carrot
        } });
        let bgCircle = wrapper.find('circle.background-circle');
        expect(bgCircle.exists()).toBe(true);
        expect(bgCircle.attributes('stroke')).toBe(Cornflower);
        let wedge = wrapper.find('circle.value-wedge');
        expect(wedge.exists()).toBe(true);
        expect(wedge.attributes('stroke')).toBe(Carrot);
    });

    it('handles infinity as maximum value', () => {
        const wrapper = mount(DonutChart, { propsData: {
            value: 42,
            maxValue: Infinity,
            displayValues: true
        } });
        expect(wrapper.vm.maxValueString).toBe('∞');
        let label = wrapper.find('div.value-label');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('42 / ∞');

        let wedge = wrapper.find('circle.value-wedge');
        expect(Number(wedge.attributes('stroke-dashoffset'))).toBeCloseTo(defaultCircumference, precision);
    });

    it('handles values larger than maximum', () => {
        const wrapper = mount(DonutChart, { propsData: {
            value: 1021,
            maxValue: defaultMaxValue,
            displayValues: true,
            acceptValuesLargerThanMax: true
        } });
        expect(wrapper.vm.displayValues).toBe(true);
        let label = wrapper.find('div.value-label');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('1021 / 10');

        let wedge = wrapper.find('circle.value-wedge');
        expect(Number(wedge.attributes('stroke-dashoffset'))).toBe(0);
    });

    it('handles values smaller than 0', () => {
        const wrapper = mount(DonutChart, { propsData: {
            value: -42,
            maxValue: defaultMaxValue,
            displayValues: true
        } });
        expect(wrapper.vm.displayValues).toBe(true);
        let label = wrapper.find('div.value-label');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('0 / 10');

        let wedge = wrapper.find('circle.value-wedge');
        expect(Number(wedge.attributes('stroke-dashoffset'))).toBeCloseTo(defaultCircumference, precision);
    });

    it('handles maximum of 0', () => {
        const wrapper = mount(DonutChart, { propsData: {
            value: defaultValue,
            maxValue: 0,
            displayValues: true
        } });
        expect(wrapper.vm.displayValues).toBe(true);
        let label = wrapper.find('div.value-label');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('0 / 0');

        let wedge = wrapper.find('circle.value-wedge');
        expect(Number(wedge.attributes('stroke-dashoffset'))).toBeCloseTo(defaultCircumference, precision);
    });
});
