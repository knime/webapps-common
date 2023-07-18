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
 *   Jul 18, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.concurrent.Callable;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;

/**
 *
 * @author Paul Bärnreuther
 */
public class DataServiceRequestHandlerTest {

    @Test
    void testSuccessfulResponse() throws InterruptedException, ExecutionException {

        final var requestHandler = new DataServiceRequestHandler();
        final var callableResult = "myResult";
        final Callable<String> callable = () -> callableResult;
        final var result = requestHandler.handleRequest("foo", callable);
        assertThat(result.state()).isEqualTo(ResultState.SUCCESS);
        assertThat(result.result()).isEqualTo(callableResult);
    }

    @Test
    void testFailedResponse() throws InterruptedException, ExecutionException {

        final var requestHandler = new DataServiceRequestHandler();
        final var message = "myMessage";
        final Callable<String> callable = () -> {
            throw new WidgetHandlerException(message);
        };
        final var result = requestHandler.handleRequest("foo", callable);
        assertThat(result.state()).isEqualTo(ResultState.FAIL);
        assertThat(result.message()).isEqualTo(message);

    }

    @Test
    void testFailedResponseWithNonExpectedException() {

        final var requestHandler = new DataServiceRequestHandler();
        final Callable<String> callable = () -> {
            throw new RuntimeException();
        };
        assertThrows(ExecutionException.class, () -> requestHandler.handleRequest("foo", callable));
    }

    @Test
    void cancelPendingRequestsOfSameId() throws InterruptedException, ExecutionException {

        ExecutorService executorService = Executors.newFixedThreadPool(2);

        final var requestHandler = new DataServiceRequestHandler();
        final Callable<String> callable = () -> {
            Thread.sleep(1);
            return null;
        };

        CompletionService<Result<String>> completionService = new ExecutorCompletionService<>(executorService);

        Future<Result<String>> future1 = completionService.submit(() -> requestHandler.handleRequest("foo", callable));
        Future<Result<String>> future2 = completionService.submit(() -> requestHandler.handleRequest("foo", callable));

        final var result1 = future1.get();
        final var result2 = future2.get();

        assertThat(result1.state()).isEqualTo(ResultState.CANCELED);
        assertThat(result2.state()).isEqualTo(ResultState.SUCCESS);

    }

}
