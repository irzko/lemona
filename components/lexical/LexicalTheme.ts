/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const LexicalTheme = {
  // code: 'editor-code',
  /* heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  }, */
  image: 'editor-image',
  link: 'editor-link',
  
  list: {
    listitem: 'editor-listitem',
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'space-y-1 text-gray-500 list-decimal list-inside',
    ul: 'space-y-1 text-gray-500 list-disc list-inside',
  },
  
  ltr: 'ltr',
  // paragraph: 'editor-paragraph',
  // placeholder: 'editor-placeholder',
  rtl: 'rtl',
  text: {
    bold: 'font-semibold',
    code: 'editor-text-code',
    hashtag: 'editor-text-hashtag',
    italic: 'italic',
    overflowed: 'editor-text-overflowed',
    strikethrough: 'line-through',
    underline: 'underline',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
  },
};

export default LexicalTheme;