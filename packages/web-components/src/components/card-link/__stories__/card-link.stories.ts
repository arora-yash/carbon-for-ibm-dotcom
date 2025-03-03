/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { boolean } from '@storybook/addon-knobs';
import { html } from 'lit-element';
import ArrowRight20 from 'carbon-web-components/es/icons/arrow--right/20.js';
import Error20 from 'carbon-web-components/es/icons/error/20.js';
import ifNonNull from 'carbon-web-components/es/globals/directives/if-non-null.js';
import readme from './README.stories.mdx';
import textNullable from '../../../../.storybook/knob-text-nullable';
import '../index';

export const Default = ({ parameters }) => {
  const { disabled, href, heading, copy } = parameters?.props?.CardLink ?? {};
  return html`
    <dds-card-link ?disabled=${disabled} href=${ifNonNull(href || undefined)}>
      <dds-card-heading>${heading}</dds-card-heading>
      ${copy
        ? html`
            <p>${copy}</p>
          `
        : ``}
      <dds-card-footer ?disabled=${disabled}>
        ${disabled ? Error20({ slot: 'icon' }) : ArrowRight20({ slot: 'icon' })}
      </dds-card-footer>
    </dds-card-link>
  `;
};

export default {
  title: 'Components/Card link',
  decorators: [
    story => html`
      <div class="dds-ce-demo-devenv--simple-grid dds-ce-demo-devenv--simple-grid--card">
        ${story()}
      </div>
    `,
  ],
  parameters: {
    ...readme.parameters,
    hasGrid: true,
    knobs: {
      CardLink: ({ groupId }) => ({
        disabled: boolean('Disabled (disabled):', false, groupId),
        href: textNullable('Card href (href):', 'https://example.com', groupId),
        heading: textNullable('Card heading (heading):', 'Explore AI use cases in all industries', groupId),
        copy: textNullable('Card copy (copy):', '', groupId),
      }),
    },
  },
};
