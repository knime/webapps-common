/*
 * ------------------------------------------------------------------------
 *
 *  Copyright by KNIME AG, Zurich, Switzerland
 *  Website: http://www.knime.com; Email: contact@knime.com
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License, Version 3, as
 *  published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful, but
 *  WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, see <http://www.gnu.org/licenses>.
 *
 *  Additional permission under GNU GPL version 3 section 7:
 *
 *  KNIME interoperates with ECLIPSE solely via ECLIPSE's plug-in APIs.
 *  Hence, KNIME and ECLIPSE are both independent programs and are not
 *  derived from each other. Should, however, the interpretation of the
 *  GNU GPL Version 3 ("License") under any applicable laws result in
 *  KNIME and ECLIPSE being a combined program, KNIME AG herewith grants
 *  you the additional permission to use and propagate KNIME together with
 *  ECLIPSE with only the license terms in place for ECLIPSE applying to
 *  ECLIPSE and the GNU GPL Version 3 applying for KNIME, provided the
 *  license terms of ECLIPSE themselves allow for the respective use and
 *  propagation of ECLIPSE together with KNIME.
 *
 *  Additional permission relating to nodes for KNIME that extend the Node
 *  Extension (and in particular that are based on subclasses of NodeModel,
 *  NodeDialog, and NodeView) and that only interoperate with KNIME through
 *  standard APIs ("Nodes"):
 *  Nodes are deemed to be separate and independent programs and to not be
 *  covered works.  Notwithstanding anything to the contrary in the
 *  License, the License does not apply to Nodes, you are not required to
 *  license Nodes under the License, and you are granted a license to
 *  prepare and propagate Nodes, in each case even if such Nodes are
 *  propagated with or for interoperation with KNIME.  The owner of a Node
 *  may freely choose the license terms applicable to such Node, including
 *  when such Node is propagated with or for interoperation with KNIME.
 * ---------------------------------------------------------------------
 *
 * History
 *   Mar 10, 2023 (hornm): created
 */
package org.knime.core.webui.node.dialog.defaultdialog;

import java.io.IOException;

import org.knime.core.webui.data.InitialDataService.InitialDataServiceBuilder;
import org.knime.core.webui.data.InitialDataService.Serializer;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

/**
 * Serializes POJOs into strings. Uses the same object mapper as is used for {@link DefaultNodeSettings}-implementations
 * if there are properties of that type. Mainly useful in case node settings are supposed to be passed as data through
 * data-services to the frontend. I.e. to be used in {@link InitialDataServiceBuilder#serializer(Serializer)}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @param <D> the default node settings type
 */
public class DefaultNodeSettingsSerializer<D> implements Serializer<D> {

    private static final ObjectMapper JSON_FORMS_DATA_MAPPER = JsonFormsDataUtil.getMapper();

    private static final ObjectMapper MAPPER = createMapper();

    private static ObjectMapper createMapper() {
        var mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        var module = new SimpleModule();
        module.addSerializer(DefaultNodeSettings.class,
            new StdSerializer<DefaultNodeSettings>(DefaultNodeSettings.class) {

                @Override
                public void serialize(final DefaultNodeSettings value, final JsonGenerator gen,
                    final SerializerProvider provider) throws IOException {
                    gen.writeRawValue(JSON_FORMS_DATA_MAPPER.writeValueAsString(value));
                }
            });
        mapper.registerModule(module);
        return mapper;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String serialize(final D obj) throws IOException {
        return MAPPER.writeValueAsString(obj);
    }

}
