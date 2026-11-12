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

export interface MiscSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_misc_social_links';
  info: {
    displayName: 'social-links';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['Instagram', 'Facebook', 'LinkedIn', 'X', 'Youtube']
    >;
    URL: Schema.Attribute.String;
  };
}

export interface PlaylistPlaylistItem extends Struct.ComponentSchema {
  collectionName: 'components_playlist_playlist_items';
  info: {
    description: 'One video at an explicit editorial position in a playlist.';
    displayName: 'playlist item';
  };
  attributes: {
    position: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    video: Schema.Attribute.Relation<'oneToOne', 'api::video.video'>;
  };
}

export interface SharedPartner extends Struct.ComponentSchema {
  collectionName: 'components_shared_partners';
  info: {
    displayName: 'partner';
  };
  attributes: {
    Logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Name: Schema.Attribute.String & Schema.Attribute.Required;
    Url: Schema.Attribute.String;
  };
}

export interface SharedSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_sections';
  info: {
    displayName: 'section';
  };
  attributes: {
    Body: Schema.Attribute.Blocks;
    Callout: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
  };
}

export interface SharedTextCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_cards';
  info: {
    displayName: 'text-card';
  };
  attributes: {
    Badge: Schema.Attribute.String;
    Body: Schema.Attribute.Blocks & Schema.Attribute.Required;
    Note: Schema.Attribute.String;
    Quote: Schema.Attribute.Text;
    SecondaryBody: Schema.Attribute.Blocks;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'article-component.image-with-caption': ArticleComponentImageWithCaption;
      'article-component.paragraph': ArticleComponentParagraph;
      'article-component.quote': ArticleComponentQuote;
      'misc.social-links': MiscSocialLinks;
      'playlist.playlist-item': PlaylistPlaylistItem;
      'shared.partner': SharedPartner;
      'shared.section': SharedSection;
      'shared.text-card': SharedTextCard;
    }
  }
}
