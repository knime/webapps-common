import { mount } from '@vue/test-utils';

import TimePartInput from '../../ui/components/forms/TimePartInput';
import DateTimeInput from '../../ui/components/forms/DateTimeInput';


import { getDayOfYear, getHours, getMinutes, getSeconds, getMilliseconds, getDate, getMonth, getYear } from 'date-fns';

describe('DateTimeInput.vue', () => {
    let context, propsData;

    beforeEach(() => {
        propsData = {
            value: new Date('2020-05-03T09:54:55'),
            id: 'dateTimeInputID',
            min: null,
            max: null,
            isValid: true,
            showSeconds: true,
            showMilliseconds: true,
            showTime: true,
            showDate: true,
            required: false,
            timezone: 'Europe/Berlin'
        };
        context = {
            // this is required due to the bug: https://github.com/vuejs/vue-test-utils/issues/1130
            sync: false
        };
    });

    describe('renders', () => {

        it('renders with datepicker and time', async () => {
            const DatePicker = (await import('v-calendar/lib/components/date-picker.umd')).default;
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData,
                stubs: DatePicker
            });
            expect(wrapper.html()).toBeTruthy();
            expect(wrapper.isVisible()).toBeTruthy();
            expect(wrapper.find({ ref: 'datePicker' }).isVisible()).toBeTruthy();
            // eslint-disable-next-line no-magic-numbers
            expect(wrapper.findAll(TimePartInput).length).toBe(4);
        });

        it('renders without time', () => {
            propsData.showTime = false;
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            expect(wrapper.html()).toBeTruthy();
            expect(wrapper.isVisible()).toBeTruthy();
            expect(wrapper.find({ ref: 'datePicker' }).isVisible()).toBeTruthy();
            expect(wrapper.findAll(TimePartInput).exists()).toBeFalsy();
        });

        it('renders without date', () => {
            propsData.showDate = false;
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            expect(wrapper.html()).toBeTruthy();
            expect(wrapper.isVisible()).toBeTruthy();
            expect(wrapper.find({ ref: 'datePicker' }).exists()).toBeFalsy();
            expect(wrapper.findAll(TimePartInput).exists()).toBeTruthy();
        });

        it('renders without milliseconds and seconds', () => {
            propsData.showSeconds = false;
            propsData.showMilliseconds = false;
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            expect(wrapper.findAll(TimePartInput).length).toBe(2);
        });

        it('has default props', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData: {
                    value: new Date()
                }
            });
            expect(wrapper.html()).toBeTruthy();
            expect(wrapper.isVisible()).toBeTruthy();
            expect(wrapper.find({ ref: 'datePicker' }).isVisible()).toBeTruthy();
        });

    });

    describe('updates', () => {

        it('updates date on datepicker changes', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            const d = new Date('2020-05-05T15:34:25');
            wrapper.find({ ref: 'datePicker' }).vm.$emit('input', d);

            expect(wrapper.emitted().input).toBeTruthy();
            expect(getDayOfYear(wrapper.emitted().input[0][0])).toStrictEqual(getDayOfYear(d));
        });

        it('updates date if datepicker emits @input', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            const d = new Date('2020-05-05T15:34:25');
            wrapper.find({ ref: 'datePicker' }).vm.$emit('input', d);

            expect(wrapper.emitted().input).toBeTruthy();
            expect(getDayOfYear(wrapper.emitted().input[0][0])).toStrictEqual(getDayOfYear(d));
        });

        it('updates date on manual input to date field', () => {
            propsData.dateFormat = 'yyyy-MM-dd';
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            const dayOfMonth = 22;
            const month = 11;
            const year = 2019;
            const input = `${year}-${month}-${dayOfMonth}`;

            // <input> is inside of the slot
            wrapper.vm.onTextInputChange({ target: { value: input } }, () => '');

            expect(wrapper.emitted().input).toBeTruthy();
            const date = wrapper.emitted().input[0][0];

            expect(getDate(date)).toStrictEqual(dayOfMonth);
            expect(getMonth(date)).toStrictEqual(month - 1);
            expect(getYear(date)).toStrictEqual(year);
        });

        it('does not update date if invalid input is entered', () => {
            propsData.value = new Date('2020-05-03T09:54:55');
            propsData.dateFormat = 'yyyy-MM-dd';
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            // <input> is inside of the slot
            wrapper.vm.onTextInputChange({ target: { value: 'asdf' } }, () => '');

            expect(wrapper.emitted().input).toBeTruthy();
            const date = wrapper.emitted().input[0][0];

            expect(getDate(date)).toStrictEqual(getDate(propsData.value));
            expect(getMonth(date)).toStrictEqual(getMonth(propsData.value));
            expect(getYear(date)).toStrictEqual(getYear(propsData.value));
        });

        it('updates hours if input changes', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            const hours = 11;
            wrapper.find({ ref: 'hours' }).vm.$emit('input', hours);

            expect(wrapper.emitted().input).toBeTruthy();
            expect(getHours(wrapper.emitted().input[0][0])).toStrictEqual(hours);
            expect(getDayOfYear(wrapper.emitted().input[0][0])).toStrictEqual(getDayOfYear(propsData.value));
        });

        it('updates minutes if input changes', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            const minutes = 23;
            wrapper.find({ ref: 'minutes' }).vm.$emit('input', minutes);

            expect(wrapper.emitted().input).toBeTruthy();
            expect(getMinutes(wrapper.emitted().input[0][0])).toStrictEqual(minutes);
            expect(getDayOfYear(wrapper.emitted().input[0][0])).toStrictEqual(getDayOfYear(propsData.value));
        });

        it('updates seconds if input changes', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            const seconds = 12;
            wrapper.find({ ref: 'seconds' }).vm.$emit('input', seconds);

            expect(wrapper.emitted().input).toBeTruthy();
            expect(getSeconds(wrapper.emitted().input[0][0])).toStrictEqual(seconds);
            expect(getDayOfYear(wrapper.emitted().input[0][0])).toStrictEqual(getDayOfYear(propsData.value));
        });

        it('updates milliseconds if input changes', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            const milliseconds = 234;
            wrapper.find({ ref: 'milliseconds' }).vm.$emit('input', milliseconds);

            expect(wrapper.emitted().input).toBeTruthy();
            expect(getMilliseconds(wrapper.emitted().input[0][0])).toStrictEqual(milliseconds);
            expect(getDayOfYear(wrapper.emitted().input[0][0])).toStrictEqual(getDayOfYear(propsData.value));
        });

    });

    describe('over- and underflow of time values', () => {

        it('updates days on overflow of hours', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            wrapper.find({ ref: 'hours' }).vm.$emit('bounds', { type: 'max', input: 25 });
            expect(wrapper.emitted().input[0][0]).toStrictEqual(new Date('2020-05-04T01:54:55'));
        });

        it('keep day on overflow of hours if date is not shown', () => {
            propsData.showDate = false;
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            wrapper.find({ ref: 'hours' }).vm.$emit('bounds', { type: 'max', input: 25 });
            expect(wrapper.emitted().input).toBeUndefined();
        });

        it('updates days on underflow of hours', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            // the -1 is not a relative value but an absolute one
            wrapper.find({ ref: 'hours' }).vm.$emit('bounds', { type: 'min', input: -1 });
            expect(wrapper.emitted().input[0][0]).toStrictEqual(new Date('2020-05-02T23:54:55'));
        });

        it('updates hours on overflow of minutes', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            wrapper.find({ ref: 'minutes' }).vm.$emit('bounds', { type: 'min', input: 63 });
            expect(wrapper.emitted().input[0][0]).toStrictEqual(new Date('2020-05-03T10:03:55'));
        });

        it('updates hours on underflow of minutes', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            wrapper.find({ ref: 'minutes' }).vm.$emit('bounds', { type: 'min', input: -1 });
            expect(wrapper.emitted().input[0][0]).toStrictEqual(new Date('2020-05-03T08:59:55'));
        });

        it('updates minutes on overflow of seconds', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            wrapper.find({ ref: 'seconds' }).vm.$emit('bounds', { type: 'max', input: 61 });
            expect(wrapper.emitted().input[0][0]).toStrictEqual(new Date('2020-05-03T09:55:01'));
        });

        it('updates minutes on underflow of seconds', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            wrapper.find({ ref: 'seconds' }).vm.$emit('bounds', { type: 'min', input: -1 });
            expect(wrapper.emitted().input[0][0]).toStrictEqual(new Date('2020-05-03T09:53:59'));
        });

        it('updates seconds on overflow of milliseconds', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            wrapper.find({ ref: 'milliseconds' }).vm.$emit('bounds', { type: 'max', input: 1000 });
            expect(wrapper.emitted().input[0][0]).toStrictEqual(new Date('2020-05-03T09:54:56'));
        });

        it('updates seconds on underflow of milliseconds', () => {
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });
            wrapper.find({ ref: 'milliseconds' }).vm.$emit('bounds', { type: 'min', input: -1 });
            expect(wrapper.emitted().input[0][0]).toStrictEqual(new Date('2020-05-03T09:54:54.999'));
        });

    });

    describe('validates', () => {

        it('invalidates values earlier than min date', () => {
            propsData.value = new Date('2020-05-03T09:54:50');
            propsData.min = new Date('2020-05-03T09:54:54');
            propsData.max = new Date('2020-05-03T09:54:56');
            propsData.dateFormat = 'yyy-MM-dd';
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });

            const validation = wrapper.vm.validate();
            expect(validation.isValid).toBeFalsy();
            expect(validation.errorMessage).toBe('2020-05-03 09:54:50 is before minimum 2020-05-03 09:54:54');
        });

        it('invalidates values later than max date', () => {
            propsData.value = new Date('2020-05-03T09:54:59');
            propsData.max = new Date('2020-05-02T09:54:56');
            propsData.dateFormat = 'yyy-MM-dd';
            propsData.showTime = false;
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });

            const validation = wrapper.vm.validate();
            expect(validation.isValid).toBeFalsy();
            expect(validation.errorMessage).toBe('2020-05-03 is after maximum 2020-05-02');
        });

        it('invalidates values later than max date (time only)', () => {
            propsData.value = new Date('2020-05-03T14:54:59');
            propsData.max = new Date('2020-05-04T14:54:56');
            propsData.timeFormat = 'HH:mm:ss';
            propsData.showTime = true;
            propsData.showDate = false;
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });

            const validation = wrapper.vm.validate();
            expect(validation.isValid).toBeFalsy();
            expect(validation.errorMessage).toBe('14:54:59 is after maximum 14:54:56');
        });

        it('invalidates values later than max date via @input', () => {
            propsData.max = new Date('2020-05-05T09:54:56');
            propsData.dateFormat = 'yyy-MM-dd';
            propsData.showTime = false;
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });

            wrapper.find({ ref: 'datePicker' }).vm.$emit('input', new Date('2020-05-06T09:54:56'));

            const validation = wrapper.vm.validate();
            expect(validation.isValid).toBeFalsy();
            expect(validation.errorMessage).toBe('2020-05-06 is after maximum 2020-05-05');
        });

        it('invalidates null value if required', () => {
            propsData.value = new Date('');
            propsData.required = true;
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });

            const validation = wrapper.vm.validate();
            expect(validation.isValid).toBeFalsy();
            expect(validation.errorMessage).toBe('Please input a valid date');
        });

        it('validates values in the given min/max range', () => {
            propsData.value = new Date('2020-05-03T09:54:55');
            propsData.min = new Date('2020-05-03T09:54:54');
            propsData.max = new Date('2020-05-03T09:54:56');
            propsData.dateFormat = 'yyy-MM-dd';
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });

            const validation = wrapper.vm.validate();
            expect(validation.isValid).toBeTruthy();
        });

        it('ignores max if none given', () => {
            propsData.value = new Date('2020-05-03T09:54:55');
            propsData.min = new Date('2020-05-03T09:54:54');
            propsData.max = null;
            propsData.dateFormat = 'yyy-MM-dd';
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });

            const validation = wrapper.vm.validate();
            expect(validation.isValid).toBeTruthy();
        });

        it('ignores min if none given', () => {
            propsData.value = new Date('2020-05-03T09:54:53');
            propsData.min = null;
            propsData.max = new Date('2020-05-03T09:54:54');
            propsData.dateFormat = 'yyy-MM-dd';
            let wrapper = mount(DateTimeInput, {
                ...context,
                propsData
            });

            const validation = wrapper.vm.validate();
            expect(validation.isValid).toBeTruthy();
        });

    });
});
