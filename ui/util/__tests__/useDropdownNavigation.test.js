import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import DropdownNavigationTestComponent from './DropdownNavigationTestComponent.vue';


describe('useDropdownNavigation', () => {
    let props, clickSpy;

    beforeEach(() => {
        clickSpy = vi.fn();
        props = {
            getNextElement: vi.fn((i, j) => {
                let index;
                // Indices between 0 and 10. -1 means that nothing is selected, which thus has to be treated differenly
                if (i === -1 && j < 0) {
                    index = j;
                } else {
                    index = i + j;
                }
                index = ((index % 10) + 10) % 10;
                return { index, element: { click: () => clickSpy(index) } };
            }),
            close: vi.fn()
        };
    });

    it('sets marked index to -1 per default', () => {
        const wrapper = mount(DropdownNavigationTestComponent, { props });
        expect(wrapper.vm.currentMarkedIndex).toBe(-1);
    });

    describe('keyboard navigation', () => {
        it('navigates to the next element on ArrowDown', () => {
            const wrapper = mount(DropdownNavigationTestComponent, { props });
            wrapper.find('#baseElement').trigger('keydown', { code: 'ArrowDown' });
            expect(wrapper.vm.currentMarkedIndex).toBe(0);
            wrapper.find('#baseElement').trigger('keydown', { code: 'ArrowDown' });
            expect(wrapper.vm.currentMarkedIndex).toBe(1);
        });

        it('navigates to the previous element on ArrowUp', () => {
            const wrapper = mount(DropdownNavigationTestComponent, { props });
            wrapper.find('#baseElement').trigger('keydown', { code: 'ArrowUp' });
            expect(wrapper.vm.currentMarkedIndex).toBe(9);
            wrapper.find('#baseElement').trigger('keydown', { code: 'ArrowUp' });
            expect(wrapper.vm.currentMarkedIndex).toBe(8);
        });

        it('calls close on Escape', () => {
            const wrapper = mount(DropdownNavigationTestComponent, { props });
            expect(props.close).not.toHaveBeenCalled();
            wrapper.find('#baseElement').trigger('keydown', { code: 'Escape' });
            expect(props.close).toHaveBeenCalled();
        });

        it('calls close on Tab', () => {
            const wrapper = mount(DropdownNavigationTestComponent, { props });
            expect(props.close).not.toHaveBeenCalled();
            wrapper.find('#baseElement').trigger('keydown', { code: 'Tab' });
            expect(props.close).toHaveBeenCalled();
        });

        describe('select an item', () => {
            it('clicks on marked element on Enter', () => {
                const wrapper = mount(DropdownNavigationTestComponent, { props });
                wrapper.find('#baseElement').trigger('keydown', { code: 'ArrowDown' });
                wrapper.find('#baseElement').trigger('keydown', { code: 'Enter' });
                expect(clickSpy).toHaveBeenCalledWith(0);
                wrapper.find('#baseElement').trigger('keydown', { code: 'ArrowDown' });
                wrapper.find('#baseElement').trigger('keydown', { code: 'Enter' });
                expect(clickSpy).toHaveBeenCalledWith(1);
            });
    
            it('clicks on marked element on Space', () => {
                const wrapper = mount(DropdownNavigationTestComponent, { props });
                wrapper.find('#baseElement').trigger('keydown', { code: 'ArrowDown' });
                wrapper.find('#baseElement').trigger('keydown', { code: 'Space' });
                expect(clickSpy).toHaveBeenCalledWith(0);
                wrapper.find('#baseElement').trigger('keydown', { code: 'ArrowDown' });
                wrapper.find('#baseElement').trigger('keydown', { code: 'Space' });
                expect(clickSpy).toHaveBeenCalledWith(1);
            });

            it('does not trigger a click if no element is marked', () => {
                const wrapper = mount(DropdownNavigationTestComponent, { props });
                wrapper.find('#baseElement').trigger('keydown', { code: 'Space' });
                wrapper.find('#baseElement').trigger('keydown', { code: 'Enter' });
                expect(clickSpy).toHaveBeenCalledTimes(0);
            });
        });

        it('returns a method which allows to reset the navigation', async () => {
            const wrapper = mount(DropdownNavigationTestComponent, { props });
            wrapper.find('#baseElement').trigger('keydown', { code: 'ArrowDown' });
            expect(wrapper.vm.currentMarkedIndex).toBe(0);

            await wrapper.vm.resetNavigation();

            expect(wrapper.vm.currentMarkedIndex).toBe(-1);
            wrapper.find('#baseElement').trigger('keydown', { code: 'Enter' });
            expect(clickSpy).toHaveBeenCalledTimes(0);
        });

        describe('prevent events', () => {
            let triggerEvent;

            const expectEventPrevented = (eventMethodsMock) => {
                expect(eventMethodsMock.preventDefault).toHaveBeenCalled();
                expect(eventMethodsMock.preventDefault).toHaveBeenCalled();
                expect(eventMethodsMock.preventDefault).toHaveBeenCalled();
            };
            const expectEventNotPrevented = (eventMethodsMock) => {
                expect(eventMethodsMock.preventDefault).not.toHaveBeenCalled();
                expect(eventMethodsMock.preventDefault).not.toHaveBeenCalled();
                expect(eventMethodsMock.preventDefault).not.toHaveBeenCalled();
            };

            beforeEach(() => {
                triggerEvent = (wrapper, code) => {
                    const eventMethodsMock = {
                        preventDefault: vi.fn(),
                        stopPropagation: vi.fn(),
                        stopImmediatePropagation: vi.fn()
                    };
                    wrapper.find('#baseElement').trigger('keydown', { code, ...eventMethodsMock });
                    return eventMethodsMock;
                };
            });

            it('prevents ArrowDown', () => {
                const wrapper = mount(DropdownNavigationTestComponent, { props });
                expectEventPrevented(triggerEvent(wrapper, 'ArrowDown'));
            });

            it('prevents ArrowUp', () => {
                const wrapper = mount(DropdownNavigationTestComponent, { props });
                expectEventPrevented(triggerEvent(wrapper, 'ArrowUp'));
            });

            it('prevents Enter if and only if an item is marked', () => {
                const wrapper = mount(DropdownNavigationTestComponent, { props });
                expectEventNotPrevented(triggerEvent(wrapper, 'Enter'));
                triggerEvent(wrapper, 'ArrowDown');
                expectEventPrevented(triggerEvent(wrapper, 'Enter'));
            });

            it('prevents Space if and only if an item is marked', () => {
                const wrapper = mount(DropdownNavigationTestComponent, { props });
                expectEventNotPrevented(triggerEvent(wrapper, 'Space'));
                triggerEvent(wrapper, 'ArrowDown');
                expectEventPrevented(triggerEvent(wrapper, 'Space'));
            });

            it('does not prevent Escape', () => {
                const wrapper = mount(DropdownNavigationTestComponent, { props });
                expectEventNotPrevented(triggerEvent(wrapper, 'Escape'));
            });

            it('does not prevent Tab', () => {
                const wrapper = mount(DropdownNavigationTestComponent, { props });
                expectEventNotPrevented(triggerEvent(wrapper, 'Tab'));
            });
        });
    });
});
