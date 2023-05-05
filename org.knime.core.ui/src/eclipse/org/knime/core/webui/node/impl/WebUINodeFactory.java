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
 *   10 Nov 2022 (marcbux): created
 */
package org.knime.core.webui.node.impl;

import java.io.IOException;
import java.io.StringReader;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.function.Function;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.xmlbeans.XmlException;
import org.knime.core.node.NodeDescription;
import org.knime.core.node.NodeDescription41Proxy;
import org.knime.core.node.NodeDialogPane;
import org.knime.core.node.NodeFactory;
import org.knime.core.node.NodeModel;
import org.knime.core.node.NodeView;
import org.knime.core.util.Version;
import org.knime.core.webui.node.dialog.NodeDialog;
import org.knime.core.webui.node.dialog.NodeDialogFactory;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeDialog;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.w3c.dom.Document;
import org.w3c.dom.DocumentFragment;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * A convenience class for simple WebUI nodes, i.e., nodes making use of the {@link DefaultNodeSettings} and
 * {@link DefaultNodeDialog} classes. For an exemplary implementation, see
 * org.knime.core.webui.node.dialog.impl.TestWebUINodeFactory in org.knime.core.ui.tests.
 *
 * @param <M> the type of the {@link WebUINodeModel} created by this factory
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public abstract class WebUINodeFactory<M extends NodeModel> extends NodeFactory<M> implements NodeDialogFactory {

    private final WebUINodeConfiguration m_configuration;

    /**
     * @param configuration the {@link WebUINodeConfiguration} for this factory
     */
    protected WebUINodeFactory(final WebUINodeConfiguration configuration) {
        super(true);
        m_configuration = configuration;
        init();
    }

    @Override
    protected final NodeDescription createNodeDescription() throws SAXException, IOException, XmlException {
        return createNodeDescription(m_configuration.getName(), m_configuration.getIcon(),
            m_configuration.getInPortDescriptions(), m_configuration.getOutPortDescriptions(),
            m_configuration.getShortDescription(), m_configuration.getFullDescription(),
            m_configuration.getModelSettingsClass(), null, null, null, m_configuration.getKeywords(),
            m_configuration.getSinceVersion());
    }

    /**
     * @param name the name of the node
     * @param icon relative path to the node icon
     * @param inPortDescriptions the descriptions of the node's input ports
     * @param outPortDescriptions the descriptions of the node's output ports
     * @param shortDescription the short node description
     * @param fullDescription the full node description
     * @param modelSettingsClass the type of the model settings, or null, if the node has no model settings
     * @param viewSettingsClass the type of the view settings, or null, if the node has no view settings
     * @param viewDescription the view description, or null, if the node has no view
     * @param type the type of the node, or null, if it should be determined automatically
     * @param keywords the keywords for serach, or null.
     * @return a description for this node
     */
    public static NodeDescription createNodeDescription(final String name, final String icon, // NOSONAR
        final PortDescription[] inPortDescriptions, final PortDescription[] outPortDescriptions,
        final String shortDescription, final String fullDescription,
        final Class<? extends DefaultNodeSettings> modelSettingsClass,
        final Class<? extends DefaultNodeSettings> viewSettingsClass, final String viewDescription, final NodeType type,
        final String[] keywords) {
        return createNodeDescription(name, icon, inPortDescriptions, outPortDescriptions, shortDescription,
            fullDescription, modelSettingsClass, viewSettingsClass, viewDescription, type, keywords, null);
    }

    /**
     * @param name the name of the node
     * @param icon relative path to the node icon
     * @param inPortDescriptions the descriptions of the node's input ports
     * @param outPortDescriptions the descriptions of the node's output ports
     * @param shortDescription the short node description
     * @param fullDescription the full node description
     * @param modelSettingsClass the type of the model settings, or null, if the node has no model settings
     * @param viewSettingsClass the type of the view settings, or null, if the node has no view settings
     * @param viewDescription the view description, or null, if the node has no view
     * @param type the type of the node, or null, if it should be determined automatically
     * @param keywords the keywords for serach, or null.
     * @param sinceVersion the KNIME AP version since which this node is available, or null
     * @return a description for this node
     */
    public static NodeDescription createNodeDescription(final String name, final String icon, // NOSONAR
        final PortDescription[] inPortDescriptions, final PortDescription[] outPortDescriptions,
        final String shortDescription, final String fullDescription,
        final Class<? extends DefaultNodeSettings> modelSettingsClass,
        final Class<? extends DefaultNodeSettings> viewSettingsClass, final String viewDescription, final NodeType type,
        final String[] keywords, final Version sinceVersion) {
        var fac = NodeDescription.getDocumentBuilderFactory();
        DocumentBuilder docBuilder;
        try {
            docBuilder = fac.newDocumentBuilder();
        } catch (ParserConfigurationException e) {
            // should never happen
            throw new IllegalStateException("Problem creating node description", e);
        }
        var doc = docBuilder.newDocument();
        var node = doc.createElement("knimeNode");

        node.setAttribute("icon", icon);
        final NodeType nodeType;
        if (type != null) {
            nodeType = type;
        } else if (inPortDescriptions.length == 0) {
            nodeType = NodeFactory.NodeType.Source;
        } else if (outPortDescriptions.length == 0) {
            nodeType = NodeFactory.NodeType.Sink;
        } else {
            nodeType = NodeFactory.NodeType.Manipulator;
        }
        node.setAttribute("type", nodeType.toString());
        var nodeName = doc.createElement("name");
        nodeName.setTextContent(name);
        node.appendChild(nodeName);

        var shortDesc = doc.createElement("shortDescription");
        shortDesc.appendChild(parseDocumentFragment(shortDescription, docBuilder, doc));
        var fullDesc = doc.createElement("fullDescription");
        var intro = doc.createElement("intro");
        intro.appendChild(parseDocumentFragment(fullDescription, docBuilder, doc));
        fullDesc.appendChild(intro);
        node.appendChild(shortDesc);
        node.appendChild(fullDesc);

        // create options tab
        var tab = doc.createElement("tab");
        tab.setAttribute("name", "Options");
        if (modelSettingsClass != null) {
            createOptions(modelSettingsClass.getDeclaredFields(), tab, docBuilder, doc);
        }
        if (viewSettingsClass != null) {
            createOptions(viewSettingsClass.getDeclaredFields(), tab, docBuilder, doc);
        }
        if (modelSettingsClass != null) {
            // We want common fields of common subclasses to appear at the end of the description
            createOptions(getParentFields(modelSettingsClass), tab, docBuilder, doc);
        }
        fullDesc.appendChild(tab);

        // create ports
        var ports = doc.createElement("ports");
        addPorts(docBuilder, doc, ports, inPortDescriptions, pd -> pd.isConfigurable() ? "dynInPort" : "inPort");
        addPorts(docBuilder, doc, ports, outPortDescriptions, pd -> pd.isConfigurable() ? "dynOutPort" : "outPort");
        node.appendChild(ports);

        // create view (if exists)
        if (viewDescription != null) {
            final var views = doc.createElement("views");
            var view = doc.createElement("view");
            view.setAttribute("index", "0");
            view.setAttribute("name", name);
            view.appendChild(parseDocumentFragment(viewDescription, docBuilder, doc));
            views.appendChild(view);
            node.appendChild(views);
        }

        if (ArrayUtils.isNotEmpty(keywords)) {
            final var keywordsElement = doc.createElement("keywords");
            for (String keyword : keywords) {
                final var keywordElement = keywordsElement.appendChild(doc.createElement("keyword"));
                keywordElement.setTextContent(keyword);
            }
            node.appendChild(keywordsElement);
        }

        doc.appendChild(node);
        try {
            return new NodeDescription41Proxy(doc, sinceVersion);
        } catch (XmlException e) {
            // should never happen
            throw new IllegalStateException("Problem creating node description", e);
        }
    }

    private static Field[] getParentFields(final Class<?> clazz) {
        final var superclasses = new ArrayList<Class<?>>();
        for (Class<?> c = clazz.getSuperclass(); c != null; c = c.getSuperclass()) {
            superclasses.add(c);
        }
        return superclasses.stream().map(Class::getDeclaredFields).flatMap(Arrays::stream).toArray(Field[]::new);
    }

    private static void addPorts(final DocumentBuilder docBuilder, final Document doc, final Element ports,
        final PortDescription[] portDescs, final Function<PortDescription, String> tagName) {
        for (int i = 0; i < portDescs.length; i++) {
            var portDesc = portDescs[i];
            var port = doc.createElement(tagName.apply(portDesc));
            port.setAttribute("name", portDesc.getName());
            if (portDesc.isConfigurable()) {
                port.setAttribute("insert-before", Integer.toString(i));
                port.setAttribute("group-identifier", portDesc.getName());
                port.setAttribute("configurable-via-menu", "false");
            } else {
                port.setAttribute("index", Integer.toString(i));
            }
            port.appendChild(parseDocumentFragment(portDesc.getDescription(), docBuilder, doc));
            ports.appendChild(port);
        }
    }

    /*
     * Creates a fragment from an xml-string (usually html) such that it can be appended to other nodes as is (i.e.
     * without escaping the html).
     */
    private static DocumentFragment parseDocumentFragment(final String s, final DocumentBuilder docBuilder,
        final Document doc) {
        var wrapped = "<fragment>" + s + "</fragment>";
        Document parsed;
        try {
            parsed = docBuilder.parse(new InputSource(new StringReader(wrapped)));
        } catch (SAXException | IOException e) {
            // should never happen
            throw new IllegalStateException("Problem creating node description", e);
        }
        var fragment = doc.createDocumentFragment();
        var children = parsed.getDocumentElement().getChildNodes();
        for (var i = 0; i < children.getLength(); i++) {
            var child = doc.importNode(children.item(i), true);
            fragment.appendChild(child);
        }
        return fragment;
    }

    private static final void createOptions(final Field[] fields, final Element tab, final DocumentBuilder docBuilder,
        final Document doc) {
        for (var field : fields) {
            if (field.isAnnotationPresent(Widget.class)) {
                var option = doc.createElement("option");
                final var title = field.getAnnotationsByType(Widget.class)[0].title();
                final var description = field.getAnnotationsByType(Widget.class)[0].description();
                option.setAttribute("name", title);
                option.appendChild(parseDocumentFragment(description, docBuilder, doc));
                tab.appendChild(option);
            }
        }
    }

    @Override
    public final int getNrNodeViews() {
        return 0;
    }

    @Override
    public final NodeView<M> createNodeView(final int i, final M nodeModel) {
        return null;
    }

    @Override
    public final boolean hasDialog() {
        return true;
    }

    @Override
    public final NodeDialog createNodeDialog() {
        return new DefaultNodeDialog(SettingsType.MODEL, m_configuration.getModelSettingsClass());
    }

    @Override
    protected final NodeDialogPane createNodeDialogPane() {
        return createNodeDialog().createLegacyFlowVariableNodeDialog();
    }

}
