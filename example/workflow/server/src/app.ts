/********************************************************************************
 * Copyright (c) 2022 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { WorkflowDiagramModule, WorkflowServerModule } from '@eclipse-glsp-examples/workflow-server/lib/common/workflow-diagram-module';
import { createAppModule, LoggerFactory, LogLevel, resolveAndCatch, WorkerServerLauncher } from '@eclipse-glsp/server/browser';
import { Container } from 'inversify';
import { WorkflowMockModelStorage } from './mock-model-storage';

export function launch(argv?: string[]): void {
    const appContainer = new Container();
    appContainer.load(createAppModule({ logLevel: LogLevel.info }));

    const logger = appContainer.get<LoggerFactory>(LoggerFactory)('WorkflowServerApp');
    const launcher = appContainer.resolve(WorkerServerLauncher);
    const serverModule = new WorkflowServerModule().configureDiagramModule(new WorkflowDiagramModule(() => WorkflowMockModelStorage));

    const errorHandler = (error: any): void => logger.error('Error in workflow server launcher:', error);
    launcher.configure(serverModule);
    resolveAndCatch(() => launcher.start(), errorHandler);
}
