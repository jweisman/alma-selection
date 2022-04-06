import { from } from "rxjs";

const readTextFile = (file: File) => {
  const promise = new Promise<string>((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = () => {
      try {
        if (typeof reader.result == 'string') {
          resolve(reader.result);
        } else {
          resolve('');
        }
      } catch (e) {
        console.error('error', e)
        reject(e)
      }
    };
    reader.readAsText(file);
  });
  return from(promise);
}

export { readTextFile };