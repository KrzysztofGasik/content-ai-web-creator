import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contentTemplate',
  description: 'Content template',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'contentType',
      title: 'Content type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Blog post', value: 'BLOG_POST' },
          { title: 'Twitter', value: 'SOCIAL_TWITTER' },
          { title: 'LinkedIn', value: 'SOCIAL_LINKEDIN' },
          { title: 'Instagram', value: 'SOCIAL_INSTAGRAM' },
          { title: 'Email', value: 'EMAIL' },
          { title: 'Product description', value: 'PRODUCT_DESC' },
          { title: 'Ad copy', value: 'AD_COPY' },
          { title: 'Other', value: 'OTHER' },
        ],
      },
    }),
    defineField({
      name: 'promptTemplate',
      title: 'Prompt template',
      type: 'text',
      validation: (Rule) => Rule.required(),
      description:
        '{topic} - topic pass to prompt, {tone} - tone pass to prompt, {context} - context pass to prompt',
    }),
    defineField({
      name: 'defaultTone',
      title: 'Default tone',
      type: 'string',
      options: {
        list: [
          { title: 'Professional', value: 'professional' },
          { title: 'Casual', value: 'casual' },
          { title: 'Friendly', value: 'friendly' },
        ],
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Is active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
  ],
});
