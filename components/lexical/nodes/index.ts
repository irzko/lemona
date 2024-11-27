import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {TableCellNode, TableNode, TableRowNode} from '@lexical/table';
import type { Klass, LexicalNode } from "lexical";
import { ParagraphNode, TextNode } from "lexical";
import {OverflowNode} from '@lexical/overflow';
import {HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode';

import {ImageNode} from './ImageNode';
import {KeywordNode} from './KeywordNode';
import {EmojiNode} from './EmojiNode';

const Nodes: Array<Klass<LexicalNode>> = [
  AutoLinkNode,
  CodeHighlightNode,
  CodeNode,
  EmojiNode,
  HeadingNode,
  HorizontalRuleNode,
  ImageNode,
  KeywordNode,
  LinkNode,
  ListItemNode,
  ListNode,
  OverflowNode,
  ParagraphNode,
  QuoteNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  TextNode,
];

export default Nodes;
