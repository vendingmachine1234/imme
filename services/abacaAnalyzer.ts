import { MODEL_URL } from '../constants';

let model: any = null;

export const loadModel = async () => {
  if (model) {
    return model;
  }
  const modelURL = MODEL_URL + 'model.json';
  const metadataURL = MODEL_URL + 'metadata.json';
  try {
    model = await window.tmImage.load(modelURL, metadataURL);
    return model;
  } catch (error) {
    console.error('Failed to load the model:', error);
    throw new Error('Could not load classification model.');
  }
};
