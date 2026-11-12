import type { Schema, Struct } from '@strapi/strapi';

export interface ArticleComponentImageWithCaption
  extends Struct.ComponentSchema {
  collectionName: 'components_article_component_image_with_captions';
  info: {
    displayName: 'image_with_caption';
  };
  attributes: {
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface ArticleComponentParagraph extends Struct.ComponentSchema {
  collectionName: 'components_article_component_paragraphs';
  info: {
    displayName: 'paragraph';
  };
  attributes: {
    text: Schema.Attribute.Blocks;
  };
}

export interface ArticleComponentQuote extends Struct.ComponentSchema {
  collectionName: 'components_article_component_quotes';
  info: {
    displayName: 'quote';
  };
  attributes: {
    author: Schema.Attribute.String;
    quote_text: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'article-component.image-with-caption': ArticleComponentImageWithCaption;
      'article-component.paragraph': ArticleComponentParagraph;
      'article-component.quote': ArticleComponentQuote;
    }
  }
}
