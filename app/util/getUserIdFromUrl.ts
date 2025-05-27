// app/util/getUserIdFromUrl.ts

export default function getUserIdFromUrl(url: string): string {
  try {
    const lastSlashIndex = url.lastIndexOf('/');
    const firstQuestionMarkIndex = url.indexOf('?');

    return url.substring(lastSlashIndex + 1, firstQuestionMarkIndex);
  } catch (error) {
    console.error('invalid url: ', url, error);
    return '';
  }
};
