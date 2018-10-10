// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';

import { ILatexTypesetter } from '@jupyterlab/rendermime';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { IMacros, renderMathInElement, setMacros } from './autorender';

import { ISettingRegistry } from '@jupyterlab/coreutils';

import '../style/index.css';

const katexPluginId = '@jupyterlab/katex-extension:plugin';

/**
 * The KaTeX Typesetter.
 */
export class KatexTypesetter implements IRenderMime.ILatexTypesetter {
  /**
   * Typeset the math in a node.
   */
  typeset(node: HTMLElement): void {
    renderMathInElement(node);
  }
}

/**
 * The KaTex extension.
 */
const katexPlugin: JupyterLabPlugin<ILatexTypesetter> = {
  id: katexPluginId,
  requires: [ISettingRegistry],
  provides: ILatexTypesetter,
  activate: (jupyterlab: JupyterLab, settingRegistry: ISettingRegistry) => {
    /**
     * Update the setting values.
     */
    function updateSettings(settings: ISettingRegistry.ISettings): void {
      const macros = settings.get('macros').composite as IMacros;
      setMacros(macros);
    }

    settingRegistry
      .load(katexPluginId)
      .then(settings => {
        settings.changed.connect(updateSettings);
        updateSettings(settings);
      })
      .catch((reason: Error) => {
        console.error(reason.message);
      });
    return new KatexTypesetter();
  },
  autoStart: true
};

export default katexPlugin;
