// app/util/getUserIdFromUrl.ts

export default function getUserIdFromUrl(url: string): string {
  try {
    const lastSlashIndex = url.lastIndexOf('/');
    let firstQuestionMarkIndex = url.indexOf('?');
    // get user id if user somehow removed all text including and after '?';
    if (firstQuestionMarkIndex === -1) {
      firstQuestionMarkIndex = url.length;
    }
    return url.substring(lastSlashIndex + 1, firstQuestionMarkIndex);
  } catch (error) {
    console.error('invalid url: ', url, error);
    return '';
  }
};
