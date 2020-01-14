import { mount } from '@vue/test-utils';

import DoubleWidget from '@/components/widgets/input/DoubleWidget.vue';
import IntegerWidget from '@/components/widgets/input/IntegerWidget.vue';
import NumberInput from '@/components/widgets/baseElements/input/NumberInput.vue';

/* eslint-disable no-magic-numbers */
describe('NumberInput.vue', () => {
    let propsData, propsData2;

    beforeEach(() => {
        propsData = {
            nodeConfig: {
                '@class': 'org.knime.js.core.JSONWebNode',
                namespace: 'knimeDoubleWidget',
                viewValue: null,
                customCSS: '',
                stylesheets: [
                    '/js-lib/font-awesome/4_7_0/css/font-awesome.min.css',
                    '/js-lib/knime/service/knime.css',
                    '/js-lib/jQueryUI/min/themes/base/jquery-ui.min.css',
                    '/org/knime/js/base/util/quickform/quickformStyles.css'
                ],
                initMethodName: 'init',
                validateMethodName: 'validate',
                setValidationErrorMethodName: 'setValidationErrorMessage',
                viewRepresentation: {
                    '@class': 'org.knime.js.base.node.base.input.dbl.DoubleNodeRepresentation',
                    label: 'This is the label. ',
                    description: 'This is the description. Now its super super super super super' +
                ' super super super super super super super super super super super super super' +
                ' super super super super super super super super super super super super super long.',
                    required: true,
                    defaultValue: {
                        '@class': 'org.knime.js.base.node.base.input.dbl.DoubleNodeValue',
                        double: 0
                    },
                    currentValue: {
                        '@class': 'org.knime.js.base.node.base.input.dbl.DoubleNodeValue',
                        double: 0
                    },
                    usemin: false,
                    usemax: false,
                    min: 0,
                    max: 1
                },
                nodeInfo: {
                    '@class': 'org.knime.js.core.JSONWebNodeInfo',
                    nodeAnnotation: '',
                    nodeName: 'Double Widget',
                    nodeState: 'executed',
                    nodeWarnMessage: null,
                    nodeErrorMessage: null,
                    displayPossible: true
                },
                javascriptLibraries: [
                    '/js-lib/knime/service/knime_service_1_0_0.js',
                    '/js-lib/jQuery/jquery-1.11.0.min.js',
                    '/js-lib/jQueryUI/min/ui/jquery-ui.min.js',
                    '/org/knime/js/base/util/quickform/knime_quickform_utils_1_0_0.js',
                    '/org/knime/js/base/node/widget/input/double/doubleWidget.js'
                ],
                getViewValueMethodName: 'value'
            },
            nodeId: '9:0:16',
            isValid: false
        };

        propsData2 = {
            nodeConfig: {
                '@class': 'org.knime.js.core.JSONWebNode',
                namespace: 'knimeIntegerWidget',
                viewValue: null,
                customCSS: '',
                stylesheets: [
                    '/js-lib/font-awesome/4_7_0/css/font-awesome.min.css',
                    '/js-lib/knime/service/knime.css',
                    '/js-lib/jQueryUI/min/themes/base/jquery-ui.min.css',
                    '/org/knime/js/base/util/quickform/quickformStyles.css'
                ],
                initMethodName: 'init',
                validateMethodName: 'validate',
                setValidationErrorMethodName: 'setValidationErrorMessage',
                viewRepresentation: {
                    '@class': 'org.knime.js.base.node.base.input.integer.IntegerNodeRepresentation',
                    label: 'This is the label',
                    description: 'This is the description. (with maximum)',
                    required: true,
                    defaultValue: {
                        '@class': 'org.knime.js.base.node.base.input.integer.IntegerNodeValue',
                        integer: 0
                    },
                    currentValue: {
                        '@class': 'org.knime.js.base.node.base.input.integer.IntegerNodeValue',
                        integer: 0
                    },
                    usemin: false,
                    usemax: true,
                    min: 0,
                    max: 100
                },
                nodeInfo: {
                    '@class': 'org.knime.js.core.JSONWebNodeInfo',
                    nodeAnnotation: '',
                    nodeName: 'Integer Widget',
                    nodeState: 'executed',
                    nodeWarnMessage: null,
                    nodeErrorMessage: null,
                    displayPossible: true
                },
                javascriptLibraries: [
                    '/js-lib/knime/service/knime_service_1_0_0.js',
                    '/js-lib/jQuery/jquery-1.11.0.min.js',
                    '/js-lib/jQueryUI/min/ui/jquery-ui.min.js',
                    '/org/knime/js/base/util/quickform/knime_quickform_utils_1_0_0.js',
                    '/org/knime/js/base/node/widget/input/integer/integerWidget.js'
                ],
                getViewValueMethodName: 'value'
            },
            nodeId: '11:0:14',
            isValid: false
        };
    });

    it('renders', () => {
        let wrapper = mount(DoubleWidget, {
            propsData
        });
        expect(wrapper.find(NumberInput).html()).toBeTruthy();
        expect(wrapper.find(NumberInput).isVisible()).toBeTruthy();
    });

    it('invalidates string values', () => {
        // propsData.nodeConfig.viewRepresentation.currentValue.double = NaN;
        let wrapper = mount(DoubleWidget, {
            propsData
        });

        wrapper.find(NumberInput).vm.$el.childNodes[0].value = 'stringValue';

        let numericInputComponent = wrapper.find(NumberInput);
        expect(numericInputComponent.vm.validate()).toBe(false);
    });

    it('invalidates values lower than its min', () => {
        propsData.nodeConfig.viewRepresentation.currentValue.double = -1;
        propsData.nodeConfig.viewRepresentation.usemin = true;
        let wrapper = mount(DoubleWidget, {
            propsData
        });

        let numericInputComponent = wrapper.find(NumberInput);
        expect(numericInputComponent.vm.validate()).toBe(false);
    });

    it('invalidates values higher than its max', () => {
        propsData.nodeConfig.viewRepresentation.currentValue.double = 1.6;
        propsData.nodeConfig.viewRepresentation.usemax = true;
        let wrapper = mount(DoubleWidget, {
            propsData
        });

        let numericInputComponent = wrapper.find(NumberInput);
        expect(numericInputComponent.vm.validate()).toBe(false);
    });

    it('correctly emulates double inputs', () => {
        let wrapper = mount(DoubleWidget, {
            propsData
        });
        const doubleStepSize = 0.1;

        let numericInputComponent = wrapper.find(NumberInput);
        expect(numericInputComponent.vm.stepSize).toBe(doubleStepSize);
    });

    it('correctly emulates integer inputs', () => {
        let wrapper = mount(IntegerWidget, {
            propsData: propsData2
        });
        const intStepSize = 1;

        let numericInputComponent = wrapper.find(NumberInput);
        expect(numericInputComponent.vm.stepSize).toBe(intStepSize);
    });

    it('handles mouseup events', () => {
        let wrapper = mount(DoubleWidget, {
            propsData
        });

        let numericInputComponent = wrapper.find(NumberInput);
        numericInputComponent.find('.knime-increase').trigger('mouseup');
        expect(numericInputComponent.emitted().updateValue).toBeTruthy();
    });

    it('handles mouseleave events', () => {
        let wrapper = mount(IntegerWidget, {
            propsData: propsData2
        });
        let testSpy = 0;
        const changeValueMock = (diff) => {
            testSpy += diff;
        };
        let numericInputComponent = wrapper.find(NumberInput);
        numericInputComponent.vm.changeValue = changeValueMock;

        numericInputComponent.find('.knime-increase').trigger('mouseleave');
        expect(testSpy).toBe(0);
        numericInputComponent.setData({ clicked: true });
        numericInputComponent.find('.knime-increase').trigger('mouseleave');
        expect(testSpy).toBe(1);
        numericInputComponent.setData({ clicked: true });
        numericInputComponent.find('.knime-decrease').trigger('mouseleave');
        expect(testSpy).toBe(0);
    });

    it('handles mousedown events', () => {
        jest.useFakeTimers();
        let wrapper = mount(DoubleWidget, {
            propsData
        });

        let numericInputComponent = wrapper.find(NumberInput);
        let originalValue = 0;

        expect(numericInputComponent.vm.getValue()).toBe(originalValue);
        expect(numericInputComponent.vm.spinnerArrowTimeout).toBeFalsy();
        expect(numericInputComponent.vm.spinnerArrowInterval).toBeFalsy();

        numericInputComponent.find('.knime-increase').trigger('mousedown');

        expect(numericInputComponent.vm.spinnerArrowTimeout).toBeTruthy();
        expect(numericInputComponent.vm.spinnerArrowInterval).toBeFalsy();
        jest.advanceTimersByTime(250);
        expect(numericInputComponent.vm.spinnerArrowInterval).toBeTruthy();
        jest.advanceTimersByTime(250);
        expect(numericInputComponent.vm.getValue()).toBeGreaterThan(originalValue);
    });

    // test should return fallbacks when values high
    it('mimics native behavior for value overflow', () => {
        let wrapper = mount(IntegerWidget, {
            propsData: propsData2
        });
        let numericInputComponent = wrapper.find(NumberInput);
        numericInputComponent.vm.$el.childNodes[0].value = 200;
        numericInputComponent.vm.changeValue(-1, {});
        expect(numericInputComponent.vm.getValue()).toBe(99);
    });

    // test should return fallbacks when values low
    it('mimics native behavior for value underflow', () => {
        let wrapper = mount(IntegerWidget, {
            propsData: propsData2
        });
        let numericInputComponent = wrapper.find(NumberInput);
        numericInputComponent.setProps({ min: 0 });
        numericInputComponent.vm.$el.childNodes[0].value = -200;
        numericInputComponent.vm.changeValue(1, {});
        expect(numericInputComponent.vm.getValue()).toBe(1);
    });

    // test should return fallbacks when values cannot be parsed
    it('mimics native behavior for invalid value', () => {
        let wrapper = mount(IntegerWidget, {
            propsData: propsData2
        });
        let numericInputComponent = wrapper.find(NumberInput);
        numericInputComponent.vm.$el.childNodes[0].value = 50;
        expect(numericInputComponent.vm.getValue()).toBe(50);
        numericInputComponent.vm.$el.childNodes[0].value = '-';
        numericInputComponent.vm.changeValue(1, {});
        expect(numericInputComponent.vm.getValue()).toBe(1);
    });
});
