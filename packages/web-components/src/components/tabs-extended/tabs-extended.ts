/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import settings from 'carbon-components/es/globals/js/settings';
import { customElement, html, internalProperty, LitElement, TemplateResult, property } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { classMap } from 'lit-html/directives/class-map';
import ddsSettings from '@carbon/ibmdotcom-utilities/es/utilities/settings/settings.js';
import ChevronRight20 from 'carbon-web-components/es/icons/chevron--right/20.js';
import StableSelectorMixin from '../../globals/mixins/stable-selector';
import DDSTab from './tab';
import styles from './tabs-extended.scss';
import { ORIENTATION } from './defs';

const { prefix } = settings;
const { stablePrefix: ddsPrefix } = ddsSettings;

/**
 * A component to present content inside a tabbed layout.
 *
 * @element dds-tabs-extended
 */
@customElement(`${ddsPrefix}-tabs-extended`)
class DDSTabsExtended extends StableSelectorMixin(LitElement) {
  /**
   * Child tab components.
   */
  @internalProperty()
  private _tabItems: Node[] = [];

  /**
   * Defines the active tab index.
   */
  @internalProperty()
  private _activeTab: Number = 0;

  /**
   * Handler for @slotChange, creates tabs from dds-tab components.
   *
   * @private
   */
  protected _handleSlotChange(event: Event) {
    this._tabItems = (event.target as HTMLSlotElement)
      .assignedNodes({ flatten: true })
      .filter(node => new DDSTab()?.nodeName === node.nodeName);
    this._tabItems.forEach((tab, index) => {
      this._activeTab = (tab as DDSTab).selected ? index : this._activeTab;
    });
  }

  private _handleClick(index, e) {
    e.preventDefault();
    this._setActiveItem(index);
  }

  private _setActiveItem(index) {
    this._activeTab = index;
  }

  updated() {
    this._tabItems.map((tab, index) => {
      (tab as DDSTab).selected = index === this._activeTab;
      (tab as DDSTab).setIndex(index);
      const navLink = this.shadowRoot!.querySelectorAll(`.${prefix}--tabs__nav-link`)[index];
      const navText = navLink!.querySelector('div p');
      if (navText!.scrollHeight > 70) {
        const label = (tab as DDSTab).getAttribute('label');
        if (label) {
          navLink!.setAttribute('aria-label', label);
          navLink!.setAttribute('hasTooltip', label);
        }
      }
      return tab;
    });
  }

  protected _renderAccordion(): TemplateResult | string | void {
    const { _tabItems: tabs } = this;
    return html`
      <ul class="${prefix}--accordion">
        ${tabs.map((tab, index) => {
          const disabled = (tab as DDSTab).disabled && true;
          const active = index === this._activeTab;
          const label = (tab as DDSTab).getAttribute('label');
          const classes = classMap({
            'bx--accordion__item': true,
            'bx--accordion__item--active': active,
            'bx--accordion__item--disabled': disabled,
          });
          return html`
            <li class="${classes}">
              <button
                class="${prefix}--accordion__heading"
                aria-expanded="${active}"
                aria-controls="pane-${index}"
                @click="${e => this._handleClick(index, e)}"
                tabindex="${index + 1}"
                ?disabled="${disabled}"
              >
                ${ChevronRight20({
                  part: 'expando-icon',
                  class: `${prefix}--accordion__arrow`,
                })}
                <div class="${prefix}--accordion__title">${label}</div>
              </button>
              <div id="pane-${index}" class="${prefix}--accordion__content">
                ${unsafeHTML((tab as DDSTab).innerHTML)}
              </div>
            </li>
          `;
        })}
      </ul>
    `;
  }

  protected _renderTabs(): TemplateResult | string | void {
    const { _tabItems: tabs } = this;
    return html`
      <div class="${prefix}--tabs">
        <ul class="${prefix}--tabs__nav ${prefix}--tabs__nav--hidden" role="tablist">
          ${tabs.map((tab, index) => {
            const disabled = (tab as DDSTab).disabled && true;
            const active = index === this._activeTab;
            const label = (tab as DDSTab).getAttribute('label');
            const classes = classMap({
              'bx--tabs__nav-item': true,
              'bx--tabs__nav-item--selected': active,
              'bx--tabs__nav-item--disabled': disabled,
            });
            return html`
              <li class="${classes}" data-target=".tab-${index}-default" role="tab" ?disabled="${disabled}">
                <a
                  tabindex="${disabled ? -1 : index + 1}"
                  id="tab-link-${index}-default"
                  class="${prefix}--tabs__nav-link"
                  href="javascript:void(0)"
                  role="tab"
                  aria-controls="tab-panel-${index}-default"
                  aria-selected="${active}"
                  @click="${e => this._handleClick(index, e)}"
                  ><div><p>${label}</p></div></a
                >
              </li>
            `;
          })}
        </ul>
      </div>
    `;
  }

  /**
   * Returns a class-name based on the defined Orientation value
   */
  protected _getOrientationClass() {
    return classMap({
      [`${prefix}--tabs-extended`]: true,
      [`${prefix}--tabs-extended--${this.orientation}`]: this.orientation,
    });
  }

  /**
   * Orientation (horizontal (default) | vertical)
   */
  @property({ attribute: 'orientation', reflect: true })
  orientation = ORIENTATION.HORIZONTAL;

  render() {
    return html`
      <div class="${this._getOrientationClass()}">
        ${this._renderAccordion()} ${this._renderTabs()}
        <div class="${prefix}--tab-content">
          <slot @slotchange="${this._handleSlotChange}"></slot>
        </div>
      </div>
    `;
  }

  static get stableSelector() {
    return `${ddsPrefix}--tabs-extended`;
  }

  static styles = styles;
}

/* @__GENERATE_REACT_CUSTOM_ELEMENT_TYPE__ */
export default DDSTabsExtended;
