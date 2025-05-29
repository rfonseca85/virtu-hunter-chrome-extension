import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-cpu';

let model = null;
let tfReadyPromise = null;

export async function ensureTfReady() {
  if (!tfReadyPromise) {
    tfReadyPromise = (async () => {
      try {
        await tf.setBackend('wasm');
        await tf.ready();
        console.log('TFJS backend set to WASM');
      } catch (e) {
        console.warn('WASM backend failed, falling back to CPU', e);
        await tf.setBackend('cpu');
        await tf.ready();
        console.log('TFJS backend set to CPU');
      }
    })();
  }
  return tfReadyPromise;
}

export async function loadUSE() {
  await ensureTfReady();
  if (!model) {
    model = await use.load();
  }
  return model;
}
