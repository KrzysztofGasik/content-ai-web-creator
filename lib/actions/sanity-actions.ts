'use server';

import { client } from '../../sanity/lib/client';
import type { ContentTemplate } from '@/types/types';

export async function getContentTemplates() {
  try {
    const templates: ContentTemplate[] = await client.fetch(
      '*[_type == "contentTemplate" && isActive == true] {_id, name,description,contentType,promptTemplate,defaultTone,category}'
    );
    return {
      success: true,
      message: 'Successfully fetched data from sanity',
      templates,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during fetching content templates from sanity',
    };
  }
}

export async function getContentTemplateById(id: string) {
  try {
    const template: ContentTemplate[] = await client.fetch(
      `*[_type == "contentTemplate" && isActive == true && _id == "${id}"] {_id, name,description,contentType,promptTemplate,defaultTone,category}`
    );
    return {
      success: true,
      message: 'Successfully fetched template from sanity',
      template: template[0],
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during fetching content template from sanity',
    };
  }
}
