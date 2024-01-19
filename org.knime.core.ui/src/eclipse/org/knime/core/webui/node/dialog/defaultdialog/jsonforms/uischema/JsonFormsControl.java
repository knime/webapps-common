package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UiSchemaDefaultNodeSettingsTraverser.TrackedAnnotations;

import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 * A record representing a single control within a node dialog
 *
 * @param scope of the control
 * @param field the associated property writer of the java field
 * @param rootClass the class from which the control originated from
 * @param trackedAnnotations tracked during the traversal.
 */
public record JsonFormsControl(String scope, PropertyWriter field, Class<?> rootClass,
    TrackedAnnotations trackedAnnotations) {
}
