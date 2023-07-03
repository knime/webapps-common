import type { ControlProps } from '@jsonforms/core';
import { useJsonFormsControl } from '@jsonforms/vue';
import { inject } from 'vue';


/**
 * Wrapper around the handleChange method of the json forms control object.
 * This is used to add custom functionality to json forms, e.g. updating data
 * of dependent settings.
 * @param {ControlProps} props
 * @returns {DispatchPropsOfControl} jsonFormsControl
 */
export const useJsonFormsControlWithUpdate = (props: ControlProps) => {
    const jsonFormsControl = useJsonFormsControl(props);
    type HandleChangeArguments = [path: string, value: any]
    const updateData = inject('updateData') as // NOSONAR
        (handleChange: (...args: HandleChangeArguments) => void, ...args: HandleChangeArguments) => void;
    const handleChange = jsonFormsControl.handleChange;
    jsonFormsControl.handleChange = (...args) => updateData(handleChange, ...args);
    return jsonFormsControl;
};
